const request = require('request');

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
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
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

module.exports = { fetchMyIP, fetchCoordsByIP };