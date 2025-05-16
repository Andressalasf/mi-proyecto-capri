import { Model, DataTypes, Sequelize } from 'sequelize';

class State extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'State',
      tableName: 'states',
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

const StateSchema = {
  id: {
    type: DataTypes.STRING(3),
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  country_id: {
    type: DataTypes.STRING(2),
    allowNull: false,
    references: {
      model: 'countries',
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

export { State, StateSchema }; 