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
    console.log(`The current price of BTC is: ${currentPrice} `);
    return currentPrice;
}

async function getBitcoinPriceRange() {
    const symbol = 'BTC/USD:USD';
    const sinceTimestamp = exchange.parse8601(Date.now() - 88 * 60 * 60 * 1000); // 88 hours ago
    const ohlcv = await exchange.fetchOHLCV(symbol, '1h', sinceTimestamp);

    const highestPrice = Math.max(...ohlcv.map(entry => entry[2])); // High price is at index 2
    const lowestPrice = Math.min(...ohlcv.map(entry => entry[3]));  // Low price is at index 3
    console.log(`The lowest price of BTC in the last 88 hrs is: ${lowestPrice}`);
    return { highestPrice, lowestPrice };
}

async function performTrade() {
    await exchange.loadMarkets();

    const riskPercentage = 0.04; // 4% risk per trade
    const currencyCode = 'USD'; // Currency code of the trading account

    // Fetch balance and calculate risk amount
    const accountInfo = await exchange.fetchBalance({ code: currencyCode });
    const usdBalance = accountInfo.total[currencyCode];
    const riskAmount = usdBalance * riskPercentage;

    const currentPrice = await getCurrentBitcoinPrice();
    const currentPriceRange = await getBitcoinPriceRange();
    const lowestPrice = currentPriceRange.lowestPrice;

    // Calculate stop loss percentage
    const stopLossPercentage = (currentPrice - lowestPrice) / currentPrice;

    // Calculate the leverage relative to 2% risk
    const leverage = (riskPercentage / stopLossPercentage).toFixed(2);

    console.log(`Calculated Leverage: ${leverage}`);
    console.log(`Calculated Stop Loss Percentage: ${(stopLossPercentage * 100).toFixed(2)}%`);

    // Calculate trade amount
    const symbol = 'BTC/USD:USD';
    const contractValue = riskAmount * leverage;

    console.log(`Contract Value: ${contractValue}`);

    // Change leverage to the desired value
    const leverageResponse = await exchange.setLeverage(leverage, symbol);
    console.log(`Leverage has been set to ${leverageResponse.leverage}`);

    // Opening a (market) order
    // const order = await exchange.createOrder(symbol, 'market', 'buy', contractValue);
    // console.log(order);
}

async function main() {
    performTrade();
}

main();
//TODO
//Build take profit function (12.5% chunks)
//needs to check if a position is open, if not then ignore
//function to get current positions


/*
Integrate this function with performTrade
async function performShortTrade() {
    await exchange.loadMarkets();
    const amount = 1;
    const symbol = 'BTC/USD:USD';
    const leverageResponse = await exchange.setLeverage(50, symbol);
    console.log(leverageResponse);
    const order = await exchange.createOrder(symbol, 'market', 'sell', amount);
    console.log(order);
}*/

module.exports = {
    performTrade,
    //performShortTrade,
    getCurrentBitcoinPrice,
    getBitcoinPriceRange,

};

//retrieve info when position is closed or consistently poll for open positions
//update balance (we need to be able to retrieve it.)
