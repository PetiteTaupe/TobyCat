const {Client, MessageEmbed, MessageAttachment} = require('discord.js')
const config = require('./config.json')
const axios = require('axios')
const _ = require('lodash')
const Canvas = require('canvas')

const client = new Client({
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
let champions = null;
let runes = null;
let summoners = null;
let boots = null;

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
                axios.get('https://api.thecatapi.com/v1/images/search')
                    .then(res => {
                        //message.reply(res.data.file)
                        message.reply(res.data[0].url)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                break;
            case 'ub':
                let randomPost = ["Jungle", "Bot", "Support", "Top", "Mid"]
                let championsAsArray = Object.values(champions)


                let channel = message.channel;
                message.channel.send("Réagissez à ce message pour participer à ce UB !").then(async message => {
                    message.react('👍');

                    const filter = (reaction, user) => {
                        return ['👍'].includes(reaction.emoji.name) && user.id !== client.user.id;
                    };

                    const collector = message.createReactionCollector({filter: filter, time: 30 * 1000, max: 5})
                    collector.on("collect", async (r, user) => {
                        let randomChamp = _.sample(championsAsArray)
                        championsAsArray.splice(championsAsArray.indexOf(randomChamp), 1)



                        let randomMajorFamilyRune = _.sample(runes)
                        let randomMajorFamilyRuneName = randomMajorFamilyRune.name
                        let randomMajorRune = _.sample(randomMajorFamilyRune.runes)
                        let randomMajorRuneName = randomMajorRune.name

                        let randomSecondaryFamilyRune
                        let randomSecondaryFamilyRuneName

                        do {
                            randomSecondaryFamilyRune = _.sample(runes)
                            randomSecondaryFamilyRuneName = randomSecondaryFamilyRune.name
                        } while (randomMajorFamilyRuneName === randomSecondaryFamilyRuneName)

                        let post = _.sample(randomPost)
                        randomPost.splice(randomPost.indexOf(post), 1)

                        let randomSummonerSpell = _.sample(summoners)

                        let randomBoots = _.sample(boots)

                        // Création du canvas
                        const canvas = Canvas.createCanvas(960, 540);
                        const context = canvas.getContext('2d');

                        // Champion Image
                        const background = await Canvas.loadImage('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + randomChamp.id + '_0.jpg');
                        context.drawImage(background, 0, 0, canvas.width, canvas.height);

                        // Champion Banner
                        const imgBanner = await Canvas.loadImage('img/banner.png');
                        context.drawImage(imgBanner, 10, 0, 200, 500);

                        // Post
                        const imgPost = await Canvas.loadImage('img/Position_Diamond-' + post + '.png');
                        context.drawImage(imgPost, 60, 25, 100, 100);

                        // Major Rune
                        const imgMajorRune = await Canvas.loadImage('https://ddragon.canisback.com/img/' + randomMajorRune.icon);
                        context.drawImage(imgMajorRune, 25, 125, 100, 100);

                        // Secondary Rune
                        const imgSecondaryRune = await Canvas.loadImage('https://ddragon.canisback.com/img/' + randomSecondaryFamilyRune.icon);
                        context.drawImage(imgSecondaryRune, 125, 150, 50, 50);

                        // Summoner
                        const imgSummoner = await Canvas.loadImage('http://ddragon.leagueoflegends.com/cdn/' + config.currentPatch + '/img/spell/' + randomSummonerSpell.id + '.png');
                        context.drawImage(imgSummoner, 45, 225, 60, 60);

                        // Bottes
                        const imgBoots = await Canvas.loadImage('http://ddragon.leagueoflegends.com/cdn/' + config.currentPatch + '/img/item/' + randomBoots.image.full);
                        context.drawImage(imgBoots, 120, 225, 60, 60);

                        context.fillStyle = 'white'
                        context.strokeStyle = '#7289D9'
                        context.font = '90px "Friz Quadrata"'

                        context.fillText(randomChamp.name, canvas.width / 4, 450);
                        context.strokeText(randomChamp.name, canvas.width / 4, 450);

                        // Use the helpful Attachment class structure to process the file for you
                        const attachment = new MessageAttachment(canvas.toBuffer(), 'ub.png');

                        const ultimate_bravery = new MessageEmbed()
                            .setColor('#7289D9')
                            //.setTitle('Ultimate Bravery')
                            .setAuthor({name: user.username, iconURL: user.avatarURL()})
                            .setDescription('Voici ton ultimate bravery, GOOD LUCK & HAVE FUN!😼🎲😹')
                            .addFields([
                                {name: 'Ton champion', value: randomChamp.name, inline: true},
                                {name: 'Ton rôle', value: post, inline: true},
                                {
                                    name: 'Tes runes',
                                    value: randomMajorRuneName + " | " + randomSecondaryFamilyRuneName,
                                    inline: true
                                },
                                {name: 'Ton summoner', value: randomSummonerSpell.name, inline: true},
                                {name: 'Tes bottes', value: randomBoots.name, inline: true},
                            ])
                            .setFooter({text: 'Powered by Toby The Fucking Cat'});

                        message.channel.send({content: user.toString(), embeds: [ultimate_bravery], files: [attachment]}).then(m => {
                            m.react('🎲')

                            const filter = (reaction, reactUser) => {
                                return ['🎲'].includes(reaction.emoji.name) && reactUser.id === user.id && reactUser !== client.user.id;
                            };

                            const collector = m.createReactionCollector({filter: filter, time: 20 * 1000, max: 1})
                            collector.on("collect", async (r, user) => {
                                m.channel.send('TU JOUES CA ET VA NIQUER TA MERE')
                            })
                        })
                    })
                    collector.on("end", () => {
                        message.delete()
                    })
                })
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
            runes = Object.values(data);
        })
    axios.get('http://ddragon.leagueoflegends.com/cdn/' + config.currentPatch + '/data/fr_FR/summoner.json')
        .then(res => {
            delete res.data.data.SummonerPoroRecall
            delete res.data.data.SummonerPoroThrow
            delete res.data.data.SummonerSnowURFSnowball_Mark
            delete res.data.data.SummonerSnowball
            delete res.data.data.Summoner_UltBookPlaceholder
            delete res.data.data.Summoner_UltBookSmitePlaceholder

            summoners = Object.values(res.data.data)
        })
    axios.get('http://ddragon.leagueoflegends.com/cdn/' + config.currentPatch + '/data/fr_FR/item.json')
        .then(res => {
            let data = res.data.data

            boots = Object.values(data).filter(item => item.tags.includes('Boots') && item.depth > 1)
            //boots.forEach(boot => console.log(boot.name))
        })
}


