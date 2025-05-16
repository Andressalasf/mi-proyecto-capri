import { Supplier } from '../models/supplier.model.js';
import { City } from '../models/city.model.js';
import { State } from '../models/state.model.js';
import { Country } from '../models/country.model.js';
import { Op } from 'sequelize';

// Obtener todos los proveedores
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'name']
        },
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'name']
        }
      ]
    });
    
    return res.status(200).json({
      suppliers
    });
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return res.status(500).json({
      message: 'Error al obtener proveedores',
      error: error.message
    });
  }
};

// Obtener un proveedor por ID
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const supplier = await Supplier.findByPk(id, {
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'name']
        },
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!supplier) {
      return res.status(404).json({
        message: 'Proveedor no encontrado'
      });
    }
    
    return res.status(200).json({
      supplier
    });
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    return res.status(500).json({
      message: 'Error al obtener proveedor',
      error: error.message
    });
  }
};

// Crear un nuevo proveedor
export const createSupplier = async (req, res) => {
  try {
    const { 
      supplier_id, 
      name, 
      phone, 
      email, 
      city_id, 
      state_id, 
      country_id, 
      nit, 
      address 
    } = req.body;
    
    // Validar datos requeridos
    if (!supplier_id || !name || !email || !city_id || !state_id || !country_id || !nit) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios'
      });
    }
    
    // Verificar si ya existe un proveedor con ese supplier_id o nit
    const existingSupplier = await Supplier.findOne({
      where: {
        [Op.or]: [
          { supplier_id },
          { nit }
        ]
      }
    });
    
    if (existingSupplier) {
      return res.status(409).json({
        message: 'Ya existe un proveedor con ese ID o NIT'
      });
    }
    
    // Crear el proveedor
    const newSupplier = await Supplier.create({
      supplier_id,
      name,
      phone,
      email,
      city_id,
      state_id,
      country_id,
      nit,
      address
    });
    
    return res.status(201).json({
      message: 'Proveedor creado exitosamente',
      supplier: newSupplier
    });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    return res.status(500).json({
      message: 'Error al crear proveedor',
      error: error.message
    });
  }
};

// Actualizar un proveedor
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      phone, 
      email, 
      city_id, 
      state_id, 
      country_id, 
      address 
    } = req.body;
    
    // Buscar el proveedor
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.status(404).json({
        message: 'Proveedor no encontrado'
      });
    }
    
    // Actualizar datos
    if (name) supplier.name = name;
    if (phone) supplier.phone = phone;
    if (email) supplier.email = email;
    if (city_id) supplier.city_id = city_id;
    if (state_id) supplier.state_id = state_id;
    if (country_id) supplier.country_id = country_id;
    if (address) supplier.address = address;
    
    await supplier.save();
    
    return res.status(200).json({
      message: 'Proveedor actualizado exitosamente',
      supplier
    });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    return res.status(500).json({
      message: 'Error al actualizar proveedor',
      error: error.message
    });
  }
};

// Eliminar un proveedor
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el proveedor
    const supplier = await Supplier.findByPk(id);
    
    if (!supplier) {
      return res.status(404).json({
        message: 'Proveedor no encontrado'
      });
    }
    
    // Eliminar el proveedor
    await supplier.destroy();
    
    return res.status(200).json({
      message: 'Proveedor eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    return res.status(500).json({
      message: 'Error al eliminar proveedor',
      error: error.message
    });
  }
}; 