import React, { useState, useEffect } from 'react';
import MathJax from 'react-mathjax2';
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
        <input onChange={e => updateSearch(e)} value={searchTerm} onKeyPress={pressKey} id="searchBox" placeholder="Describe your math symbol..." />
        <MathJax.Context input='tex'>
          <div>
            {searchResult.map(r => (
              <div key={r.command}>{r.descriptions[0]}
                <code>{r.command}</code>
                <MathJax.Node inline>{r.example}</MathJax.Node>
              </div>
            ))}
          </div>
        </MathJax.Context>
      </header>
    </div>
  );
}

export default App;
