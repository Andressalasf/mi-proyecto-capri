import { Model, DataTypes } from 'sequelize';

class Output extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Output',
      tableName: 'outputs',
      timestamps: true
    };
  }
}

const OutputSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'products',
      key: 'product_id'
    }
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'staff',
      key: 'staff_id'
    }
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  output_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
};

export { Output, OutputSchema }; 