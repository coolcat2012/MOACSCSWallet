/**
Helper functions

@module scsApi2
**/

/**
The Helpers class containing helper functions

@class scsApi
@constructor
**/

scsApi2 = {scsMonitorAddr: ""};

chainscs3 = new Chainscs3();

scsApi2.init = function (rpcaddr, rpcport) {
    var addr = "http://" + rpcaddr + ":" + rpcport;
    if (addr !== this.scsMonitorAddr) {
        chain3.setScsProvider(new chain3.providers.HttpProvider(addr));
		chainscs3.setScsProvider(new chain3.providers.HttpProvider(addr));
    }
};