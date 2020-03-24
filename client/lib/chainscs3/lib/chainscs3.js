/*
    This file is part of chain3.js.

    chain3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    chain3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with chain3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file chain3.js
 * @Modified from file web3.js
 * @authors:
 *   Jeffrey Wilcke <jeff@ethdev.com>
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 * @authors:
   @MOAC tech
   @date 2018
 */

var RequestManager = require('./chainscs3/requestmanager');
//var Iban = require('./chainscs3/iban');
//var Mc = require('./chainscs3/methods/mc');
//var Vnode = require('./chainscs3/methods/vnode');
var Scs = require('./chainscs3/methods/scs');
//var Admin = require('./chainscs3/methods/admin');
//var Txpool = require('./chainscs3/methods/txpool');
//var Net = require('./chainscs3/methods/net');
//var Personal = require('./chainscs3/methods/personal');
var Settings = require('./chainscs3/settings');
var version = require('./version.json');
var utils = require('./utils/utils');
//var sha3 = require('./utils/sha3');
//var extend = require('./chainscs3/extend');
//var Batch = require('./chainscs3/batch');
var Property = require('./chainscs3/property');
var HttpProvider = require('./chainscs3/httpprovider');
var IpcProvider = require('./chainscs3/ipcprovider');
var BigNumber = require('bignumber.js');
//var Coder = require('./solidity/coder');
//var MicroChain = require('./microchain/microchain');
//var sigutils = require('./accounts/sigUtils.js');
//var McDapp = require('./chainscs3/dapp.js');
//var Debug = require('./chainscs3/methods/debug');


function Chainscs3 (provider,scsProvider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this._scsRequestManager = new RequestManager(scsProvider);
    this.scsCurrentProvider = scsProvider;
  
//    this.mc = new Mc(this);
//    this.admin = new Admin(this);
 //   this.txpool = new Txpool(this);
//    this.vnode = new Vnode(this);
    this.scs = new Scs(this);
 //   this.net = new Net(this);
//    this.personal = new Personal(this);
//    this.debug = new Debug(this);
    this.settings = new Settings();

    this.version = {
        api: version.version
    };
    this.providers = {
        HttpProvider: HttpProvider,
        IpcProvider: IpcProvider
    };
    //this._extend = extend(this);
    //this._extend({
    //    properties: properties()
    //});
}

// expose providers on the class
Chainscs3.providers = {
    HttpProvider: HttpProvider,
    IpcProvider: IpcProvider
};

Chainscs3.prototype.setProvider = function (provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
};

Chainscs3.prototype.setScsProvider = function (provider) {
    this._scsRequestManager.setProvider(provider);
    this.scsCurrentProvider = provider;
};

//Chainscs3.prototype.reset = function (keepIsSyncing) {
//    this._requestManager.reset(keepIsSyncing);
//    this.settings = new Settings();
//};

Chainscs3.prototype.BigNumber = BigNumber;
Chainscs3.prototype.toHex = utils.toHex;
Chainscs3.prototype.toAscii = utils.toAscii;
Chainscs3.prototype.toUtf8 = utils.toUtf8;
Chainscs3.prototype.fromAscii = utils.fromAscii;
Chainscs3.prototype.fromUtf8 = utils.fromUtf8;
Chainscs3.prototype.toDecimal = utils.toDecimal;
Chainscs3.prototype.fromDecimal = utils.fromDecimal;
Chainscs3.prototype.toBigNumber = utils.toBigNumber;
Chainscs3.prototype.toSha = utils.toSha;
//Chainscs3.prototype.fromSha = utils.fromSha;
//Chainscs3.prototype.isAddress = utils.isAddress;
//Chainscs3.prototype.isChecksumAddress = utils.isChecksumAddress;
//Chainscs3.prototype.toChecksumAddress = utils.toChecksumAddress;
//Chainscs3.prototype.isIBAN            = utils.isIBAN;
Chainscs3.prototype.padLeft = utils.padLeft;
Chainscs3.prototype.padRight = utils.padRight;

//New functions to sign transaction
Chainscs3.prototype.intToHex = utils.BigIntToHex;

//Encode the input types and parameters
Chainscs3.prototype.encodeParams     = function(type, param) {
    return Coder.encodeParams(type, param);
};

//Chainscs3.prototype.sha3 = function(string, options) {
//    return '0x' + sha3(string, options);
//};

/**
 * Transforms direct icap to address
 */
//Chainscs3.prototype.fromICAP = function (icap) {
//    var iban = new Iban(icap);
//    return iban.address();
//};

var properties = function () {
    return [
        new Property({
            name: 'version.node',
            getter: 'chain3_clientVersion'
        }),
        new Property({
            name: 'version.network',
            getter: 'net_version',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.moac',
            getter: 'mc_protocolVersion',
            inputFormatter: utils.toDecimal
        })
    ];
};

Chainscs3.prototype.isConnected = function(){
    return (this.currentProvider && this.currentProvider.isConnected());
};

Chainscs3.prototype.isScsConnected = function(){
    return (this.scsCurrentProvider && this.scsCurrentProvider.isConnected());
};

//Chainscs3.prototype.createBatch = function () {
//    return new Batch(this);
//};

// //MicroChain constructor object for multi contract chain.
// TODO
//Chainscs3.prototype.microchain = function (inabi, inAddress) {
    //Used the MicroChain with 
//    var mcChain = new MicroChain(this.mc, this.scs, inabi);
//    return mcChain;
//};

//A collection of signing functions used for MOAC chain
//Verify Signature function
//TX function
//Chainscs3.prototype.signTransaction = sigutils.signTransaction;
//Chainscs3.prototype.verifyMcSignature = sigutils.verifyMcSignature;
//Chainscs3.prototype.signMcMessage = sigutils.signMcMessage;
//Chainscs3.prototype.recoverPersonalSignature = sigutils.recoverPersonalSignature;

module.exports = Chainscs3;


