const {Client, MessageEmbed, MessageAttachment} = require('discord.js')
const config = require('./config.json')
const axios = require('axios')
const _ = require('lodash')
const Canvas = require('canvas')

const client = new Client({
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

const randomPost = ["Jungle", "Bot", "Support", "Top", "Mid"]

let champions = null;
let runes = null;

client.login(config.token)

client.on('ready', () => {
    console.log('Bot Ready')
    client.user.setActivity({type: 'PLAYING', name: 'casser de la vaisselle'})
    getDataFromAPI()
    setInterval(getDataFromAPI, 1000 * 60 * 60 * 6)
})

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(config.prefix)) {
        let command = message.content.split(' ')[0].replace(config.prefix, '')
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
                let championsAsArray = Object.values(champions)
                let randomChamp = _.sample(championsAsArray)
                let randomChampName = randomChamp.name
                let randomChampId = randomChamp.id

                let runesAsArray = Object.values(runes)

                let randomMajorFamilyRune = _.sample(runesAsArray)
                let randomMajorFamilyRuneName = randomMajorFamilyRune.name
                let randomMajorRune = _.sample(randomMajorFamilyRune.runes)
                let randomMajorRuneName = randomMajorRune.name

                let randomSecondaryFamilyRune
                let randomSecondaryFamilyRuneName

                do {
                    randomSecondaryFamilyRune = _.sample(runesAsArray)
                    randomSecondaryFamilyRuneName = randomSecondaryFamilyRune.name
                } while (randomMajorFamilyRuneName === randomSecondaryFamilyRuneName)

                let post = _.sample(randomPost)

                /*
                const canvas = Canvas.createCanvas(700, 700)
                const ctx = canvas.getContext('2d')

                Canvas.loadImage('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + randomChampId + '_0.jpg').then(image => {
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                })

                /*Canvas.loadImage('img/Position_Diamond-' + post + ".png").then(image => {
                    ctx.drawImage(image, 0, 0, 100, 100)
                })*/

                //const attachment = new MessageAttachment(canvas.toBuffer(), 'ub.png');

                //'https://ddragon.canisback.com/img/' + randomMajorRune.icon
                //'https://ddragon.canisback.com/img/' + randomSecondaryFamilyRune.icon

                //message.reply({ files: [attachment] })

                const canvas = Canvas.createCanvas(960, 540);
                const context = canvas.getContext('2d');

                const background = await Canvas.loadImage('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + randomChampId + '_0.jpg');

                // This uses the canvas dimensions to stretch the image onto the entire canvas
                context.drawImage(background, 0, 0, canvas.width, canvas.height);

                const imgBanner = await Canvas.loadImage('img/banner.png');

                // Draw a shape onto the main canvas
                context.drawImage(imgBanner, 10, 0, 200, 500);

                const imgPost = await Canvas.loadImage('img/Position_Diamond-' + post + '.png');

                // Draw a shape onto the main canvas
                context.drawImage(imgPost, 60, 50, 100, 100);

                const imgMajorRune = await Canvas.loadImage('https://ddragon.canisback.com/img/' + randomMajorRune.icon);

                // Draw a shape onto the main canvas
                context.drawImage(imgMajorRune, 25, 175, 100, 100);

                const imgSecondaryRune = await Canvas.loadImage('https://ddragon.canisback.com/img/' + randomSecondaryFamilyRune.icon);

                // Draw a shape onto the main canvas
                context.drawImage(imgSecondaryRune, 125, 200, 50, 50);

                // Use the helpful Attachment class structure to process the file for you
                const attachment = new MessageAttachment(canvas.toBuffer(), 'ub.png');

                const ultimate_bravery = new MessageEmbed()
                    .setColor('#7289D9')
                    //.setTitle('Ultimate Bravery')
                    .setAuthor({name: message.member.nickname, iconURL: message.author.avatarURL()})
                    .setDescription('Voici ton ultimate bravery, GOOD LUCK & HAVE FUN!😼🎲😹')
                    .addFields([
                        {name: 'Ton Champion', value: randomChampName, inline: true},
                        {name: 'Ton rôle', value: post, inline: true},
                        {
                            name: 'Tes runes',
                            value: randomMajorRuneName + " | " + randomSecondaryFamilyRuneName,
                            inline: true
                        },
                    ])
                    .setFooter({text: 'Powered by Toby The Fucking Cat'});


                message.reply({embeds: [ultimate_bravery], files: [attachment]})
                break;
            default:
                message.reply('che ne connais pas cha! 😾')
                //message.reply({files: ["img/error.png"]});
                break;
        }
    }
})

function getDataFromAPI() {
    axios.get('http://ddragon.leagueoflegends.com/cdn/' + config.currentPatch + '/data/fr_FR/champion.json')
        .then(res => {
            champions = res.data.data
        })
    axios.get('http://ddragon.leagueoflegends.com/cdn/' + config.currentPatch + '/data/fr_FR/runesReforged.json')
        .then(res => {
            let data = res.data

            data.forEach(runeType => {
                runeType.runes = runeType.slots[0].runes
                delete runeType.slots
            })
            runes = data;
        })
}


