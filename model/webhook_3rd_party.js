module.exports = (sequelize, Sequelize) => {
  const Webhook3rdParty = sequelize.define('webhook_3rd_party', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    source_url: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    data: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  });
  return Webhook3rdParty;
};
