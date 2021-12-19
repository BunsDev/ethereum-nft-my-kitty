pragma solidity ^0.8;

import "./IERC721.sol";
import "./IERC721Receiver.sol";

contract MyKitty is IERC721 {

    mapping(address => uint) tokenOwnedBalance;
    mapping(uint => address) public tokenOwner;
    mapping(address => uint[]) ownerTokens;
    
    mapping(uint => address) public tokenToApproved;
    mapping(address => mapping (address => bool)) private operatorApprovals;

    address owner;
    string public constant tokenGivenName = "My Kitty";
    string public constant tokenTicker = "KIT";
    uint public constant GEN0_LIMIT = 10;
    uint public gen0Counter;

    bytes4 internal constant ERC721_RECEIPT = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    event Birth(address owner, uint kittyId, uint momId, uint dadId, uint dna);

    event Breed(address owner, uint kittyId, uint momId, uint dadId, uint dna, uint generation);

    struct Kitty {
        uint dna;
        uint64 birthTime;
        uint32 momId;
        uint32 dadId;
        uint16 generation;
    }

    Kitty[] kitties;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // If one prefer providing the information at the time the contract is deployed
    // constructor(string memory _tokenGivenName, string memory _tokenTicker) public {
    //     tokenGivenName = _tokenGivenName;
    //     tokenTicker = _tokenTicker;
    // }

    function supportsInterface(bytes4 _interfaceId) external pure returns(bool) {
        return ( _interfaceId == _INTERFACE_ID_ERC721 || _interfaceId == _INTERFACE_ID_ERC165);
    }

    function createKittyGen0(uint _dna) public onlyOwner returns(uint) {
        require(gen0Counter < GEN0_LIMIT);

        gen0Counter++;

        return _createKitty(0, 0, 0, _dna, msg.sender);
    }

    function _createKitty (
        uint _momId,
        uint _dadId,
        uint _generation,
        uint _dna,
        address _owner
    ) private returns(uint) {
        Kitty memory newKitty = Kitty({
            dna: _dna,
            birthTime: uint64(block.timestamp),
            momId: uint32(_momId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        kitties.push(newKitty);
        uint newKittyId = kitties.length - 1;

        emit Birth(_owner, newKittyId, _momId, _dadId, _dna);

        _transfer(address(0), _owner, newKittyId);

        return newKittyId;    
    }

    function getKitty(uint _kittyId) external view returns(uint dna_, uint birthTime_, uint momId_, uint dadId_, uint generation_) {
        dna_ = kitties[_kittyId].dna;
        birthTime_ = uint(kitties[_kittyId].birthTime);
        momId_ = uint(kitties[_kittyId].momId);
        dadId_ = uint(kitties[_kittyId].dadId);
        generation_ = uint(kitties[_kittyId].generation);
    }

    function breed(uint _momId, uint _dadId) public returns(uint newKittyId) {
        require(tokenOwner[_momId] == msg.sender && tokenOwner[_dadId] == msg.sender, "Should own both kitties before breeding.");

        uint newDna = _mixDna(kitties[_momId].dna, kitties[_dadId].dna);
        uint newGen = _calcGen(kitties[_momId].generation, kitties[_dadId].generation);

        newKittyId = _createKitty(_momId, _dadId, newGen, newDna, msg.sender);

        emit Breed(msg.sender, newKittyId, _momId, _dadId, newDna, newGen);
    }

    // Alternating Mixing Pattern
    function _mixDna(uint _momDna, uint _dadDna) internal pure returns(uint newDna) {
        uint newDna1stQuarter = _momDna / 1000000000000;
        uint newDna2ndQuarter = (_dadDna / 100000000) % 10000;
        uint newDna3rdQuarter = (_momDna % 100000000) / 10000;
        uint newDna4thQuarter = _dadDna % 10000;

        newDna = (newDna1stQuarter * 1000000000000) + (newDna2ndQuarter * 100000000) + (newDna3rdQuarter * 10000) + newDna4thQuarter;
    }

    // Advance Random Mixing Pattern
    // function _mixDna(uint _momDna, uint _dadDna) internal view returns(uint newDna) {
    //     // Need to test further with Remix
    //     uint[8] memory dnaArray;

    //     uint8 random = uint8( block.timestamp % 255);
    //     uint i;
    //     uint dnaArrayMaxIndex = 7;

    //     for (i = 1; i <= 128; i = i * 2) {
    //         if(random & i != 0) {
    //             dnaArray[dnaArrayMaxIndex] = uint8(_momDna % 100);
    //         }
    //         else {
    //             dnaArray[dnaArrayMaxIndex] = uint8(_dadDna % 100);
    //         }

    //         _momDna = _momDna / 100;
    //         _dadDna = _dadDna / 100;

    //         dnaArrayMaxIndex--;
    //     }

    //     for (i = 0; i < dnaArray.length; i++) {
    //         newDna = newDna + dnaArray[i];
            
    //         if(i != dnaArray.length - 1) {
    //             newDna = newDna * 100;
    //         }
    //     }
    // }

    function _calcGen(uint _momGen, uint _dadGen) internal pure returns(uint newGen) {
        if (_momGen <= _dadGen) {
            newGen = _dadGen + 1;
        }          
        else {
            newGen = _momGen + 1;
        }
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        balance = tokenOwnedBalance[_owner];
    }

    function tokenOwnedOf(address _owner) public view returns (uint256[] memory tokensOwned) {
        tokensOwned = ownerTokens[_owner];
    }

    function totalSupply() external view returns (uint256 total) {
        total = kitties.length;
    }

    function name() external pure returns (string memory tokenName) {
        tokenName = tokenGivenName;
    }

    function symbol() external pure returns (string memory tokenSymbol) {
        tokenSymbol = tokenTicker;
    }

    function ownerOf(uint256 _tokenId) external view returns (address owner_) {
        require(tokenOwner[_tokenId] != address(0), "Token does not exist");
        owner_ = tokenOwner[_tokenId];
    }

    function transfer(address _to, uint256 _tokenId) external {
        require(tokenOwner[_tokenId] == msg.sender, "Sender should own the token before transferring.");
        require(_to != address(0), "Receiving address should be valid");
        require(_to != address(this), "Contract address cannot be the receiver");

        _transfer(msg.sender, _to, _tokenId);

    }

    function _transfer(address _from, address _to, uint _tokenId) internal {

        if (_from != address(0)) {
            tokenOwnedBalance[_from] -= 1;
            _removeToken(_from, _tokenId);
            delete tokenToApproved[_tokenId];
        }

        tokenOwnedBalance[_to] += 1;
        ownerTokens[_to].push(_tokenId);
        tokenOwner[_tokenId] = _to;

        emit Transfer(msg.sender, _to, _tokenId);
    }

    function _removeToken(address _owner, uint _tokenId) internal {
        uint[] storage tokenList = ownerTokens[_owner];

        if (tokenList[tokenList.length - 1] == _tokenId) {
            tokenList.pop();
            return;
        }

        for(uint i = 0; i < ownerTokens[_owner].length; i++) {
            if( tokenList[i] == _tokenId) {
                uint lastToken = tokenList[tokenList.length - 1];
                tokenList[i] = lastToken;
                tokenList.pop();
                return;
            }
        }
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata data) external {
        require((tokenOwner[_tokenId] == msg.sender) || tokenToApproved[_tokenId] == msg.sender || (operatorApprovals[tokenOwner[_tokenId]][msg.sender]), "Caller is not authorized");
        require(tokenOwner[_tokenId] == _from, "Giving address is not the owner");
        require(_to != address(0));
        require(_tokenId < kitties.length, "Token does not exist");

        _safeTransfer(_from, _to, _tokenId, data);      
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {
        require((tokenOwner[_tokenId] == msg.sender) || tokenToApproved[_tokenId] == msg.sender || (operatorApprovals[tokenOwner[_tokenId]][msg.sender]), "Caller is not authorized");
        require(tokenOwner[_tokenId] == _from, "Giving address is not the owner");
        require(_to != address(0));
        require(_tokenId < kitties.length, "Token does not exist");
        
        _safeTransfer(_from, _to, _tokenId, "");
    }

    function _safeTransfer(address _from, address _to, uint _tokenId, bytes memory _data) internal {
        _transfer(_from, _to, _tokenId);
        require( _checkERC721Support(_from, _to, _tokenId, _data) );
    }

    function _checkERC721Support(address _from, address _to, uint _tokenId, bytes memory _data) internal returns(bool) {
        if ( !_isContract(_to )) {
            return true;
        }

        bytes4 returnData = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);
        return returnData == ERC721_RECEIPT;
    }

    function _isContract(address _to) internal view returns(bool) {
        uint size;
        assembly {
            size := extcodesize(_to)
        }
        return size > 0;
    }

    function approve(address _approved, uint256 _tokenId) external {
        require(_approved != address(0));
        require(tokenOwner[_tokenId] != address(0), "Token does not exist");
        require((tokenOwner[_tokenId] == msg.sender) || tokenToApproved[_tokenId] == msg.sender || (operatorApprovals[tokenOwner[_tokenId]][msg.sender]), "Caller is not authorized");

        _approve(_approved, _tokenId);

        emit Approval(msg.sender, _approved, _tokenId);
    }

    function _approve(address _approved, uint256 _tokenId) private {
        tokenToApproved[_tokenId] = _approved;
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        require(_tokenId < kitties.length, "Token does not exist");

        return tokenToApproved[_tokenId];
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        require(_operator != address(0));
        require(_operator != msg.sender);

        _setApprovalForAll(msg.sender, _operator, _approved);

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function _setApprovalForAll(address _owner, address _operator, bool _approved) private {
        operatorApprovals[_owner][_operator] = _approved;
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return operatorApprovals[_owner][_operator];
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external {
        require((tokenOwner[_tokenId] == msg.sender) || tokenToApproved[_tokenId] == msg.sender || (operatorApprovals[tokenOwner[_tokenId]][msg.sender]), "Caller is not authorized");
        require(tokenOwner[_tokenId] == _from, "Giving address is not the owner");
        require(_to != address(0));
        require(_tokenId < kitties.length, "Token does not exist");

        _transfer(_from, _to, _tokenId);     
    }
}