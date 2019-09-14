import React from "react";
import styles from "./styles.module.scss";

function Song(props) {
  const { title, artist, year, genre, owned } = props;

  return (
    <div className={styles.song}>
      {artist} - {title} | {year} | {genre} | {owned === "Y" ? "In library" : "Not in library"}
    </div>
  );
}

export default Song;
