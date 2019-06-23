function handle_analysis_form() {
  //preventDefault();
  var q = document.getElementById("analysis-song-entry").value;
  console.log(q);
  url = "http://127.0.0.1:5000/analysis/" + q;

  var request = new XMLHttpRequest();
  
  request.onload = function() {
    console.log(request.responseText);

  };
  request.onerror = function () {
    console.log(request.status);
  };
  request.open("GET", url, true);
  request.send();
}
