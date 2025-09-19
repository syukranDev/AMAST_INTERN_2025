module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define('users', {
    username: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    role: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  });
  return Users;
};
