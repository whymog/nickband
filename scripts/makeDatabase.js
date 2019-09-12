// TODO: This thing should take data/raw.json and pare it down to something very simple.
// It should also run as part of a build script, if I get that far. But it should look for a songs.json file first before overwriting!

const fs = require("fs");
const rawData = require("../data/raw.json");
const songs = rawData.feed.entry;

console.log(songs.length, "songs found");

const fieldsToUse = [
  "gsx$songtitle",
  "gsx$artist",
  "gsx$decade",
  "gsx$genre",
  "gsx$owned"
];

const simplifiedFieldsToUse = ["title", "artist", "year", "genre", "owned"];

const simplifiedSongs = [];
songs.map(song => {
  const simplifiedSong = {};

  for (let i = 0; i < fieldsToUse.length; i++) {
    const text = song[fieldsToUse[i]];

    simplifiedSong[simplifiedFieldsToUse[i]] = song[fieldsToUse[i]]["$t"];
  }

  simplifiedSongs.push(simplifiedSong);
});

fs.writeFile("./data/db.json", JSON.stringify(simplifiedSongs), err => {
  if (err) throw err;
  console.log("Database created!");
});
