var handle_button = function(event) {
    console.log("listner triggered");
    var q = document.getElementById("analysis-song-entry").value;
    console.log(q);
    url = "/analysis/" + q;

    var request = new XMLHttpRequest();

    request.onload = function() {
      console.log(request.responseText);

      var theyTyped = document.createElement("p");
      var text = document.createTextNode('You Typed: ' + q);
      theyTyped.appendChild(text);
      document.body.appendChild(theyTyped);

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
