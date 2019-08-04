# Distribution Token

> IOST Token where 5% of transfers are transferred to a random token holder.

## Mainnet Address

```

```

## Commands 

### Issue

```
iwallet call $DISTRO_CONTRACT issue "[\"distro\", \"admin\", \"100000\"]" --account admin -s $GRPC_URL --chain_id $CHAIN_ID
```

### Transfer

```
iwallet call $DISTRO_CONTRACT transfer "[\"distro\", \"admin\", \"admin\", \"100000\", \"TEST\"]" --account admin -s $GRPC_URL --chain_id $CHAIN_ID
```

### totalSupply

```
iwallet call $DISTRO_CONTRACT totalSupply '["distro"]' --account admin -s $GRPC_URL --chain_id $CHAIN_ID
```

### checkBalance

```
iwallet call $DISTRO_CONTRACT balanceOf '["distro", "admin"]' --account admin -s $GRPC_URL --chain_id $CHAIN_ID
```