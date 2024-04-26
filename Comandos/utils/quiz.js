const Discord = require("discord.js");
const cor = require('..//..//cor.json');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "nome", //nome do comando
    description: "Abre o painel de trocar o nome dos membros!", // descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal_nome",
            description: "Canal para enviar o painel de trocar o nome dos membros.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "cargo",
            description: "Cargo que o membro recebe após registrar um nome.",
            type: Discord.ApplicationCommandOptionType.Role,
            required: true,
        }
    ],

    run: async (client, interaction) => {

    }
};
