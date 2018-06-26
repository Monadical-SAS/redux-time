#!/bin/bash
set -o pipefail

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
    env NODE_ENV=production "$BIN/browserify" "$CODE/$1" -o "$CODE/$2"
}

function build_file() {
    if [[ -e "es6/$1" ]]; then
        echo "[1/3] Linting JS..."
        eslint "es6/$1" || exit 1
        echo
        echo "[2/3] Babelifying for Node..."
        babel "es6/$1" "node/$1" || exit 1
        # echo
        # echo "[3/3] Browserifying for Browsers..."
        # browserify "es6/$1" "browser/$1"
    fi

    if [[ -e "examples/$1" ]]; then
        echo "[1/2] Linting JS..."
        eslint "examples/$1" || exit 1
        echo
        echo "[2/2] Browserifying for Browsers..."
        browserify "examples/$1" "examples/static/$1"
    fi
}


function build_all() {
    echo "[1/3] Linting JS..."
    eslint es6 || exit 1

    echo
    echo "[2/3] Babelifying for Node..."
    for file in "$CODE"/es6/*.js; do
        [ -e "$file" ] || continue
        name="$(basename "$file")"

        babel "es6/$name" "node/$name" &  # env NODE_ENV=production 
    done
    wait

    echo
    echo "[3/3] Browserifying for Browsers..."
    for file in "$CODE"/es6/*.js; do
        [ -e "$file" ] || continue
        name="$(basename "$file")"

        # browserify "es6/$name" "browser/$name" &
    done
    # for file in "$CODE"/examples/*.js; do
    #     [ -e "$file" ] || continue
    #     name="$(basename "$file")"

    #     browserify "examples/$name" "examples/static/$name" &
    # done
    wait
}

if [[ "$1" ]]; then
    build_file "$1"
else
    build_all
fi
