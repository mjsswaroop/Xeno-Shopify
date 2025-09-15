const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tenant = sequelize.define('Tenant', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    shopifyStoreName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    shopifyAccessToken: {
      type: DataTypes.STRING,
      allowNull: true // Will be null until OAuth is completed
    },
    shopifyWebhookSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastSyncAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'tenants',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['shopifyStoreName']
      }
    ]
  });

  Tenant.associate = (models) => {
    Tenant.hasMany(models.User, { foreignKey: 'tenantId' });
    Tenant.hasMany(models.Customer, { foreignKey: 'tenantId' });
    Tenant.hasMany(models.Product, { foreignKey: 'tenantId' });
    Tenant.hasMany(models.Order, { foreignKey: 'tenantId' });
  };

  return Tenant;
};