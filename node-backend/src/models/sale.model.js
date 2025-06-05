import { Model, DataTypes, Sequelize } from 'sequelize';

class Sale extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Sale',
      tableName: 'sales',
      timestamps: true
    };
  }
}

const SaleSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  sale_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
    field: 'sale_id'
  },
  user_id: {
    type: DataTypes.STRING(6), // staff_id
    allowNull: false,
    references: {
      model: 'staff',
      key: 'staff_id'
    }
  },
  client_id: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  product_type: {
    type: DataTypes.ENUM('carne', 'leche', 'cabra de a pie'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unit: {
    type: DataTypes.ENUM('lt', 'kg', 'unidad'),
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  payment_status: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  notes: {
    type: DataTypes.STRING(255),
    allowNull: true
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

export { Sale, SaleSchema }; 