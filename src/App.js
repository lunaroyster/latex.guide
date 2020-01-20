import React, { Component, createRef } from 'react';
import MathJax from 'react-mathjax2';
import classNames from 'classnames';

import { Table, TableRow, TableCell, TableBody, Container, TableHead, Snackbar, IconButton, CircularProgress } from '@material-ui/core';

import './App.scss';

import Commands from './Commands';

import Fuse from 'fuse.js';

const searchConfig = {
  keys: ['command', 'descriptions'],
  includeMatches: true,
  shouldSort: true,
  minMatchCharLength: 2,
};

const promptStates = {
  HIDDEN: 0,
  READY: 1,
  LOADING: 2,
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
    document.addEventListener('keypress', this.pressKey);

    let callback = r => {
      let entry = r[0];
      if (entry.isIntersecting) {
        if (this.state.searchResult.length > this.state.visibleCount) {
          this.setState({
            visibleCount: this.state.visibleCount + 5,
          })
        }
      }
    }
    let observer = new IntersectionObserver(callback, {
      rootMargin: '0px',
      threshold: 0.1
    });
    observer.observe(document.querySelector('#loadMoreGutter'));
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('keypress', this.pressKey);
  }
  state = {
    searchTerm: '',
    searchResult: [],
    selectedResult: 0,
    snackBarMessage: '',
    missingPromptState: promptStates.HIDDEN,
    visibleCount: 15,
  }
  suggestMissing = async () => {
    try {
      this.setState({missingPromptState: promptStates.LOADING});
      await window.fetch('https://us-central1-random-arts.cloudfunctions.net/api/latexguide/missingsymbol', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          suggestion: this.state.searchTerm,
        }),
      });
      this.setState({missingPromptState: promptStates.HIDDEN, snackBarMessage: `Suggested: ${this.state.searchTerm}`});
    } catch (e) {}
  }
  copyToClipboard = async text => {
    try {
      let clipboardPerms = await navigator.permissions.query({name: "clipboard-write"});
      if (clipboardPerms.state === "granted" || clipboardPerms.state === "prompt") {
        await navigator.clipboard.writeText(text);
        window.gtag('event', 'user_copy');
      };
    } catch (e) {
      try {
        await navigator.clipboard.writeText(text);
        window.gtag('event', 'user_copy');
      } catch (e) {console.log(e);}
      console.log(e);
    }
    this.setState({snackBarMessage: 'Copied!'});
  }
  updateSearch = e => {
    let term = e.target.value;
    this.setState({searchTerm: term});
    setTimeout(()=>{
      let results = this.latexSearch.search(term);
      this.setState({
        searchResult: results,
        selectedResult: 0,
        missingPromptState: term.length > 2 ? promptStates.READY : promptStates.HIDDEN,
        visibleCount: 15,
      });
    }, 1)
  }
  clickResult = index => {
    this.setState({selectedResult: index});
  }
  pressKey = e => {
    if (e.key === 'Enter') {
      if (this.state.searchResult[this.state.selectedResult]) {
        this.copyToClipboard(this.state.searchResult[this.state.selectedResult].item.command);
      }
    }
  }
  scrollToResult = () => {
    let selectedResult = document.querySelector('.result.selected');
    if (selectedResult) selectedResult.scrollIntoViewIfNeeded()
  }
  selectNext = () => {
    let { selectedResult, searchResult } = this.state;
    let index = selectedResult+1 >= searchResult.length ? 0 : selectedResult+1;
    this.setState({selectedResult: index});
    this.scrollToResult();
    // window.gtag('event', 'select_next');
  }
  selectPrevious = () => {
    let { selectedResult, searchResult } = this.state;
    let index = selectedResult === 0 ? searchResult.length-1 : selectedResult-1;
    this.setState({selectedResult: index});
    this.scrollToResult();
    // window.gtag('event', 'select_previous');
  }
  keyDown = e => {
    if (e.key === 'Tab') {
      (e.shiftKey ? this.selectPrevious : this.selectNext)();
      e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
      this.selectNext();
      e.preventDefault();
    }
    if (e.key === 'ArrowUp') {
      this.selectPrevious();
      e.preventDefault();
    }
  };
  getVisibleDescriptions = (item, matches) => {
    let descriptions = [];
    for (let m of matches) {
      if (m.key !== 'descriptions') continue;
      descriptions.push(item.descriptions[m.arrayIndex]);
    }
    if (descriptions.length === 0) descriptions.push(item.descriptions[0])
    return descriptions;
  }
  closeSnackbar = () => this.setState({snackBarMessage: ''});
  render() {
    let { searchTerm, selectedResult, searchResult, snackBarMessage, missingPromptState, visibleCount } = this.state;
    let visibleResults = searchResult.slice(0, visibleCount);
    return (
      <div className="App">
        <Snackbar 
          open={snackBarMessage.length > 0}
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
          autoHideDuration={1000}
          onClose={this.closeSnackbar}
          message={<span id="message-id">{snackBarMessage}</span>}
        />
        <Container>
          <div className="header">
            <input onChange={e => this.updateSearch(e)} value={searchTerm} ref={this.searchInput} id="searchBox" placeholder="Describe your math symbol..." tabIndex={1} />
            {missingPromptState === promptStates.READY && <div id="missingSymbol" onClick={this.suggestMissing}>Missing Symbol?</div>}
            {missingPromptState === promptStates.LOADING && <div><CircularProgress /></div>}
            <a href="https://github.com/lunaroyster/LaTeX-search" target="_blank" rel="noopener noreferrer"><IconButton><img src="/github.svg" alt="Link to project's GitHub page" width={32} height={32} /></IconButton></a>
          </div>
          <MathJax.Context input='tex'>
            <div>
              <Table>
                <colgroup>
                  <col style={{width:'30%'}}/>
                  <col style={{width:'30%'}}/>
                  <col style={{width:'30%'}}/>
                  <col style={{width:'10%'}}/>
                </colgroup>
                <TableBody>
                  {visibleResults.map(({item: r, matches}, i) => (
                    <TableRow key={r.command} className={classNames('result', {'selected': i===selectedResult})} tabIndex={i+1} onClick={() => this.clickResult(i)}>
                      <TableCell colSpan={1}>
                        {this.getVisibleDescriptions(r, matches).map(d => (
                          <div key={d}>"{d}"</div>
                        ))}
                      </TableCell>
                      <TableCell colSpan={1} style={{cursor: 'pointer'}} onClick={()=>this.copyToClipboard(r.command)}><code style={{paddingRight: '1em'}}>{r.command}</code></TableCell>
                      <TableCell colSpan={1} style={{textAlign: 'center'}}>
                        <span className="renderedlatex"><MathJax.Node inline>{r.example}</MathJax.Node></span>
                      </TableCell>
                      <TableCell colSpan={1}>
                        {i===selectedResult && (<span className="hint">↵ to copy</span>)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </MathJax.Context>
          {searchResult.length === 0 && (
            <div id="bottomBar">
              <a href="https://www.producthunt.com/posts/latex-search" target="_blank" rel="noopener noreferrer"><IconButton><img src="/producthunt.svg" alt="Link to project's ProductHunt page" width={24} height={24} /></IconButton></a>
              <a href="https://twitter.com/@itsarnavb" target="_blank" rel="noopener noreferrer"><IconButton><img src="/twitter.svg" alt="Link to project's ProductHunt page" width={24} height={24} /></IconButton></a>
            </div>
          )}
          <div id="loadMoreGutter">
            {searchResult.length > visibleCount && (
              <CircularProgress />
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
