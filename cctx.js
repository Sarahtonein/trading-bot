// tradingFunctions.js
const ccxt = require('ccxt');
const config = require('./config.json');

async function performTrade() {
    const exchange = new ccxt.phemex({
        apiKey: config.phemexApiId,
        secret: config.phemexApiSecret,
        options: {
            defaultType: 'swap',
        },
    });

    // Load markets
    await exchange.loadMarkets();

    const amount = 1; // This represents one CONTRACT, not 1 of the token/coin
    const symbol = 'BTC/USD:USD'; // Use the correct symbol format // exchange.markets? to

    // Change leverage to the desired value
    const leverageResponse = await exchange.setLeverage(50, symbol);
    console.log(leverageResponse);

    // Opening a pending contract (limit) order
    const order = await exchange.createOrder(symbol, 'market', 'buy', amount);
    console.log(order);

}

async function performShortTrade() {
    const exchange = new ccxt.phemex({
        apiKey: config.phemexApiId,
        secret: config.phemexApiSecret,
        options: {
            defaultType: 'swap',
        },
    })

    await exchange.loadMarkets();

    const amount = 1;
    const symbol = 'BTC/USD:USD';

    //change leverage to the desired value
    const leverageResponse = await exchange.setLeverage(50, symbol);
    console.log(leverageResponse);

    const order = await exchange.createOrder(symbol, 'market', 'sell', amount);
    console.log(order);
}

module.exports = {
    performTrade,
    performShortTrade
};
