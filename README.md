# Moac Appchain Wallet Ðapp

The Moac Appchain wallet. Change from Ethereum Wallet Dapp.

**NOTE** The wallet is not yet official released,
can contain severe bugs!  

## Development  
Start an `moac` node and the app using meteor and open http://localhost:3000 in your browser:  

Test Net:  
    $ moac --testnet --rpccorsdomain "http://localhost:3000" --rpc --rpcapi=db,mc,net,chain3,personal,vnode,debug,scs --unlock <your account>  
Main:  
    $ moac --rpccorsdomain "http://localhost:3000" --rpc --rpcapi=db,mc,net,chain3,personal,vnode,debug,scs --unlock <your account>  

Start SCS as Monitor listening on 8548 port as the RPC Port:
    $ scsserver --rpc --rpcaddr 127.0.0.1 --rpcport 8548

Starting the wallet dapp using [Meteor](https://meteor.com/install)

    $ cd MOACSCSWallet
    $ npm install
    $ meteor

Go to http://localhost:3000


## Deployment

To create a build version of your app run:

    $ meteor build --architecture os.linux.x86_64  ../build/MoacWallet_build/
