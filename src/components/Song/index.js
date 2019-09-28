import React from "react";
import styles from "./styles.module.scss";

import favoriteActive from "../../images/favorite-active.svg";
import favoriteInactive from "../../images/favorite-inactive.svg";

function Song(props) {
  const { id, title, artist, year, genre, owned, isDarkMode, isFavorite, toggleFavorite } = props;

  return (
    <div className={`${styles.song} ${owned ? styles.owned : styles.unowned} ${isDarkMode ? styles.dark : ""}`}>
      <div className={styles.songData}>
        <div className={styles.primaryData}>
          {artist} - "{title}"
        </div>
        <div className={styles.secondaryData}>
          {year} | {genre} | {owned === "Y" ? "In library ✅" : "Not in library ❌"}
        </div>
      </div>
      <div className={styles.favorite}>
        <img
          src={isFavorite ? favoriteActive : favoriteInactive}
          onClick={() => toggleFavorite(id)}
          alt={isFavorite ? "favorite song" : "click to favorite this song"}
        ></img>
      </div>
    </div>
  );
}

export default Song;
