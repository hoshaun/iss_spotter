const request = require('request-promise-native');

const nextISSTimesForMyLocation = function() {
  let passTimes = [];
  
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(body => {
      const parsedBody = JSON.parse(body);
      const times = parsedBody.response;

      for (const time of times) {
        const date = new Date(time.risetime * 1000).toUTCString();
        const duration = time.duration;
        passTimes.push(`Next pass at ${date} for ${duration} seconds!`);
      }
      
      return passTimes;
    });
};

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const parsedBody = JSON.parse(body);
  const latitude = parsedBody.latitude;
  const longitude = parsedBody.longitude;
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

module.exports = { nextISSTimesForMyLocation };