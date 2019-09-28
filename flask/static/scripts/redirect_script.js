$(document).ready(function() {
  //get the token
  let hash = location.hash.slice(1);
  let params = new URLSearchParams(hash);
  let token = params.get("access_token");
  console.log(token);

  //assert that the calculated state matches the given state:
  console.assert(sessionStorage.getItem("statetime") === params.get("state"));

  //use the token to make the requests
  let request_head = {"Authorization": "Bearer " + token, "Content-Type": "application/json"};


  // 1. get the list of songs that match the users choices
  let get_ids = function() {
    let get_data = {}; //format the data to pass
    try {
      get_data["seed_artists"] = JSON.parse(sessionStorage.getItem("seed_artists")).join(",");
    } catch (e) {
      console.log(e);
    }
    try {
      get_data["seed_tracks"] = JSON.parse(sessionStorage.getItem("seed_tracks")).join(",");
    } catch (e){
    }
    try {
      get_data["seed_genres"] = JSON.parse(sessionStorage.getItem("seed_genres")).join(",");
    } catch(e) {
    }
    let tuneables = JSON.parse(sessionStorage.getItem("tuneables"));
    let tunes = ["acousticness", "danceability", "energy", "instrumentalness", "valence"];
    for (let i = 0; i < 5; i++) {
      get_data["min_" + tunes[i]] = parseFloat(tuneables[tunes[i]][0]);
      get_data["max_" + tunes[i]] = parseFloat(tuneables[tunes[i]][1]);
    }
    console.log(get_data);

    let ids = [];
    $.ajax("https://api.spotify.com/v1/recommendations", {
      data: get_data,
      headers: request_head,
      dataType: "json",
      success: (data) => {
        let len = data["tracks"].length;
        if (len < 1) {
          console.log("Bad Input!. 0 length");
        }
        for (let i = 0; i < len; i++){
          ids.push(data.tracks[i].id);
        }
      }
    });
    return ids;
  };



  // 2. make the playlist
  //gets the user id
  let get_user_id = function() {
    $.ajax("https://api.spotify.com/v1/me", {
      headers: request_head,
      method: "GET",
      dataType: "json",
      success: (data) => {
        return data["id"];
      }
    });
  };

  let create_playlist = function(user_id) {
    let playlist_data = {};
    let playlist_info = JSON.parse(sessionStorage.getItem("playlist_info"));
    playlist_data["name"] = playlist_info["title"];
    playlist_data["public"] = playlist_info["privacy"] === "public";
    if (playlist_info["description"]) {
      playlist_data["description"] = playlist_info["description"];
    }


    let playlist_id = "";
    console.log(playlist_data);
    $.ajax("https://api.spotify.com/v1/users/" + "21ddrf6nyskfyon2ul6yf76bi" + "/playlists", {
      headers: request_head,
      data: JSON.stringify(playlist_data),
      method: "POST",
      success: (data) => {
        console.log(data);
        playlist_id = data["id"];
      },
      error: (error) => {
        console.log(error);
      }
    });
    return playlist_id;
  };

  //main code -- promises?

  let id_promise = new Promise(function(resolve) {
    resolve(get_user_id());
  });
  id_promise.then(function(result){
    create_playlist(result);
  });


});