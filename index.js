const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

fetchCoordsByIP('99.228.99.228', (error, coords) => {
  if (error) {
    console.log('fetchCoordsByIP error: ', error);
    return;
  }

  console.log(`My coordinates = Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`);
});