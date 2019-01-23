// Requiring npm packages and files
require('dotenv').config();
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const fs = require(`fs`);

// Caputures user input
let arguments = process.argv;
let input = process.argv[2];

let user = '';
    for(let i = 3; i < arguments.length; i++) {
        if(i > 3 && i < arguments.length) {
            user = `${user}+${arguments[i]}`;
        }
        else {
            user += arguments[i];
        }
    }

// Switch statement that runs different functions based on user commands


// concert-this input
function concertSearch(user) {
    if(!user) {
        user = `Ella Mai`;
        console.log(`C'mon, you can think of a better artist than that`);
    }

    let concertUrl = `https://rest.bandsintown.com/artists/${user}/events?app_id=codingbootcamp`;
   
    axios.get(concertUrl).then(
        function(response) {
            if(response.data[0] === undefined) {
                console.log(`Whoops! They aren't performing here anytime soon, try again.`);
            }
            else {
            console.log(`Artist: ${response.data[0].lineup[0]}`);
            console.log(`Venue: ${response.data[0].venue.name}`);
            console.log(`Location: ${response.data[0].venue.city} ${response.data[0].venue.region} ${response.data[0].venue.country}`);
            let date = moment(response.data[0].datetime).format(`MM DD YYYY`);
            console.log(`Date: ${date}`);
            let concert = (`concert-this / Artist: ${response.data[0].lineup[0]} / Venue: ${response.data[0].venue.name} / Location: ${response.data[0].venue.city} ${response.data[0].venue.region} ${response.data[0].venue.country} / Date: ${date},
            `);
 // sends it to the txt file
            fs.appendFile('log.txt', concert, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(`
                    Concert information added to search log!`);
                    }
                })
            }
            
        }
      ).catch(function (error) {
        console.log(error);
      });
} 



function movieSearches(user) {
    if(!user) {
         user = `Mr.+Nobody`;
         console.log(`Can't think of a movie to search for, huh? Here's one you might like!
         `);
    }

    let omdbURL = `http://www.omdbapi.com/?t=${user}&y=&plot=short&apikey=trilogy`;

    axios.get(omdbURL).then(
        function(response) {
            console.log(`Title: ${response.data.Title}`);
            console.log(`Year: ${response.data.Year}`);
            console.log(`IMDB Rating: ${response.data.imdbRating}`);
            console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
            console.log(`Country: ${response.data.Country}`);
            console.log(`Language: ${response.data.Language}`);
            console.log(`Plot: ${response.data.Plot}`);
            console.log(`Actors: ${response.data.Actors}`);
            let exportMovie = (`movie-this / Title: ${response.data.Title} / Year: ${response.data.Year} / Plot: ${response.data.Plot},
            `)
            // Exports input and response to log.txt
            fs.appendFile('log.txt', exportMovie, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(`
                    Movie information added to search log!`);
                    }
                })
        }
      ).catch(function (error) {
        console.log(error);
      });
} // ends movieSearches function


// Function for spotify-this-song input
function spotifySearch(user) {
    if(!user) {
        user = `The Sign Ace of Base`;
        console.log(`Uh-oh, you didn't input a song name! That's OK though, because I saw it - and it opened up my eyes...
        `);
    }

    spotify.search({type: `track`, query: user, limit: 1 })
           .then(function(response) {
               //console.log(JSON.stringify(response, null, 2));
               console.log(`Artist: ${response.tracks.items[0].artists[0].name}`);
               console.log(`Song Title: ${response.tracks.items[0].name}`);
               console.log(`Album: ${response.tracks.items[0].album.name}`);
               let prev;
               if(response.tracks.items[0].prev_url === undefined || response.tracks.items[0].prev_url === null) {
                   prev = "Whoops! Look like this artist is too 'cool' for Spotify";
               } else {
                   prev = response.tracks.items[0].prev_url;
               }
               console.log(`prev URL: ${prev}`);
               let tracks = (`spotify-this-song / Artist: ${response.tracks.items[0].artists[0].name} / Song Title: ${response.tracks.items[0].name} / Album: ${response.tracks.items[0].album.name},
               `);
               // Exports input and response to log.txt
               fs.appendFile('log.txt', tracks, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("Track information added to search log!");
                    }
                })
           })
           .catch(function(err) {
               console.log(err);
           });
} 

// do-what-it-says input
function randomText() {
    fs.readFile('./random.txt', 'utf8', function(error, data) {
        if(error) {
            return console.log(error);
        }

        let dataArr = data.split(',');

        if(dataArr[0] === 'spotify-this-song') {
            let textSong = dataArr[1];
            spotifySearch(textSong);
        }
        else if(dataArr[0] === 'concert-this') {
            let textArtist = dataArr[1];
            concertSearch(textArtist);
        }
        else if(dataArr[0] === 'movie-this') {
            let textMovie = dataArr[1];
            movieSearches(textMovie);
        }
    });
} 
switch (input) {
    case "concert-this":
    concertSearch(user);
    break;

    case "spotify-this-song":
    spotifySearch(user);
    break;

    case "movie-this":
    movieSearches(user);
    break;

    case "do-what-it-says":
    randomText();
    break;

    default:
    console.log(`
    Uh Oh!! That wasn't a valid input:
    For concerts, input 'concert-this' and an artist
    For movies, input 'movie-this' and a movie name
    For songs, input 'spotify-this-song' and a song name
    Or if you can't decide what to look for type in 'do-what-it-says' and you'll get a suprise!`
    )
}