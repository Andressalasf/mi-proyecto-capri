import { Router } from 'express';
import { Goat } from '../models/goat.model.js';

const router = Router();

// Obtener todos los caprinos
router.get('/goats', async (req, res) => {
  try {
    const goats = await Goat.findAll();
    res.json({ goats });
  } catch (error) {
    console.error('Error al obtener caprinos:', error);
    res.status(500).json({ error: 'Error al obtener caprinos' });
  }
});

// Obtener un caprino por ID
router.get('/goats/:id', async (req, res) => {
  try {
    const goat = await Goat.findByPk(req.params.id);
    if (!goat) {
      return res.status(404).json({ error: 'Caprino no encontrado' });
    }
    res.json({ goat });
  } catch (error) {
    console.error('Error al obtener caprino:', error);
    res.status(500).json({ error: 'Error al obtener caprino' });
  }
});

// Crear un nuevo caprino
router.post('/goats', async (req, res) => {
  try {
    const goat = await Goat.create(req.body);
    res.status(201).json({ goat });
  } catch (error) {
    console.error('Error al crear caprino:', error);
    res.status(500).json({ error: 'Error al crear caprino' });
  }
});

// Actualizar un caprino
router.put('/goats/:id', async (req, res) => {
  try {
    const goat = await Goat.findByPk(req.params.id);
    if (!goat) {
      return res.status(404).json({ error: 'Caprino no encontrado' });
    }
    await goat.update(req.body);
    res.json({ goat });
  } catch (error) {
    console.error('Error al actualizar caprino:', error);
    res.status(500).json({ error: 'Error al actualizar caprino' });
  }
});

// Eliminar una cabra
router.delete('/goats/:id', async (req, res) => {
  try {
    const goat = await Goat.findByPk(req.params.id);
    if (!goat) {
      return res.status(404).json({ message: 'Cabra no encontrada' });
    }

    await goat.destroy();
    res.status(200).json({ 
      success: true,
      id: parseInt(req.params.id)
    });
  } catch (error) {
    console.error('Error al eliminar cabra:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

export default router; 