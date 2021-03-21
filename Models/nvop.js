const { Sequelize } = require('sequelize');
const db = require('../Router/database');

const nvop = db.define('chess openings', {

    name:{
        type: Sequelize.STRING,
        allowNull:false
    },
    eco:{
        type: Sequelize.STRING,
        allowNull:false,
        primaryKey: true
    },
    fen:{
        type: Sequelize.STRING,
        allowNull:false
    },
    moves:{
        type: Sequelize.STRING,
        allowNull:false
    }

});
module.exports = nvop;