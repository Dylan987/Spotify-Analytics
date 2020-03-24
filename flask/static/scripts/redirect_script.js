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
  let get_ids = function(plid_pass_through) {
    let get_data = {}; //format the data to pass
    try {
      get_data["seed_artists"] = JSON.parse(sessionStorage.getItem("seed_artists")).join(",");
    } catch (e) {
      console.log("no artists");
    }
    try {
      get_data["seed_tracks"] = JSON.parse(sessionStorage.getItem("seed_tracks")).join(",");
    } catch (e){
      console.log("no songs");
    }
    try {
      get_data["seed_genres"] = JSON.parse(sessionStorage.getItem("seed_genres")).join(",");
    } catch(e) {
      console.log("no genres");
    }
    let tuneables = JSON.parse(sessionStorage.getItem("tuneables"));
    let tunes = ["acousticness", "danceability", "energy", "instrumentalness", "valence"];
    for (let i = 0; i < 5; i++) { //don't worry about the math. It's just a fancy set of 4 if statments
      if (tuneables[tunes[i]][3] % 2){
        get_data["min_" + tunes[i]] = parseFloat(tuneables[tunes[i]][0]);
        get_data["max_" + tunes[i]] = parseFloat(tuneables[tunes[i]][1]);
      }
      if (Math.floor(tuneables[tunes[i]][3] / 2)) { //why don't they have nice intrger division
        get_data["target_" + tunes[i]] = parseFloat(tuneables[tunes[i]][2]);
      }
    }
    get_data["market"] = "from_token";
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
        get_and_add_songs(plid_pass_through, ids);
      }
    });
  };



  // 2. make the playlist
  //gets the user id
  let get_user_id = function() {
    console.log("got to get_user_id");
    $.ajax("https://api.spotify.com/v1/me", {
      headers: request_head,
      method: "GET",
      dataType: "json",
      success: (data) => {
        create_playlist(data["id"]);
        return data["id"];
      },
      error: error => {console.log("error")}
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
    $.ajax("https://api.spotify.com/v1/users/" + user_id + "/playlists", {
      headers: request_head,
      data: JSON.stringify(playlist_data),
      method: "POST",
      success: (data) => {
        console.log(data);
        playlist_id = data["id"];
        get_ids(playlist_id);
      },
      error: (error) => {
        console.log(error);
      }
    });

  };

  let get_and_add_songs = function(playlist_id, ids) {
    let uris = [];
    for (let i = 0; i < ids.length; i++) {
      uris.push("spotify:track:" + ids[i]);
    }
    let song_data = {"uris" : uris};
    $.ajax("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks", {
      headers: request_head,
      data: JSON.stringify(song_data),
      method: "POST",
      success: (data) => {
        console.log(data);
        $(".playlist-display").attr({
          "width":"300",
          "height": "380",
          "frameborder":"0",
          "allowtransparency":"true",
          "allow":"encrypted-media",
          "src":"https://open.spotify.com/embed/playlist/" + playlist_id
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  };


  //main code -- promises?
  get_user_id();



});
