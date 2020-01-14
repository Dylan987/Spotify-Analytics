var iframe_rules = {"width":"300", "height":"80", "frameborder":"0", "allowtransparency":"true","allow":"encrypted-media"};

var handle_button = function() {
  console.log("listner triggered");
  var q = encodeURIComponent(document.getElementById("analysis-song-entry").value);
  var type = encodeURIComponent(document.getElementById("type-selection").value);
  var url = "/search/" + "q=" + q + "&" + "t=" + type;

  var request = new XMLHttpRequest();

  if (window.location.pathname === "/analysis.html") {
    request.onload = function() {
      var data = JSON.parse(request.responseText);
      console.log(data);

      var number_of_displayed = Math.min(5, data[type + "s"]["items"].length);  // caps at 5 at

      //delete any previous searches
      if (document.querySelector(".results_container") !== null) {
        console.log("deleting");
        document.body.removeChild(document.querySelector(".results_container"));
      }

      //add the new search
      var table_rows = document.createElement("div"); //creating the container
      table_rows.setAttribute("class", "results_container");

      if (number_of_displayed == 0) { //if they send gibberish (or typos)
        var try_again = document.createElement("p");
        try_again.appendChild(document.createTextNode("No results to display. Try another search."));
        var row = document.createElement("div");
        row.setAttribute("class", "result_row");
        row.appendChild(try_again);
        table_rows.appendChild(row);
      }
      else {
        if (type == "track") {
          //tracks
          var items = data["tracks"]["items"]; //array of "track objects"
          for (var i = 0; i < number_of_displayed; i++) {
            //create a link for the table row
            var link = document.createElement("a");
            link.setAttribute("href", "/analysis/" + type + "-" + items[i]["id"]);

            //create a "row" - a display for a single item
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

            //embeded spotify play button (looks nice)
            var preview_audio = document.createElement("iframe");
            for (var key in iframe_rules) {
              preview_audio.setAttribute(key, iframe_rules[key]);
            }
            preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
            row.appendChild(preview_audio);

            link.appendChild(row);

            table_rows.appendChild(link);
          }
        }
        else if (type == "artist") {
          var items = data["artists"]["items"]; //array of "artist" objects
          for (var i = 0; i < number_of_displayed; i++) {
            // create a link for the table rows
            var link = document.createElement("a");
            link.setAttribute("href", "/analysis/" + type + "-" + items[i]["id"]);

            //create a "row" - a display for a single item
            var row = document.createElement("div");
            row.setAttribute("class", "result_row");

            var artist_name = document.createElement("p");
            artist_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
            row.appendChild(artist_name);

            //embeded spotify play button (looks nice)
            var preview_audio = document.createElement("iframe");
            for(var key in iframe_rules) {
              preview_audio.setAttribute(key, iframe_rules[key]);
            }
            preview_audio.setAttribute("height", "380");
            preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
            row.appendChild(preview_audio);

            link.appendChild(row);

            table_rows.appendChild(link);
          }
        }
        else if (type == "album") {
          var items = data["albums"]["items"]; //array of album objects
          for (var i = 0; i < number_of_displayed; i++) {
            //create a link for the table row
            var link = document.createElement("a");
            link.setAttribute("href", "/analysis/" + type + "-" + items[i]["id"]);

            //create a "row" - a display for a single item
            var row = document.createElement("div");
            row.setAttribute("class", "result_row");

            var album_name = document.createElement("p");
            album_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
            row.appendChild(album_name);

            var artist_name = document.createElement("p");
            artist_name.appendChild(document.createTextNode("Artist: " + items[i]["artists"][0]["name"]));
            row.appendChild(artist_name);

            //embeded spotify play button (looks nice)
            var preview_audio = document.createElement("iframe");
            for(var key in iframe_rules) {
              preview_audio.setAttribute(key, iframe_rules[key]);
            }
            preview_audio.setAttribute("height", "380")
            preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
            row.appendChild(preview_audio);

            link.appendChild(row);

            table_rows.appendChild(link);
          }
        }
        else if (type == "playlist") {
          var items = data["playlists"]["items"]; //array of "playlist" objects
          table_rows.setAttribute("class", "results_container");
          for (var i = 0; i < number_of_displayed; i++) {
            //create a "row" - a display for a single item
            var row = document.createElement("div");
            row.setAttribute("class", "result_row");

            var playlist_name = document.createElement("p");
            playlist_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
            row.appendChild(playlist_name);

            //embeded spotify play button (looks nice)
            var preview_audio = document.createElement("iframe");
            for(var key in iframe_rules){
              preview_audio.setAttribute(key, iframe_rules[key]);
            }
            preview_audio.setAttribute("height", "380")
            preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
            row.appendChild(preview_audio);

            table_rows.appendChild(row);
          }
        }
        else {
          console.log("What happened!?")
        }
      }
      //add the finished search to the document
      document.body.appendChild(table_rows);
    };
  }
  else if (window.location.pathname === "/playlist-generator.html") {
    request.onload = function() {
      //get the data
      var data = JSON.parse(request.responseText);
      console.log(data);
      var number_of_displayed = Math.min(5, data[type + "s"]["items"].length);  // caps at 5 at

      //delete previous searches
      if (document.querySelector(".results_container") !== null) {
        console.log("deleting");
        document.querySelector(".formbox").removeChild(document.querySelector(".results_container"));
      }

      //add the new search
      var table_rows = document.createElement("div"); //creating the container
      table_rows.setAttribute("class", "results_container");

      //handle gibberish
      if (number_of_displayed == 0) { //if they send gibberish (or typos)
        var try_again = document.createElement("p");
        try_again.appendChild(document.createTextNode("No results to display. Try another search."));
        var row = document.createElement("div");
        row.setAttribute("class", "result_row");
        row.appendChild(try_again);
        table_rows.appendChild(row);
      }
      else {
        if (type == "track") {
          //tracks
          let items = data["tracks"]["items"]; //array of "track objects"
          for (let i = 0; i < number_of_displayed; i++) {
            //create an event handler for the table row
            let link = document.createElement("div");
            link.addEventListener("click", function() {
                console.log("add this song to the list.  ID: " + items[i]['id']);
                var list = document.getElementsByClassName("seed-confirm-list")[0];
                list_item = document.createElement("li");
                list_item.innerText = items[i]["name"] + " - " + type + ":" + items[i]["id"];
                list_item.classList.add("seed-item");
                list_item.dataset.id = items[i]["id"]; //needed for sessionStorage
                list_item.addEventListener("click", function(e) {
                  this.parentNode.removeChild(this);
                  //remove from sessionStorage
                  let tracks = JSON.parse(sessionStorage.getItem("seed_tracks"));
                  let index = tracks.indexOf(this.dataset.id);
                  tracks.splice(index, 1);
                  sessionStorage.setItem("seed_tracks", JSON.stringify(tracks));
                });
                list.appendChild(list_item);

                //also: remove searches
                if (document.querySelector(".results_container") !== null) {
                  console.log("deleting");
                  document.querySelector(".formbox").removeChild(document.querySelector(".results_container"));
                }

                //also: add to session storage
                if (sessionStorage.getItem("seed_tracks")) {
                  let tracks = JSON.parse(sessionStorage.getItem("seed_tracks")); // return an array of IDs
                  tracks.push(items[i]["id"]);
                  sessionStorage.setItem("seed_tracks", JSON.stringify(tracks));
                } else {
                  let tracks = [];
                  tracks.push(items[i]["id"]);
                  sessionStorage.setItem("seed_tracks", JSON.stringify(tracks));
                }
            });

            //create a "row" - a display for a single item
            let row = document.createElement("div");
            row.setAttribute("class", "result_row");

            let track_name = document.createElement("p");
            track_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
            row.appendChild(track_name);

            let artist_name = document.createElement("p");
            artist_name.appendChild(document.createTextNode("Artist: " + items[i]["artists"][0]["name"]));
            row.appendChild(artist_name);

            let album_name = document.createElement("p");
            album_name.appendChild(document.createTextNode("Album: " + items[i]["album"]["name"]));
            row.appendChild(album_name);

            //embeded spotify play button (looks nice)
            let preview_audio = document.createElement("iframe");
            for (let key in iframe_rules) {
              preview_audio.setAttribute(key, iframe_rules[key]);
            }
            preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"]);
            row.appendChild(preview_audio);

            link.appendChild(row);

            table_rows.appendChild(link);
          }
        }
        else if (type == "artist") {
          let items = data["artists"]["items"]; //array of "artist" objects
          for (let i = 0; i < number_of_displayed; i++) {
            //create an event handler for the row
            let link = document.createElement("div");
            link.addEventListener("click", function() {
              console.log("add this artist to the list.  ID: " + items[i]['id']);
              let list = document.getElementsByClassName("seed-confirm-list")[0];
              let list_item = document.createElement("li");
              list_item.classList.add("seed-item");
              list_item.dataset.id = items[i]["id"];
              list_item.innerText = items[i]["name"] + " - " + type + ": " + items[i]["id"];
              list_item.addEventListener("click", function(e) {
                //remove from sessionStorage
                let artists = JSON.parse(sessionStorage.getItem("seed_artists"));
                let index = artists.indexOf(this.dataset.id);
                artists.splice(index, 1);
                sessionStorage.setItem("seed_artists", JSON.stringify(artists));
                this.parentNode.removeChild(this);
              });
              list.appendChild(list_item);


              //also: remove searches
              if (document.querySelector(".results_container") !== null) {
                console.log("deleting");
                document.querySelector(".formbox").removeChild(document.querySelector(".results_container"));
              }
              //also: add to session storage
              if (sessionStorage.getItem("seed_artists")) {
                let artists = JSON.parse(sessionStorage.getItem("seed_artists")); // return an array of IDs
                artists.push(items[i]["id"]);
                sessionStorage.setItem("seed_artists", JSON.stringify(artists));
              } else {
                let artists = [];
                artists.push(items[i]["id"]);
                sessionStorage.setItem("seed_artists", JSON.stringify(artists));
              }
            });
            //create a "row" - a display for a single item
            let row = document.createElement("div");
            row.setAttribute("class", "result_row");

            let artist_name = document.createElement("p");
            artist_name.appendChild(document.createTextNode("Name: " + items[i]["name"]));
            row.appendChild(artist_name);

            //embeded spotify play button (looks nice)
            let preview_audio = document.createElement("iframe");
            for(let key in iframe_rules) {
              preview_audio.setAttribute(key, iframe_rules[key]);
            }
            preview_audio.setAttribute("height", "380");
            preview_audio.setAttribute("src", "https://open.spotify.com/embed/" + type + "/" + items[i]["id"] + ":" + items[i]["name"]);
            row.appendChild(preview_audio);
            link.appendChild(row);

            table_rows.appendChild(link);
          }
        }
      }
      document.querySelector(".formbox").appendChild(table_rows);
    };
  }
  request.onerror = function () {
    console.log(request.status);
  };
  request.open("GET", url, true);
  request.send();
};

