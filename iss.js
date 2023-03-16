const request = require('request');

const nextISSTimesForMyLocation = function(callback) {
  let passTimes = [];

  fetchMyIP((error, ip) => {
    if (error) {
      console.log("fetchMyIP error: " , error);
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        console.log('fetchCoordsByIP error: ', error);
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, times) => {
        if (error) {
          console.log('fetchISSFlyOverTimes error: ', error);
          return callback(error, null);
        }

        for (const time of times) {
          const date = new Date(time.risetime * 1000).toUTCString();
          const duration = time.duration;
          passTimes.push(`Next pass at ${date} for ${duration} seconds!`);
        }
        
        callback(error, passTimes);
      });
    });
  });
};

const fetchMyIP = function(callback) {
  request.get('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = body && JSON.parse(body) ? JSON.parse(body).ip : null;

    callback(error, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request.get(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coords. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const parsedBody = JSON.parse(body);
    
    if (!parsedBody.success) {
      const msg = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(msg), null);
      return;
    }

    const coords = {
      latitude: parsedBody.latitude,
      longitude: parsedBody.longitude
    };

    callback(error, coords);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request.get(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
  
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Fly Over Times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    const times = JSON.parse(body).response;
  
    callback(error, times);
  });
};

module.exports = { nextISSTimesForMyLocation };