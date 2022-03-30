const {Client} = require('discord.js')
const client = new Client({
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')

const _ = require('lodash')
const randomResponse = [ "https://imgur.com/d6BSgMS" , "https://imgur.com/GZ8hObx" , "https://imgur.com/lo0HqdX",
                         "https://imgur.com/lo0HqdX" , "https://imgur.com/gh8i9QC" , "https://imgur.com/nVIGIJO",
                         "https://imgur.com/VgdARTk" , "https://imgur.com/DaY8PcB" , "https://imgur.com/Ao9Lu4t",
                         "https://imgur.com/aNDUcF2" , "https://imgur.com/JXzgI7y" , "https://imgur.com/BZzwABw"]

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!')) {
        let command = message.content.split(' ')[0].replace('!', '')
        console.log(command)
        if (command === 'miaou') {
            message.reply('miaou')
        }
        if (command === 'cat') {
            message.reply(_.sample(randomResponse))
        }
    }
})

client.on('ready', () => {
    console.log('Bot Ready')
    client.user.setActivity({type: 'PLAYING', name: 'arbre à chat'})
})

client.login(config.token)