import { Staff } from '../models/staff.model.js';
import { Op } from 'sequelize';

// Obtener todos los empleados
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      include: [
        {
          model: Staff,
          as: 'manager',
          attributes: ['staff_id', 'first_name', 'last_name']
        }
      ]
    });
    
    return res.status(200).json({
      staff
    });
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    return res.status(500).json({
      message: 'Error al obtener empleados',
      error: error.message
    });
  }
};

// Obtener un empleado por ID
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const staff = await Staff.findByPk(id, {
      include: [
        {
          model: Staff,
          as: 'manager',
          attributes: ['staff_id', 'first_name', 'last_name']
        }
      ]
    });
    
    if (!staff) {
      return res.status(404).json({
        message: 'Empleado no encontrado'
      });
    }
    
    return res.status(200).json({
      staff
    });
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    return res.status(500).json({
      message: 'Error al obtener empleado',
      error: error.message
    });
  }
};

// Crear un nuevo empleado
export const createStaff = async (req, res) => {
  try {
    const { 
      staff_id,
      first_name,
      middle_name,
      last_name,
      dni,
      salary,
      year_experience,
      specialization,
      period,
      degree,
      staff_type,
      manager_id
    } = req.body;
    
    // Validar datos requeridos
    if (!staff_id || !first_name || !last_name || !dni || !staff_type) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios'
      });
    }
    
    // Verificar si ya existe un empleado con ese staff_id o dni
    const existingStaff = await Staff.findOne({
      where: {
        [Op.or]: [
          { staff_id },
          { dni }
        ]
      }
    });
    
    if (existingStaff) {
      return res.status(409).json({
        message: 'Ya existe un empleado con ese ID o DNI'
      });
    }
    
    // Crear el empleado
    const newStaff = await Staff.create({
      staff_id,
      first_name,
      middle_name,
      last_name,
      dni,
      salary,
      year_experience,
      specialization,
      period,
      degree,
      staff_type,
      manager_id
    });
    
    return res.status(201).json({
      message: 'Empleado creado exitosamente',
      staff: newStaff
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    return res.status(500).json({
      message: 'Error al crear empleado',
      error: error.message
    });
  }
};

// Actualizar un empleado
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name,
      middle_name,
      last_name,
      salary,
      year_experience,
      specialization,
      period,
      degree,
      staff_type,
      manager_id
    } = req.body;
    
    // Buscar el empleado
    const staff = await Staff.findByPk(id);
    
    if (!staff) {
      return res.status(404).json({
        message: 'Empleado no encontrado'
      });
    }
    
    // Actualizar datos
    if (first_name) staff.first_name = first_name;
    if (middle_name !== undefined) staff.middle_name = middle_name;
    if (last_name) staff.last_name = last_name;
    if (salary !== undefined) staff.salary = salary === '' ? null : Number(salary);
    if (year_experience !== undefined) staff.year_experience = year_experience === '' ? null : Number(year_experience);
    if (specialization !== undefined) staff.specialization = specialization;
    if (period !== undefined) staff.period = period;
    if (degree !== undefined) staff.degree = degree === '' ? null : Number(degree);
    if (staff_type) staff.staff_type = staff_type;
    if (manager_id !== undefined) staff.manager_id = manager_id === '' ? null : manager_id;
    
    await staff.save();
    
    return res.status(200).json({
      message: 'Empleado actualizado exitosamente',
      staff
    });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    return res.status(500).json({
      message: 'Error al actualizar empleado',
      error: error.message
    });
  }
};

// Eliminar un empleado
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el empleado
    const staff = await Staff.findByPk(id);
    
    if (!staff) {
      return res.status(404).json({
        message: 'Empleado no encontrado'
      });
    }
    
    // Verificar si el empleado es manager de otros
    const hasSubordinates = await Staff.count({
      where: { manager_id: id }
    });
    
    if (hasSubordinates > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar el empleado porque es manager de otros empleados'
      });
    }
    
    // Eliminar el empleado
    await staff.destroy();
    
    return res.status(200).json({
      message: 'Empleado eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    return res.status(500).json({
      message: 'Error al eliminar empleado',
      error: error.message
    });
  }
}; 