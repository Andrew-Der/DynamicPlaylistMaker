# the user already has the token
# they got it in the client
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
# import spotipy.util as util
import pandas as pd
from sklearn.ensemble.forest import RandomForestRegressor, RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn import decomposition
from sklearn.preprocessing import StandardScaler
import numpy as np
from scipy.sparse import csr_matrix, hstack
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import StratifiedKFold, GridSearchCV
from collections import defaultdict


MIN_INVALID_SKF_SPLIT               = 2
BEST_SKF_SPLIT                      = 10 
LIMIT_REC_TRACKS_FOR_SINGLE_TRACK   = 5
DEFAULT_PCA_NUM_COMPONENTS          = 8
MIN_RATING_ACCEPTANCE_FOR_REC_SONGS = 8 # 1-10 where 10 is the new song highly aligns with base

def getSpotifyUserId(token):
    sp = spotipy.Spotify(auth=token)
    user = sp.current_user()
    return user.get('id')

def fetchSongsFromSpotify(token, track_query):
    sp = spotipy.Spotify(auth=token)
    response = sp.search(track_query, limit=10, offset=0, type='track', market=None)
    ret_songs = []
    if len(response['tracks']['items']) > 0:
        for track in response['tracks']['items']: 
            if track['id'] != None:
                name = track['name']
                artists = [artist['name'] for artist in track['artists']]
                popularity = track['popularity']
                album = track['album']['name']
                id = track['id']
                ret_songs.append((name, artists, popularity, album, id))
        
        ret_songs.sort(key=lambda tup: tup[2], reverse=True)

        return ret_songs 
    else:
        return []

def makePlaylistUsingBaseSongs(token, user_id, newPlaylistName, baseSongs):
    """
        baseSongs
        #  [{'id': 'a1', 'name': ' ', 'rank': 10}, {id, name, rank}]  
        #
        #    
    """
    sp = spotipy.Spotify(auth=token)
    playlist_df = getPlaylistDF(sp, baseSongs)

    # get the rec songs
    try:
        rec_songs = doSomeMLToGetGetSongs(sp, playlist_df, baseSongs)
    except Error as e:
        return e["text"]

    baseSongIds = [song['id'] for song in baseSongs]
    # return {'href' : "send it"}
    playlist_info = sp.user_playlist_create(user_id, name=newPlaylistName)
    # Add tracks to the new playlist
    sp.user_playlist_add_tracks(
        user=user_id, playlist_id=playlist_info['id'], tracks=baseSongIds + rec_songs)
    
    link = playlist_info.get('external_urls').get('spotify')
    return {'href': link}


