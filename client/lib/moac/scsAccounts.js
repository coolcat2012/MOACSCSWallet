import '../../lib/collections.js';

ScsAccounts.init = function(){

    // clear current block list
    ScsAccounts.clear();
	
	_.each(McAccounts.find({}).fetch(), function(mcAccount){

				//var block = ScsAccounts.findOne({address:subChain.address}).fetch()
				var scsAccount = {
					type: mcAccount.type,
					address: mcAccount.address,
					name: mcAccount.name,
					balance: 0
				}
				ScsAccounts.insert( scsAccount );

	});
    //Tracker.nonreactive(function() {
    //    observeLatestBlocks();
    //});
};

ScsAccounts.clear = function(){
    _.each(ScsAccounts.find({}).fetch(), function(block){
        ScsAccounts.remove(block._id);
    });
};
