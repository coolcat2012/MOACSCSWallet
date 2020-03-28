import {Template} from 'meteor/templating';
import '../../elements/accountLink.js';
import './scsSendTransactionInfo.html';

/**
Template Controllers

@module Templates
*/

/**
The send transaction info template

@class [template] views_modals_sendTransactionInfo
@constructor
*/

// Set basic variables
Template['views_modals_scsSendTransactionInfo'].helpers({
    /**
    Calculates the fee used for this transaction in mc

    @method (estimatedFee)
    */
    'estimatedFee': function() {
        if(this.estimatedGas && this.gasPrice)
            return McTools.formatBalance(new BigNumber(this.estimatedGas, 10).times(new BigNumber(this.gasPrice, 10)), '0,0.0[0000000] unit', 'mc');
    },
	
	'scCoinUnit': function () {
        subChain = SubChains.findOne({});
		if( subChain)
			return subChain.coinUnit;
		else
			return "";
    }
});