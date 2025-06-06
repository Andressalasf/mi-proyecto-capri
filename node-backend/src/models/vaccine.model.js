import { Model, DataTypes } from 'sequelize';

class Vaccine extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Vaccine',
      tableName: 'vaccines',
      timestamps: true
    };
  }
}

const VaccineSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  goat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'goats',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dose: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'lt'
  },
  application_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
};

export { Vaccine, VaccineSchema }; 