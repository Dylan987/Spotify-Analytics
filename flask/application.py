from flask import Flask
from flask import request
from flask import render_template
import requests
import pyscripts
import json
import urllib.parse

application = app = Flask(__name__)

@app.route("/search/<qt>")
def search(qt):
    params = urllib.parse.parse_qs(qt)

    q = params["q"]
    t = params["t"]

    req = pyscripts.query(q, t)

    return json.dumps(req)

@app.route("/analysis.html")
def analysis_page():
    return render_template("analysis.html")

@app.route("/")
def home_page_2():
    return render_template("home.html")

@app.route("/home.html")
def home_page():
    return render_template("home.html")

@app.route("/about.html")
def about_page():
    return render_template("about.html")

@app.route("/contact.html")
def contact_page():
    return render_template("contact.html")

@app.route("/playlist-generated.html")
def playlist_generated():
    return render_template("playlist-generated.html")

@app.route("/playlist-generator.html")
def generator_page():
    return render_template("playlist-generator.html")

@app.route("/login.html")
def login_page():
    return render_template("login.html")

@app.route("/analysis/track-<i>")
def track_analysis(i):
    id = i
    similar_songs = pyscripts.get_similar_songs(i)['tracks']
    features = pyscripts.analysis(i)
    features2 = pyscripts.analysis(i)
    data = pyscripts.get_track(i)
    removed = ["track_href", "uri", "type", "analysis_url", "key", "mode", "time_signature", "id"]
    removed2 = ["track_href", "uri", "type", "analysis_url", "key", "mode", "time_signature", "id", "tempo", "duration_ms", "loudness"]
    for element in removed2:
        del features2[element]
    features2 = json.dumps(features2)
    key = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]
    mode = ["-", "+"]
    song_key = key[features["key"]] + mode[features["mode"]]
    time_signature = features["time_signature"]
    name = data["name"]
    artists = data["artists"][0]["name"]
    if len(data["artists"]) > 1:
        for i in range (1, len(data["artists"])):
            artists += ", " + data["artists"][i]["name"]
    return render_template("track-analysis.html", title=name, id=id, name=name, artists=artists, features=features, features2=features2, key=song_key, time_signature=time_signature, removed=removed, similar_songs=similar_songs)

@app.route("/analysis/album-<i>")
def album_analysis(i):
    #basic information
    id = str(i)
    album = pyscripts.get_album(id)
    name = album["name"]
    artists = album["artists"][0]["name"] # becomes a comma seperated string of the artists
    audio_preview_link = "https://open.spotify.com/embed/album/" + i
    if len(album["artists"]) > 1:
        for i in range(1, len(album["artists"])):
            artists += ", " + album["artists"][i]["name"]
    #gather ids for analysis
    albumtracks = pyscripts.get_album_tracks(id)
    ids = albumtracks["items"][0]["id"]  # becomes a comma seperated string of song IDs
    if len(albumtracks["items"]) > 1:
        for i in range(1, len(albumtracks["items"])):
            ids += "," + albumtracks["items"][i]["id"]
    features = pyscripts.multianalysis(ids)["audio_features"] # this is a list of song feature dictionaries
    features2 = json.dumps(features)
    #averages track features for the album by summing each value then dividing by the length of the album
    averageremoved = ["track_href", "uri", "type", "analysis_url", "key", "mode", "time_signature", "id"]
    averagefeatures = {"danceability": 0, "energy": 0, "loudness": 0, "speechiness": 0, "acousticness": 0, "instrumentalness": 0, "liveness": 0, "valence": 0, "tempo": 0, "duration_ms": 0}
    for song_features in features:  # for each tracks
        for feature in song_features:  # for each feature
            if feature not in averageremoved:  # if the feature is not to be removed
                averagefeatures[feature] += song_features[feature]
    for feature in averagefeatures:
        averagefeatures[feature] /= album["total_tracks"]
        averagefeatures[feature] = round(averagefeatures[feature], 3)
    averagefeatures["duration_ms"] = round(averagefeatures["duration_ms"])

    averagefeatures2 = json.dumps(averagefeatures)
    #individual track analyses copied and pasted from track_analysis
    key = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]
    mode = ["-", "+"]
    for feature in features:
        #hope this works
        feature.update(Key = key[feature["key"]] + mode[feature["mode"]])
        feature.update(TS = feature["time_signature"])
        track = pyscripts.get_track(feature["id"])
        feature.update(name = track["name"])
    removed = ["track_href", "uri", "type", "analysis_url", "key", "mode", "id", "TS", "time_signature", "Key", "name"]
    return render_template("album-analysis.html", title=name, artists=artists, id=id, ids=ids, features=features, features2=features2, averagefeatures=averagefeatures, averagefeatures2=averagefeatures2, album=albumtracks, removed=removed, audio_preview_link=audio_preview_link)

@app.route("/analysis/artist-<i>")
def artist_analysis(i):
    # basic information
    id = str(i)
    artist = pyscripts.get_artist(id)
    name = artist["name"]
    # albums = pyscripts.get_artist_albums(id)["items"]
    audio_preview_link = "https://open.spotify.com/embed/artist/" + i

    top_songs = pyscripts.get_top_tracks(id)
    ids = top_songs["tracks"][0]["id"] # becomes a comma separated string of song ids
    if len(top_songs["tracks"]) > 1:
        for i in range(1, len(top_songs["tracks"])):
            ids += "," + top_songs["tracks"][i]["id"]

    features = pyscripts.multianalysis(ids)["audio_features"] # list of song feature dictionaries
    features2 = json.dumps(features)
    # average track features by getting averages
    average_removed = ["track_href", "uri", "type", "analysis_url", "key", "mode", "time_signature", "id"]
    average_features = {"danceability": 0, "energy": 0, "loudness": 0, "speechiness": 0, "acousticness": 0, "instrumentalness": 0, "liveness": 0, "valence": 0, "tempo": 0, "duration_ms": 0}
    for song_features in features:
        for feature in song_features:
            if feature not in average_removed:
                average_features[feature] += song_features[feature]
    for feature in average_features:
        average_features[feature] /= len(top_songs["tracks"])
        average_features[feature] = round(average_features[feature], 3)
    average_features["duration_ms"] = round(average_features["duration_ms"])

    average_features2 = json.dumps(average_features)
    key = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]
    mode = ["-", "+"]

    for feature in features:
        feature.update(Key = key[feature["key"]] + mode[feature["mode"]])
        feature.update(TS = feature["time_signature"])
        track = pyscripts.get_track(feature["id"])
        feature.update(name = track["name"])

    removed = ["track_href", "uri", "type", "analysis_url", "key", "mode", "id", "TS", "time_signature", "Key", "name"]

    #songs is here for debugging purposes - i assume it somehow returns empty?
    return render_template("artist-analysis.html", title=name) # unfinished

if __name__ == "__main__":
    application.debug == True
    application.run()
