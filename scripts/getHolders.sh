#!/bin/bash
curl -s -X POST https://api.iost.io/getContractStorage -d '{"id":"Contract54TrDQe629JYvtGYSZdp5x453k8FHTmupgfNGVMtYCGy","key":"holders","by_longest_chain":true}' | jq -r ".data" | jq -r