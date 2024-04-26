const mongoose = require('mongoose')
const chalk = require('chalk')
const cor = require('./cor.json')

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://joaopedrobaliza619:JzlTYXzZf439B8Wg@estudent.6yu2ops.mongodb.net/');
        console.clear(clearImmediate)
        console.log(chalk.hex('#2EFE64').bold(`✅ | Database logada com sucesso.`))
    } catch (error) {
        console.error(chalk.hex(cor.vermelho).bold('❌ | Erro ao conectar na Database:', error))
    }
}

module.exports = { connect }

