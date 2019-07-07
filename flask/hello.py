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
    features = pyscripts.analysis(i);
    features2 = json.dumps(features);
    data = pyscripts.get_track(i);
    name = data["name"]
    artists = data["artists"][0]["name"]
    if len(data["artists"]) > 1:
        for i in range (1, len(data["artists"])):
            artists += ", " + data["artists"][i]["name"]
    return render_template("track-analysis.html", title=name, id=i, name=name, artists=artists, features=features, features2=features2)
