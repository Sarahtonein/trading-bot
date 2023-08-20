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

 - discordjs
 - discordreply
 - cctx
 - node


**Running things:**

- Well, you need to configure Discord for a start.
 - Secondly you need to setup an exchange API key, in this case we used phemex
 - Third, you need to set those env variables
 - fourth, run it and send commands to discord, see the fireworks.



