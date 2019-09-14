import React from "react";
import Song from "./components/Song/index";
import db from "./data/db.json";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        isOwned: false,
        genre: "",
        searchString: ""
      },
      totalSongs: db.length,
      ownedSongs: this.getOwnedSongsCount()
    };
  }

  getOwnedSongsCount() {
    const ownedSongs = db.filter(song => song.owned === "Y");
    return ownedSongs.length;
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

  toggleOwnedSongs() {
    this.setState({
      filters: {
        ...this.state.filters,
        isOwned: !this.state.filters.isOwned
      }
    });
  }

  render() {
    const filteredSongs = this.getFilteredSongs();
    const { totalSongs, ownedSongs } = this.state;

    return (
      <div className="App">
        <h1>NickBand v0.1</h1>
        <div>
          {ownedSongs} songs owned | {totalSongs} available |{" "}
          {filteredSongs.length} shown
        </div>
        <input
          id="ownedSongsToggle"
          type="checkbox"
          onChange={this.toggleOwnedSongs.bind(this)}
        />
        <label htmlFor="ownedSongsToggle">Show only songs that Nick owns</label>
        {filteredSongs.map((song, i) => (
          <Song key={i} {...song} />
        ))}
      </div>
    );
  }
}

export default App;
