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
      if (filters.genre.length && filters.genre !== song.genre) return;
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

  getGenres(songs) {
    let songGenres = [];

    songs.forEach(song => songGenres.push(song.genre));

    const genres = new Set(songGenres);
    console.log(genres);

    return genres;
  }

  setGenreFilter(e) {
    this.setState({
      filters: {
        ...this.state.filters,
        genre: e.target.name
      }
    });
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
    const genresSet = this.getGenres(filteredSongs);
    const genres = [];

    genresSet.forEach(genre => genres.push(genre));

    console.log(genres);

    return (
      <div className="App">
        <h1>NickBand v0.1</h1>
        <div>
          {ownedSongs} songs owned | {totalSongs} available |{" "}
          {filteredSongs.length} shown
        </div>
        <div>
          <input
            id="ownedSongsToggle"
            type="checkbox"
            onChange={this.toggleOwnedSongs.bind(this)}
          />
          <label htmlFor="ownedSongsToggle">
            Show only songs that Nick owns
          </label>
        </div>
        {genres.map((genre, i) => (
          <button key={i} name={genre} onClick={this.setGenreFilter.bind(this)}>
            {genre}
          </button>
        ))}
        <button onClick={this.setGenreFilter.bind(this)}>CLEAR GENRE</button>
        {filteredSongs.map((song, i) => (
          <Song key={i} {...song} />
        ))}
      </div>
    );
  }
}

export default App;
