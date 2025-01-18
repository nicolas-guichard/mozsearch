#!/usr/bin/env bash

set -eu
set -o pipefail
set -x

FILTER=${1:-}

cargo install geckodriver

if ! [ -d mozsearch-firefox ]; then
    curl -L -o mozsearch-firefox.tar.bz2 "https://download.mozilla.org/?product=firefox-latest&os=linux64"
    tar xf mozsearch-firefox.tar.bz2
    mv firefox mozsearch-firefox
fi

stop_geckodriver() {
    PID=$(pgrep geckodriver || true)
    if [ "x${PID}" != "x" ]; then
        echo "Stopping geckodriver: PID=${PID}"
        kill $PID
    fi
}

stop_geckodriver

echo "Starting geckodriver"
geckodriver -b /vagrant/mozsearch-firefox/firefox >/dev/null 2>&1 &

echo "Running tests"
./tools/target/release/searchfox-tool "webtest ${FILTER}"

stop_geckodriver
