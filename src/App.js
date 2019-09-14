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
      genres: this.getGenres(db),
      isDarkMode: false,
      isShowingGenreFilters: false,
      ownedSongs: this.getOwnedSongsCount(),
      sortByTitle: false,
      totalSongs: db.length
    };
  }

  clearFilters() {
    const searchInput = document.getElementById("search");
    searchInput.value = "";

    this.setState({
      filters: {
        isOwned: false,
        genre: "",
        searchString: ""
      },
      isShowingGenreFilters: false
    });
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

  toggleDarkMode() {
    this.setState({
      isDarkMode: !this.state.isDarkMode
    });
  }

  updateSearchString(e) {
    e.preventDefault();
    console.log(e.target[0].value);

    this.setState({
      filters: {
        ...this.state.filters,
        searchString: e.target[0].value
      }
    });
  }

  render() {
    const { totalSongs, ownedSongs, filters, isShowingGenreFilters, sortByTitle, isDarkMode } = this.state;
    const { isOwned } = filters;

    let filteredSongs = this.getFilteredSongs();
    let sortedSongs = this.getSortedSongs(filteredSongs, sortByTitle);

    const genres = [];
    this.state.genres.forEach(genre => genres.push(genre));

    return (
      <div className={`${styles.app} ${isDarkMode ? styles.dark : ""}`}>
        <h1 className={styles.title}>
          NickBand v0.1{" "}
          <span className={styles.darkModeToggle} onClick={this.toggleDarkMode.bind(this)}>
            {isDarkMode ? "🌞" : "🌙"}
          </span>
        </h1>
        <div className={styles.options}>
          <div>
            <span className={styles.bold}>{ownedSongs} songs</span> owned, {totalSongs} available
          </div>
          <div>{sortedSongs.length} shown</div>
          <div className={styles.option}>
            <form action="." onSubmit={this.updateSearchString.bind(this)}>
              <input
                className={styles.textInput}
                id="search"
                type="search"
                placeholder="Search for songs or artists..."
              ></input>
            </form>
          </div>
          <div className={styles.option}>
            <input
              id="ownedSongsToggle"
              type="checkbox"
              onChange={this.toggleOwnedSongs.bind(this)}
              checked={isOwned ? true : false}
            />
            <label htmlFor="ownedSongsToggle">Show only songs that Nick owns</label>
          </div>
          <div className={styles.option}>
            <input
              id="showGenresToggle"
              type="checkbox"
              onChange={this.toggleVisibleGenres.bind(this)}
              checked={isShowingGenreFilters}
            />
            <label htmlFor="showGenresToggle">Filter by genre</label>
          </div>
          <div className={styles.genres}>
            {isShowingGenreFilters &&
              genres.map((genre, i) => (
                <button
                  key={i}
                  className={`${styles.button} ${
                    filters.genre.length && filters.genre === genre ? styles.active : styles.inactive
                  }`}
                  name={genre}
                  onClick={this.setGenreFilter.bind(this)}
                >
                  {genre}
                </button>
              ))}
          </div>
          <button className={styles.button} onClick={this.clearFilters.bind(this)}>
            CLEAR FILTERS
          </button>
        </div>
        {sortedSongs.map((song, i) => (
          <Song key={i} isDarkMode={isDarkMode} {...song} />
        ))}
      </div>
    );
  }
}

export default App;
