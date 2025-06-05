import { Sale } from '../models/sale.model.js';
import { Staff } from '../models/staff.model.js';

// Obtener todas las ventas
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [{ model: Staff, as: 'user', attributes: ['staff_id', 'first_name', 'last_name'] }],
      order: [['date', 'DESC']]
    });
    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
  }
};

// Obtener una venta por ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id, {
      include: [{ model: Staff, as: 'user', attributes: ['staff_id', 'first_name', 'last_name'] }]
    });
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
    res.status(200).json({ sale });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la venta', error: error.message });
  }
};

// Crear una nueva venta
export const createSale = async (req, res) => {
  try {
    const {
      sale_id,
      user_id,
      client_id,
      product_type,
      quantity,
      unit,
      unit_price,
      date,
      payment_method,
      payment_status,
      notes
    } = req.body;

    // Validaciones básicas
    if (!sale_id || !user_id || !client_id || !product_type || !quantity || !unit || !unit_price || !date) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    if (client_id.length !== 10) {
      return res.status(400).json({ message: 'La cédula del cliente debe tener 10 dígitos' });
    }
    // Calcular total
    const total = parseFloat(quantity) * parseFloat(unit_price);

    // Verificar unicidad de sale_id
    const exists = await Sale.findOne({ where: { sale_id } });
    if (exists) {
      return res.status(409).json({ message: 'Ya existe una venta con ese ID' });
    }

    const newSale = await Sale.create({
      sale_id,
      user_id,
      client_id,
      product_type,
      quantity,
      unit,
      unit_price,
      total,
      date,
      payment_method,
      payment_status,
      notes
    });
    res.status(201).json({ message: 'Venta registrada exitosamente', sale: newSale });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la venta', error: error.message });
  }
};

// Actualizar una venta
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id);
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
    const {
      client_id,
      product_type,
      quantity,
      unit,
      unit_price,
      date,
      payment_method,
      payment_status,
      notes
    } = req.body;
    if (client_id && client_id.length !== 10) {
      return res.status(400).json({ message: 'La cédula del cliente debe tener 10 dígitos' });
    }
    // Calcular total si se actualiza cantidad o precio
    let total = sale.total;
    if (quantity !== undefined && unit_price !== undefined) {
      total = parseFloat(quantity) * parseFloat(unit_price);
    } else if (quantity !== undefined) {
      total = parseFloat(quantity) * parseFloat(sale.unit_price);
    } else if (unit_price !== undefined) {
      total = parseFloat(sale.quantity) * parseFloat(unit_price);
    }
    await sale.update({
      client_id,
      product_type,
      quantity,
      unit,
      unit_price,
      total,
      date,
      payment_method,
      payment_status,
      notes
    });
    res.status(200).json({ message: 'Venta actualizada', sale });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la venta', error: error.message });
  }
};

// Eliminar una venta
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id);
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
    await sale.destroy();
    res.status(200).json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la venta', error: error.message });
  }
}; 