// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;


interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract Dex {

        bool private locked;
        uint256 constant PRECISION = 1e18; 
        uint256 constant MIN_LIQUIDITY = 10; 
        uint256 constant FEE_DENOMINATOR = 500;


    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    struct Pool {
        address poolAddress; // address of the pool same as the token address of tok/eth pair
        uint price;
        uint ethReserve;
        uint tokenReserve;
    }
    
    address[] public poolAddresses; // stores the address of all the liquidity pools that have been made the address fo each pool is same as their token address
    mapping(address => Pool) public poolInfo; 
    mapping(address => bool) public poolExists; 

    error InvalidTokenAddress();
    error InsufficientEthLiquidity();
    error InsufficientTokenLiquidity(); 
    error poolAlreadyExists(); 

    event PoolCreated(address indexed tokenAddress, uint256 ethAmount, uint256 tokenAmount);
    event EthToTokenSwap(address indexed tokenAddress, uint256 ethIn, uint256 tokensOut);
    event TokenToEthSwap(address indexed tokenAddress, uint256 tokensIn, uint256 ethOut);
    event TokenToTokenSwap(address indexed tokenIn, address indexed tokenOut, uint256 tokensIn, uint256 tokensOut);

    function createPool(IERC20 _tokenAddress, uint256 _tokenReserve) public payable returns(Pool memory) {
        require(address(_tokenAddress) != address(0), "Invalid token address");
        require(msg.value >= MIN_LIQUIDITY, "Insufficient ETH liquidity");
        require(_tokenReserve >= MIN_LIQUIDITY, "Insufficient token liquidity");
        require(!poolExists[address(_tokenAddress)], "Pool already exists");
        
        require(_tokenAddress.transferFrom(msg.sender, address(this), _tokenReserve), "Transfer failed");
        
        uint256 _price = (msg.value * PRECISION) / _tokenReserve;
        
        poolInfo[address(_tokenAddress)] = Pool({
            poolAddress: address(_tokenAddress), 
            price: _price,
            ethReserve: msg.value,
            tokenReserve: _tokenReserve
        });

        emit PoolCreated(address(_tokenAddress), msg.value, _tokenReserve);
        poolExists[(address(_tokenAddress))] = true; 
        poolAddresses.push(address(_tokenAddress)); // _tokenAddress is of type IERC20 so we typecast it to type address
        return poolInfo[address(_tokenAddress)];
    }

    function getAllPoolsInfo() public view returns(Pool[] memory) {   // function that returns the info about all the pools that have been created
        Pool[] memory pools = new Pool[](poolAddresses.length); 

        for (uint256 i = 0; i < poolAddresses.length; i++) {
            pools[i] = poolInfo[poolAddresses[i]]; 
        }
        return pools; 
    }

    function getPrice(IERC20 _tokenAddress) public view returns (uint256) {
        Pool memory pool = poolInfo[address(_tokenAddress)];
        return pool.price; 
    }

    function setPrice(IERC20 _tokenAddress) internal returns(uint256) {
        Pool memory pool = poolInfo[address(_tokenAddress)];    // this creates a copy of the pool mapping
        uint256 newPrice = (pool.ethReserve * PRECISION) / pool.tokenReserve; 
        poolInfo[address(_tokenAddress)].price = newPrice; 
        return newPrice; 
    }

    function ethToTokenSwap(IERC20 _tokenAddress, uint256 minTokensOut) public payable noReentrant {
        Pool memory pool = poolInfo[address(_tokenAddress)];
        require(pool.price > 0, "Pool does not exist for this token");
        require(msg.value > 0, "must send some ETH");

        uint256 fee = msg.value / FEE_DENOMINATOR; 
        uint256 invariant = pool.ethReserve * pool.tokenReserve; 
        uint256 newEthPool = pool.ethReserve + msg.value; 
        uint256 newTokenPool = invariant / (newEthPool - fee); 
        uint256 tokensOut = pool.tokenReserve - newTokenPool; 

        require(tokensOut > minTokensOut, "insufficient output amount");
        require(tokensOut > 0, "zero token output");
        require(_tokenAddress.transfer(msg.sender, tokensOut), "Transfer failed");

        poolInfo[address(_tokenAddress)].ethReserve = newEthPool; 
        poolInfo[address(_tokenAddress)].tokenReserve = newTokenPool; 
        setPrice(_tokenAddress);

        emit EthToTokenSwap(address(_tokenAddress), msg.value, tokensOut);
    }

    function tokenToEthSwap(IERC20 _tokenAddress, uint256 _tokenSent, uint256 minEthOut) public payable noReentrant {
        Pool  memory pool = poolInfo[address(_tokenAddress)]; 
        require(pool.price > 0, "pool does not exist for this token"); 
        require(_tokenSent > 0, "tokens sent must be greater than zero");

        require(_tokenAddress.transferFrom(msg.sender, address(this), _tokenSent), "Token transfer failed");

        uint256 fee = _tokenSent / FEE_DENOMINATOR; 
        uint256 invariant = pool.ethReserve * pool.tokenReserve; 
        uint256 newTokenPool = pool.tokenReserve + _tokenSent; 
        uint256 newEthPool = invariant / (newTokenPool - fee); 
        uint256 ethOut = pool.ethReserve - newEthPool; 

        require(ethOut >= minEthOut, "Insufficient output amount"); 
        require(address(this).balance >= ethOut, "Insufficient ETH liquidity"); 

        (bool success, ) = msg.sender.call{value: ethOut }(""); 
        require(success, "Eth transfer failed");


        poolInfo[address(_tokenAddress)].ethReserve = newEthPool; 
        poolInfo[address(_tokenAddress)].tokenReserve = newTokenPool; 
        setPrice(_tokenAddress);

        emit TokenToEthSwap(address(_tokenAddress), _tokenSent, ethOut);
        
    }

    function tokenToTokenSwap(IERC20 _tokenIn, IERC20 _tokenOut, uint256 _tokenInAmount, uint256 minTokensOut) public noReentrant {
        // first swap token to eth 
        Pool memory poolIn = poolInfo[address(_tokenIn)]; 
        require(poolIn.price > 0, "input token pool does not exist"); 
        require(_tokenInAmount > 0, "must send tokens");

        require(_tokenIn.transferFrom(msg.sender, address(this), _tokenInAmount), "First transfer failed");

        uint256 fee = _tokenInAmount / FEE_DENOMINATOR; 
        uint256 invariant = poolIn.ethReserve * poolIn.tokenReserve; 
        uint256 newTokenPool = poolIn.tokenReserve + _tokenInAmount; 
        uint256 newEthPool = invariant / (newTokenPool - fee); 
        uint256 ethOut = poolIn.ethReserve - newEthPool; 

        require(ethOut > 0, "zero intermidiate ETH amount");
        // update first pool
        poolInfo[address(_tokenIn)].ethReserve = newEthPool; 
        poolInfo[address(_tokenIn)].tokenReserve = newTokenPool; 
        setPrice(_tokenIn);

        // second swap: eth to outToken
        Pool memory poolOut = poolInfo[address(_tokenOut)]; 
        require(poolOut.price > 0, "output token pool does not exist");
        
        fee = ethOut / FEE_DENOMINATOR; 
        invariant = poolOut.ethReserve * poolOut.tokenReserve; 
        uint256 newEthPoolOut = poolOut.ethReserve + ethOut; 
        uint256 newTokenPoolOut = invariant / (newEthPoolOut - fee); 
        uint256 tokensOut = poolOut.tokenReserve - newTokenPoolOut; 

        require(tokensOut >= minTokensOut, "Insufficient output amount"); 
        require(tokensOut > 0, "zero token output");
        require(_tokenOut.transfer(msg.sender, tokensOut), "final transfer failed");

        // update second pool 
        poolInfo[address(_tokenOut)].ethReserve = newEthPoolOut; 
        poolInfo[address(_tokenOut)].tokenReserve = newTokenPoolOut; 
        setPrice(_tokenOut);

        emit TokenToTokenSwap(address(_tokenIn), address(_tokenOut), _tokenInAmount, tokensOut); 
    }
}