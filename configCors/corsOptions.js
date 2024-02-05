const e = require("express");

exports.corsOptionsDelegate = {
  origin: (origin, callback) => {
    // Allow all origins for now, replace with your actual origin check
    callback(null, true);
  },
  optionsSuccessStatus: 200,
};
