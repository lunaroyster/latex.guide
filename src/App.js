import React, { useState, useEffect, useRef  } from 'react';
import MathJax from 'react-mathjax2';
import classNames from 'classnames';

import { Table, TableRow, TableCell, TableBody } from '@material-ui/core';

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
  let [selectedResult, selectResult] = useState(0);
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
  const searchInput = useRef(null);
  useEffect(()=>searchInput.current.focus(), []);
  let updateSearch = e => {
    let term = e.target.value;
    setSearchTerm(term);
    setSearchResult(latexSearch.search(term));
    selectResult(0);
  }
  let pressKey = e => {
    if (e.key === 'Enter') {
      if (searchResult[selectedResult]) {
        copyToClipboard(searchResult[selectedResult].command);
      }
    }
  }
  let selectNext = () => {
    let index = selectedResult+1 >= searchResult.length ? 0 : selectedResult+1;
    selectResult(index);
  }
  let selectPrevious = () => {
    let index = selectedResult === 0 ? searchResult.length-1 : selectedResult-1;
    selectResult(index);
  }
  let keyDown = e => {
    if (e.key === 'Tab') selectNext();
    if (e.key === 'ArrowDown') selectNext();
    if (e.key === 'ArrowUp') selectPrevious();
  }
  return (
    <div className="App">
      <input onChange={e => updateSearch(e)} value={searchTerm} ref={searchInput} onKeyPress={pressKey} onKeyDown={keyDown} id="searchBox" placeholder="Describe your math symbol..." tabIndex={1} />
      <MathJax.Context input='tex'>
        <div>
          <Table>
            <TableBody>
              {searchResult.map((r,i) => (
                <TableRow key={r.command} className={classNames('result', {'selected': i===selectedResult})}>
                  <TableCell>{r.descriptions[0]}</TableCell>
                  <TableCell><code style={{paddingRight: '1em'}}>{r.command}</code></TableCell>
                  <TableCell><span className="renderedlatex"><MathJax.Node inline>{r.example}</MathJax.Node></span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </MathJax.Context>
    </div>
  );
}

export default App;
