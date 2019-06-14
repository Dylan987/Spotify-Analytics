var token = "BQBDEO4xNpj8C987GmToyYSfBdfdIs93nGsY9orpftYwaLTrtfw1IFIYhwUzcywBbTxZ_EeZOPDInJVmj6quxk44TWPSYMdS9Vsy6opcDCQpqKjV7ox9rTBFEuNVxNMya9VoONgBxDcW08csFNq6GexttMaBWksVOZYwPEkCpGtR7TMdETPHqL-7_A_3zJwkTCaTU4Bci2MyK7AvCvSAOqzzMSUap6Q";
var song_id = "1XP0VR8KMArstV37bfzkt8";

function handle_button_click(){
  document.getElementsByTagName("button")[0].innerText = "Clicked!";
  var get_request = new XMLHttpRequest();
  get_request.open("GET", "https://api.spotify.com/v1/audio-features/" + song_id, true);
  get_request.setRequestHeader("Authorization", "Bearer " + token);
  get_request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      var data = JSON.parse(this.responseText);
      document.getElementsByClassName("dance")[0].innerText = data["danceability"];

    }
  }

  get_request.send();

}
