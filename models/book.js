'use strict';
var dateFormat = require('dateformat');
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    body: DataTypes.TEXT,
    // genre: DataTypes.STRING,
    // year: DataTypes.INTEGER,
  }, {});

  Book.associate = function(models) {
    // associations can be defined here
  };

  Book.prototype.publishedAt = function(){
    return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
  };

  Book.prototype.shortDescription = function(){
    return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
  };

  return Book;
};



// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Book = sequelize.define('Book', {
//     title: {
//       type: DataTypes.STRING,
//       validate: {
//         notEmpty: {
//           msg: "Title is required"
//         }
//       }
//     },
//     author: {
//       type: DataTypes.STRING,
//       validate: {
//         notEmpty: {
//           msg: "Author is required"
//         }
//       }
//     },
//     genre: {
//       type: DataTypes.STRING,
//     },
//     year: {
//       type: DataTypes.INTEGER,
//     }
//   }, {});
//   Book.associate = function(models) {
//     // associations can be defined here
//   };
//   return Book;
// };