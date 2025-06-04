import sequelize from '../src/config/database.js';
import { Country } from '../src/models/country.model.js';
import { State } from '../src/models/state.model.js';
import { City } from '../src/models/city.model.js';

async function insertData() {
  try {
    console.log('🧹 Iniciando limpieza de tablas...');

    // Limpiar las tablas en orden correcto por las FK
    console.log('🗑️ Eliminando todas las ciudades...');
    await City.destroy({ where: {}, truncate: false });
    
    console.log('🗑️ Eliminando todos los departamentos...');
    await State.destroy({ where: {}, truncate: false });
    
    console.log('🗑️ Eliminando todos los países...');
    await Country.destroy({ where: {}, truncate: false });
    
    console.log('✅ Tablas limpiadas correctamente');

    console.log('📊 Iniciando inserción de datos de ubicación...');

    // Insertar país
    const country = await Country.create({
      id: '057',
      name: 'Colombia'
    });
    console.log('✅ País insertado:', country.name);

    // Insertar estados/departamentos
    const states = await State.bulkCreate([
      { id: '054', country_id: '057', name: 'Norte de Santander' },
      { id: '070', country_id: '057', name: 'Valle del cauca' },
      { id: '011', country_id: '057', name: 'Bogotá D.C.' },
      { id: '005', country_id: '057', name: 'Antioquia' },
      { id: '050', country_id: '057', name: 'Santander' }
    ]);
    console.log('✅ Estados/departamentos insertados:', states.length);

    // Insertar ciudades
    const cities = await City.bulkCreate([
      { id: '498', state_id: '054', name: 'Ocaña' },
      { id: '001', state_id: '054', name: 'Cúcuta' },
      { id: '002', state_id: '005', name: 'Medellín' },
      { id: '003', state_id: '070', name: 'Cali' },
      { id: '004', state_id: '050', name: 'Bucaramanga' }
    ]);
    console.log('✅ Ciudades insertadas:', cities.length);

    // Verificar los datos insertados
    console.log('\n🔍 Verificando datos insertados...');
    const countries = await Country.findAll();
    const statesCount = await State.findAll();
    const citiesCount = await City.findAll();
    
    console.log(`Países en BD: ${countries.length}`);
    console.log(`Departamentos en BD: ${statesCount.length}`);
    console.log(`Ciudades en BD: ${citiesCount.length}`);

    console.log('\n🎉 Proceso completado con éxito');
  } catch (error) {
    console.error('❌ Error general:', error);
    console.error('Detalles:', error.message);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
    console.log('🔌 Conexión cerrada');
  }
}

insertData(); 