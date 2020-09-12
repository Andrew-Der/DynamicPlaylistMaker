from .middlewares import login_required
from flask import Flask, json, jsonify, g, request
from schema import FetchSongSchema, MakePlayistSchema
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, decode_token
)
from web.clients.spotify import fetchSongsFromSpotify 
from web.clients.spotify import makePlaylistUsingBaseSongs
from web.clients.spotify import getSpotifyUserId
import requests
from flask import request, redirect, url_for
import base64
import random
import spotipy
from collections import defaultdict
from datetime import timedelta
import os

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY") 
jwt = JWTManager(app)

cid = os.getenv("SPOTIFY_CLIENT_ID")        # Client ID; copy this from your app 
secret = os.getenv("SPOTIFY_CLIENT_SECRET") # Client Secret; copy this from your app

#for avaliable scopes see https://developer.spotify.com/web-api/using-scopes/
scope = 'playlist-modify-public playlist-read-private'

#hardcoded token for testing
the_access_token = ""

TOKEN_DB = defaultdict(dict)

def saveToken(token_info, user_id):
  global TOKEN_DB
  TOKEN_DB[user_id] = {
    'access_token': token_info['access_token'],
    'refresh_token' : token_info['refresh_token'],
    'sp' : {
      'access_token': token_info['sp_access_token'],
      'refresh_token': token_info['sp_refresh_token'],
      'expires_in': token_info['sp_expires_in'],
    }
  }

def getSpotifyAccessToken(request):
  global TOKEN_DB
  jwt_token = request.headers['Authorization'].replace('Bearer ', '')
  jwt_data = decode_token(jwt_token)
  token_data = TOKEN_DB[jwt_data['identity']]
  the_access_token = token_data['sp']['access_token']
  return the_access_token

def generateRandomString(length):
  text = '' 
  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for i in range(length):
    text += (possible[random.randint(0, len(possible) - 1)])
  return text

@app.route("/hey", methods=["GET"])
def hello_world():
  return jsonify("Hello, World!")

@app.route("/callback", methods=["GET","POST"])
def requestAccessToken():

  [code, state] = request.query_string.decode("utf-8").split('&')
  code = code.replace("code=",'')
  state = state.replace("state=", '')

  if (state == None) :
    redirect('/state_mismatch')

  URL = 'https://accounts.spotify.com/api/token'
  PARAMS = {
    'code' : code,
    'redirect_uri' : f'http://{os.getenv("CLIENT_REDIRECT_HOSTNAME")}/login',
    'grant_type' : 'authorization_code',
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
    } 
  }    
  res = requests.post(url=URL, data=PARAMS, auth=(cid, secret))
  res_object = json.loads(res.text)
  access_token = res_object.get('access_token')
  refresh_token = res_object.get('refresh_token')
  expires_in = res_object.get('expires_in')
  
  # set jwt in json data
  # set jwt refresh in cookie 

  # returning this to the front end
  # if access_token != None:
  user_id = getSpotifyUserId(res_object.get('access_token')) 
  ret = {
    'access_token': create_access_token(identity=user_id, expires_delta=timedelta(hours=3)),
    'refresh_token': create_refresh_token(identity=user_id, expires_delta=timedelta(hours=3)),
    'sp_access_token': access_token,
    'sp_refresh_token': refresh_token,
    'sp_expires_in': expires_in,
  }
  saveToken(ret, user_id)

  return jsonify({
    'jwt_access_token' : ret["access_token"], 
    'sp_access_token' : ret["sp_access_token"]
    })


@app.route("/fetch_songs", methods=["POST"])
@jwt_required
def fetchSongs():

  global the_access_token
  if not the_access_token:
    the_access_token = getSpotifyAccessToken(request)
    print(f"Not using hardcoded token, using real token {the_access_token}")

  # given the query, return a list of songs from Spotify
  fetch_song_data = FetchSongSchema().load(json.loads(request.data))

  if fetch_song_data.get('errors'):
    return json_response({'error' : fetch_song_data['errors']}, 422)

  print(f"Fetching songs from SP, query: {fetch_song_data['track_query']}")
  top_tracks = fetchSongsFromSpotify(the_access_token, fetch_song_data['track_query'])
  return jsonify(top_tracks) 

 
@app.route("/create_playlist", methods=["POST"])
# @jwt_required
def makePlaylist():
  # given songIDs, Post a New Playlist to the users Spotify account
  global the_access_token
  if not the_access_token:
    the_access_token = getSpotifyAccessToken(request)
    print(f"Not using hardcoded token, using real token {the_access_token}")

  user_id = ""
  user_id = getSpotifyUserId(getSpotifyAccessToken(request))
  if not user_id:
    return "error getting user_id in make playlist"

  req_data = MakePlayistSchema().load(json.loads(request.data))

  results = makePlaylistUsingBaseSongs(the_access_token, user_id, req_data["playlist_name"], req_data["base_songs"])
  return jsonify(results)


@app.route("/logout", methods=["POST"])
@jwt_required
def logout():
  global TOKEN_DB
  user_id = get_jwt_identity()
  ret_msg = "could not find user"
  if TOKEN_DB.get(user_id):
    user_info = TOKEN_DB.pop(user_id)
    ret_msg = "removed user credentials"
  return jsonify({'success': ret_msg})


# # route not called bc browser redirects to SP login
# @app.route("/login", methods=["GET"])
# def login():
#   URL = 'https://accounts.spotify.com/authorize'
#   state = generateRandomString(16)
#   PARAMS = {
#     'client_id' : cid, 
#     'response_type' : 'code', 
#     #TODO remove port
#     'redirect_uri' : 'http://localhost:4433' + '/callback', 
#     'scope' : scope,
#     'state' : state 
#   }
#   res = requests.get(url= URL, params=PARAMS)
#   print(res.url)
#   return redirect(res.url) 
