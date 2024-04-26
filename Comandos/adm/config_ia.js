const Discord = require("discord.js");
const cor = require('..//..//cor.json');
const Config = require('..//..//models/Config')
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "config_ia", //nome do comando
    description: "Abre o painel de trocar o nome dos membros!", // descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "categoria_chat_ia",
            description: "Categoria para cria os chats que ia irá ser utilizada.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        const categoria_chat_ia = interaction.options.getChannel('categoria_chat_ia')
        const ownerId = interaction.guild.ownerId
        const pesqOwner = await Config.findOne({ ownerId: ownerId })

        if (interaction.user.id !== ownerId) {

            return interaction.reply({ content: `❌ | ${interaction.user} Somente o dono do servidor pode utilizar este comando!`, ephemeral: true })
        } else {

            if (categoria_chat_ia.type !== Discord.ChannelType.GuildCategory) {

                return interaction.reply({ content: `❌ | ${interaction.user} O canal mencionado deve ser uma categoria!`, ephemeral: true })
            } else {

                if (pesqOwner) {

                    return interaction.reply({ content: `❌ | ${interaction.user} Você já está registrado em nosso banco de dados`, ephemeral: true })
                } else {

                    const newConfig = new Config({
                        guildId: interaction.guild.id,
                        ownerId: ownerId,
                        categoryIa: categoria_chat_ia.id,
                    });

                    await newConfig.save();

                    const pesqConfig = await Config.findOne({ ownerId: ownerId })
                    const nomeCategoria = interaction.guild.channels.cache.find(c => c.id === pesqConfig.categoryIa)

                    const infoEmbed = new Discord.EmbedBuilder()
                    .setFields(
                        {
                            name: `ID do servidor:`,
                            value: `||${pesqConfig.guildId}||`,
                            inline: false
                        },
                        {
                            name: `Dono do servidor:`,
                            value: `<@${pesqConfig.ownerId}>(||${pesqConfig.ownerId}||)`,
                            inline: false
                        },
                        {
                            name: `Categoria chat IA:`,
                            value: `\`\`${nomeCategoria.name}\`\``
                        }
                    )
                    .setColor(cor.verde)

                    interaction.reply({ content: `${interaction.user} As configurações foram salvas no meu banco de dados`, embeds: [infoEmbed], ephemeral: true })
                }
            }
        }
    }
};
