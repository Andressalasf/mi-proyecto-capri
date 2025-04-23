import { Model, DataTypes, Sequelize } from 'sequelize';

class Person extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Person',
      tableName: 'persons',
      timestamps: true
    };
  }
}

const PersonSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name'
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name'
  },
  surname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
};

export { Person, PersonSchema }; 