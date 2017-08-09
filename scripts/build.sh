#!/bin/bash

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CODE="$SCRIPTS_DIR/.."
BIN="$CODE/node_modules/.bin"

function eslint() {
    echo "    - $1"
    "$BIN/eslint" "$CODE"/"$1"
}

function babel() {
    echo "    - $1  >  $2"
    "$BIN/babel" "$CODE/$1" -o "$CODE/$2"
}

function browserify() {
    echo "    - $1  >  $2"
    "$BIN/browserify" "$CODE/$1" -o "$CODE/$2"
}

function build_file() {
    echo "[1/3] Linting JS..."
    [[ -e "es6/$1" ]] && eslint "es6/$1"
    [[ -e "examples/$1" ]] && eslint "examples/$1"

    echo
    echo "[2/3] Babelifying for Node..."
    [[ -e "es6/$1" ]] && babel "es6/$1" "node/$1"

    echo
    echo "[3/3] Browserifying for Browsers..."
    [[ -e "es6/$1" ]] && browserify "es6/$1" "browser/$1"
    [[ -e "examples/$1" ]] && browserify "examples/$1" "examples/static/$1"
}


function build_all() {
    echo "[1/3] Linting JS..."
    eslint es6

    echo
    echo "[2/3] Babelifying for Node..."
    for file in "$CODE"/es6/*.js; do
        [ -e "$file" ] || continue
        name="$(basename "$file")"

        babel "es6/$name" "node/$name" &
    done
    wait

    echo
    echo "[3/3] Browserifying for Browsers..."
    for file in "$CODE"/es6/*.js; do
        [ -e "$file" ] || continue
        name="$(basename "$file")"

        browserify "es6/$name" "browser/$name" &
    done
    for file in "$CODE"/examples/*.js; do
        [ -e "$file" ] || continue
        name="$(basename "$file")"

        browserify "examples/$name" "examples/static/$name" &
    done
    wait
}

if [[ "$1" ]]; then
    build_file "$1"
else
    build_all
fi
