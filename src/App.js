import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import Commands from './Commands';

import Fuse from 'fuse.js';

const searchConfig = {
  keys: ['command', 'descriptions'],
};

function App() {
  const latexSearch = new Fuse(Commands, searchConfig);
  const [searchTerm, setSearchTerm] = useState('');
  let [searchResult, setSearchResult] = useState([]);
  let copyToClipboard = async text => {
    try {
      let clipboardPerms = await navigator.permissions.query({name: "clipboard-write"});
      if (clipboardPerms.state === "granted" || clipboardPerms.state === "prompt") {
        await navigator.clipboard.writeText(text);
      };
    } catch (e) {
      console.log(e);
    }
  }
  let updateSearch = e => {
    let term = e.target.value;
    setSearchTerm(term);
    setSearchResult(latexSearch.search(term));
  }
  let pressKey = e => {
    if (e.key === 'Enter') {
      if (searchResult[0]) {
        copyToClipboard(searchResult[0].command);
      }
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <input onChange={e => updateSearch(e)} value={searchTerm} onKeyPress={pressKey}/>
        {searchResult.map(r => (
          <div key={r.command}>{r.descriptions[0]}{r.command}</div>
        ))}
      </header>
    </div>
  );
}

export default App;
