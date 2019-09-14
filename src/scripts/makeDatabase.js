// TODO: This thing should take data/raw.json and pare it down to something very simple.
// It should also run as part of a build script, if I get that far. But it should look for a songs.json file first before overwriting!

const fs = require("fs");
const rawData = require("../data/raw.json");
const songs = rawData.feed.entry;

console.log(songs.length, "songs found");

const fieldsToUse = ["gsx$songtitle", "gsx$artist", "gsx$decade", "gsx$genre", "gsx$owned"];

const simplifiedFieldsToUse = ["title", "artist", "year", "genre", "owned"];

const simplifiedSongs = [];
songs.map(song => {
  const simplifiedSong = {};

  for (let i = 0; i < fieldsToUse.length; i++) {
    let text = song[fieldsToUse[i]]["$t"];

    if (simplifiedFieldsToUse[i] === "title") {
      // Cleanup titles
      text = text.match(/([\w\d\s'\/\.!¿?:;,]+)/);
      text = text[1];
      text = text.trim();
    }

    // Mix Pop/Rock and Pop-Rock together
    if (simplifiedFieldsToUse[i] === "genre" && text === "Pop/Rock") {
      text = "Pop-Rock";
    }

    // Mix Prog and Progressive together
    if (simplifiedFieldsToUse[i] === "genre" && text === "Progressive") {
      text = "Prog";
    }

    simplifiedSong[simplifiedFieldsToUse[i]] = text;
  }

  simplifiedSongs.push(simplifiedSong);
});

// Deduplicate songs
let deduplicatedSongs = [];

for (let i = 0; i < simplifiedSongs.length; i++) {
  // Check to see if song is already in deduped array. Only add if it's not.
  const index = deduplicatedSongs.findIndex(
    song => song.title === simplifiedSongs[i].title && song.artist === simplifiedSongs[i].artist
  );
  if (index > -1) {
    console.log(`${simplifiedSongs[i].title} - ${simplifiedSongs[i].artist} already in array - skipping`);
  } else {
    deduplicatedSongs.push(simplifiedSongs[i]);
  }
}

console.log(simplifiedSongs.length, "songs in source file");
console.log(deduplicatedSongs.length, "songs minus duplicates");

fs.writeFile("./src/data/db.json", JSON.stringify(deduplicatedSongs), err => {
  if (err) throw err;
  console.log("Database created!");
});
