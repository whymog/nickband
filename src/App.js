import React from "react";
import Song from "./components/Song/index";
import db from "./data/db.json";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        isOwned: true,
        genre: "",
        searchString: ""
      }
    };
  }

  getFilteredSongs() {
    const { filters } = this.state;

    let filteredSongs = [];

    db.forEach(song => {
      if (filters.isOwned && song.owned !== "Y") return;
      if (filters.genre.length && filters.genre.length !== song.genre) return;
      if (
        filters.searchString.length &&
        !song.title.match(filters.searchString) &&
        !song.artist.match(filters.searchString)
      )
        return;

      filteredSongs.push(song);
    });

    return filteredSongs;
  }

  render() {
    const filteredSongs = this.getFilteredSongs();
    console.log(filteredSongs.length);

    return (
      <div className="App">
        <h1>NickBand v0.1</h1>
        {filteredSongs.map((song, i) => (
          <Song key={i} {...song} />
        ))}
      </div>
    );
  }
}

export default App;
