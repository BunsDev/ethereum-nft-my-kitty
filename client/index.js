let web3 = new Web3(window.ethereum);

let contractInstance, marketInstance;
let contractAddress = "";
let marketAddress = "";
let user;

$(document).ready( async () => {
    if(window.ethereum) {
        ethereum.request({ method: 'eth_requestAccounts' }).then( (accounts) => {
            user = accounts[0];
            contractInstance = new web3.eth.Contract(kittyabi, contractAddress, {from: user});
            marketInstance = new web3.eth.Contract(marketabi, marketAddress, {from: user});
            eventListeners(contractInstance, marketInstance);
        })
    }
})

async function newCat() {

    let dnaStr = getDna();
    await contractInstance.methods.createKittyGen0(dnaStr).send( {}, (error, txHash) => {
        if(error)
            console.log(error);
        else {
            console.log(txHash);
            alert("Create Kitty transaction was sent. Give it a few moments to process.");
        }
    });
}

function eventListeners(kittyContract, marketContract) {

    kittyContract.events.Birth({}, (error, event) => {
        if (error)
            console.log(error);
        else {
            alert("Create Kitty transaction was successful. You now own a Kitty :)");
            console.log(event.returnValues);
        }
    });

    kittyContract.events.Breed({}, (error, event) => {
        if (error)
            console.log(error);
        else {
            alert("Breed transaction was successful. You now have a newly bred Kitty :)");
            console.log(event.returnValues);
        }
    });

    kittyContract.events.ApprovalForAll({}, (error, event) => {
        if (error)
            console.log(error);
        else {
            alert("Approval for the Marketplace was successful.");
            console.log(event.returnValues);
        }
    });

    marketContract.events.MarketTransaction({}, (error, event) => {
        if (error)
            console.log(error);
        else {
            alert("Kitty offer was listed successfully.");
            console.log(event.returnValues);
        }        
    });
}

async function breedCat() {

    let momKittyId = parseInt( $('#momKittyId').val() );
    let dadKittyId = parseInt( $('#dadKittyId').val() );
    await contractInstance.methods.breed(momKittyId, dadKittyId).send( {}, (error, txHash) => {
        if(error)
            console.log(error);
        else {
            console.log(txHash);
            alert("Breed transaction was sent. Give it a few moments to process.");
        }
    });
}

async function getKittyList() {

    await contractInstance.methods.tokenOwnedOf(user).call( {}, (error, txHash) => {
        if(error)
            console.log(error);
        else {
            console.log(txHash);
            alert("Getting kitties you own. Give it a few moments to process.");
        }
    }).then( (kittyList) => {
        let result = "Kitty ID: ";
        kittyList.forEach(element => {
                result = result + element + "  ";
        });
        $('#availablekitty').html(result);
    });
}

async function getMarketList() {

    await marketInstance.methods.getAllTokenOnSale().call( {}, (error, txHash) => {
        if(error)
            console.log(error);
        else {
            console.log(txHash);
            alert("Getting offers from the marketplace. Give it a few moments to process.");
        }
    }).then( (marketList) => {
        let result = "Kitty ID: ";
        marketList.forEach(element => {
            if (element != 0) {
            result = result + element + "  ";
            }
        });
        $('#marketKitties').html(result);
    });    
}

async function buyKitty() {
    let tokenId = parseInt( $('#marketKittyId').val() );

    if (tokenId > -1) {
        await marketInstance.methods.getOffer(tokenId).call( {}, (error, txHash) => {
            if(error)
                console.log(error);
            else {
                console.log(txHash);
                alert("Checking the price of the token. Please wait for a few moments.");
            }
        }).then( async (kitty) => {
            await marketInstance.methods.buyKitty(tokenId).send( {value: kitty.price}, (error, txHash) => {
                if(error)
                    console.log(error);
                else {
                    console.log(txHash);
                    alert("Your buy request is being processed. Please wait for a few moments.");
                }
            }); 
        });   
    } 
    else {
        alert("Invalid ID")
    }
}

async function sellKitty() {
    let tokenId = parseInt( $('#marketKittyId').val() );
    let marketPrice = parseInt( $('#marketPriceId').val() );

    if (tokenId > -1 && marketPrice > -1) {
        await marketInstance.methods.setOffer(marketPrice, tokenId).send( {}, (error, txHash) => {
            if(error)
                console.log(error);
            else {
                console.log(txHash);
                alert("Your offer is being listed at the marketplace. Please wait for a few moments.");
            }
        });  
    } 
    else {
        alert("Invalid ID or Price")
    }
}

async function cancelOffer() {
    let tokenId = parseInt( $('#marketKittyId').val() );

    if (tokenId > -1) {
        await marketInstance.methods.removeOffer(tokenId).send( {}, (error, txHash) => {
            if(error)
                console.log(error);
            else {
                console.log(txHash);
                alert("Your offer is being canceled. Please wait for a few moments.");
            }
        });  
    } 
    else {
        alert("Invalid ID or Price")
    }
}

async function approve() {
    await contractInstance.methods.setApprovalForAll(marketAddress, true).send( {}, (error, txHash) => {
        if(error)
            console.log(error);
        else {
            console.log(txHash);
            alert("Transaction was sent to give the marketplace approval of your tokens.");
        }
    });
}