import '../collections.js';
import './walletConnector.js';




/**
Update the owner list

@method checkOwner
*/
checkOwner = function(newDocument){
    // check if the owners have changed
    //if(chain3.isAddress(newDocument.address)) {
		chain3.scs.getMicroChainInfo(newDocument.subChainAddress).then(function(subChainInfo){
            SubChains.update(newDocument._id, {$set: {owners: subChainInfo.owner}});
		},function(err){
			console.log('subChainOwner err:'+err);
		});
    //}
};


/**
Observe SubChains and setup filters

@method observeSubChains
*/
observeSubChains = function(){

    /**
    Checking for confirmations of created subChains.

    Will only check if the old document, has no address and its inside the confirmations still.

    @method checkSubChainConfirmations
    @param {Object} newDocument
    @param {Object} oldDocument
    */
    var checkSubChainConfirmations = function(newDocument, oldDocument){
        var confirmations = McBlocks.latest.number - newDocument.creationBlock;

        if(newDocument.address && (!oldDocument || (oldDocument && !oldDocument.address)) && confirmations < moacConfig.requiredConfirmations) {
            var filter = chain3.mc.filter('latest');
            filter.watch(function(e, blockHash){
                if(!e) {
                    var confirmations = McBlocks.latest.number - newDocument.creationBlock;

                    if(confirmations < moacConfig.requiredConfirmations && confirmations > 0) {
                        Helpers.eventLogs('Checking subChain address '+ newDocument.address +' for code. Current confirmations: '+ confirmations);

                        // TODO make smarter?

                        // Check if the code is still at the contract address, if not remove the subChain
                        chain3.mc.getCode(newDocument.address, function(e, code){
                            if(!e) {
                                if(code.length > 2) {
                                    updateContractData(newDocument);                                

                                // check for subChain data
                                } else {
                                    SubChains.remove(newDocument._id);
                                    filter.stopWatching();
                                }
                            }
                        });
                    } else if(confirmations > moacConfig.requiredConfirmations) {
                        filter.stopWatching();
                    }
                }
            });
        }
    };

    /**
    Observe SubChains, listen for new created accounts.

    @class SubChains.find({}).observe
    @constructor
    */
    collectionObservers[collectionObservers.length] = SubChains.find({}).observe({
        /**
        This will observe the account creation, to send the contract creation transaction.

        @method added
        */
        added: function(newDocument) {
			
			scsApi2.init(newDocument.monitorAddr, newDocument.monitorPort);
			//chain3.scs.getBlockNumber( newDocument.address, function(e,blockNumber){
				//if( !e ){
					//var block = ScsBlocks.findOne({address:newDocument.address}).fetch()
					var scsBlock = {
						address: newDocument.address,
						currentBlockNumber: 0
					}
					ScsBlocks.insert( scsBlock );
					SubChains.update( newDocument._id, {$set:{ currentBlockNumber: 0,
							ownerBalance: 0}});

				//}
			//});
			/*chain3.scs.getBlockNumber(newDocument.address,function(e, res){
					if( !e && !(res===newDocument.currentBlockNumber )) {
							//console.log('observe scs blocks3');
							SubChains.update( newDocument._id, {$set:{ currentBlockNumber: res}});
							chain3.scs.getBalance(newDocument.address, subChain.owner.address,function(err,balance){
								//console.log('observe scs blocks5');
								//console.log('observe scs balance:'+balance);
								if(! err)
									SubChains.update( newDocument._id, {$set:{ ownerBalance: balance}});
								else
									console.log(err);
							});
					}
				});*/
		},
/*
            // DEPLOYED NEW CONTRACT
            if(!newDocument.address) {

                // tx hash already exisits, so just get the receipt and don't re-deploy
                if(newDocument.transactionHash) {
                    contracts['ct_'+ newDocument._id] = SubChainContract.at();

                    // remove account, if something is searching since more than 30 blocks
                    if(newDocument.creationBlock + 50 <= McBlocks.latest.number)
                        SubChains.remove(newDocument._id);
                    else
                        setupContractFilters(newDocument);

                    return;
                }


                if(_.isEmpty(newDocument.owners))
                    return;

                // SAFETY

                // 1. check if stub code has a proper address
                if(newDocument.code.indexOf('cafecafecafecafecafecafecafecafecafecafe') !== -1) {
                    GlobalNotification.error({
                        content: TAPi18n.__('subChain.newSubChain.error.stubHasNoOrigSubChainAddress'),
                        closeable: false
                    });
                    SubChains.remove(newDocument._id);
                    return;
                }

                // 2. check if we ares still on the right chain, before creating a subChain
                Helpers.checkChain(function(e) {
                    if(e) {
                        SubChains.remove(newDocument._id);

                        GlobalNotification.error({
                            content: TAPi18n.__('subChain.app.error.wrongChain'),
                            closeable: false
                        });

                    } else {

                        console.log('Deploying SubChain with following options', newDocument);

                        SubChainContract.new(newDocument.owners, newDocument.requiredSignatures, (newDocument.dailyLimit || moacConfig.dailyLimitDefault), {
                            from: newDocument.deployFrom,
                            data: newDocument.code,
                            gas: 3000000,

                        }, function(error, contract){
                            if(!error) {

                                // TX HASH arrived
                                if(!contract.address) {

                                    // add transactionHash to account
                                    newDocument.transactionHash = contract.transactionHash;
                                    console.log('Contract transaction hash: ', contract.transactionHash);

                                    SubChains.update(newDocument._id, {$set: {
                                        transactionHash: contract.transactionHash
                                    }});

                                // CONTRACT DEPLOYED
                                } else {

                                    console.log('Contract Address: ', contract.address);

                                    contracts['ct_'+ newDocument._id] = contract;

                                    // add address to account
                                    SubChains.update(newDocument._id, {$set: {
                                        creationBlock: McBlocks.latest.number - 1,
                                        checkpointBlock: McBlocks.latest.number - 1,
                                        address: contract.address
                                    }, $unset: {
                                        code: ''
                                    }});
                                    newDocument.address = contract.address;
                                    delete newDocument.code;


                                    updateContractData(newDocument);

                                    setupContractFilters(newDocument);

                                    // Show backup note
                                    McElements.Modal.question({
                                        template: 'views_modals_backupContractAddress',
                                        data: {
                                            address: contract.address
                                        },
                                        ok: true
                                    },{
                                        closeable: false
                                    });
                                }
                                
                            } else {
                                console.log('Error while deploying subChain', error);
                                
                                GlobalNotification.error({
                                    content: error.message,
                                    duration: 8
                                });

                                // remove account, if something failed
                                SubChains.remove(newDocument._id);
                            }
                        });
                    }
                });



            // USE DEPLOYED CONTRACT
            } else {
                contracts['ct_'+ newDocument._id] = SubChainContract.at(newDocument.address);

                // update balance on start
                chain3.mc.getBalance(newDocument.address, function(err, res){
                    if(!err) {
                        SubChains.update(newDocument._id, {$set: {
                            balance: res.toString(10)
                        }});
                    }
                });

                // check if subChain has code
                chain3.mc.getCode(newDocument.address, function(e, code) {
                    if(!e) {
                        if(code && code.length > 2){
                            SubChains.update(newDocument._id, {$unset: {
                                disabled: ''
                            }});

                            // init subChain events, only if existing subChain
                            updateContractData(newDocument);
                            setupContractFilters(newDocument);
                            checkSubChainConfirmations(newDocument, {});

                        } else {
                            SubChains.update(newDocument._id, {$set: {
                                disabled: true
                            }});
                        }
                    } else {
                        console.log('Couldn\'t check SubChain code of ', newDocument, e);
                    }
                });

                // check for vulnerability
                checkForVulnerableSubChain(newDocument);
            }*/
        //},
        /**
        Will check if the contract is still there and update the today spend if a new tx is added

        @method changed
        */
        changed: function(newDocument, oldDocument){
            // checkSubChainConfirmations(newDocument, oldDocument);

            //if(newDocument.transactions != oldDocument.transactions)
            //    updateContractData(newDocument);
        },
        /**
        Stop filters, when accounts are removed

        @method removed
        */
        removed: function(newDocument){
        /*    var contractInstance = contracts['ct_'+ newDocument._id];
            if(!contractInstance)
                return;

            if(!contractInstance.subChainEvents)
                contractInstance.subChainEvents = [];

            // stop all running events
            _.each(contractInstance.subChainEvents, function(event){
                event.stopWatching();
                contractInstance.subChainEvents.shift();
            });

            delete contracts['ct_'+ newDocument._id];

            // delete the all tx and pending conf
            _.each(Transactions.find({from: newDocument.address}).fetch(), function(tx){
                if(!SubChains.findOne({transactions: tx._id}) && !McAccounts.findOne({transactions: tx._id}))
                    Transactions.remove(tx._id);
            });
            _.each(PendingConfirmations.find({from: newDocument.address}).fetch(), function(pc){
                PendingConfirmations.remove(pc._id);
            });*/
        }
    });

};