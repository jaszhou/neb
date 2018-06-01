"use strict";

var myItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);

        this.account = obj.account; // wallet address
        this.hashcode = obj.hashcode; // unique hash for item
        this.addr = obj.addr; // LostFound hashcode with address info
        this.name = obj.name;
        this.description = obj.description;
        this.founder = obj.founder; // founder info, blank initially
        this.msg = obj.msg; // founder may update message here


    } else {
        this.account = ""; // wallet address
        this.hashcode = "";
        this.addr = "";
        this.name = "";
        this.description = "";
        this.founder = "";
        this.msg = "";
    }
};
myItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

var foundItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);

        this.hashcode = obj.hashcode; // unique hash for item
        this.founder = obj.founder; // founder info, account
        this.msg = obj.msg; // founder may update message here


    } else {
        this.hashcode = "";
        this.founder = "";
        this.msg = "";
    }
};
foundItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};



var LostFound = function() {
    LocalContractStorage.defineMapProperty(this, "inventory", {
        parse: function(text) {
            return new myItem(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });

    LocalContractStorage.defineMapProperty(this, "found", {
        parse: function(text) {
            return new foundItem(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });

    LocalContractStorage.defineMapProperty(this, "arrayMap");
    LocalContractStorage.defineProperty(this, "size");

};

LostFound.prototype = {
    init: function() {
        // todo

        this.size = 0;


    },


    len: function() {
        return this.size;
    },



    save: function(account, hashcode, addr, name, description, founder, msg) { // myItem is a string in JSON format

        myItem = new myItem();
        myItem.account = Blockchain.transaction.from;

        var input_account = account.trim();
        var hashcode = hashcode.trim();
        if (input_account === "") {
            throw new Error("empty account");
        }

        // if (account != myItem.account) {
        //     throw new Error("Only owner can update the address");
        // }

        myItem.hashcode = hashcode;
        myItem.addr = addr;
        myItem.name = name;
        myItem.description = description;
        myItem.founder = founder;
        myItem.msg = msg;



        this.inventory.put(myItem.hashcode, myItem);
        this.arrayMap.put(this.size, myItem.hashcode);
        this.size += 1;

        // this.arrayMap.put(this.size, key);
        // this.size +=1;



    },

    foundAItem: function(hashcode,founder, msg) { // myItem is a string in JSON format

        foundItem = new foundItem();
        var hashcode = hashcode.trim();

        foundItem.hashcode = hashcode;
        foundItem.founder = founder;
        foundItem.msg = msg;

        this.found.put(hashcode, foundItem);
    },
    getAll: function() {

        var items = [];
        for (var i = 0; i < this.size; i++) {

            var key = this.arrayMap.get(i);

            items.push(this.inventory.get(key));
        }

        return items;
    },

    get: function(key) {
        key = key.trim();
        if (key === "") {
            throw new Error("empty key")
        }
        return this.inventory.get(key);
    },

    getFound: function(key) {
        key = key.trim();
        if (key === "") {
            throw new Error("empty key")
        }
        return this.found.get(key);
    }


};
module.exports = LostFound;
