import { Model, DataTypes, Sequelize } from 'sequelize';

class Product extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true
    };
  }
}

const ProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  product_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
    field: 'product_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Alimento', 'Medicamento', 'Suplemento', 'Insumo', 'Equipo', 'Otro'),
    allowNull: false
  },
  unit: {
    type: DataTypes.ENUM('kg', 'g', 'L', 'ml', 'unidad', 'dosis', 'frasco'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  min_stock: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'min_stock'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expiry_date'
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'supplier_id',
    references: {
      model: 'suppliers',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
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

export { Product, ProductSchema }; 