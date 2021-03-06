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
  db.album
    .findAll()
      .then(returnedAlbum => {
        console.log( "----------------Albums WORK!!!! -----------")
        res.render("home", {
          album: returnedAlbum
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
app.get('/game/:id', (req, res) => {
  const gameIndex = parseInt(req.params.id)
  db.song
    .findOne({
      where: {
        id: gameIndex
      },
      include: [db.lyric]
    })
      .then(returnedSong => {
        console.log("---------- GET QUESTIONS!!!! ----------")
            res.render('game', {
              lyrics: returnedSong.lyrics,
              song: returnedSong
            })
    })
});

// Get one score
app.post('/results/:id', (req, res) => {
  const gameIndex = parseInt(req.params.id)
  db.song
    .findOne({
      where: {
        id: gameIndex
      },
      include: [db.highscore],
      include: [db.lyric]
    })
      .then(returnedSong => {
        console.log("----------- GET Answers of ONE SONG!!! ------------")
          res.render('results', {blink:{
            oneHighscore: returnedSong.highscores,
            song: returnedSong,
            lyrics: returnedSong.lyrics,
            playerAnswer: req.body
          }});
      })
});

// Get all scores
app.get('/highscore', (req, res) => {
  db.highscore
    .findAll()
      .then(returnedScores => {
        console.log(returnedScores)
        console.log("----------- GET High Score of ALL SONGS!!! ------------")
        db.song.findAll()
          .then(returnedSong => {
            res.render('highscore', {
              scores: returnedScores,
              song: returnedSong
            });
          })
      })
});

app.listen(2500, function() {
  db.sequelize.sync()
})

module.exports