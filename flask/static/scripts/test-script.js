var iframe_rules = {"width":"300", "height":"80", "frameborder":"0", "allowtransparency":"true","allow":"encrypted-media"};

var handle_button = function(event) {
    console.log("listner triggered");
    var q = encodeURIComponent(document.getElementById("analysis-song-entry").value);
    var type = encodeURIComponent(document.getElementById("type-selection").value);
    console.log(type);
    console.log(q);
    url = "/analysis/" + "q=" + q + "&" + "t=" + type;

    var request = new XMLHttpRequest();

    request.onload = function() {
      console.log(request.responseText);
      data = JSON.parse(request.responseText);
      console.log(data);

      if (type == "track") {
        items = data["tracks"]["items"]
        table_rows = document.createElement("div");
        table_rows.setAttribute("class", "results_container")
        number_of_displayed = 5 // set to 5 because
        for (var i = 0; i < number_of_displayed; i++) {
          row = document.createElement("div");
          row.setAttribute("class", "result_row")

          track_name = document.createElement("p");
          track_name_text = document.createTextNode("Name: " + items[i]["name"]);
          track_name.appendChild(track_name_text);
          row.appendChild(track_name);

          artist_name = document.createElement("p");
          artist_name_text = document.createTextNode("Artist: " + items[i]["artists"][0]["name"]);
          artist_name.appendChild(artist_name_text);
          row.appendChild(artist_name);

          album_name = document.createElement("p");
          album_name_text = document.createTextNode("Album: " + items[i]["album"]["name"]);
          album_name.appendChild(album_name_text);
          row.appendChild(album_name);

          //preview_audio = document.createElement("audio");
          //preview_audio.setAttribute("controls", "");
          //preview_audio_source = document.createElement("source");
          //preview_audio_source.setAttribute("src", items[i]["preview_url"])
          //preview_audio.appendChild(preview_audio_source);
          //row.appendChild(preview_audio);

          preview_audio = document.createElement("iframe");
          for (var key in iframe_rules) {
              preview_audio.setAttribute(key, iframe_rules[key]);
          }
          preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
          row.appendChild(preview_audio);

          document.body.appendChild(row);
        }
      }
      else if (type == "artist") {
        //do something else
      }
      else if (type == "album") {
        //something else again
      }
      else if (type == "playlist") {
        //bah
      }
      else {
        console.log("What happened!?")
      }

    };
    request.onerror = function () {
      console.log(request.status);
    };
    request.open("GET", url, true);
    request.send();
};
