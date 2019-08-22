var iframe_rules = {"width":"300", "height":"80", "frameborder":"0", "allowtransparency":"true","allow":"encrypted-media"};

var handle_button = function(event, type) {
  console.log("listner triggered");
  var q = encodeURIComponent(document.getElementById("analysis-song-entry").value);
  var type = encodeURIComponent(document.getElementById("type-selection").value);
  console.log(type);
  console.log(q);
  url = "/search/" + "q=" + q + "&" + "t=" + type;

  var request = new XMLHttpRequest();

  if (type=="analysis") {
    request.onload = function() {
      data = JSON.parse(request.responseText);
      console.log(data);

      number_of_displayed = Math.min(5, data[type + "s"]["items"].length);  // caps at 5 at

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

            table_rows.appendChild(row);
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
  else if (type=="seeds") {
    
  }
  request.onerror = function () {
    console.log(request.status);
  };
  request.open("GET", url, true);
  request.send();
};

$(document).ready(function() { //only runs when the code is ready

  //collapsibles code
  if (document.getElementsByClassName("collapsible")){
      var c = document.getElementsByClassName("collapsible");
      for (var i = 0; i < c.length; i++){
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
  if (document.getElementsByClassName("graph")) { //only runs if there is a "graph" ID on the page
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
          for (var i = 0; i < this.bars.length; i++) {
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
          for (var i = 0; i < 10; i++) {
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
            if (this.bars[i].isInside(mx, my)){
              this.bars[i].hovered = true;
            }
            else {
              this.bars[i].hovered = false;
            }
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
});
