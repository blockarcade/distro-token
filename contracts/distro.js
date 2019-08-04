const name = 'distro';
const fullName = 'Distribution Token';
const decimal = 6;
const totalSupply = 10000000;
const admin = 'admin';
const burnRate = 0.05;

class Token {
    init() {
        blockchain.callWithAuth("token.iost", "create", [
            name,
            blockchain.contractName(),
            totalSupply,
            {
                fullName,
                decimal,
                canTransfer: true,
                onlyIssuerCanTransfer: false,
            }
        ]);

        storage.put('holders', JSON.stringify({}));
    }

    can_update(data) {
        return blockchain.requireAuth(blockchain.contractOwner(), "active");
    }

    _amount(amount) {
        return new BigNumber(new BigNumber(amount).toFixed(decimal));
    }

    _checkToken(token_name) {
        if (token_name !== name) {
            throw "token not exist";
        }
    }

    _burn(from, amount) {
      const allHolders = this._getHolders();
      // Remove from user from the holders list.
      delete allHolders[from];

      const holders = Object.keys(allHolders);
      const bi = JSON.parse(blockchain.blockInfo());
      const bn = bi.number;
      const hash = IOSTCrypto.sha3(bn.toString());
      let sum = 0;
      for (let i = 0; i < hash.length; i++) {
        sum += hash.charCodeAt(i);
      }
      const roll = (sum % holders.length);
      const randomHolder = holders[roll];
      const burnAmount = this._amount(new BigNumber(amount).times(burnRate));
      blockchain.callWithAuth('token.iost', 'transfer', [name, from, randomHolder, burnAmount, 'DISTRO BURN']);

      return this._amount(new BigNumber(amount).minus(burnAmount));
    }

    _updateHolder(holder, payer) {
      const balance = this.balanceOf(name, holder);
      const holders = this._getHolders();
      if (balance > 0) {
        holders[holder] = true;
      } else {
        delete holders[holder];
      }

      this._saveHolders(holders, payer);
    }

    _getHolders() {
      return JSON.parse(storage.get('holders'));
    }

    _saveHolders(holders, payer) {
      storage.put('holders', JSON.stringify(holders), payer);
    }

    issue(token_name, to, amount) {
        if (!blockchain.requireAuth(admin, "active")) {
            throw "permission denied";
        }
        this._checkToken(token_name);
        amount = this._amount(amount);

        blockchain.callWithAuth("token.iost", "issue", [token_name, to, amount]);

        this._updateHolder(to, admin);
    }

    transfer(token_name, from, to, amount, memo) {
        this._checkToken(token_name);
        amount = this._amount(amount);

        const amountAfterBurn = this._burn(from, amount);
        blockchain.callWithAuth("token.iost", "transfer", [token_name, from, to, amountAfterBurn, memo]);

        // Update balances for both users.
        this._updateHolder(from, from);
        this._updateHolder(to, from);
    }

    transferFreeze(token_name, from, to, amount, timestamp, memo) {
        this._checkToken(token_name);
        amount = this._amount(amount);
        blockchain.callWithAuth("token.iost", "transferFreeze", [token_name, from, to, amount, timestamp, memo]);

        // Update balances for both users.
        this._updateHolder(from, from);
        this._updateHolder(to, from);
    }

    destroy(token_name, from, amount) {
        this._checkToken(token_name);
        amount = this._amount(amount);
        blockchain.callWithAuth("token.iost", "destroy", [token_name, from, amount]);

        this._updateHolder(from, from);
    }

    // call abi and parse result as JSON string
    _call(contract, api, args) {
        const ret = blockchain.callWithAuth(contract, api, args);
        if (ret && Array.isArray(ret) && ret.length >= 1) {
            return ret[0];
        }
        return null;
    }

    balanceOf(token_name, owner) {
        this._checkToken(token_name);
        return this._call("token.iost", "balanceOf", [token_name, owner]);
    }

    supply(token_name) {
        this._checkToken(token_name);
        return this._call("token.iost", "supply", [token_name]);
    }

    totalSupply(token_name) {
        this._checkToken(token_name);
        return this._call("token.iost", "totalSupply", [token_name]);
    }
}

module.exports = Token;