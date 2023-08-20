# trading-bot

Discord bot that also trades based on messages from discord.
Data is closed source, so we are relying on discord alerts from the closed source indicator for positions.

**config.json:**

Refer: https://discordjs.guide/#before-you-begin

{
    "token": "TOKENHERE",
    "clientId": "YOURAPP",
    "guildId": "YOURGUILD"
}

**Dependencies:**

discordjs
discordreply
cctx
node


**Writing commands:**

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Replies with list of commands!'),
    async execute(interaction) {
        await interaction.reply('Discord commands are present are: /ping and /commands');
    },
};

Commands must be loaded using deploy-commands.js.




