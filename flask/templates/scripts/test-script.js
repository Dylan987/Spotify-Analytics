function handle_analysis_form(event) {
  event.preventDefault();
  var q = document.getElementById("analysis-song-entry").value;
  console.log(q);
  url = "/analysis/" + q;

  var request = new XMLHttpRequest();

  request.onload = function() {
    console.log(request.responseText);

    var they-typed = document.createElement("p");
    they-typed.innerText = 'You Typed: ' + q;
    body.appendElement(they-typed);

    var their-analysis = document.createElement("p");
    their-analysis.innerText = "Your Analysis: " + request.responseText;
    body.appendElemenent(their-analysis);
  };
  request.onerror = function () {
    console.log(request.status);
  };
  request.open("GET", url, true);
  request.send();
  return false
}
