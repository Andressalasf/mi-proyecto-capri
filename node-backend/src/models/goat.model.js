import { Model, DataTypes } from 'sequelize';

class Goat extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Goat',
      tableName: 'goats',
      timestamps: true
    };
  }
}

const GoatSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  goat_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false
  },
  goat_type: {
    type: DataTypes.ENUM('REPRODUCTOR', 'LECHERA', 'CRIA'),
    allowNull: true,
    defaultValue: 'CRIA'
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  milk_production: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  food_consumption: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  vaccinations_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  heat_periods: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  offspring_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'goats',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'deceased'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
};

export { Goat, GoatSchema }; 