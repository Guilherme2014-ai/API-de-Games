const sequelize = require('sequelize')
const connection = require('../index')

const game = connection.define('games', {    //Nome da Tabela
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    year: {
        type: sequelize.STRING,
        allowNull: false
    },
    price: {
        type: sequelize.STRING,
        allowNull: false
    }
})

game.sync({ force: false }).then(() => {}).catch((err) => {console.log(`Error: ${err}`)}) // Sync: Tipo um save | Force: forca a a criacao, mesmo tendo uma tabela do mesmo nome
module.exports = game;