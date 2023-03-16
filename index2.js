const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then(passTimes => {
    for (const time of passTimes) {
      console.log(time);
    }
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });