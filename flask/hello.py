from flask import Flask
from flask import request
from flask_cors import CORS
from flask import render_template
import requests
import pyscripts
import json

app = Flask("__name__")
CORS(app)


@app.route("/analysis/<q>")
def analysis(q):
    return json.dumps(pyscripts.analysis(pyscripts.query(q)[0]["id"]))

@app.route("/analysis.html")
def analysis_page():
    searchword = request.args.get('query', "")
    analysis = ""
    if not(searchword == ""):
        analysis = json.dumps(pyscripts.analysis(pyscripts.query(searchword)[0]["id"]))
    return render_template("analysis.html", search=searchword, analysis=analysis)

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