import { Person, PersonSchema } from './person.model.js';
import { Supplier, SupplierSchema } from './supplier.model.js';
import { City, CitySchema } from './city.model.js';
import { State, StateSchema } from './state.model.js';
import { Country, CountrySchema } from './country.model.js';
import { Staff, StaffSchema } from './staff.model.js';
import { Product, ProductSchema } from './product.model.js';
import { Goat, GoatSchema } from './goat.model.js';
import { sequelize } from '../config/database.js';

const setupModels = async () => {
  try {
    // Inicializar modelos
    Person.init(PersonSchema, Person.config(sequelize));
    Supplier.init(SupplierSchema, Supplier.config(sequelize));
    City.init(CitySchema, City.config(sequelize));
    State.init(StateSchema, State.config(sequelize));
    Country.init(CountrySchema, Country.config(sequelize));
    Staff.init(StaffSchema, Staff.config(sequelize));
    Product.init(ProductSchema, Product.config(sequelize));
    Goat.init(GoatSchema, Goat.config(sequelize));
    
    // Definir asociaciones
    // Supplier asociaciones
    Supplier.belongsTo(City, { as: 'city', foreignKey: 'city_id' });
    Supplier.belongsTo(State, { as: 'state', foreignKey: 'state_id' });
    Supplier.belongsTo(Country, { as: 'country', foreignKey: 'country_id' });
    Supplier.hasMany(Product, { as: 'products', foreignKey: 'supplier_id' });
    
    // City asociaciones
    City.belongsTo(State, { as: 'state', foreignKey: 'state_id' });
    City.hasMany(Supplier, { as: 'suppliers', foreignKey: 'city_id' });
    
    // State asociaciones
    State.belongsTo(Country, { as: 'country', foreignKey: 'country_id' });
    State.hasMany(City, { as: 'cities', foreignKey: 'state_id' });
    State.hasMany(Supplier, { as: 'suppliers', foreignKey: 'state_id' });
    
    // Country asociaciones
    Country.hasMany(State, { as: 'states', foreignKey: 'country_id' });
    Country.hasMany(Supplier, { as: 'suppliers', foreignKey: 'country_id' });

    // Staff auto-referencia para la relación manager
    Staff.hasMany(Staff, { foreignKey: 'manager_id', as: 'subordinates' });
    Staff.belongsTo(Staff, { foreignKey: 'manager_id', as: 'manager' });
    
    // Product asociaciones
    Product.belongsTo(Supplier, { as: 'supplier', foreignKey: 'supplier_id' });

    // Goat auto-referencia para la relación padre/hijo
    Goat.hasMany(Goat, { foreignKey: 'parent_id', as: 'offspring' });
    Goat.belongsTo(Goat, { foreignKey: 'parent_id', as: 'parent' });

    // Verificar si las tablas existen y crearlas si no existen
    const models = [Person, Supplier, City, State, Country, Staff, Product, Goat];
    
    for (const model of models) {
      try {
        // Usar { force: false } para solo crear la tabla si no existe
        await model.sync({ force: false });
        console.log(`Tabla ${model.name} verificada/creada correctamente`);
      } catch (error) {
        console.error(`Error al verificar/crear tabla ${model.name}:`, error);
      }
    }

    console.log('Base de datos actualizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
    throw error;
  }
};

export default setupModels;

