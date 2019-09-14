import React from "react";
import Song from "./components/Song/index";
import db from "./data/db.json";
import styles from "./App.module.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        isOwned: false,
        genre: "",
        searchString: ""
      },
      isShowingGenreFilters: false,
      sortByTitle: false,
      genres: this.getGenres(db),
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

  getSortedSongs(songs, sortByTitle) {
    let sortedSongs = songs;

    sortedSongs.sort((a, b) => {
      if (sortByTitle) {
        if (a.title < b.title) return -1;
        else if (a.title > b.title) return 1;
        return 0;
      } else {
        if (a.artist < b.artist) return -1;
        else if (a.artist > b.artist) return 1;
        return 0;
      }
    });

    return sortedSongs;
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

  toggleVisibleGenres() {
    this.setState({
      isShowingGenreFilters: !this.state.isShowingGenreFilters
    });
  }

  render() {
    const { totalSongs, ownedSongs, isShowingGenreFilters, sortByTitle } = this.state;

    let filteredSongs = this.getFilteredSongs();
    let sortedSongs = this.getSortedSongs(filteredSongs, sortByTitle);

    const genres = [];
    this.state.genres.forEach(genre => genres.push(genre));

    return (
      <div className={styles.app}>
        <h1 className={styles.title}>NickBand v0.1</h1>
        <div className={styles.options}>
          <div>
            {ownedSongs} songs owned, {totalSongs} available
          </div>
          <div>{sortedSongs.length} shown</div>
          <div className={styles.option}>
            <input
              id="ownedSongsToggle"
              type="checkbox"
              onChange={this.toggleOwnedSongs.bind(this)}
            />
            <label htmlFor="ownedSongsToggle">Show only songs that Nick owns</label>
          </div>
          <div className={styles.option}>
            <input
              id="showGenresToggle"
              type="checkbox"
              onChange={this.toggleVisibleGenres.bind(this)}
            />
            <label htmlFor="showGenresToggle">Filter by genre</label>
          </div>
          {isShowingGenreFilters &&
            genres.map((genre, i) => (
              <button key={i} name={genre} onClick={this.setGenreFilter.bind(this)}>
                {genre}
              </button>
            ))}
          <button onClick={this.setGenreFilter.bind(this)}>CLEAR GENRE</button>
        </div>
        {sortedSongs.map((song, i) => (
          <Song key={i} {...song} />
        ))}
      </div>
    );
  }
}

export default App;
