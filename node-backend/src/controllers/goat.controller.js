import { Goat } from '../models/goat.model.js';

// Obtener todos los caprinos
export const getAllGoats = async (req, res) => {
  try {
    const goats = await Goat.findAll({
      include: [
        {
          model: Goat,
          as: 'parent',
          attributes: ['id', 'goat_id', 'name']
        },
        {
          model: Goat,
          as: 'offspring',
          attributes: ['id', 'goat_id', 'name']
        }
      ]
    });
    res.json(goats);
  } catch (error) {
    console.error('Error al obtener caprinos:', error);
    res.status(500).json({ message: 'Error al obtener los caprinos' });
  }
};

// Obtener un caprino por ID
export const getGoatById = async (req, res) => {
  try {
    const { id } = req.params;
    const goat = await Goat.findByPk(id, {
      include: [
        {
          model: Goat,
          as: 'parent',
          attributes: ['id', 'goat_id', 'name']
        },
        {
          model: Goat,
          as: 'offspring',
          attributes: ['id', 'goat_id', 'name']
        }
      ]
    });

    if (!goat) {
      return res.status(404).json({ message: 'Caprino no encontrado' });
    }

    res.json(goat);
  } catch (error) {
    console.error('Error al obtener caprino:', error);
    res.status(500).json({ message: 'Error al obtener el caprino' });
  }
};

// Crear un nuevo caprino
export const createGoat = async (req, res) => {
  try {
    const {
      goat_id,
      name,
      birth_date,
      sex,
      breed,
      goat_type,
      weight,
      milk_production,
      food_consumption,
      vaccinations_count,
      heat_periods,
      offspring_count,
      parent_id
    } = req.body;

    // Validar campos requeridos
    if (!goat_id || !name || !birth_date || !sex || !breed || !goat_type) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si ya existe un caprino con el mismo ID
    const existingGoat = await Goat.findOne({ where: { goat_id } });
    if (existingGoat) {
      return res.status(400).json({ message: 'Ya existe un caprino con este ID' });
    }

    const goat = await Goat.create({
      goat_id,
      name,
      birth_date,
      sex,
      breed,
      goat_type,
      weight: weight || 0,
      milk_production: milk_production || 0,
      food_consumption: food_consumption || 0,
      vaccinations_count: vaccinations_count || 0,
      heat_periods: heat_periods || 0,
      offspring_count: offspring_count || 0,
      parent_id
    });

    res.status(201).json(goat);
  } catch (error) {
    console.error('Error al crear caprino:', error);
    res.status(500).json({ message: 'Error al crear el caprino' });
  }
};

// Actualizar un caprino
export const updateGoat = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      birth_date,
      sex,
      breed,
      goat_type,
      weight,
      milk_production,
      food_consumption,
      vaccinations_count,
      heat_periods,
      offspring_count,
      parent_id
    } = req.body;

    const goat = await Goat.findByPk(id);
    if (!goat) {
      return res.status(404).json({ message: 'Caprino no encontrado' });
    }

    await goat.update({
      name,
      birth_date,
      sex,
      breed,
      goat_type,
      weight,
      milk_production,
      food_consumption,
      vaccinations_count,
      heat_periods,
      offspring_count,
      parent_id
    });

    res.json(goat);
  } catch (error) {
    console.error('Error al actualizar caprino:', error);
    res.status(500).json({ message: 'Error al actualizar el caprino' });
  }
};

// Eliminar un caprino
export const deleteGoat = async (req, res) => {
  try {
    const { id } = req.params;
    const goat = await Goat.findByPk(id);
    
    if (!goat) {
      return res.status(404).json({ message: 'Caprino no encontrado' });
    }

    // Verificar si el caprino tiene descendientes
    const hasOffspring = await Goat.findOne({ where: { parent_id: id } });
    if (hasOffspring) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el caprino porque tiene descendientes registrados' 
      });
    }

    await goat.destroy();
    res.json({ message: 'Caprino eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar caprino:', error);
    res.status(500).json({ message: 'Error al eliminar el caprino' });
  }
}; 