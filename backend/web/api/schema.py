from marshmallow import Schema, fields

# objects that endpoint is expecting
class MakePlayistSchema(Schema):
  playlist_name = fields.Str(requred=True)
  base_songs = fields.List(fields.Dict(), required=True)
  min_rating_acceptance = fields.Int(required=True)
  return_count_only = fields.Bool(required=True)

class FetchSongSchema(Schema):
  track_query = fields.Str(required=True)