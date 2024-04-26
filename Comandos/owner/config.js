const Discord = require("discord.js");
const cor = require('..//..//cor.json');
const { QuickDB } = require("quick.db");
const { contents } = require("language-detect");
const db = new QuickDB();

module.exports = {
    name: "config", //nome do comando
    description: "Configurações do meu criador!", // descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal_nome",
            description: "Canal para enviar o painel de trocar o nome dos membros.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "cargo",
            description: "Cargo que o membro recebe após registrar um nome.",
            type: Discord.ApplicationCommandOptionType.Role,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        const user = interaction.user
        if(user.id !== '491999578091159556') {
            interaction.reply({ content: `${user} Apenas o meu criador pode utilizar este comando!` })
        } else {
            interaction.reply({ content: `${user} Ola criador!` })
        }
    }
};
