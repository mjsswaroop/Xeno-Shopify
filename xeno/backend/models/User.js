// const { DataTypes } = require('sequelize');
// const bcrypt = require('bcryptjs');

// module.exports = (sequelize) => {
//   const User = sequelize.define('User', {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     firstName: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     lastName: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     role: {
//       type: DataTypes.ENUM('admin', 'user'),
//       defaultValue: 'user'
//     },
//     tenantId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'tenants',
//         key: 'id'
//       }
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true
//     },
//     lastLoginAt: {
//       type: DataTypes.DATE,
//       allowNull: true
//     }
//   }, {
//     tableName: 'users',
//     timestamps: true,
//     hooks: {
//       beforeCreate: async (user) => {
//         user.password = await bcrypt.hash(user.password, 12);
//       },
//       beforeUpdate: async (user) => {
//         if (user.changed('password')) {
//           user.password = await bcrypt.hash(user.password, 12);
//         }
//       }
//     }
//   });

//   User.prototype.validatePassword = async function(password) {
//     return bcrypt.compare(password, this.password);
//   };

//   User.associate = (models) => {
//     User.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
//   };

//   return User;
// };










const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tenants', // Use the model name
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
  };

  return User;
};
