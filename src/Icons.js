import * as React from "react";

import { IconButton } from "@material-ui/core";

export function GithubIcon() {
  return (
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
  );
}

export function ProductHuntIcon() {
  return (
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
  );
}

export function TwitterIcon() {
  return (
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
  );
}
