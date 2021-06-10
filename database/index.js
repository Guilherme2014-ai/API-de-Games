const Sequelize = require('sequelize')

const connection = new Sequelize('games','root','Celso_bixa2014', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection