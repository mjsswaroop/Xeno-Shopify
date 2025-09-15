const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    shopifyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    acceptsMarketing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    totalSpent: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    ordersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addresses: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    shopifyCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shopifyUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'customers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['shopifyId', 'tenantId']
      },
      {
        fields: ['tenantId']
      },
      {
        fields: ['email']
      }
    ]
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    Customer.hasMany(models.Order, { foreignKey: 'customerId' });
  };

  return Customer;
};