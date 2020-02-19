
var div = document.getElementById("imgi");
div.document.body.style.backgroundImage = "url('http://localhost:3000/users/5e443c4aa2b629495c4db54a/avatars')";

fetch('localhost:3000/users/5e443c4aa2b629495c4db54a/avatars',{
method: 'GET',
headers: {
  'Content-Type': 'application/json',
  'Authorization':"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTQ0M2M0YWEyYjYyOTQ5NWM0ZGI1NGEiLCJpYXQiOjE1ODE2ODU1Njh9.75iFgaqjrMShiTfiMwwuVVy8mvvU-qUeAqVd4aqfRgM"
}
})  
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
  });
  