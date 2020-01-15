import requests
import base64
import os


def get_token():
    client_id = os.environ['spot_id']
    client_secret = os.environ['spot_pass']
    auth_str = "{}:{}".format(client_id, client_secret)
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()
    head = {"Authorization": "Basic " + b64_auth_str}
    dat = {"grant_type": "client_credentials"}
    url = "https://accounts.spotify.com/api/token"
    token = requests.post(url, headers=head, data=dat).json()['access_token']
    return token


def query(_q, _t):

    head = {"Authorization": "Bearer " + get_token()}
    para = {"query": _q, "type": _t}
    url = "https://api.spotify.com/v1/search"
    req = requests.get(url, headers=head, params=para).json()
    return req


def analysis(_id):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/audio-features/" + _id
    req = requests.get(url, headers=head).json()
    return req

def multianalysis(_ids):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/audio-features"
    para = {"ids": _ids}
    req = requests.get(url, headers=head, params=para).json()
    return req

def get_track(_id):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/tracks/" + _id
    req = requests.get(url, headers=head).json();
    return req

def get_album(_id):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/albums/" + _id
    req = requests.get(url, headers=head).json();
    return req

def get_artist(_id):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/artists/" + _id
    req = requests.get(url, headers=head).json();
    return req

def get_artist_albums(_id):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/artists/" + _id + "/albums"
    para = {"limit": 5}
    req = requests.get(url, headers=head, params=para).json();
    return req

def get_album_tracks(_id):
    head = {"Authorization": "Bearer " + get_token()}
    para = {"limit": "50"}
    url = "https://api.spotify.com/v1/albums/" + _id + "/tracks"
    req = requests.get(url, headers=head, params=para).json();
    return req

def get_similar_songs(_id):
    head = {"Authorization": "Bearer " + get_token()}
    para = {"seed_tracks": _id, "limit": 5}
    url = "https://api.spotify.com/v1/recommendations"
    req = requests.get(url, headers=head, params=para).json()
    return req

def get_similar_artists(_id):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/artists/" + _id + "/related-artists"
    req = requests.get(url, headers=head).json();
    return req

def get_top_tracks(_id):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/artists/" + _id + "/top-tracks"
    para = {"country": "CA"} # cheating here - not sure how to add token from country
    req = requests.get(url, headers=head, params=para).json();
    return req

#will require authorization to work correctly to get proper token
#userid is the user's ID, obviously
#name and description are strings, public is a boolean
def create_and_return_playlist(_userID, _name, _description, _public):
    head = {"Authorization": "Bearer " + get_token()}
    para = {"name": _name, "description": _description, "public": _public}
    url = "https://api.spotify.com/users/" + _userID + "/playlists"
    playlist = requests.post(url, headers=head, json=para).json()
    return playlist
