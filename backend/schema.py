from marshmallow import Schema, fields

# objects that endpoint is expecting
class MakePlayistSchema(Schema):
  playlist_name = fields.Str(requred=True)
  base_songs = fields.List(fields.Dict(), required=True)

class FetchSongSchema(Schema):
  track_query = fields.Str(required=True)