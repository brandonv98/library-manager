'use strict';
var dateFormat = require('dateformat');
module.exports = (sequelize, DataTypes) => {
  const Novel = sequelize.define('Novel', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    body: DataTypes.TEXT,
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Novel.associate = function(models) {
    // associations can be defined here
  };

  Novel.prototype.publishedAt = function(){
    return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
  };

  Novel.prototype.shortDescription = function(){
    return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
  };
  return Novel;
};