require("dotenv").config();

const keys = require("./keys.js");
const moment = require('moment');

const spotify = new Spotify(keys.spotify);
// moment().format();