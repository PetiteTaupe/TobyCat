const {Client} = require('discord.js')
const { MessageEmbed } = require('discord.js');
const client = new Client({
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')
const axios = require('axios')

const _ = require('lodash')
const randomPost = [ "Jungle" , "ADC" , "Support" , "Top" , "Mid"]

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
                        console.log(err)
                    })
                break;
            case 'ub':
                axios.get('http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json')
                    .then(res => {
                        let championList = res.data.data;
                        const newList = [];

                        for (let i in championList) {
                            newList.push(championList[i])
                        }

                        let randomId = Math.floor(Math.random() * newList.length)
                        newList[randomId].name
                        let randomChamp = newList[randomId].name

                        const ultimate_bravery = new MessageEmbed()
                            .setColor('#7289D9')
                            .setTitle('Ultimate Bravery')
                            .setAuthor({ name: 'TobyCat', iconURL: 'https://i.imgur.com/SHdyR65.png'})
                            .setDescription('Voici ta prochaine game de la League des Croquettes, GOOD LUCK & HAVE FUN!')
                            .setFooter({ text: 'Powered by Toby The Fucking Cat'})
                            .setImage('http://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/' + randomChamp + '.png')
                            .addFields(
                                { name: 'Ton Champion', value: randomChamp },
                                { name: 'Ton rôle', value: _.sample(randomPost) },
                            );

                        message.reply({embeds: [ultimate_bravery]})

                    })
                    .catch(err => {
                        console.log(err)
                    })
                break;
            default:
                message.reply('che ne connais pas cha! 😾')
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