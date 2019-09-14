import React from "react";
import Song from "./components/Song/index";
import db from "./data/db.json";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>NickBand v0.1</h1>
      {db.map(song => (
        <Song {...song} />
      ))}
    </div>
  );
}

export default App;
