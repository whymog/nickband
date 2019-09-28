import React from "react";

import Song from "./components/Song/index";
import db from "./data/db.json";
import styles from "./App.module.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        isFavorite: false,
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

    // Initialize favorites in localStorage if not present
    if (window.localStorage.getItem("favorites") === null) {
      window.localStorage.setItem("favorites", JSON.stringify([]));
    }
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
      isShowingGenreFilters: false,
      sortByTitle: false
    });
  }

  getOwnedSongsCount() {
    const ownedSongs = db.filter(song => song.owned === "Y");
    return ownedSongs.length;
  }

  getFilteredSongs() {
    const { filters } = this.state;
    const favorites = JSON.parse(window.localStorage.getItem("favorites"));

    let filteredSongs = [];

    db.forEach(song => {
      if (filters.isOwned && song.owned !== "Y") return;
      if (filters.isFavorite && favorites.indexOf(song.id) < 0) return;
      if (filters.genre.length && filters.genre !== song.genre) return;
      if (
        filters.searchString.length &&
        !song.title.toLowerCase().match(filters.searchString.toLowerCase()) &&
        !song.artist.toLowerCase().match(filters.searchString.toLowerCase())
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

    return new Set(songGenres);
  }

  setGenreFilter(e) {
    this.setState({
      filters: {
        ...this.state.filters,
        genre: e.target.name
      }
    });
  }

  toggleFavoriteSongs() {
    this.setState({
      filters: {
        ...this.state.filters,
        isFavorite: !this.state.filters.isFavorite
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

  toggleFavorite(id) {
    if (id >= 0) {
      const favorites = JSON.parse(window.localStorage.getItem("favorites"));

      const faveIndex = favorites.indexOf(id);

      if (faveIndex > -1) {
        favorites.splice(faveIndex, 1);
      } else {
        favorites.push(id);
      }

      window.localStorage.setItem("favorites", JSON.stringify(favorites));

      // Since we're only using localStorage and not state to manage favorites,
      // React needs to be told to update
      this.forceUpdate();
    }
  }

  toggleSortBy() {
    this.setState({
      sortByTitle: !this.state.sortByTitle
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
    const { isFavorite, isOwned } = filters;

    let filteredSongs = this.getFilteredSongs();
    let sortedSongs = this.getSortedSongs(filteredSongs, sortByTitle);

    const genres = [];
    this.state.genres.forEach(genre => genres.push(genre));

    let previousEntryName = "";

    const alphabet = Array.from("abcdefghijklmnopqrstuvwxyz");

    // Get favorites
    const favorites = JSON.parse(window.localStorage.getItem("favorites"));

    return (
      <div className={`${styles.app} ${isDarkMode ? styles.dark : ""}`}>
        <h1 className={styles.title}>
          NickBand <span className={styles.version}>v0.1.1</span>{" "}
          <span className={styles.darkModeToggle} onClick={this.toggleDarkMode.bind(this)}>
            {isDarkMode ? "🌙" : "🌞"}
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
              id="favoriteSongsToggle"
              type="checkbox"
              onChange={this.toggleFavoriteSongs.bind(this)}
              checked={isFavorite ? true : false}
            />
            <label htmlFor="favoriteSongsToggle">Show only favorites</label>
          </div>
          <div className={styles.option}>
            <input
              id="sortByToggle"
              type="checkbox"
              onChange={this.toggleSortBy.bind(this)}
              checked={sortByTitle ? true : false}
            />
            <label htmlFor="sortByToggle">Sort by title</label>
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
          <div>
            Jump to a letter:{" "}
            <div className={styles.jumpToLetterWrapper}>
              {alphabet.map(letter => (
                <span
                  key={letter}
                  className={styles.jumpToLetterLink}
                  onClick={() => {
                    const element = document.getElementById(`section-${letter.toUpperCase()}`);
                    element.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {letter.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
        {sortedSongs.map((song, i) => {
          let shouldInsertNewLetter = false;
          const newEntryName = sortByTitle ? song.title : song.artist;

          if (
            !previousEntryName.length ||
            (previousEntryName.length && newEntryName.charAt(0) > previousEntryName.charAt(0))
          ) {
            shouldInsertNewLetter = true;
          }

          previousEntryName = newEntryName;

          return (
            <React.Fragment key={i}>
              {shouldInsertNewLetter ? (
                <div className={styles.sectionHeader}>
                  <span id={`section-${newEntryName.charAt(0)}`}>{newEntryName.charAt(0)}</span>
                  <span
                    className={styles.backToTop}
                    onClick={() => {
                      window.scroll({
                        top: 0,
                        left: 0,
                        behavior: "smooth"
                      });
                    }}
                  >
                    back to top
                  </span>
                </div>
              ) : (
                ""
              )}
              <Song
                key={i}
                isDarkMode={isDarkMode}
                {...song}
                isFavorite={favorites.indexOf(song.id) >= 0}
                toggleFavorite={this.toggleFavorite.bind(this)}
              />
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export default App;
