var iframe_rules = {"width":"300", "height":"80", "frameborder":"0", "allowtransparency":"true","allow":"encrypted-media"};

var handle_button = function(event) {
    console.log("listner triggered");
    var q = encodeURIComponent(document.getElementById("analysis-song-entry").value);
    var type = encodeURIComponent(document.getElementById("type-selection").value);
    console.log(type);
    console.log(q);
    url = "/analysis/" + "q=" + q + "&" + "t=" + type

    var request = new XMLHttpRequest();

    request.onload = function() {
      data = JSON.parse(request.responseText);
      console.log(data);

      number_of_displayed = Math.min(5, data[type + "s"]["items"].length);  // caps at 5 at

      //delete any previous searches
      if (document.querySelector(".results_container") !== null) {
        console.log("deleting");
        document.body.removeChild(document.querySelector(".results_container"));
      }

      var table_rows = document.createElement("div");
      table_rows.setAttribute("class", "results_container");
      if (type == "track") {
        var items = data["tracks"]["items"];
        for (var i = 0; i < number_of_displayed; i++) {
          var row = document.createElement("div");
          row.setAttribute("class", "result_row");

          var track_name = document.createElement("p");
          track_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
          row.appendChild(track_name);

          var artist_name = document.createElement("p");
          artist_name.appendChild(document.createTextNode("Artist: " + items[i]["artists"][0]["name"]));
          row.appendChild(artist_name);

          var album_name = document.createElement("p");
          album_name.appendChild(document.createTextNode("Album: " + items[i]["album"]["name"]));
          row.appendChild(album_name);

          var preview_audio = document.createElement("iframe");
          for (var key in iframe_rules) {
              preview_audio.setAttribute(key, iframe_rules[key]);
          }
          preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
          row.appendChild(preview_audio);

          table_rows.appendChild(row)
        }
        document.body.appendChild(table_rows);
      }
      else if (type == "artist") {
        var items = data["artists"]["items"];
        for (var i = 0; i < number_of_displayed; i++) {
          var row = document.createElement("div");
          row.setAttribute("class", "result_row");

          var artist_name = document.createElement("p");
          artist_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
          row.appendChild(artist_name);

          var preview_audio = document.createElement("iframe");
          for(var key in iframe_rules) {
              preview_audio.setAttribute(key, iframe_rules[key]);
          }
          preview_audio.setAttribute("height", "380");
          preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
          row.appendChild(preview_audio);

          table_rows.appendChild(row);
        }
        document.body.appendChild(table_rows);
      }
      else if (type == "album") {
        var items = data["albums"]["items"];
        for (var i = 0; i < number_of_displayed; i++) {
          var row = document.createElement("div");
          row.setAttribute("class", "result_row");

          var album_name = document.createElement("p");
          album_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
          row.appendChild(album_name);

          var artist_name = document.createElement("p");
          artist_name.appendChild(document.createTextNode("Artist: " + items[i]["artists"][0]["name"]));
          row.appendChild(artist_name);

          //maybe a collapsible for track names + analysis darkSlateGray
          var preview_audio = document.createElement("iframe");
          for(var key in iframe_rules) {
                  preview_audio.setAttribute(key, iframe_rules[key]);
          }
          preview_audio.setAttribute("height", "380")
          preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
          row.appendChild(preview_audio);

          table_rows.appendChild(row);
        }
        document.body.appendChild(table_rows);
      }
      else if (type == "playlist") {
        var items = data["playlists"]["items"];
        table_rows.setAttribute("class", "results_container");
        for (var i = 0; i < number_of_displayed; i++) {
          var row = document.createElement("div");
          row.setAttribute("class", "result_row");

          var playlist_name = document.createElement("p");
          playlist_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
          row.appendChild(playlist_name);

          var preview_audio = document.createElement("iframe");
          for(var key in iframe_rules){
              preview_audio.setAttribute(key, iframe_rules[key]);
          }
          preview_audio.setAttribute("height", "380")
          preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
          row.appendChild(preview_audio);

          table_rows.appendChild(row);
        }
        document.body.appendChild(table_rows);
      }
      else {
        console.log("What happened!?")
      }
      if (number_of_displayed == 0) {
        var try_again = document.createElement("p");
        try_again.appendChild(document.createTextNode("no results to display. Try another search"));
        var row = document.createElement("div");
        row.setAttribute("class", "result_row");
        row.appendChild(try_again);
        table_rows.appendChild(row);
      }

    };
    request.onerror = function () {
      console.log(request.status);
    };
    request.open("GET", url, true);
    request.send();
};
