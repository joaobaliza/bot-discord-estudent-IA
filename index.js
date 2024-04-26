const Discord = require("discord.js"); // Importa a biblioteca discord.js
const { QuickDB } = require("quick.db"); // Importa a biblioteca quick.db
const db = new QuickDB(); // Cria um novo quick db para o banco de dados
const mongoose = require('mongoose'); // Importa a biblioteca mongoose para utilizar o MongoDb
const chalk = require('chalk'); // Importa a biblioteca chalk para escrver colorido no terminal
const config = require("./config.json"); // Importa o arquivo config.json para ober as informações de configuração do bot
const axios = require('axios'); // Importa a biblioteca axios para utilizar extenções HTTPs
const { connect } = require('./database') // conecta ao bando de dados
connect(); // conecta ao bando de dados
const { GoogleGenerativeAI } = require('@google/generative-ai')
const geminiClient = require('./gemini');

const client = new Discord.Client({
  intents: [1, 512, 32768, 2, 128,
    Discord.IntentsBitField.Flags.DirectMessages,
    Discord.IntentsBitField.Flags.GuildInvites,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildPresences,
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.MessageContent,
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMessageReactions,
    Discord.IntentsBitField.Flags.GuildEmojisAndStickers
  ],
  partials: [
    Discord.Partials.User,
    Discord.Partials.Message,
    Discord.Partials.Reaction,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember
  ]
});

module.exports = client

client.on('interactionCreate', (interaction) => {

  if (interaction.type === Discord.InteractionType.ApplicationCommand) {

    const cmd = client.slashCommands.get(interaction.commandName);

    if (!cmd) return interaction.reply(`Error`);

    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

    cmd.run(client, interaction)
  }
})

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.token)

const fs = require('fs');

fs.readdir('./Events', (err, file) => {
  file.forEach(event => {
    require(`./Events/${event}`)
  })
})

client.on("ready", async() => {
  console.log(chalk.hex('#2EFE64').bold(`✅ | Estou online como: ${client.user.username}!`))
})
