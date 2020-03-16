import {Template} from 'meteor/templating';
import '../../lib/collections.js';
import '../elements/account.js';
import '../elements/mistAlert.js';
import '../elements/transactionTable.js';
import './scs_add.html';

/**
Template Controllers

@module Templates
*/

/**
The scs trans template

@class [template] views_scs_add
@constructor
*/


// Set basic variables
Template['views_scs_add'].onCreated(function () {
    var template = this;
    Tracker.autorun(function () {
        FlowRouter.watchPathChange();
        //TemplateVar.set(template, 'subChainDapp', false);
    });
	
    //TemplateVar.set('monitorAddr','localhost');
    //TemplateVar.set('monitorPort',8548);
		
    // check if we are still on the correct chain
    Helpers.checkChain(function (error) {
        if (error && (McAccounts.find().count() > 0)) {
            checkForOriginalWallet();
        }
    });
});



Template['views_scs_add'].onRendered(function () {
    var template = this;

	this.$('input[name="subChain-addr"]').trigger('input');

});


Template['views_scs_add'].helpers({
	
	'blockNumber': function(){
		blockNumber = Session.get('scsBlockNumber');
		//alert('come to blocknumber'+blockNumber);
		return blockNumber;
	},
    /**
    Get the current selected account

    @method (selectedAccount)
    */
    //'selectedAccount': function () {
    //    return Helpers.getAccountByAddress(TemplateVar.getFrom('.dapp-select-account.send-from', 'value'));
    //},
    /**
    Get the current selected token document

    @method (selectedToken)
    */
    //'selectedToken': function () {
    //    return Tokens.findOne({ address: TemplateVar.get('selectedToken') });
    //},
    /**
    Retrun checked, if the current token is selected

    @method (tokenSelectedAttr)
    */
    //'tokenSelectedAttr': function (token) {
    //    return (TemplateVar.get('selectedToken') === token)
    //        ? { checked: true }
    //        : {};
    //},
    /**
    Get all tokens

    @method (tokens)
    */
    //'tokens': function () {
    //    if (TemplateVar.get('selectedAction') === 'send-funds')
    //        return Tokens.find({}, { sort: { name: 1 } });
    //},
    /**
    Checks if the current selected account has tokens

    @method (hasTokens)
    */
    //'hasTokens': function () {
		//alert('come to has tokens');
		//var selectedAddress = TemplateVar.getFrom('.dapp-select-account.send-from', 'value')
		//console.log('help,hastokens,selectedAddr:'+selectedAddress);

    //    var selectedAccount = Helpers.getAccountByAddress(TemplateVar.getFrom('.dapp-select-account.send-from', 'value')),
    //        query = {};
        //console.log("selectedAccount", selectedAccount);
        // chain3.scs.getNonce("0xa1eefaaa40ddbe1317cea35a8be58ac488de3a12",selectedAccount.address,function(e,r){console.log(e,r)})


    //    if (!selectedAccount)
    //        return;
//need to check subchain?
     //   query['balances.' + selectedAccount._id] = { $exists: true, $ne: '0' };

     //   return (TemplateVar.get('selectedAction') === 'send-funds' && !!Tokens.findOne(query, { field: { _id: 1 } }));
    //},


});


Template['views_scs_add'].events({
 
 
    /**
    React on user input on Monitor RPC Address

    @event change .monitorAddrInput
    */
    'keyup .monitorAddrInput, change .monitorAddrInput, input .monitorAddrInput': function (e, template) {
        TemplateVar.set('monitorAddr', e.currentTarget.value);
    },
    /**
    React on user input on Monitor RPC Port

    @event change .monitorAddrInput
    */
    'keyup .monitorPortInput, change .monitorPortInput, input .monitorPortInput': function (e, template) {
        TemplateVar.set('monitorPort', e.currentTarget.value);
    },
    /**
    Submit the form and send the transaction!

    @event submit form
    */
    'submit form': function (e, template) {
		//var microChainDapp = TemplateVar.get('subChainDapp') || false;

        var address = TemplateVar.getFrom('.dapp-address-input .subChain-addr', 'value'),
			//via = TemplateVar.getFrom('.dapp-address-input .subChain-via', 'value'),
			via = Session.get('vnode');
			//name = TemplateVar.getFrom('.input .name', 'value'),
			name = 'scName'; //$('input[name="name"]').val(),
			scCoinUnit = $('input[name="scCoinUnit"]').val(),
			dappAddr = TemplateVar.getFrom('.dapp-address-input .dapp', 'value'),
			//selectedAccount = Helpers.getAccountByAddress(template.find('select[name="dapp-select-account"].send-from').value),
            monitorAddr = TemplateVar.get('monitorAddr'),
            monitorPort = TemplateVar.get('monitorPort'),
			owner = McAccounts.findOne({});

		
		
		if(!chain3.isAddress(address) )
                return GlobalNotification.warning({
                    content: 'i18n:wallet.scs.newScs.noScsAddress',
                    duration: 2
                });
				
				
		if(!chain3.isAddress(dappAddr) )
                return GlobalNotification.warning({
                    content: 'i18n:wallet.scs.newScs.noDappAddr',
                    duration: 2
                });
				
		if(!monitorAddr )
			monitorAddr = "127.0.0.1";
                //return GlobalNotification.warning({
                //    content: 'i18n:wallet.scs.newScs.noMonitorAddr',
                //    duration: 2
                //});
		
		if(!monitorPort)
		 	monitorPort = 8548;
                //return GlobalNotification.warning({
                 //   content: 'i18n:wallet.scs.newScs.noMonitorPort',
                //    duration: 2
                //});
		
		if(!scCoinUnit)
                return GlobalNotification.warning({
                    content: 'i18n:wallet.scs.newScs.noCoinUnit',
                    duration: 2
                });
				
		_.each(SubChains.find({}).fetch(), function(subChain){
			SubChains.remove(subChain._id);
		});
		
		if( SubChains.find({name:name}).count()>0 ){
			//alert('sc has exits');
			GlobalNotification.error({
				content:"Name has been used, rename it!", //translateExternalErrorMessage.message(err.message),
				duration:8
			});
			return;
			//FlowRouter.go('scs_dashboard');
		}
		
		
		
		if( SubChains.findOne({address: address})){  
		//if( SubChains.find({address:address}).count()>0 ){
			//alert('sc has exits');
			GlobalNotification.error({
				content:"Micro chain has exists!", //translateExternalErrorMessage.message(err.message),
				duration:8
			});
			FlowRouter.go('scs_dashboard');
		}else{
			var dappAddr = TemplateVar.getFrom('.dapp-address-input .dapp', 'value');
				//owner = Helpers.getAccountByAddress(template.find('select[name="dapp-select-account"].send-from').value);
		//chain3.scs.getMicroChainInfo(address).then(function(e,subChainInfo){
		//	if(!e){
		//		var owner = subChainInfo.owner;

					var insert = {
						name: name,
						address: address,
						dappAddr: dappAddr,
						via: via,
						monitorAddr: monitorAddr,
						monitorPort: monitorPort,
						owner: owner,
						coinUnit: scCoinUnit
					};
					SubChains.insert(insert);
					FlowRouter.go('scs_dashboard');

//			}else{
//				alert(e);
//			}
		//});	
	}
}
});

