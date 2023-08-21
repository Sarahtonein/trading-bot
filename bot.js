const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('discord-reply')
const { token } = require('./config.json');
const tradingFunctions = require('./cctx');// Create a new client instance
const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });
//const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });


/*TODO 
Clean up the bot file os that it doesn't have all the discord shit in here
I'm sure there's a lot more to do.
*/

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

//Discord branch

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


/*@Dev 
Is this outdated? */
client.on('messageCreate', async (message) => {
    if (message.content.includes('ping')) {
        message.reply('Pong!');
    } else if (message.content.includes('BTCUSDT BBWP is below 15%tile')) {
        message.reply('Low volatility detected, looking for signals');

        // Wait for a specific secondary message
        const filter = (response) => {
            return response.author.id === message.author.id;
        };

        try {
            const collected = await message.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000, // Time in milliseconds to wait for a response
                errors: ['time']
            });

            const responseMessage = collected.first();
            if (responseMessage.content.includes('continuation bull divergence - is confirmed')) {
                message.reply('cont bull div confirmed, placing long order');
                (async () => {
                    await tradingFunctions.performTrade();
                    message.reply('ORDER PLACED SUCCESSFULLY!')

                })();
            } else if (responseMessage.content.includes('continuation bear divergence - is confirmed')) {
                message.reply('Cont bear div confirmed');
                (async () => {
                    await tradingFunctions.performShortTrade();
                    message.reply('ORDER PLACED SUCESSFULLY!')
                })();
            } else if (responseMessage.content.includes('Regular Bear Divergence')) {
                message.reply('Reg bear div confirmed');
                (async () => {
                    await tradingFunctions.performShortTrade();
                    message.reply('ORDER PLACED SUCCESSFULLY!');
                })();
            } else if (responseMessage.content.includes('Regular bull Divergenc')) {
                message.reply('Reg bull div confirmed');
                (async () => {
                    await performTrade();
                    message.reply('ORDER PLACED SUCCESSFULLY')
                })();
            } else {
                message.reply('No valid confirmation message received.');
            }
        } catch (error) {
            console.error(error);
            message.reply('No confirmation received within the time limit.');
        }
    }

    else if (message.content.includes('dxy')) {
        message.reply('Quite easily the biggest ponzi in the world')
    } else if (message.content.includes('price')) {
        try {
            await message.reply('Fetching BTC value ...');
            const currentPriceMessage = await tradingFunctions.getCurrentBitcoinPrice();
            await message.reply(currentPriceMessage);

            await message.reply('Fetching BTC value range...');
            const priceRangeMessage = await tradingFunctions.getBitcoinPriceRange();
            await message.reply(priceRangeMessage);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while fetching data.');
        }
    }
    else if (message.content.includes('balance')) {
        const balance = await tradingFunctions.getBalanceAndRisk();
        console.log(balance);
        await message.reply(`Current details: ${balance}`);
    }

});

/*Get ANY messages from author: User { 
    id: '1081353818580721785',
    bot: true, 
    username: 'BBWP Signals'
}*/




///
client.on(Events.InteractionCreate, interaction => {
    console.log(interaction);
});

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
});


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// Log in to Discord with your client's token
client.login(token);