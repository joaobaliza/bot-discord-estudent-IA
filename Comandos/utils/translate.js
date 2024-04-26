const Discord = require("discord.js");
const cor = require('..//..//cor.json');
const config = require('../../config.json');
const link = require('../../links.json');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const MODEL_NAME = "gemini-pro";
const genAI = new GoogleGenerativeAI(config.API_KEY)
const model = genAI.getGenerativeModel({ model: MODEL_NAME })


module.exports = {
  name: "translate", //nome do comando
  description: "Traduz o texto para o idioma desejado", // descrição do comando
  type: Discord.ApplicationCommandOptionType.ChatInput,
  options: [
    {
      name: "texto",
      description: "O que você deseja traduzir?",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'idioma',
      description: 'Para que idioma deseja traduzir o texto?',
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  run: async (client, interaction) => {
    
    const texto = interaction.options.getString('texto'); // texto para ser traduzido
    const idioma = interaction.options.getString('idioma'); // Idioma para que o texto será traduzido
    const user = interaction.user

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    }

    const parts = [
      {
        text: `Traduza: ${texto} para o idioma ${idioma}.`,
      }
    ]

    try {

      interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`📚 | ${user} Aguarde enquanto eu estou fazendo a tradução do seu texto...`).setColor(cor.azul_discord)] })

      const resultado = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig,
      })

      const resposta = resultado.response.text()
      const embedTrad = new Discord.EmbedBuilder()
      .setAuthor({ name: 'Estudent IA', iconURL: link.foto_bot })
      .setThumbnail(link.foto_bot)
      .setTitle('Estudent Translate')
      .setDescription(`${resposta}`)
      .setColor(cor.azul_discord)
      
      interaction.channel.send({ embeds: [embedTrad] })

    } catch (error) {
      console.error(error)
      interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`❌ | ${user} O sistema apresentou um erro na tradução, tente novamente mais tarde!`).setColor(cor.vermelho)] })
    }

  }
};
