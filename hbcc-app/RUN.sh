#!/bin/bash

if [[ "$1" == "dev" || "$1" == "prod" ]]; then

    # Update dependencies
    yarn || npm install

    if [[ "$1" == "dev" ]]; then

        # build angular app with dev mode and watch
        yarn run build:app:dev &

        # deploy express app with a watch
        # cd server to watch exclusively servers files
        yarn run start:api:dev &

        # for the RUN.sh process stay alive
        while :
        do
            read -t 1 -n 1 key
        done
    else
        # build angular app with prod mode
        ng build --aot -prod

        # deploy express app
        node server/server
    fi
else
    if [[ "$1" == "help" ]]; then
        echo -e "Invalid parameters"
    fi
    echo -e "Usage:"
    echo -e "\\t./RUN.sh dev\\tRun app in dev mode, redo compilation on file edit."
    echo -e "\\t./RUN.sh prod\\tRun app in production mode."
fi
