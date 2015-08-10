'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Blobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false
      },
      extension: {
        type: Sequelize.STRING
      },
      bytes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      application: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pool"
      },
      version: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      dirty: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      properties: {
        type: Sequelize.STRING
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Blobs');
  }
};