$(document).ready(function() { //only runs when the code is ready

  //replacing the js call from the html
  $("#analysisform").click(handle_button);
  $("#analysis-song-entry").on("keyup", function(e) {
      console.log("called");
      if (e.which === 13) {
        console.log("they hit enter");
        $("#analysisform").click();
      }
  });

  //collapsibles code
  if (document.getElementsByClassName("collapsible").length){
      var c = document.getElementsByClassName("collapsible");
      for (let i = 0; i < c.length; i++){
          c[i].addEventListener("click", function() {
              this.classList.toggle("active");
              var content = this.nextElementSibling;
              if (content.style.display === "block") {
                  content.style.display = "none";
              } else {
                  content.style.display = "block";
              }
          });
      }
  }
  if (document.getElementsByClassName("graph").length) { //only runs if there is a "graph" ID on the page
      let graphs = document.getElementsByClassName("graph");
      //graph object definitions
      //create the bar object:
      function Bar(char, value, x, y, width, height) {
        this.char = char;
        this.value = value;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hovered = false;
        this.isInside = function (mx, my) {
          if (mx < this.x) {
            return false;
          }
          else if (mx > this.x + this.width) {
            return false;
          }
          else if (my < this.y) {
            return false;
          }
          else if (my > this.y + this.height) {
            return false;
          }
          else {
            return true;
          }
        };
        this.draw = function (ctx) {
          ctx.font = "13pt 'Open Sans', sans-serif";
          if (this.hovered) {
            ctx.fillStyle = "#52d98f";
          }
          else {
            ctx.fillStyle = "mediumSeaGreen";
          }
          ctx.fillRect(this.x, this.y, this.width, this.height);
          var txt = this.char + ": " + this.value;
          ctx.fillStyle = "white";
          ctx.fillText(txt, this.x + 5, this.y + 30);
        }
      }
      //create the graph object
      function Graph(dataset, ctx, width, height) {
        ctx.clearRect(0, 0, width, height); //clear the canvas
        this.dataset = dataset;
        this.bars = [];
        var spacing_factor = Math.floor(200 / Object.keys(this.dataset).length)
        var i = 0;
        for (char in dataset) {
          var a = new Bar(char.charAt(0).toUpperCase() + char.slice(1), dataset[char], 40, 60 + spacing_factor * i, dataset[char] * 400, spacing_factor - 5);
          this.bars.push(a);
          i++;
        }
        this.draw = function () {
          //clear the Canvas
          ctx.clearRect(0, 0, 480, 320);
          //the bars
          for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].draw(ctx);
          }
          //the axis
          //vertical (catergory axis):
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.moveTo(40, 20);
          ctx.lineTo(40, 260);
          ctx.moveTo(40, 20);
          ctx.lineTo(30, 30);
          ctx.moveTo(40, 20);
          ctx.lineTo(50, 30);
          ctx.stroke();
          //horizontal (value) axis
          ctx.beginPath();
          ctx.moveTo(40, 260);
          ctx.lineTo(460, 260);
          ctx.lineTo(450, 270);
          ctx.moveTo(460, 260);
          ctx.lineTo(450, 250);
          ctx.stroke();
          //ticks
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            ctx.moveTo(40 + (i + 1) * 40, 260);
            ctx.lineTo(40 + (i + 1) * 40, 270);
            ctx.font = "12pt 'Open Sans', sans-serif";
            ctx.fillStyle = "white";
            if (i < 9) {
              ctx.fillText("0." + (i + 1), 30 + (i + 1) * 40, 290);
            }
            else {
              ctx.fillText("1.0", 30 + (i + 1) * 40, 290)
            }

          }
          ctx.stroke();
        };
        this.mousemove = function(mx, my) {
          for (var i = 0; i < this.bars.length; i++) {
            this.bars[i].hovered = this.bars[i].isInside(mx, my);
          }
          this.draw();
        };
      }

      for (var i = 0; i < graphs.length; i++) {
        let features;
        if (graphs[i].hasAttribute("list")) { //if the element is one of many in a collection
          features = JSON.parse(graphs[i].dataset.features)[i - 1]; //the -1 corrects for the average at the top
        } else {
          features = JSON.parse(graphs[i].dataset.features);
        }
        let style_chars = {
          "danceability": features["danceability"],
          "energy": features["energy"],
          "valence": features["valence"]
        };
        let instrumental_chars = {
          "acousticness": features["acousticness"],
          "liveness": features["liveness"],
          "instrumentalness": features["instrumentalness"],
          "speechiness": features["speechiness"]
        };

        let canvas1 = document.createElement("canvas");
        graphs[i].appendChild(canvas1);
        canvas1.setAttribute("width", "480");
        canvas1.setAttribute("height", "320");
        if (canvas1.getContext) {
          let ctx = canvas1.getContext("2d");
          let style_g = new Graph(style_chars, ctx);
          style_g.draw();
          canvas1.addEventListener("mousemove", function(e) {
            var rect = canvas1.getBoundingClientRect();
            style_g.mousemove(e.clientX - rect.left, e.clientY - rect.top);
          });
        }

        let canvas2 = document.createElement("canvas");
        graphs[i].appendChild(canvas2);
        canvas2.setAttribute("width", "480");
        canvas2.setAttribute("height", "320");
        if (canvas2.getContext) {
          let ctx = canvas2.getContext("2d");
          let instrumental_g = new Graph(instrumental_chars, ctx);
          instrumental_g.draw();
          canvas2.addEventListener("mousemove", function(e) {
            var rect = canvas2.getBoundingClientRect();
            instrumental_g.mousemove(e.clientX - rect.left, e.clientY - rect.top);
          });
        }
      }
    }
  if (document.getElementsByClassName("genre_button").length) {
     document.getElementsByClassName("genre_button")[0].addEventListener("click", function(e) {
       let selected_genre = this.parentNode.getElementsByTagName("input")[0].value;
       //reset the field
       this.parentNode.getElementsByTagName("input")[0].value = "";
       console.log(selected_genre + " is being added to the seed list");
       var list = document.getElementsByClassName("seed-confirm-list")[0];
       var list_item = document.createElement("li");
       list_item.classList.add("seed-item");
       list_item.dataset.genre = selected_genre;
       list_item.innerText = "genre" + ": " + selected_genre
       list_item.addEventListener("click", function(e) {
         //remove from sessionStorage
         let genres = JSON.parse(sessionStorage.getItem("seed_genres"));
         let index = genres.indexOf(this.dataset.genre);
         genres.splice(index, 1);
         sessionStorage.setItem("seed_genres", JSON.stringify(genres));
         this.parentNode.removeChild(this);
       });
       list.appendChild(list_item);
       //also: add to session storage
       if (sessionStorage.getItem("seed_genres")) {
         let genres = JSON.parse(sessionStorage.getItem("seed_genres")); // return an array of IDs
         genres.push(selected_genre);
         sessionStorage.setItem("seed_genres", JSON.stringify(genres));
       } else {
         let genres = [];
         genres.push(selected_genre);
         sessionStorage.setItem("seed_genres", JSON.stringify(genres));
       }
     });
  }
  if (window.location.pathname == "/playlist-generator.html") {
    sessionStorage.clear();

    //implementing range sliders
    $(".range-slider-container").slider({
      range: true,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      values: [0.0, 1.0],
      slide: function(e, ui) {
        let tuneable = this.id.slice(7);
        $("#slider-label-" + tuneable).val(ui.values[0] + " - " + ui.values[1]);
      }
    });

    $(".target-slider-container").slider({
      range: false,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      values: [0.5],
      slide: function(e, ui) {
        let tuneable = this.id.slice(7);
        $("#target-slider-label-" + tuneable).val(ui.values[0]);
      }
    });

    //adding event listener for the btn
    $("#playlist-gen-btn").click(function(){
      //get the range slider values into sessionStorage
      let tuneable_char = ["acousticness", "danceability", "energy", "instrumentalness", "valence"];
      let tuneables = {};
      $(".slider-box").each(function(index){
        let input_els = this.querySelectorAll("input[type='text']");
        let checkboxes = this.querySelectorAll("input[type='checkbox']");
        console.log(checkboxes);
        console.log(input_els);
        tuneables[tuneable_char[index]] = input_els[0].value.split("-");
        tuneables[tuneable_char[index]].push(input_els[1].value);
        //0 - none, 1 - only max/min, 2 - only target, 3 both (technically a bit set (00, 01, 10, 11) hehe
        //note: this halves the # of if statments :)
        let checked_set = 0;
        if (checkboxes[0].checked){
          checked_set += 1;
        }
        if (checkboxes[1].checked) {
          checked_set += 2;
        }
        tuneables[tuneable_char[index]].push(checked_set);
      });
      console.log(tuneables);
      sessionStorage.setItem("tuneables", JSON.stringify(tuneables));
      //get the playlist info sessionStorage
      let playlist_chars = ["title", "privacy", "description"];

      //defaults
      let d = new Date();
      let statetime = d.getTime(); //used for a default playlist name and as a state value
      sessionStorage.setItem("statetime", encodeURIComponent(statetime));
      let playlist_info = {
        "title": "Playlist created at " + statetime,
        "privacy": "private",
        "description": ""
      };

      $(".textbox-playlist").each(function(index){
        if(this.firstElementChild.value){
          playlist_info[playlist_chars[index]] = this.firstElementChild.value;
        }
      });
      console.log(playlist_info);
      sessionStorage.setItem("playlist_info", JSON.stringify(playlist_info));
      let scopes;
      if (playlist_info["privacy"] === "public") {
        scopes = "playlist-modify-public";
      }
      else {
        scopes = "playlist-modify-private";
      }

      //now, send the user to the spotify authentication
      let client_id = "a144ffdca3a04024b85da45b0865dc17";
      let url = "https://accounts.spotify.com/authorize" +
        "?client_id="+client_id+"&response_type=token&redirect_uri=http://127.0.0.1:5000/playlist-generated.html" +
        "&scope=" + encodeURIComponent(scopes) + "&state=" + encodeURIComponent(statetime);
      console.log("you clicked me");
      window.location.href = url;
    });
  }
});
