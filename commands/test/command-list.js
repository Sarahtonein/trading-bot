const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Replies with list of commands!'),
    async execute(interaction) {
        await interaction.reply('Discord commands are present are: /ping and /commands');
    },
};