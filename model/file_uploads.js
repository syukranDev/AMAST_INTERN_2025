module.exports = (sequelize, Sequelize) => {
    var Transactions = sequelize.define('file_uploads', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      file_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      file_path: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    },{
      timestamps: true,
      underscored: true,
      freezeTableName: true
    });
    return Transactions;
  }