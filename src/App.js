import React, { Component, createRef } from "react";
import MathJax from "react-mathjax2";
import classNames from "classnames";

import { v4 as uuid } from "uuid";

import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { GithubIcon, ProductHuntIcon, TwitterIcon } from "./Icons";

import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";

import Check from "@material-ui/icons/Check";
import Add from "@material-ui/icons/Add";

import "./App.scss";

import Commands from "./Commands";

import Fuse from "fuse.js";

const searchConfig = {
  keys: ["command", "descriptions"],
  includeMatches: true,
  shouldSort: true,
  minMatchCharLength: 2,
};

const getUserCommands = () => {
  try {
    const c = window.localStorage.getItem("user/commands");
    if (c && typeof c === "string") {
      const userCommands = JSON.parse(c);

      return Object.values(userCommands);
    }
  } catch (e) {
    console.log(e);
  }

  return [];
};

const getFuse = () => {
  const commands = [...Commands];

  commands.push(...getUserCommands());

  return new Fuse(commands, searchConfig);
};

const appStates = {
  SEARCH: 0,
  NEWSYMBOL: 1,
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

function CommandRow({
  item,
  selectedResult,
  variant,
  index,
  matches,
  onClickRow,
  onCopy,
}) {
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

  let { command, example } = item;

  if (
    variant !== -1 &&
    selectedResult === index &&
    item.variants &&
    item.variants[variant]
  ) {
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
      <CommandCell command={command} onClick={(cmd) => onCopy(cmd)} />
      <TableCell colSpan={1}>
        {item.variants && item.variants.length > 0 && index === selectedResult && (
          <span>
            +{item.variants.length} variant{item.variants.length > 1 && "s"}
          </span>
        )}
      </TableCell>
      <ExampleCell example={example} />
      <TableCell colSpan={1}>
        {index === selectedResult && (
          // we already have enter to focus
          // eslint-disable-next-line jsx-a11y/interactive-supports-focus
          <span className="hint" onClick={() => onCopy(command)} role="button">
            ↵ to copy
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}

function NewCommandRow({ initialDescription, onSubmit, onClose }) {
  const [desc, setDesc] = React.useState(initialDescription);
  const [command, setCommand] = React.useState("");
  const [example, setExample] = React.useState("");

  const descRef = React.useRef(null);

  React.useEffect(() => {
    if (descRef && descRef.current) {
      descRef.current.focus();
    }

    window.gtag("event", "user_add_symbol_start");
  }, []);

  React.useEffect(() => {
    const onKeyPress = (e) => {
      if (e.key === "Enter" && command.length > 0) {
        submitCommand();
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keypress", onKeyPress);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keypress", onKeyPress);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [command, desc]);

  const updateCommand = (e) => {
    setCommand(e.target.value);
    setExample(e.target.value);
  };

  const submitCommand = () => {
    onSubmit({
      id: uuid(),
      descriptions: [desc],
      command,
      example,
    });
    setDesc("");
    setCommand("");
    setExample("");
    window.gtag("event", "user_add_symbol_finish");
  };

  return (
    <TableRow>
      <TableCell colSpan={1}>
        <input
          ref={descRef}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="descriptionInput"
          placeholder="Describe your symbol"
        />
      </TableCell>
      <TableCell colSpan={1}>
        <input
          value={command}
          onChange={updateCommand}
          className="latexInput"
          placeholder="Enter LaTeX here"
        />
      </TableCell>
      <TableCell colSpan={1} />
      <ExampleCell example={example} />
      <TableCell colSpan={1}>
        <div
          onClick={submitCommand}
          className={classNames("submitNewCommand", {
            enabled: command.length > 0,
          })}
          role="button"
          tabIndex={0}
        >
          <Check />
        </div>
      </TableCell>
    </TableRow>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.searchInput = createRef();
    this.latexSearch = getFuse();
    this.searchTermChange = new Subject();
    this.searchTermChange.subscribe((e) => {
      const term = e.target.value;
      this.setState({ searchTerm: term });
    });
    this.searchTermChange.pipe(debounceTime(90)).subscribe(() => {
      const term = this.state.searchTerm;
      const results = term.length === 0 ? [] : this.latexSearch.search(term);
      this.setState({
        searchResult: results,
        selectedResult: 0,
        appState: appStates.SEARCH,
        visibleCount: 15,
      });
    });
    this.state = {
      searchTerm: "",
      searchResult: [],
      selectedResult: 0,
      snackBarMessage: "",
      appState: appStates.SEARCH,
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
    if (e.key === "Enter" && this.state.appState === appStates.SEARCH) {
      const res = this.state.searchResult[this.state.selectedResult];
      if (res) {
        this.copyToClipboard(res.item.command, res.item.descriptions[0]);
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
    if (this.state.appState === appStates.NEWSYMBOL) {
      return;
    }

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
  submitNewCommand = (command) => {
    let currentCommands;
    try {
      const c = window.localStorage.getItem("user/commands");
      if (c && typeof c === "string") {
        currentCommands = JSON.parse(c);
      } else {
        currentCommands = {};
      }

      currentCommands[command.id] = command;

      window.localStorage.setItem(
        "user/commands",
        JSON.stringify(currentCommands)
      );
      this.setState({
        appState: appStates.SEARCH,
        snackBarMessage: `Added symbol: ${command.descriptions[0]}`,
      });
      this.latexSearch = getFuse();
    } catch (e) {
      this.setState({ snackBarMessage: "Something went wrong." });
    }
  };
  render() {
    const {
      searchTerm,
      selectedResult,
      searchResult,
      snackBarMessage,
      appState,
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
        <main>
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
                aria-label="Type here to search for math symbols in LaTeX"
              />
              {/* {appState === appStates.SEARCH && searchTerm.length > 2 && (
                <div
                  id="addSymbol"
                  onClick={() =>
                    this.setState({ appState: appStates.NEWSYMBOL })}
                  role="button"
                  tabIndex={0}
                >
                  <Add /> Add symbol
                </div>
              )} */}
              <GithubIcon />
            </div>
            <MathJax.Context input="tex" options={{ messageStyle: "none" }}>
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
                    {appState === appStates.NEWSYMBOL && (
                      <>
                        <NewCommandRow
                          initialDescription={searchTerm}
                          onSubmit={(c) => this.submitNewCommand(c)}
                          onClose={() =>
                            this.setState({ appState: appStates.SEARCH })}
                        />
                        {getUserCommands().length > 0 && (
                          <>
                            <div className="user-symbols">Your symbols</div>
                            {getUserCommands().map((item, i) => (
                              <CommandRow
                                index={i}
                                item={item}
                                selectedResult={-1}
                                matches={[]}
                                key={item.id}
                              />
                            ))}
                          </>
                        )}
                      </>
                    )}
                    {appState === appStates.SEARCH &&
                      visibleResults.map(({ item, matches }, i) => (
                        <CommandRow
                          index={i}
                          item={item}
                          selectedResult={selectedResult}
                          matches={matches}
                          onClickRow={() => this.clickResult(i)}
                          onCopy={(command) =>
                            this.copyToClipboard(command, item.descriptions[0])}
                          variant={variant}
                          key={item.id || item.command}
                        />
                      ))}
                  </TableBody>
                </Table>
              </div>
            </MathJax.Context>
            {searchResult.length === 0 && appState === appStates.SEARCH && (
              <div id="bottomBar">
                <ProductHuntIcon />
                <TwitterIcon />
              </div>
            )}
            <div id="loadMoreGutter" className="no-print">
              {searchResult.length > visibleCount &&
                appState === appStates.SEARCH && (
                  <CircularProgress onClick={this.loadMoreResults} />
                )}
            </div>
          </Container>
        </main>
      </div>
    );
  }
}

export default App;
