pragma solidity ^0.8;

import "./MyKitty.sol";
import "./IKittyMarketplace.sol";

contract KittyMarketplace is IKittyMarketPlace {

    MyKitty private _myKittyContract;
    address owner;

    struct Offer {
        address payable seller;
        uint price;
        uint index;
        uint tokenId;
        bool active;
    }

    Offer[] offers;

    mapping(uint => Offer) tokenIdToOffer;
    
    modifier onlyOwner {
        require(msg.sender == owner, "You should be the contract owner");
        _;
    }

    constructor(address _kittyContractAddress) public {
        owner = msg.sender;
        setKittyContract(_kittyContractAddress);
    }

    function setKittyContract(address _kittyContractAddress) public onlyOwner {
        _myKittyContract = MyKitty(_kittyContractAddress);
    }

    function getOffer(uint256 _tokenId) public view returns (address seller, uint256 price, uint256 index, uint256 tokenId, bool active) {
        require(tokenIdToOffer[_tokenId].active, "No active offer for the given token ID");

        seller = tokenIdToOffer[_tokenId].seller;
        price = tokenIdToOffer[_tokenId].price;
        index = tokenIdToOffer[_tokenId].index;
        tokenId = tokenIdToOffer[_tokenId].tokenId;
        active = tokenIdToOffer[_tokenId].active;
    }

    function getAllTokenOnSale() external view  returns(uint256[] memory listOfOffers) {

        // TODO: There's no distinction between Kitty ID: 0 and non active offers unless burn Kitty ID: 0 during contract deployment

        if (offers.length == 0) {
            return new uint256[](0);
        }

        listOfOffers = new uint256[](offers.length);

        for(uint i = 0; i < offers.length; i++) { 
            if (offers[i].active) {
                listOfOffers[i] = offers[i].tokenId;
            }
        }
    }

    function setOffer(uint256 _price, uint256 _tokenId) external {
        require(_myKittyContract.tokenOwner(_tokenId) == msg.sender, "Only the owner can create an offer for the token");
        require(!tokenIdToOffer[_tokenId].active, "Only one offer is allowed at a time");
        require(_myKittyContract.tokenToApproved(_tokenId) == address(this) || _myKittyContract.isApprovedForAll(msg.sender, address(this)), "Marketplace should be an approved operator of the token");

        _setOffer(msg.sender, _price, _tokenId);

        emit MarketTransaction("Create Offer", msg.sender, _tokenId);
    }

    function _setOffer(address _seller, uint256 _price, uint256 _tokenId) private {
        Offer memory newOffer = Offer(payable(_seller), _price, offers.length, _tokenId, true);
        offers.push(newOffer);
        tokenIdToOffer[_tokenId] = newOffer;
    }

    function removeOffer(uint256 _tokenId) external {
        require(tokenIdToOffer[_tokenId].seller == msg.sender, "Only the seller can remove the offer");

        _removeOffer(_tokenId);

        emit MarketTransaction("Remove offer", msg.sender, _tokenId);
    }

    function _removeOffer(uint256 _tokenId) private {
        offers[tokenIdToOffer[_tokenId].index].active = false;
        tokenIdToOffer[_tokenId].active = false;        
    }

    function buyKitty(uint256 _tokenId) external payable {
        require(tokenIdToOffer[_tokenId].active, "There should be an active offer");
        require(tokenIdToOffer[_tokenId].price == msg.value, "Funds is not sufficient");

        _removeOffer(_tokenId);

        if ( tokenIdToOffer[_tokenId].price > 0 ) {
            (bool sent, ) = tokenIdToOffer[_tokenId].seller.call{value: msg.value}("");
            require(sent, "Failed to send payment to seller.");
        }

        _buyKitty(tokenIdToOffer[_tokenId].seller, msg.sender, _tokenId);

        emit MarketTransaction("Buy", msg.sender, _tokenId);
    }

    function _buyKitty(address _seller, address _buyer, uint256 _tokenId) private {
        _myKittyContract.safeTransferFrom(_seller, _buyer, _tokenId);
    }
}