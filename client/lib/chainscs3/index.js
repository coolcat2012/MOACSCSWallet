var Chainscs3 = require('./lib/chainscs3');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Chainscs3 === 'undefined') {
    window.Chainscs3 = Chainscs3;
}

// Add window moac
//if ( typeof window !== 'undefined' && typeof window.moac === 'undefined'){
//    window.moac = Chain3;
//}

module.exports = Chainscs3;
