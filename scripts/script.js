var client_id = "a144ffdca3a04024b85da45b0865dc17";
var client_secret = "9aeee40325cf492e9e341384bd65cf5a";

function get_token(){
  var url = "https://accounts.spotify.com/api/token";
  var post_request = new XMLHttpRequest();
  post_request.open("POST", url)

}

function handle_analysis_form(){
  var query = document.getElementById("analysis-song-entry").value;

  var get_request = new XMLHttpRequest();
  get_request.open("GET", "https://api.spotify.com/v1/search/" + "q=" + query + "type=track", true);
  get_request.setRequestHeader("Authorization", "Bearer " + token);
  get_request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      var data = JSON.parse(this.responseText);
      document.getElementsByClassName("dance")[0].innerText = data["danceability"];

    }
  }

  get_request.send();

}
