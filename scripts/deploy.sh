#!/bin/bash

ADDRESS="$(iwallet \
 --server $GRPC_URL \
 --account $IOST_USER \
 --amount_limit '*:unlimited' \
 --chain_id $CHAIN_ID \
 --gas_limit 2000000 \
 publish ./contracts/distro.js ./contracts/distro.js.abi | grep "The contract id" | cut -d':' -f2 | xargs)"
echo $ADDRESS
export DISTRO_CONTRACT=$ADDRESS