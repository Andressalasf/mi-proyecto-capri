import { Model, DataTypes, Sequelize } from 'sequelize';

class Country extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Country',
      tableName: 'countries',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]
    };
  }
}

const CountrySchema = {
  id: {
    type: DataTypes.STRING(2),
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at'
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
};

export { Country, CountrySchema }; 