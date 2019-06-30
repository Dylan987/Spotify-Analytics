var handle_button = function(event) {
    console.log("listner triggered");
    var q = document.getElementById("analysis-song-entry").value;
    console.log(q);
    url = "/analysis/" + q;

    var request = new XMLHttpRequest();

    request.onload = function() {
      console.log(request.responseText);
      console.log("hello");

      var theyTyped = document.createElement("p");
      var text = document.createTextNode('You Typed: ' + q);
      theyTyped.appendChild(text);
      document.body.appendChild(theyTyped);

      var iframe = document.getElementsByTagName("iframe")[0];
      var att = document.createAttribute("src");
      var found = request.responseText["id"];
      console.log(found);
      att.value = "https://open.spotify.com/embed/track" + found;
      iframe.setAttributeNode(att);

      var theirAnalysis = document.createElement("p");
      var text2 = document.createTextNode("Your Analysis: " + request.responseText);
      theirAnalysis.appendChild(text2);
      document.body.appendChild(theirAnalysis);
    };
    request.onerror = function () {
      console.log(request.status);
    };
    request.open("GET", url, true);
    request.send();
    return false
};
