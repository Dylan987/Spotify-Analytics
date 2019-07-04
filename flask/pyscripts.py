import requests
import base64


def get_token():
    client_id = "a144ffdca3a04024b85da45b0865dc17"
    client_secret = "9aeee40325cf492e9e341384bd65cf5a"
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

def get_track(_id):
    head = {"Authorization": "Bearer " + get_token()}
    url = "https://api.spotify.com/v1/tracks/" + _id
    req = requests.get(url, headers=head).json();
    return req
