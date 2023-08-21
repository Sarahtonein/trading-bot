const ccxt = require('ccxt');
const config = require('./config.json');

const exchange = new ccxt.phemex({
    apiKey: config.phemexApiId,
    secret: config.phemexApiSecret,
    options: {
        defaultType: 'swap',
    },
});


async function getCurrentBitcoinPrice() {
    const symbol = 'BTC/USD:USD';
    const ticker = await exchange.fetchTicker(symbol);
    const currentPrice = ticker.last;
    return `Current Bitcoin Price: ${currentPrice}`;
}

async function getBitcoinPriceRange() {
    const symbol = 'BTC/USD:USD';
    const sinceTimestamp = exchange.parse8601(Date.now() - 88 * 60 * 60 * 1000); // 88 hours ago
    const ohlcv = await exchange.fetchOHLCV(symbol, '1h', sinceTimestamp);

    const highestPrice = Math.max(...ohlcv.map(entry => entry[2])); // High price is at index 2
    const lowestPrice = Math.min(...ohlcv.map(entry => entry[3]));  // Low price is at index 3
    return `Highest Bitcoin Price 88 hours ago: ${highestPrice}\nLowest Bitcoin Price 88 hours ago: ${lowestPrice}`;
}

async function performTrade() {
    // Load markets
    await exchange.loadMarkets();
    const amount = 1; // This represents one CONTRACT, not 1 of the token/coin
    const symbol = 'BTC/USD:USD'; // Use the correct symbol format // exchange.markets? to
    // Change leverage to the desired value
    const leverageResponse = await exchange.setLeverage(50, symbol);
    console.log(leverageResponse);
    let currentPrice = await getCurrentBitcoinPrice();
    // Opening a (market) order
    const order = await exchange.createOrder(symbol, 'market', 'buy', amount);
    console.log(order);
}

async function performShortTrade() {
    await exchange.loadMarkets();
    const amount = 1;
    const symbol = 'BTC/USD:USD';
    const leverageResponse = await exchange.setLeverage(50, symbol);
    console.log(leverageResponse);
    const order = await exchange.createOrder(symbol, 'market', 'sell', amount);
    console.log(order);
}

module.exports = {
    performTrade,
    performShortTrade,
    getCurrentBitcoinPrice,
    getBitcoinPriceRange
};

//retrieve info when position is closed or consistently poll for open positions
//update balance (we need to be able to retrieve it.)
