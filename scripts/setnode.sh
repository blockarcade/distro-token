#!/bin/bash

if [ "$1" = "" ]; then
    echo "Must call script with local or blockarcade"
elif [ "$1" = "local" ]; then
    export GRPC_URL="localhost:30002"
    export IOST_USER="admin"
    export CHAIN_ID="1020"
elif [ "$1" = "alpha" ]; then
    export GRPC_URL="alpha.blockarca.de:30002"
    export IOST_USER="admin"
    export CHAIN_ID="1024"
elif [ "$1" = "mainnet" ]; then
    export GRPC_URL="18.209.137.246:30002"
    export IOST_USER="blockarcade"
    export CHAIN_ID="1024"
else
  echo "unrecognized destination node"
fi

echo $GRPC_URL
echo $IOST_USER

