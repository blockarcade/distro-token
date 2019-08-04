#!/bin/bash

iwallet \
 --gas_limit 2000000 \
 --server $GRPC_URL \
 --account $IOST_USER \
 --chain_id $CHAIN_ID \
 --amount_limit '*:unlimited' \
 publish --update ./contracts/distro.js ./contracts/distro.js.abi $DISTRO_CONTRACT