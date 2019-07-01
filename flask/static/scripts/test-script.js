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
      console.log(request.responseText);
      data = JSON.parse(request.responseText);
      console.log(data);

      number_of_displayed = 5 // set to 5 because

      //delete any previous searches
      if (document.querySelector(".results_container") !== null) {
        console.log("deleting");
        document.body.removeChild(document.querySelector(".results_container"));
      }

      if (type == "track") {
        items = data["tracks"]["items"]
        table_rows = document.createElement("div");
        table_rows.setAttribute("class", "results_container")
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

          preview_audio = document.createElement("iframe");
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
        //do something else
      }
      else if (type == "album") {
          items = data["albums"]["items"];
          table_rows = document.createElement("div");
          table_rows.setAttribute("class", "results_container");
          for (var i = 0; i < number_of_displayed; i++){
              row = document.createElement("div");
              row.setAttribute("class", "results_row");

              album_name = document.createElement("p");
              album_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
              row.appendChild(album_name);

              artist_name = document.createElement("p");
              artist_name.appendChild(document.createTextNode("Artist: " + items[i]["artists"][0]["name"]));
              row.appendChild(artist_name);

              //maybe a collapsible for track names + analysis darkSlateGray
              preview_audio = document.createElement("iframe");
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
