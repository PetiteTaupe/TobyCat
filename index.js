const {Client} = require('discord.js')
const client = new Client({
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')
const axios = require('axios')

const _ = require('lodash')
/*
const randomResponse = [ "https://imgur.com/d6BSgMS" , "https://imgur.com/GZ8hObx" , "https://imgur.com/lo0HqdX",
                         "https://imgur.com/lo0HqdX" , "https://imgur.com/gh8i9QC" , "https://imgur.com/nVIGIJO",
                         "https://imgur.com/VgdARTk" , "https://imgur.com/DaY8PcB" , "https://imgur.com/Ao9Lu4t",
                         "https://imgur.com/aNDUcF2" , "https://imgur.com/JXzgI7y" , "https://imgur.com/BZzwABw"]
 */

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!')) {
        let command = message.content.split(' ')[0].replace('!', '')

        console.log(command)

        switch (command){
            case 'miaou': message.reply('miaou'); break;
            case 'cat':
                axios.get('https://aws.random.cat/meow')
                    .then(res => {
                        message.reply(res.data.file)
                    })
                    .catch(err => {
                        console.log(err);
                    });
                break;
            default:
                message.reply('che ne connais pas cha! 😾');
                //message.reply({files: ["img/error.png"]});
                break;
        }

    }
})

client.on('ready', () => {
    console.log('Bot Ready')
    client.user.setActivity({type: 'PLAYING', name: 'arbre à chat'})
})

client.login(config.token)