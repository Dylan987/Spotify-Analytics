var token = "BQCJ1-ljySGfbSVZ4fFZkmWAaQlYnr4hV_qfyDcfaH4iMs236EfIxYUSuwlqPv6vU0HOZaFxEcuhrnR8DwVo7oysdnkB0hvBjvWq0ipxOUkKbew_ihXMvbSJlF8Z0uGKw14wwNB-Pak1s7XcRsaz4IzBQhGnRi0n1b0_zT6TzdDIGj-hhFVSqjtylJwngvRyaSFBO7T7hgghqktfcKhm90W0mjrVK84-7_A_3zJwkTCaTU4Bci2MyK7AvCvSAOqzzMSUap6Q";
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
