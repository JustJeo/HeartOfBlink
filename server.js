// Require Statements
const express = require("express");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const fs = require("fs")
// const fs = require("fs")
const app = express();

const db = require("./models");
const album = require("./models/album");

// Middleware
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(layouts);

app.use(methodOverride("_method"));

// Routes
// Get all albums
app.get("/", (req, res) => {
  // const albums = fs.readFileSync()
  db.album
    .findAll()
      .then(returnedAlbum => {
        console.log( "----------------Albums WORK!!!! -----------")
        res.render("home", {
          albumName: returnedAlbum
    })
  })
});

// Get all songs
app.get('/songs', (req, res) => {
  db.song
    .findAll()
      // where: {
      //   albumId: 1
      // }
      .then(returnedSongs => {
        console.log("------------- SONGS PAGE!!! --------------")
        db.album.findAll()
          // { include: [db.song] }
          .then(returnedAlbum => {
            res.render('songs', {
              songs: returnedSongs,
              album: returnedAlbum
            })
          });
      })
});

// Get one game
app.get('/game', (req, res) => {
  // const gameData = JSON.parse(lyrics)
  // // Can you parse over a seeder file?
  // const gameIndex = parseInt(req.params.id)
  db.lyric
    .findAll()
      .then(returnedLyrics => {
        console.log(returnedLyrics)
        console.log("--------- GET QUESTIONS!!!! -------------")
        db.song.findAll()
        .then(returnedSong => {
            res.render('game', {
              lyrics: returnedLyrics,
              song: returnedSong
          })
    });
  })
});

// Get one score
app.get('/results', (req, res) => {
  res.render('results');
});

// Get all scores
app.get('/highscore', (req, res) => {
  res.render('highScore');
});

app.listen(2500, function() {
  db.sequelize.sync()
})

module.exports