import React, { Component, createRef } from 'react';
import MathJax from 'react-mathjax2';
import classNames from 'classnames';

import { Table, TableRow, TableCell, TableBody, Container, TableHead } from '@material-ui/core';

import './App.css';

import Commands from './Commands';

import Fuse from 'fuse.js';

const searchConfig = {
  keys: ['command', 'descriptions'],
  includeMatches: true,
  shouldSort: true,
  minMatchCharLength: 2,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.searchInput = createRef();
    this.latexSearch = new Fuse(Commands, searchConfig);
  }
  componentDidMount() {
    this.searchInput.current.focus();
    document.addEventListener('keydown', this.keyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown);
  }
  state = {
    searchTerm: '',
    searchResult: [],
    selectedResult: 0,
  }  
  copyToClipboard = async text => {
    try {
      let clipboardPerms = await navigator.permissions.query({name: "clipboard-write"});
      if (clipboardPerms.state === "granted" || clipboardPerms.state === "prompt") {
        await navigator.clipboard.writeText(text);
      };
    } catch (e) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {console.log(e);}
      console.log(e);
    }
  }  
  updateSearch = e => {
    let term = e.target.value;
    let results = this.latexSearch.search(term);
    this.setState({
      searchTerm: term,
      searchResult: results,
      selectedResult: 0,
    });
  }
  pressKey = e => {
    if (e.key === 'Enter') {
      if (this.state.searchResult[this.state.selectedResult]) {
        this.copyToClipboard(this.state.searchResult[this.state.selectedResult].item.command);
      }
    }
  }
  selectNext = () => {
    let { selectedResult, searchResult } = this.state;
    let index = selectedResult+1 >= searchResult.length ? 0 : selectedResult+1;
    this.setState({selectedResult: index});
  }
  selectPrevious = () => {
    let { selectedResult, searchResult } = this.state;
    let index = selectedResult === 0 ? searchResult.length-1 : selectedResult-1;
    this.setState({selectedResult: index});
  }
  keyDown = e => {
    if (e.key === 'Tab') {
      (e.shiftKey ? this.selectPrevious : this.selectNext)();
      e.preventDefault();
    }
    if (e.key === 'ArrowDown') this.selectNext();
    if (e.key === 'ArrowUp') this.selectPrevious();
  };
  getVisibleDescriptions = (item, matches) => {
    let descriptions = [];
    for (let m of matches) {
      if (m.key !== 'descriptions') continue;
      descriptions.push(item.descriptions[m.arrayIndex]);
    }
    return descriptions;
  }
  render() {
    let { searchTerm, selectedResult, searchResult } = this.state;
    return (
      <div className="App">
        <Container>
          <input onChange={e => this.updateSearch(e)} value={searchTerm} ref={this.searchInput} onKeyPress={this.pressKey} id="searchBox" placeholder="Describe your math symbol..." tabIndex={1} />
          <MathJax.Context input='tex'>
            <div>
              <Table>
                <colgroup>
                  <col style={{width:'25%'}}/>
                  <col style={{width:'25%'}}/>
                  <col style={{width:'25%'}}/>
                  <col style={{width:'25%'}}/>
                </colgroup>
                <TableBody>
                  {searchResult.map(({item: r, matches}, i) => (
                    <TableRow key={r.command} className={classNames('result', {'selected': i===selectedResult})} tabIndex={i+1}>
                      <TableCell colSpan={1}>
                        {this.getVisibleDescriptions(r, matches).map(d => (
                          <div key={d}>"{d}"</div>
                        ))}
                      </TableCell>
                      <TableCell colSpan={1}><code style={{paddingRight: '1em'}}>{r.command}</code></TableCell>
                      <TableCell colSpan={1}><span className="renderedlatex"><MathJax.Node inline>{r.example}</MathJax.Node></span></TableCell>
                      <TableCell colSpan={1}>
                        {i===selectedResult && (<span>↵ to copy</span>)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </MathJax.Context>
        </Container>
      </div>
    );
  }
}

export default App;
