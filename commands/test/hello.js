module.exports = {
    name: 'reply',
    category: 'Test',
    run: (client, message, args) => {
        message.lineReply('This is reply with @mention');
    }
}