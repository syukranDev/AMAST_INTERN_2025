module.exports = (sequelize, Sequelize) => {
  const Products = sequelize.define('products', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    origin_country: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    price: {
      type: Sequelize.NUMERIC,
      allowNull: true
    },
    expiry_date: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    status: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  });
  return Products;
};
