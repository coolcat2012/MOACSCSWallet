import '../../lib/collections.js';
//ScsBlocks = new Mongo.Collection('scs_blocks', {connection: null});

ScsBlocks.init = function(){
    if(typeof chain3 === 'undefined') {
        console.warn('ScsBlocks couldn\'t find chain3, please make sure to instantiate a chain3 object before calling McBlocks.init()');
        return;
    }

    // clear current block list
    ScsBlocks.clear();
	
	_.each(SubChains.find({}).fetch(), function(subChain){
		chain3.scs.getBlockNumber(subChain.address, function(e,blockNumber){
			if( !e ){
				//var block = ScsBlocks.findOne({address:subChain.address}).fetch()
				var scsBlock = {
					address: subChain.address,
					currentBlockNumber: blockNumber
				}
				ScsBlocks.insert( scsBlock );
			}
		});
	});
    //Tracker.nonreactive(function() {
    //    observeLatestBlocks();
    //});
};

ScsBlocks.clear = function(){
    _.each(ScsBlocks.find({}).fetch(), function(block){
        ScsBlocks.remove(block._id);
    });
};
