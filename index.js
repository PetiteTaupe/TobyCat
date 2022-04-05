const {Client , MessageEmbed} = require('discord.js')

const fs = require('fs');
const path = require('path');
const config = require('./config.json')
const axios = require('axios')
const _ = require('lodash')

const client = new Client({
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

const randomPost = ["Jungle", "ADC", "Support", "Top", "Mid"]

let champions = null;

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!')) {
        let command = message.content.split(' ')[0].replace('!', '')

        console.log(command)

        switch (command) {
            case 'miaou':
                message.reply('miaou');
                break;
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
                //newList[randomId].name

                let championsAsArray = Object.values(champions)

                let randomChamp = _.sample(championsAsArray);

                let randomChampName = randomChamp.name
                let randomChampId = randomChamp.id

                const ultimate_bravery = new MessageEmbed()
                    .setColor('#7289D9')
                    .setTitle('Ultimate Bravery')
                    .setAuthor({name: 'TobyCat', iconURL: 'https://i.imgur.com/SHdyR65.png'})
                    .setDescription('Voici ta prochaine game de la League des Croquettes, GOOD LUCK & HAVE FUN!')
                    .addFields(
                        {name: 'Ton Champion', value: randomChampName},
                        {name: 'Ton rôle', value: _.sample(randomPost)},
                    )
                    .setImage('http://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/' + randomChampId + '.png')
                    .setFooter({text: 'Powered by Toby The Fucking Cat'});


                message.reply({embeds: [ultimate_bravery]})
                break;
            default:
                message.reply('che ne connais pas cha! 😾')
//message.reply({files: ["img/error.png"]});
                break;
        }

    }
})

function getChampionsFromAPI() {
    axios.get('http://ddragon.leagueoflegends.com/cdn/' + config.currentPatch + '/data/en_US/champion.json')
        .then(res => {
            fs.writeFileSync(path.resolve(__dirname, 'champion.json'), JSON.stringify(res.data.data));

            champions = require('./champion.json')
        })
}

client.on('ready', () => {
    console.log('Bot Ready')
    client.user.setActivity({type: 'PLAYING', name: 'arbre à chat'})
    getChampionsFromAPI()
    setInterval(getChampionsFromAPI, 1000 * 60 * 60 * 6)
})

client.login(config.token)