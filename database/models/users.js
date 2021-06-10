const connection = require('../index');
const sequelize = require('sequelize');

const users = connection.define('users',{
    name: {
        type: sequelize.STRING,
        allowNull: false
    },

    email: {
        type: sequelize.STRING,
        allowNull: false
    },

    password: {
        type: sequelize.STRING,
        allowNull: false
    }
});

users.sync({ force: false }).then(()=>{}).catch((err)=>console.error(err));
module.exports = users;