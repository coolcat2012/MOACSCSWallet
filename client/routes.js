import './templates/layout/header.js';
import './templates/views/dashboard.js';
import './templates/views/send.js';
import './templates/views/contracts.js';
import './templates/views/account.js';
import './templates/views/account_create.js';
import './templates/layout/notFound.html';
import './templates/layout/main.html';
import './templates/views/scs_send.js'; 
import './templates/views/scs_dashboard.js';  //add for scs dashboard

// configure
BlazeLayout.setRoot('body');

FlowRouter.notFound = {
    action: function() {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'layout_notFound'
        });
    }
};

// redirect on start to dahsboard on file protocol
if(location.origin === 'file://') {
    FlowRouter.wait();
    FlowRouter.initialize({hashbang: true});

    Meteor.startup(function() {
        FlowRouter.go('dashboard');
    });
}


FlowRouter.triggers.enter([function(){
    McElements.Modal.hide();
    $(window).scrollTop(0);
}, updateMistMenu]);



// ROUTES

/**
The receive route, showing the wallet overview

@method dashboard
*/
FlowRouter.route('/', {
    name: 'dashboard',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_dashboard'
        });
    }
});



/**
The send route.

// @method send
// */
// FlowRouter.route('/send', {
//     name: 'send',
//     action: function(params, queryParams) {
//         BlazeLayout.render('layout_main', {
//             header: 'layout_header',
//             main: 'views_send'
//         });
//     }
// });

/**
The Coins route.

@method tokens
*/
FlowRouter.route('/tokens', {
    name: 'tokens',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_tokens'
        });
    }
});


/**
The Coins route.

@method tokens
*/
FlowRouter.route('/contracts', {
    name: 'contracts',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_contracts'
        });
    }
});



/**
The send route.

@method send
*/
FlowRouter.route('/send/:address', {
    name: 'sendTo',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_send'
        });
    }
});

/**
The send route.

@method send
*/
FlowRouter.route('/send-from/:from', {
    name: 'sendFrom',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_send'
        });
    }
});

/**
The send route.

@method send
*/
FlowRouter.route('/send-token/:from/:token', {
    name: 'sendToken',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_send'
        });
    }
});


/**
The send route.

@method send
*/
FlowRouter.route('/deploy-contract', {
    name: 'deployContract',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_send',
            data: {
                deployContract: true
            }
        });
    }
});


/**
The create account route.

@method send
*/
FlowRouter.route('/account/new', {
    name: 'createAccount',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_account_create'
        });
    }
});



/**
The account route.

@method send
*/
FlowRouter.route('/account/:address/:isMicroChainContract?', {
    name: 'account',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_account'
        });
    }
});

/**
The receive route, showing the scs dashboard

@method scs_dashboard
*/

FlowRouter.route('/scs_dashboard', {
    name: 'scs_dashboard',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_scs_dashboard'
        });
    }
});

/**
The receive route, showing the scs dashboard

@method scs_trans
*/

FlowRouter.route('/scs_send', {
    name: 'scs_send',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_scs_send'
        });
    }
});

FlowRouter.route('/scs_add', {
    name: 'scs_add',
    action: function(params, queryParams) {
        BlazeLayout.render('layout_main', {
            header: 'layout_header',
            main: 'views_scs_add'
        });
    }
});
