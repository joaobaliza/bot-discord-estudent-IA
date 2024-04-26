const Discord = require("discord.js");
const cor = require('..//..//cor.json');
const config = require('../../config.json');
const Config = require('..//..//models/Config');
const link = require('..//..//links.json');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const MODEL_NAME = "gemini-pro";
const genAI = new GoogleGenerativeAI(config.API_KEY)
const model = genAI.getGenerativeModel({ model: MODEL_NAME })

module.exports = {
    name: "search", //nome do comando
    description: "Faz uma pesquisa utilizando IA", // descrição do comando
    type: Discord.ApplicationCommandOptionType.ChatInput,
    options: [
        {
            name: "consulta",
            description: "O que você deseja pesquisar?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const consulta = interaction.options.getString('consulta')
        const user = interaction.user
        const channelName = `consulta-ia-${user.globalName}`
        const channel = interaction.guild.channels.cache.find(c => c.name === channelName)
        const pesqConfig = await Config.findOne({ ownerId: interaction.guild.ownerId })

        let endIA = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('endIA')
                .setEmoji('❌')
                .setLabel('Encerrar chat IA')
                .setStyle(Discord.ButtonStyle.Secondary)
        )

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        }

        const parts = [
            {
                text: `input: ${consulta}`,
            }
        ]

        if (!pesqConfig) { // Se o sistema não estiver configurando retorna mensagem de erro
            return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`❌ | ${user} O meu sistema de buscas utilizando IA não está configurado neste servidor`).setColor(cor.vermelho)], ephemeral: true })
        } else { // Se o sistema estiver configurado verifica se já existe um canal de ia criado
            if (!channel) { // Caso não exista um canal de ia criado ele cria um
                interaction.guild.channels.create({
                    name: channelName,
                    type: Discord.ChannelType.GuildText,
                    parent: pesqConfig.categoryIa,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [
                                Discord.PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.SendMessages,
                                Discord.PermissionFlagsBits.AttachFiles,
                                Discord.PermissionFlagsBits.EmbedLinks,
                                Discord.PermissionFlagsBits.AddReactions,
                                Discord.PermissionFlagsBits.ReadMessageHistory
                            ]
                        }
                    ]
                }).then(async (ch) => { // Após criar o canal envia a mensagem de pesquisa
                    interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`✅ | ${user} O seu chat IA foi criado em: ${ch}`).setColor(cor.verde)], ephemeral: true })
                    await ch.send({ embeds: [new Discord.EmbedBuilder().setDescription(`🔎 | ${user} Pesquisando por: \`\`${consulta}\`\``).setColor(cor.azul_discord)] })

                    try {
                        const resultado = await model.generateContent({
                            contents: [{ role: 'user', parts }],
                            generationConfig,
                        })

                        const reply = resultado.response.text()

                        const embedReply = new Discord.EmbedBuilder()
                        .setAuthor({ name: 'Estudent IA', iconURL: link.foto_bot })
                        .setThumbnail(link.foto_bot)
                        .setTitle(`Resposta gerada para: \`\`${consulta}\`\``)
                        .setDescription(`${reply}`)
                        .setColor(cor.azul_discord)

                        ch.send({ embeds: [embedReply] })
                    } catch (error) {
                        await ch.send({ embeds: [new Discord.EmbedBuilder().setDescription(`❌ | ${user} O sistema apresentou um erro na pesquisa, tente novamente mais tarde!`).setColor(cor.vermelho)], ephemeral: true })
                        console.error('Erro ao fazer uma pesquisa:', error)
                    }
                })
            } else { // Caso ja exista um canal criado
                if (interaction.channel.name !== channelName) { // Verifica se o canal onde foi utilizado o comando é o canal de IA e caso não seja retorna a mensagem de erro
                    await ch.send({ embeds: [new Discord.EmbedBuilder().setDescription(`❌ | ${user} Suas pesquisas devem ser feitas em: ${channelName}`).setColor(cor.vermelho)], ephemral: true })
                } else { // Caso o canal do comando utilizado seja de IA envia a mensagem de pesquisa
                    interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`🔎 | ${user} Pesquisando por: \`\`${consulta}\`\``).setColor(cor.azul_discord)] })

                    try {
                        const resultado = await model.generateContent({
                            contents: [{ role: 'user', parts }],
                            generationConfig,
                        })

                        const reply = resultado.response.text()

                        const embedReply = new Discord.EmbedBuilder()
                        .setAuthor({ name: 'Estudent IA', iconURL: link.foto_bot })
                        .setThumbnail(link.foto_bot)
                        .setTitle(`Resposta gerada para: \`\`${consulta}\`\``)
                        .setDescription(`${reply}`)
                        .setColor(cor.azul_discord)

                        interaction.channel.send({ embeds: [embedReply] })
                    } catch (error) {
                        console.error('Erro ao fazer uma pesquisa:', error)
                        await interaction.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`❌ | ${user} O sistema apresentou um erro na pesquisa, tente novamente mais tarde!`).setColor(cor.vermelho)], ephemeral: true })
                    }
                }
            }
        }
    }
};
