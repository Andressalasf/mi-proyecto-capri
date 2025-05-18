import { Model, DataTypes } from 'sequelize';

class Staff extends Model {
  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Staff',
      tableName: 'staff',
      schema: 'public',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };
  }
}

const StaffSchema = {
  staff_id: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El ID del empleado es obligatorio'
      }
    }
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El nombre es obligatorio'
      }
    }
  },
  middle_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El apellido es obligatorio'
      }
    }
  },
  dni: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'El DNI es obligatorio'
      }
    }
  },
  salary: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  year_experience: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  specialization: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  period: {
    type: DataTypes.DATE,
    allowNull: true
  },
  degree: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  staff_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: {
        args: [['ADMINISTRATIVO', 'PRACTICANTE']],
        msg: 'El tipo de empleado debe ser ADMINISTRATIVO o PRACTICANTE'
      },
      notNull: {
        msg: 'El tipo de empleado es obligatorio'
      }
    }
  },
  manager_id: {
    type: DataTypes.STRING(6),
    allowNull: true,
    references: {
      model: 'staff',
      key: 'staff_id'
    }
  }
};

export { Staff, StaffSchema }; 