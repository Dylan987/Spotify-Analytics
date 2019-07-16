from flask import Flask
from flask import request
from flask import render_template
import requests
import pyscripts
import json
import urllib.parse

app = Flask("__name__")

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

@app.route("/home.html")
def home_page():
    return render_template("home.html")

@app.route("/about.html")
def about_page():
    return render_template("about.html")

@app.route("/contact.html")
def contact_page():
    return render_template("contact.html")

@app.route("/playlist-generator.html")
def generator_page():
    return render_template("playlist-generator.html")

@app.route("/login.html")
def login_page():
    return render_template("login.html")

@app.route("/analysis/track-<i>")
def track_analysis(i):
    features = pyscripts.analysis(i)
    features2 = json.dumps(features)
    data = pyscripts.get_track(i)
    removed = ["track_href", "uri", "type", "analysis_url", "key", "mode", "time_signature"]
    key = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]
    mode = ["-", "+"]
    song_key = key[features["key"]] + mode[features["mode"]]
    time_signature = features["time_signature"]
    name = data["name"]
    artists = data["artists"][0]["name"]
    if len(data["artists"]) > 1:
        for i in range (1, len(data["artists"])):
            artists += ", " + data["artists"][i]["name"]
    return render_template("track-analysis.html", title=name, id=i, name=name, artists=artists, features=features, features2=features2, key=song_key, time_signature=time_signature, removed=removed)

@app.route("/analysis/album-<i>")
def album_analysis(i):
    #basic information
    album = pyscripts.get_album(i)
    name = album["name"]
    artists = album["artists"][0]["name"]
    if len(album["artists"]) > 1:
        for i in range(1, len(album["artists"])):
            artists += ", " + album["artists"][i]["name"]
    #gather ids for analysis
    albumtracks = pyscripts.get_album_tracks(i)
    ids = albumtracks["items"][0]["id"]
    if len(albumtracks["items"]) > 1:
        for i in range(1, len(albumtracks["items"])):
            ids += "," + albumtracks["items"][i]["id"]
    features = pyscripts.multianalysis(ids)["audio_features"]
    #averages track features for the album by summing each value then dividing by the length of the album
    averageremoved = ["track_href", "uri", "type", "analysis_url", "key", "mode", "time_signature", "id"]
    averagefeatures = {"danceability": 0, "energy": 0, "loudness": 0, "speechiness": 0, "acousticness": 0, "instrumentalness": 0, "liveness": 0, "valence": 0, "tempo": 0, "duration_ms": 0}
    for song_features in features:
        for feature in song_features:
            if feature not in averageremoved:
                averagefeatures[feature] += song_features[feature]
    for feature in averagefeatures:
        averagefeatures[feature] /= album["total_tracks"]
    #individual track analyses copied and pasted from track_analysis
    key = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]
    mode = ["-", "+"]
    for feature in features:
        #hope this works
        feature.update(Key = key[feature["key"]] + mode[feature["mode"]])
        feature.update(TS = feature["time_signature"])
        track = pyscripts.get_track(feature["id"])
        feature.update(name = track["name"])
    removed = ["track_href", "uri", "type", "analysis_url", "key", "mode", "id", "TS", "time_signature", "Key"]
    return render_template("album-analysis.html", title=name, artists=artists, id=i, ids=ids, features=features, averagefeatures=averagefeatures, album=albumtracks, removed=removed)
