import {Template} from 'meteor/templating';
import '../../lib/collections.js';
import '../elements/scsAccount.js';
import '../elements/mistAlert.js';
import '../elements/scsTransactionTable.js';
import './scs_dashboard.html';

/**
Template Controllers

@module Templates
*/

/**
The dashboard template

@class [template] views_dashboard
@constructor
*/
Template['views_scs_dashboard'].onCreated(function () {
	Tracker.autorun(function () {
		
        //scsApi2.init('127.0.0.1', 8548);
    })
});

Template['views_scs_dashboard'].helpers({
    /**
    Get all current wallets

    @method (wallets)
    */
    'wallets': function(){
        var wallets = Wallets.find({$or: [{disabled: {$exists: false}}, {disabled: false}]}, {sort: {creationBlock: 1}}).fetch();

        // sort wallets by balance
        wallets.sort(Helpers.sortByBalance);

        return wallets;
    },
 
 
    'subChains': function(){
        // balance need to be present, to show only full inserted accounts (not ones added by mist.requestAccount)
        //var microChains = MicroChains.find({name: {$exists: true}}, {sort: {name: 1}}).fetch();
		var subChains = SubChains.find({name: {$exists: true}}, {sort: {name: 1}}).fetch();

        //microChains.sort(Helpers.sortByBalance);

        return subChains;
    },

    'hasSubChains' : function() {
		//alert("has scs?"+ SubChains.find().count());
		//console.log("****has scs?"+ MicroChains.find().count());
        return (SubChains.find().count() > 0);
    },
	
	'accounts': function(){
        // balance need to be present, to show only full inserted accounts (not ones added by mist.requestAccount)
        //var accounts = McAccounts.find({name: {$exists: true}}, {sort: {name: 1}}).fetch();
		var accounts = ScsAccounts.find({name: {$exists: true}}, {sort: {name: 1}}).fetch();
		//console.log('scs-dash,scs account count:'+ScsAccounts.find({}).count());
        accounts.sort(Helpers.sortByBalance);
		
        return accounts;
    },
    /**
    Are there any accounts?

    @method (hasAccounts)
    */
    'hasMinimumBalance' : function() {

        var enoughBalance = false;
        _.each(_.pluck(McAccounts.find({}).fetch(), 'balance'), function(bal){
            if(new BigNumber(bal, '10').gt(1000000000000000)) enoughBalance = true;
        });

        return enoughBalance;
    },
	

	
	'formattedScsBlockNumber': function(){
		if( SubChains.find({}).count()>0 ){
			var subChains = SubChains.find({}).fetch();

			var subChain = subChains[0],
				blockNumber = subChain.currentBlockNumber;
			//console.log('scs block number:'+blockNumber);
			return numeral(blockNumber).format('0,0');
		}else
			return 0;
	},
	

    /**
    Get all transactions

    @method (allTransactions)
    */
    'allScsTransactions': function(){
        return ScsTransactions.find({}, {sort: {timestamp: -1}}).count();
		//return ScsTransactions.find({}, {sort: {timestamp: -1}}).count();
    },
    /**
    Returns an array of pending confirmations, from all accounts

    @method (pendingConfirmations)
    @return {Array}
    */
    'scsPendingConfirmations': function(){
        return _.pluck(PendingConfirmations.find({operation: {$exists: true}, confirmedOwners: {$ne: []}}).fetch(), '_id');
    }
});


Template['views_dashboard'].events({
    /**
    Request to add an subChain in mist

    @event click .add.subChain
    */
    'click .add.subChain': function(e){
		alert('add sub');
        e.preventDefault();
		FlowRouter.go('scs_add');
       /* mist.requestAccount(function(e, accounts) {
            if(!e) {
                if(!_.isArray(accounts)) {
                    accounts = [accounts];
                }
                accounts.forEach(function(account){
                    account = account.toLowerCase();
                    McAccounts.upsert({address: account}, {$set: {
                        address: account,
                        new: true
                    }});
                });
            }
        });*/
    }
});
