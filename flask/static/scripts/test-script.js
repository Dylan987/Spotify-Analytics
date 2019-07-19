var iframe_rules = {"width":"300", "height":"80", "frameborder":"0", "allowtransparency":"true","allow":"encrypted-media"};

var handle_button = function(event) {
    console.log("listner triggered");
    var q = encodeURIComponent(document.getElementById("analysis-song-entry").value);
    var type = encodeURIComponent(document.getElementById("type-selection").value);
    console.log(type);
    console.log(q);
    url = "/search/" + "q=" + q + "&" + "t=" + type;

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
    request.onerror = function () {
      console.log(request.status);
    };
    request.open("GET", url, true);
    request.send();
};

$(document).ready(function() { //only runs when the code is ready
  if (document.getElementById("graph")) { //only runs if there is a "graph" ID on the page
    var features = JSON.parse(document.getElementById("graph").dataset.features); //get the features into JS
    console.log(features); // log them

    var style_chars = {};
    for (element in features) {
        style_chars[element] = features[element];
    }

    canvas = document.createElement("canvas");
    canvas.setAttribute("width", "480");
    canvas.setAttribute("height", "320");
    document.getElementById("graph").appendChild(canvas);
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      //fill bars and text

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
          ctx.font = "14px sans-serif";
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
      //creat the graph object
      function Graph(dataset, ctx) {
        ctx.clearRect(0, 0, 480, 320); //clear the canvas
        this.dataset = dataset;
        this.bars = [];
        var i = 0;
        for (char in dataset) {
          var a = new Bar(char, dataset[char], 40, 80 + 55 * i, dataset[char] * 400, 50);
          this.bars.push(a);
          i++;
        }
        this.draw = function () {
          //clear the Canvas
          ctx.clearRect(0, 0, 480, 320);
          //the title
          ctx.font = "22pt sans-serif";
          ctx.fillStyle = "white";
          //ctx.fillText("{Song Title}", 160, 60);
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
            ctx.font = "12px sans-serif"
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

      var g = new Graph(style_chars, ctx);
      g.draw();

      canvas.addEventListener("mousemove", function(e) {
        var rect = canvas.getBoundingClientRect();
        g.mousemove(e.clientX - rect.left, e.clientY - rect.top);
      });
    }
  }
});

//so collapsibles in analytics (and maybe other places) work
$(document).ready(function() {
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
});
