const { Sequelize } = require('sequelize');

module.exports = new Sequelize('d2m4a0jmp0e9u9', 'opxljzfshcpclx', '298d69a1840c4d890a07cf58a68a5d3889f990a7aa08e8675766c8c18b1a8f9e', {
    host: 'ec2-54-145-102-149.compute-1.amazonaws.com',
    dialect: 'postgres',
    protocol: 'postgres',
    define: {
        timestamps: false
    },
    dialectOptions:{
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }


});