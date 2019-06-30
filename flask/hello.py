from flask import Flask
from flask import request
from flask import render_template
import requests
import pyscripts
import json
import urllib.parse

app = Flask("__name__")


@app.route("/analysis/<qt>")
def analysis(qt):
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
