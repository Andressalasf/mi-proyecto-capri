import { Router } from 'express';
import { 
  getAllCountries, 
  getAllStates, 
  getStatesByCountry, 
  getAllCities, 
  getCitiesByState 
} from '../controllers/location.controller.js';

const router = Router();

// Rutas para países
router.get('/countries', getAllCountries);

// Rutas para estados
router.get('/states', getAllStates);
router.get('/countries/:countryId/states', getStatesByCountry);

// Rutas para ciudades
router.get('/cities', getAllCities);
router.get('/states/:stateId/cities', getCitiesByState);

export default router; 