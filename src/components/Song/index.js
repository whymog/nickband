import React from "react";

function Song(props) {
  const { title, artist, year, genre, owned } = props;

  return (
    <div>
      {artist} - {title} | {year} | {genre} |{" "}
      {owned === "Y" ? "In library" : "Not in library"}
    </div>
  );
}

export default Song;
