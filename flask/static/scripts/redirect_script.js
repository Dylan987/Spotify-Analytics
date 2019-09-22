$(document).ready(function() {
  //get the token
  let hash = location.hash.slice(1);
  let params = new URLSearchParams(hash);
  let token = params.get("access_token");
  console.log(token);

  //use the token to make the request



});