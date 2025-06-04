import { Product } from '../models/product.model.js';
import { Supplier } from '../models/supplier.model.js';
import { Op } from 'sequelize';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'supplier_id']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json({
      products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'supplier_id']
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }
    
    return res.status(200).json({
      product
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { 
      product_id, 
      name, 
      category, 
      unit, 
      quantity, 
      min_stock, 
      price, 
      location, 
      expiry_date, 
      supplier_id, 
      description 
    } = req.body;
    
    // Validar datos requeridos
    if (!product_id || !name || !category || !unit || price === undefined) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios: product_id, name, category, unit, price'
      });
    }
    
    // Verificar si ya existe un producto con ese product_id
    const existingProduct = await Product.findOne({
      where: { product_id }
    });
    
    if (existingProduct) {
      return res.status(409).json({
        message: 'Ya existe un producto con ese ID'
      });
    }
    
    // Verificar que el supplier existe si se proporciona
    if (supplier_id) {
      const supplier = await Supplier.findByPk(supplier_id);
      if (!supplier) {
        return res.status(400).json({
          message: 'El proveedor especificado no existe'
        });
      }
    }
    
    // Crear el producto
    const newProduct = await Product.create({
      product_id,
      name,
      category,
      unit,
      quantity: quantity || 0,
      min_stock: min_stock || 0,
      price,
      location,
      expiry_date,
      supplier_id,
      description
    });
    
    return res.status(201).json({
      message: 'Producto creado exitosamente',
      product: newProduct
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      category, 
      unit, 
      quantity, 
      min_stock, 
      price, 
      location, 
      expiry_date, 
      supplier_id, 
      description 
    } = req.body;
    
    // Buscar el producto
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }
    
    // Verificar que el supplier existe si se proporciona
    if (supplier_id) {
      const supplier = await Supplier.findByPk(supplier_id);
      if (!supplier) {
        return res.status(400).json({
          message: 'El proveedor especificado no existe'
        });
      }
    }
    
    // Actualizar datos
    if (name) product.name = name;
    if (category) product.category = category;
    if (unit) product.unit = unit;
    if (quantity !== undefined) product.quantity = quantity;
    if (min_stock !== undefined) product.min_stock = min_stock;
    if (price !== undefined) product.price = price;
    if (location !== undefined) product.location = location;
    if (expiry_date !== undefined) product.expiry_date = expiry_date;
    if (supplier_id !== undefined) product.supplier_id = supplier_id;
    if (description !== undefined) product.description = description;
    
    await product.save();
    
    return res.status(200).json({
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el producto
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }
    
    // Eliminar el producto
    await product.destroy();
    
    return res.status(200).json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

// Actualizar stock de un producto
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    
    if (!quantity || !operation) {
      return res.status(400).json({
        message: 'Faltan campos: quantity y operation (add/subtract)'
      });
    }
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }
    
    const currentQuantity = parseFloat(product.quantity);
    const changeQuantity = parseFloat(quantity);
    
    let newQuantity;
    if (operation === 'add') {
      newQuantity = currentQuantity + changeQuantity;
    } else if (operation === 'subtract') {
      newQuantity = currentQuantity - changeQuantity;
      if (newQuantity < 0) {
        return res.status(400).json({
          message: 'No se puede reducir el stock por debajo de 0'
        });
      }
    } else {
      return res.status(400).json({
        message: 'Operación no válida. Use "add" o "subtract"'
      });
    }
    
    product.quantity = newQuantity;
    await product.save();
    
    return res.status(200).json({
      message: 'Stock actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return res.status(500).json({
      message: 'Error al actualizar stock',
      error: error.message
    });
  }
};

// Obtener productos con stock bajo
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        quantity: {
          [Op.lte]: Product.sequelize.col('min_stock')
        }
      },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'supplier_id']
        }
      ],
      order: [['quantity', 'ASC']]
    });
    
    return res.status(200).json({
      products
    });
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    return res.status(500).json({
      message: 'Error al obtener productos con stock bajo',
      error: error.message
    });
  }
}; 