def doSomeMLToGetGetSongs(sp, playlist_df, baseSongs):
    
    #use random forest to classify songs
    # import pdb; pdb.set_trace()
    X_train = playlist_df.drop(['id', 'ratings'], axis=1)
    y_train = playlist_df['ratings']
    forest = RandomForestClassifier(random_state=42, max_depth=5, max_features=12) # Set by GridSearchCV below
    forest.fit(X_train, y_train)
    importances = forest.feature_importances_
    indices = np.argsort(importances)[::-1]
    printAudioFeatures(X_train, importances, indices) 

    # apply pca to scaled train set first
    # More on PCA : https://towardsdatascience.com/pca-using-python-scikit-learn-e653f8989e60
    X_scaled = StandardScaler().fit_transform(X_train)
    pca = decomposition.PCA().fit(X_scaled)
    # fit the dataset to the optimal pca
    # num_components = len(baseSongs) if len(baseSongs) < DEFAULT_PCA_NUM_COMPONENTS else DEFAULT_PCA_NUM_COMPONENTS
    pca1 = decomposition.PCA(n_components=pca.n_components_)
    X_pca = pca1.fit_transform(X_scaled)

    v=TfidfVectorizer(sublinear_tf=True, ngram_range=(1, 6), max_features=10000)
    X_names_sparse = v.fit_transform([song['name'] for song in baseSongs]) 
    X_names_sparse.shape
    X_train_last = csr_matrix(hstack([X_pca, X_names_sparse]))

    # build a decision tree
    # More on SKF : https://machinelearningmastery.com/k-fold-cross-validation/
    k_splits = getBestSKFSplit([song['rank'] for song in baseSongs]) 
    if k_splits == None:
        raise Error("Rating values could not be at least paired so SKFSplits is not possible. Please have at least two of each ratingk_splits = 2") 

    skf = StratifiedKFold(n_splits=k_splits, shuffle=True, random_state=42)
    tree = DecisionTreeClassifier()
    tree_params = {'max_depth': range(1,11), 'max_features': range(4,12)}
    tree_grid = GridSearchCV(tree, tree_params, cv=skf, n_jobs=-1, verbose=True)
    #here
    tree_grid.fit(X_train_last, y_train)
    tree_grid.best_estimator_, tree_grid.best_score_

    # Now build the test set
    rec_tracks = []
    for i in playlist_df['id'].values.tolist():
        rec_tracks += sp.recommendations(seed_tracks=[i], limit=LIMIT_REC_TRACKS_FOR_SINGLE_TRACK)['tracks']

    rec_track_ids = []
    rec_track_names = []
    for i in rec_tracks:
        rec_track_ids.append(i['id'])
        rec_track_names.append(i['name'])

    rec_features = []
    for i in range(0,len(rec_track_ids)):
        rec_audio_features = sp.audio_features(rec_track_ids[i])
        for track in rec_audio_features:
            rec_features.append(track)
            
    rec_playlist_df = pd.DataFrame(rec_features, index = rec_track_ids)

    # Apply our original DF set to test set
    X_test_names = v.transform(rec_track_names)
    rec_playlist_df=rec_playlist_df[["acousticness", "danceability", "duration_ms", 
                         "energy", "instrumentalness",  "key", "liveness",
                         "loudness", "mode", "speechiness", "tempo", "valence"]]
    # Apply our DF to create 'ratings' for rec songs 
    tree_grid.best_estimator_.fit(X_train_last, y_train)
    rec_playlist_df_scaled = StandardScaler().fit_transform(rec_playlist_df)
    rec_playlist_df_pca = pca1.transform(rec_playlist_df_scaled)
    X_test_last = csr_matrix(hstack([rec_playlist_df_pca, X_test_names]))
    y_pred_class = tree_grid.best_estimator_.predict(X_test_last)

    # Pick the top ranking tracks to add your new playlist 9, 10 will work
    rec_playlist_df['ratings']=y_pred_class
    rec_playlist_df = rec_playlist_df.sort_values('ratings', ascending = False)
    rec_playlist_df = rec_playlist_df.reset_index()
    recs_to_add = rec_playlist_df[rec_playlist_df['ratings']>=MIN_RATING_ACCEPTANCE_FOR_REC_SONGS]['index'].values.tolist()

    # i have this data here in rec_tracks
    return recs_to_add

def printAudioFeatures(df, importances, indices):
    print("Feature ranking:")
    for f in range(len(importances)):
        print("%d. %s %f " % (f + 1, 
                df.columns[f], 
                importances[indices[f]]))


def getPlaylistDF(sp, songs):

    song_names = [song['name'] for song in songs]
    features = []
    for song in songs:
        audio_features = sp.audio_features(song['id'])
        for track in audio_features:
            features.append(track)

    playlist_df = pd.DataFrame(features, index = song_names)
    playlist_df=playlist_df[["id", "acousticness", "danceability", "duration_ms", 
                         "energy", "instrumentalness",  "key", "liveness",
                         "loudness", "mode", "speechiness", "tempo", "valence"]]

    # add user ratings to df
    playlist_df['ratings'] = [song['rank'] for song in songs]
    return playlist_df

def getBestSKFSplit(rankings):
    rank_dict = defaultdict(int)
    for rank in rankings:
        rank_dict[rank] += 1

    max_split = min(rank_dict.values())
    if max_split < MIN_INVALID_SKF_SPLIT:
        return None
    elif max_split > BEST_SKF_SPLIT:
        return BEST_SKF_SPLIT
    else:
        return max_split