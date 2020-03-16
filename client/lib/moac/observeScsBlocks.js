import '../collections.js';
import './walletConnector.js';

var scsBlockIntervalId = null;

observeScsBlocks = function(){


    // GET the latest blockchain information


	var updateScsBalances = function(subChain){
		//only for one subchain
		_.each(McAccounts.find({}).fetch(), function(mcAccount){
			chain3.scs.getBalance(subChain.address, mcAccount.address,function(err,balance){
				if(! err){
					//console.log('observe scs block name:'+mcAccount.name+','+balance);
					if(ScsAccounts.find({ name: mcAccount.name }).count() > 0 ){
						ScsAccounts.update( {name: mcAccount.name}, {$set:{ balance: balance}});
					}else{
						var scsAccount = {
							type: mcAccount.type,
							address: mcAccount.address,
							name: mcAccount.name,
							balance: balance
						}
						ScsAccounts.insert( scsAccount );
					}
				
				}else
					console.log(err);
			});
		});
	}

	var updateScsBlocks = function(){
		//console.log('observe scs blocks1');
		subChains = SubChains.find({}).fetch();
			_.each(subChains,function( subChain ){
				chain3.scs.getBlockNumber(subChain.address,function(e, res){
					if( e ){
						console.log('observe scs:'+e);
					}else if(res!==subChain.currentBlockNumber ) {
							//console.log('observe scs blocks3');
							SubChains.update( subChain._id, {$set:{ currentBlockNumber: res}});
							updateScsBalances(subChain);
					}
				});
			});		
	}

	    // update balances on start
    updateScsBlocks();


    clearInterval(scsBlockIntervalId);
    scsBlockIntervalId = setInterval(function() {
        updateScsBlocks();
    }, 1000);
};
