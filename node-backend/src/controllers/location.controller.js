import { City } from '../models/city.model.js';
import { State } from '../models/state.model.js';
import { Country } from '../models/country.model.js';

// Obtener todos los países
export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json({
      countries
    });
  } catch (error) {
    console.error('Error al obtener países:', error);
    return res.status(500).json({
      message: 'Error al obtener países',
      error: error.message
    });
  }
};

// Obtener todos los estados
export const getAllStates = async (req, res) => {
  try {
    const states = await State.findAll({
      include: [
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json({
      states
    });
  } catch (error) {
    console.error('Error al obtener estados:', error);
    return res.status(500).json({
      message: 'Error al obtener estados',
      error: error.message
    });
  }
};

// Obtener estados por país
export const getStatesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    
    const states = await State.findAll({
      where: {
        country_id: countryId
      },
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json({
      states
    });
  } catch (error) {
    console.error('Error al obtener estados por país:', error);
    return res.status(500).json({
      message: 'Error al obtener estados por país',
      error: error.message
    });
  }
};

// Obtener todas las ciudades
export const getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll({
      include: [
        {
          model: State,
          as: 'state',
          attributes: ['id', 'name'],
          include: [
            {
              model: Country,
              as: 'country',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json({
      cities
    });
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
    return res.status(500).json({
      message: 'Error al obtener ciudades',
      error: error.message
    });
  }
};

// Obtener ciudades por estado
export const getCitiesByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    
    const cities = await City.findAll({
      where: {
        state_id: stateId
      },
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json({
      cities
    });
  } catch (error) {
    console.error('Error al obtener ciudades por estado:', error);
    return res.status(500).json({
      message: 'Error al obtener ciudades por estado',
      error: error.message
    });
  }
}; 