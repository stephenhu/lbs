'use strict';
module.exports = function(sequelize, DataTypes) {
  var Blob = sequelize.define('Blob', {
    key: DataTypes.STRING,
    filename: DataTypes.STRING,
    extension: DataTypes.STRING,
    bytes: DataTypes.INTEGER,
    application: DataTypes.STRING,
    version: DataTypes.INTEGER,
    dirty: DataTypes.BOOLEAN,
    properties: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Blob;
};