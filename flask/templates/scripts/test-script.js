function handle_analysis_form(event) {
  event.preventDefault();
  var q = document.getElementById("analysis-song-entry").value;
  console.log(q);
  url = "/analysis/" + q;

  var request = new XMLHttpRequest();

  request.onload = function() {
    console.log(request.responseText);

  };
  request.onerror = function () {
    console.log(request.status);
  };
  request.open("GET", url, true);
  request.send();
  return false
}
