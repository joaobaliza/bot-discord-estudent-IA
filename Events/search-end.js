require('../index')

const Discord = require('discord.js')
const client = require('../index')

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'encerrarIA') {

            interaction.reply({ content: `este canal sera excluido em 5 segundos` }).then( () => {
                setTimeout(() => {
                    interaction.channel.delete()
                }, 5000)
            })
        }
    }
})