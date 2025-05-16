import sequelize from '../src/config/database.js';
import { Country } from '../src/models/country.model.js';
import { State } from '../src/models/state.model.js';
import { City } from '../src/models/city.model.js';

async function insertData() {
  try {
    console.log('Iniciando inserción de datos de ubicación...');

    // Verificar si las tablas existen
    try {
      await sequelize.query('SELECT 1 FROM "countries" LIMIT 1');
      await sequelize.query('SELECT 1 FROM "states" LIMIT 1');
      await sequelize.query('SELECT 1 FROM "cities" LIMIT 1');
      console.log('Las tablas existen, procediendo con la inserción...');
    } catch (error) {
      console.error('Error al verificar tablas:', error.message);
      console.log('Asegúrate de que las tablas countries, states y cities existan.');
      return;
    }

    // Verificar si ya existen registros
    const countryCount = await Country.count();
    if (countryCount > 0) {
      console.log('Ya existen datos en la tabla countries. Omitiendo inserción de países.');
    } else {
      // Insertar país
      const country = await Country.create({
        id: '057',
        name: 'Colombia'
      });
      console.log('País insertado:', country.name);
    }

    // Verificar estados
    const stateCount = await State.count();
    if (stateCount > 0) {
      console.log('Ya existen datos en la tabla states. Omitiendo inserción de estados.');
    } else {
      // Insertar estados/departamentos
      const states = await State.bulkCreate([
        { id: '054', country_id: '057', name: 'Norte de Santander' },
        { id: '070', country_id: '057', name: 'Valle del cauca' },
        { id: '011', country_id: '057', name: 'Bogotá D.C.' },
        { id: '005', country_id: '057', name: 'Antioquia' },
        { id: '050', country_id: '057', name: 'Santander' }
      ]);
      console.log('Estados/departamentos insertados:', states.length);
    }

    // Verificar ciudades
    const cityCount = await City.count();
    if (cityCount > 0) {
      console.log('Ya existen datos en la tabla cities. Omitiendo inserción de ciudades.');
    } else {
      // Insertar ciudades
      const cities = await City.bulkCreate([
        { id: '498', state_id: '054', country_id: '057', name: 'Ocaña' },
        { id: '001', state_id: '054', country_id: '057', name: 'Cúcuta' },
        { id: '002', state_id: '005', country_id: '057', name: 'Medellín' },
        { id: '003', state_id: '070', country_id: '057', name: 'Cali' },
        { id: '004', state_id: '050', country_id: '057', name: 'Bucaramanga' }
      ]);
      console.log('Ciudades insertadas:', cities.length);
    }

    console.log('Proceso completado con éxito');
  } catch (error) {
    console.error('Error general:', error);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
  }
}

insertData(); 