import '../../lib/collections.js';

SubChains.init = function(){
    if(typeof chain3 === 'undefined') {
        console.warn('ScsBlocks couldn\'t find chain3, please make sure to instantiate a chain3 object before calling McBlocks.init()');
        return;
    }
	if(typeof chainscs3 === 'undefined') {
        console.warn('ScsBlocks couldn\'t find chainscs3, please make sure to instantiate a chain3 object before calling McBlocks.init()');
        return;
    }
	

    // clear current block list
    //SubChains.clear();
	
	_.each(SubChains.find({}).fetch(), function(subChain){
		scsApi2.init(subChain.monitorAddr, subChain.monitorPort);

	});
    //Tracker.nonreactive(function() {
    //    observeLatestBlocks();
    //});
};

SubChains.clear = function(){
   _.each(SubChains.find({}).fetch(), function(subChain){
        SubChains.remove(subChain._id);
    });
};
