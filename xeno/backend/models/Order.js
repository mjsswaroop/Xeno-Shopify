const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
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
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    totalTax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    financialStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fulfillmentStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lineItems: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: true
    },
    billingAddress: {
      type: DataTypes.JSON,
      allowNull: true
    },
    discountCodes: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'orders',
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
        fields: ['customerId']
      },
      {
        fields: ['shopifyCreatedAt']
      }
    ]
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    Order.belongsTo(models.Customer, { foreignKey: 'customerId' });
  };

  return Order;
};