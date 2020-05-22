# [LaTeX Search](https://github.com/lunaroyster/LaTeX-search/blob/master/README.md) 

[![Run on Repl.it](https://repl.it/badge/github/lunaroyster/LaTeX-search)](https://repl.it/github/lunaroyster/LaTeX-search)

## Goals:

* Reduce the learning curve for LaTeX beginners
* Improve workflow while using LaTeX

## How to contribute:

The file containing LaTeX commands is located at src/Commands.js

Fields:

* `descriptions`: How someone would search for the command. Example: 'square root'
* `example`: A typical use of the command, used to generate the LaTeX preview
* `command`: The command itself. This is copied.

More fields will be added later.

## Setting up your dev environment.

* If you want to quickly test out a change, use the `Run on Repl.it` button above.

* To install locally: 
  * Clone the repository
  * Make sure you have node and npm installed. I recommend using [nvm](https://github.com/nvm-sh/nvm)
  * Run `npm install` inside the repository.
  * Once that completes, run `npm run start`.
  * The web app should be available at `localhost:3000`
