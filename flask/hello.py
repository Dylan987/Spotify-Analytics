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

@app.route("/analysis/<q>")
def analysis(q):
    return json.dumps(pyscripts.analysis(q));

@app.route("/analysis.html")
def analysis_page():
    return render_template("analysis.html", title="Spotify Analytics - Analysis", big_header="Analytics")

@app.route("/home.html")
def home_page():
    return render_template("home.html", title="Spotify Analytics", big_header="Spotify Analytics")

@app.route("/about.html")
def about_page():
    return render_template("about.html", title="Spotify Analytics - About", big_header="About")

@app.route("/contact.html")
def contact_page():
    return render_template("contact.html", title="Spotify Analytics - Contact", big_header="Contact")

@app.route("/playlist-generator.html")
def generator_page():
    return render_template("playlist-generator.html", title="Spotify Analytics - Playlist Generator", big_header="Generate Playlist")

@app.route("/login.html")
def login_page():
    return render_template("login.html", title="Spotify-Analytics - User Authorization", big_header="pls authorize")
