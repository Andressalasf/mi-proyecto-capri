import { Vaccine } from '../models/vaccine.model.js';
import { Goat } from '../models/goat.model.js';

// Obtener todas las vacunas
export const getAllVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.findAll({
      include: [{ model: Goat, as: 'goat', attributes: ['id', 'goat_id', 'name'] }],
      order: [['application_date', 'DESC']]
    });
    res.json(vaccines);
  } catch (error) {
    console.error('Error al obtener vacunas:', error);
    res.status(500).json({ message: 'Error al obtener las vacunas' });
  }
};

// Crear una nueva vacuna
export const createVaccine = async (req, res) => {
  try {
    const { goat_id, name, dose, unit, application_date } = req.body;
    if (!goat_id || !name || !dose || !unit || !application_date) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const vaccine = await Vaccine.create({ goat_id, name, dose, unit, application_date });
    res.status(201).json(vaccine);
  } catch (error) {
    console.error('Error al crear vacuna:', error);
    res.status(500).json({ message: 'Error al crear la vacuna' });
  }
}; 