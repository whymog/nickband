import React from "react";
import styles from "./styles.module.scss";

function Song(props) {
  const { title, artist, year, genre, owned, isDarkMode } = props;

  return (
    <div
      className={`${styles.song} ${owned ? styles.owned : styles.unowned} ${
        isDarkMode ? styles.dark : ""
      }`}
    >
      <div className={styles.primaryData}>
        {artist} - "{title}"
      </div>
      <div className={styles.secondaryData}>
        {year} | {genre} | {owned === "Y" ? "In library ✅" : "Not in library ❌"}
      </div>
    </div>
  );
}

export default Song;
