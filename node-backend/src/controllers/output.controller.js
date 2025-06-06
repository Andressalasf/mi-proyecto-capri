import { Output } from '../models/output.model.js';
import { Product } from '../models/product.model.js';
import { Staff } from '../models/staff.model.js';

// Obtener todas las salidas
export const getAllOutputs = async (req, res) => {
  try {
    const outputs = await Output.findAll({
      include: [
        { model: Product, as: 'product', attributes: ['product_id', 'name', 'quantity', 'unit'] },
        { model: Staff, as: 'employee', attributes: ['staff_id', 'first_name', 'last_name'] }
      ],
      order: [['output_date', 'DESC']]
    });
    res.json(outputs);
  } catch (error) {
    console.error('Error al obtener salidas:', error);
    res.status(500).json({ message: 'Error al obtener las salidas' });
  }
};

// Registrar una nueva salida
export const createOutput = async (req, res) => {
  try {
    const { product_id, employee_id, quantity, output_date } = req.body;
    if (!product_id || !employee_id || !quantity || !output_date) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    // Buscar producto por product_id
    const product = await Product.findOne({ where: { product_id } });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    // Validar stock suficiente
    if (parseFloat(product.quantity) < parseFloat(quantity)) {
      return res.status(400).json({ message: 'No hay suficiente stock para la salida' });
    }
    // Restar cantidad
    product.quantity = parseFloat(product.quantity) - parseFloat(quantity);
    await product.save();
    // Registrar salida
    const output = await Output.create({ product_id, employee_id, quantity, output_date });
    res.status(201).json(output);
  } catch (error) {
    console.error('Error al registrar salida:', error);
    res.status(500).json({ message: 'Error al registrar la salida' });
  }
}; 