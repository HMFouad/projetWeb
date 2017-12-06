#!/bin/bash

if [[ "$1" == "dev" ]]; then

    # build angular app
    ng build -dev --watch &

    # deploy express app with a watch
    # cd server to watch exclusively servers files
    (cd server && ../node_modules/pm2/bin/pm2-dev start server.js) &

    # for the RUN.sh process stay alive
    while :
    do
        read -t 1 -n 1 key
    done
else
    echo -e "Invalid parameters\\nUsage: ./RUN.sh dev"
fi
