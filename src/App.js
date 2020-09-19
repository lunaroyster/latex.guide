import React, { Component, createRef } from "react";
import MathJax from "react-mathjax2";
import classNames from "classnames";

import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Snackbar,
  IconButton,
  CircularProgress,
} from "@material-ui/core";

import "./App.scss";

import Commands from "./Commands";

import Fuse from "fuse.js";

const searchConfig = {
  keys: ["command", "descriptions"],
  includeMatches: true,
  shouldSort: true,
  minMatchCharLength: 2,
};

const promptStates = {
  HIDDEN: 0,
  READY: 1,
  LOADING: 2,
};

const CommandCell = ({ command, onClick }) => (
  <TableCell
    colSpan={1}
    style={{ cursor: "pointer" }}
    onClick={() => onClick(command)}
  >
    <code style={{ paddingRight: "1em" }}>{command}</code>
  </TableCell>
);

const ExampleCell = ({ example }) => (
  <TableCell colSpan={1} style={{ textAlign: "center" }}>
    <span className="renderedlatex">
      <MathJax.Node inline>{example}</MathJax.Node>
    </span>
  </TableCell>
);

function CommandRow({ item, selectedResult, variant, index, matches, onClickRow, onCopy }) {
  const getVisibleDescriptions = (i, matchArray) => {
    const descriptions = [];
    for (const m of matchArray) {
      if (m.key !== "descriptions") {
        continue;
      }

      descriptions.push(i.descriptions[m.arrayIndex]);
    }

    if (descriptions.length === 0) {
      descriptions.push(i.descriptions[0]);
    }

    return descriptions;
  };

  let {command, example} = item;

  if (variant !== -1 && selectedResult === index && item.variants && item.variants[variant]) {
    command = item.variants[variant].command;
    example = item.variants[variant].example;
  }

  return (
    <TableRow
      key={item.command}
      className={classNames("result", { selected: index === selectedResult })}
      tabIndex={index + 1}
      onClick={onClickRow}
    >
      <TableCell colSpan={1}>
        {getVisibleDescriptions(item, matches).map((d) => (
          <div key={d}>"{d}"</div>
        ))}
      </TableCell>
      <CommandCell
        command={command}
        onClick={(cmd) => onCopy(cmd)}
      />
      <TableCell colSpan={1}>
        {item.variants && item.variants.length > 0 && index === selectedResult && (
          <span>
            +{item.variants.length} variant{item.variants.length > 1 && "s"}
          </span>
        )}
      </TableCell>
      <ExampleCell
        example={example}
      />
      <TableCell colSpan={1}>
        {index === selectedResult && 
          // we already have enter to focus
          // eslint-disable-next-line jsx-a11y/interactive-supports-focus 
          <span className="hint" onClick={() => onCopy(command)} role="button">↵ to copy</span>}
      </TableCell>
    </TableRow>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.searchInput = createRef();
    this.latexSearch = new Fuse(Commands, searchConfig);
    this.searchTermChange = new Subject();
    this.searchTermChange.subscribe((e) => {
      const term = e.target.value;
      this.setState({ searchTerm: term });
    });
    this.searchTermChange.pipe(debounceTime(150)).subscribe(() => {
      const term = this.state.searchTerm;
      const results = term.length === 0 ? [] : this.latexSearch.search(term);
      this.setState({
        searchResult: results,
        selectedResult: 0,
        missingPromptState:
          term.length > 2 ? promptStates.READY : promptStates.HIDDEN,
        visibleCount: 15,
      });
    });
    this.state = {
      searchTerm: "",
      searchResult: [],
      selectedResult: 0,
      snackBarMessage: "",
      missingPromptState: promptStates.HIDDEN,
      visibleCount: 12,
      variant: -1,
    };
  }
  componentDidMount() {
    this.searchInput.current.focus();
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keypress", this.pressKey);

    const callback = (r) => {
      const entry = r[0];
      if (entry.isIntersecting) {
        this.loadMoreResults();
      }
    };

    const observer = new window.IntersectionObserver(callback, {
      rootMargin: "0px",
      threshold: 0.1,
    });
    observer.observe(document.querySelector("#loadMoreGutter"));
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyDown);
    document.removeEventListener("keypress", this.pressKey);
  }

  loadMoreResults = () => {
    if (this.state.searchResult.length > this.state.visibleCount) {
      this.setState({
        visibleCount: this.state.visibleCount + 5,
      });
    }
  };
  suggestMissing = async () => {
    try {
      this.setState({ missingPromptState: promptStates.LOADING });
      await window.fetch(
        "https://us-central1-random-arts.cloudfunctions.net/api/latexguide/missingsymbol",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            suggestion: this.state.searchTerm,
          }),
        }
      );
      this.setState({
        missingPromptState: promptStates.HIDDEN,
        snackBarMessage: `Suggested: ${this.state.searchTerm}`,
      });
    } catch (e) {
      console.error(e);
    }
  };
  copyToClipboard = async (text, copyMessage) => {
    try {
      const clipboardPerms = await window.navigator.permissions.query({
        name: "clipboard-write",
      });
      if (
        clipboardPerms.state === "granted" ||
        clipboardPerms.state === "prompt"
      ) {
        await window.navigator.clipboard.writeText(text);
        window.gtag("event", "user_copy");
      }
    } catch (e) {
      try {
        await window.navigator.clipboard.writeText(text);
        window.gtag("event", "user_copy");
      } catch (err) {
        console.log(err);
      }

      console.log(e);
    }

    this.setState({ snackBarMessage: `Copied ${copyMessage}` });
  };
  updateSearch = (e) => {
    this.searchTermChange.next(e);
  };
  clickResult = (index) => {
    this.setState({ selectedResult: index });
  };
  pressKey = (e) => {
    if (e.key === "Enter") {
      const res = this.state.searchResult[this.state.selectedResult];
      if (res) {
        this.copyToClipboard(
          res.item.command,
          res.item.descriptions[0],
        );
      }
    }
  };
  scrollToResult = () => {
    const selectedResult = document.querySelector(".result.selected");
    if (selectedResult) {
      selectedResult.scrollIntoViewIfNeeded();
    }
  };
  nextVariant = () => {
    const { searchResult, selectedResult, variant } = this.state;
    const current = searchResult[selectedResult].item;
    if (
      current.variants &&
      current.variants.length > 0 &&
      variant < current.variants.length - 1
    ) {
      this.setState({ variant: variant + 1 });
    }
  };
  lastVariant = () => {
    const { searchResult, selectedResult, variant } = this.state;
    const current = searchResult[selectedResult].item;
    if (current.variants && current.variants.length > 0 && variant >= 0) {
      this.setState({ variant: variant - 1 });
    }
  };
  selectNext = () => {
    const { selectedResult, searchResult } = this.state;
    const index =
      selectedResult + 1 >= searchResult.length ? 0 : selectedResult + 1;
    const update = { selectedResult: index };
    update.variant = -1;
    this.setState(update);
    this.scrollToResult();
    // window.gtag('event', 'select_next');
  };
  selectPrevious = () => {
    const { selectedResult, searchResult } = this.state;
    const index =
      selectedResult === 0 ? searchResult.length - 1 : selectedResult - 1;
    const update = { selectedResult: index };
    update.variant = -1;
    this.setState(update);
    this.scrollToResult();
    // window.gtag('event', 'select_previous');
  };
  keyDown = (e) => {
    if (e.key === "Tab") {
      (e.shiftKey ? this.selectPrevious : this.selectNext)();
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      this.selectNext();
      e.preventDefault();
    }

    if (e.key === "ArrowUp") {
      this.selectPrevious();
      e.preventDefault();
    }

    if (e.key === "ArrowRight") {
      this.nextVariant();
      e.preventDefault();
    }

    if (e.key === "ArrowLeft") {
      this.lastVariant();
      e.preventDefault();
    }
  };
  closeSnackbar = () => this.setState({ snackBarMessage: "" });
  render() {
    const {
      searchTerm,
      selectedResult,
      searchResult,
      snackBarMessage,
      missingPromptState,
      visibleCount,
      variant,
    } = this.state;
    const visibleResults = searchResult.slice(0, visibleCount);

    return (
      <div className="App">
        <Snackbar
          open={snackBarMessage.length > 0}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          autoHideDuration={1000}
          onClose={this.closeSnackbar}
          message={<span id="message-id">{snackBarMessage}</span>}
        />
        <Container>
          <div className="header">
            <input
              onChange={(e) => this.updateSearch(e)}
              value={searchTerm}
              ref={this.searchInput}
              id="searchBox"
              placeholder="Describe your math symbol..."
              tabIndex={1}
              autoComplete="off"
            />
            {missingPromptState === promptStates.READY && (
              <div id="missingSymbol" onClick={this.suggestMissing} role="button" tabIndex={0}>
                Missing Symbol?
              </div>
            )}
            {missingPromptState === promptStates.LOADING && (
              <div>
                <CircularProgress />
              </div>
            )}
            <a
              href="https://github.com/lunaroyster/LaTeX-search"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton>
                <img
                  src="/github.svg"
                  alt="Link to project's GitHub page"
                  width={32}
                  height={32}
                />
              </IconButton>
            </a>
          </div>
          <MathJax.Context input="tex" options={{messageStyle: "none"}}>
            <div>
              <Table>
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <TableBody>
                  {visibleResults.map(({ item, matches }, i) => (
                    <CommandRow
                      index={i}
                      item={item}
                      selectedResult={selectedResult}
                      matches={matches}
                      onClickRow={() => this.clickResult(i)}
                      onCopy={(command) => this.copyToClipboard(command)}
                      variant={variant}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </MathJax.Context>
          {searchResult.length === 0 && (
            <div id="bottomBar">
              <a
                href="https://www.producthunt.com/posts/latex-search"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  <img
                    src="/producthunt.svg"
                    alt="Link to project's ProductHunt page"
                    width={24}
                    height={24}
                  />
                </IconButton>
              </a>
              <a
                href="https://twitter.com/@itsarnavb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  <img
                    src="/twitter.svg"
                    alt="Link to project's ProductHunt page"
                    width={24}
                    height={24}
                  />
                </IconButton>
              </a>
            </div>
          )}
          <div id="loadMoreGutter" className="no-print">
            {searchResult.length > visibleCount && (
              <CircularProgress onClick={this.loadMoreResults} />
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
