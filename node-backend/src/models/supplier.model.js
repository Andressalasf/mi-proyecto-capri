import { Model, DataTypes, Sequelize } from 'sequelize';

class Supplier extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Supplier',
      tableName: 'suppliers',
      timestamps: true
    };
  }
}

const SupplierSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  supplier_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
    field: 'supplier_id'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  city_id: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'city_id',
    references: {
      model: 'cities',
      key: 'id'
    }
  },
  state_id: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'state_id',
    references: {
      model: 'states',
      key: 'id'
    }
  },
  country_id: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'country_id',
    references: {
      model: 'countries',
      key: 'id'
    }
  },
  nit: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.STRING(100),
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

export { Supplier, SupplierSchema }; 