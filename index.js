const {Client} = require('discord.js')
const client = new Client({
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!')) {
        let command = message.content.split(' ')[0].replace('!', '')
        console.log(command)
        if (command === 'cat') {
            message.reply('miaou')
        }
    }
})

client.on('ready', () => {
    console.log('Bot Ready')
    client.user.setActivity({type: 'PLAYING', name: 'arbre à chat'})
})

client.login(config.token)