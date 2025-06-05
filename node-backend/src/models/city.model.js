import { Model, DataTypes, Sequelize } from 'sequelize';

class City extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'City',
      tableName: 'cities',
      timestamps: true
    };
  }
}

const CitySchema = {
  id: {
    type: DataTypes.STRING(3),
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  state_id: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'state_id',
    references: {
      model: 'states',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
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

export { City, CitySchema }; 