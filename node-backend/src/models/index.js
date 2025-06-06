import { Person, PersonSchema } from './person.model.js';
import { Supplier, SupplierSchema } from './supplier.model.js';
import { City, CitySchema } from './city.model.js';
import { State, StateSchema } from './state.model.js';
import { Country, CountrySchema } from './country.model.js';
import { Staff, StaffSchema } from './staff.model.js';
import { Product, ProductSchema } from './product.model.js';
import { Goat, GoatSchema } from './goat.model.js';
import { Sale, SaleSchema } from './sale.model.js';
import { Vaccine, VaccineSchema } from './vaccine.model.js';
import { Output, OutputSchema } from './output.model.js';
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
    Sale.init(SaleSchema, Sale.config(sequelize));
    Vaccine.init(VaccineSchema, Vaccine.config(sequelize));
    Output.init(OutputSchema, Output.config(sequelize));
    
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
    // Relación Goat-Vaccine
    Goat.hasMany(Vaccine, { as: 'vaccines', foreignKey: 'goat_id' });
    Vaccine.belongsTo(Goat, { as: 'goat', foreignKey: 'goat_id' });

    // Sale asociaciones
    Sale.belongsTo(Staff, { as: 'user', foreignKey: 'user_id' });
    Staff.hasMany(Sale, { as: 'sales', foreignKey: 'user_id' });

    // Relación Product-Output usando product_id
    Product.hasMany(Output, { as: 'outputs', foreignKey: 'product_id', sourceKey: 'product_id' });
    Output.belongsTo(Product, { as: 'product', foreignKey: 'product_id', targetKey: 'product_id' });
    // Relación Staff-Output usando staff_id
    Staff.hasMany(Output, { as: 'outputs', foreignKey: 'employee_id', sourceKey: 'staff_id' });
    Output.belongsTo(Staff, { as: 'employee', foreignKey: 'employee_id', targetKey: 'staff_id' });

    // Verificar si las tablas existen y crearlas si no existen
    const models = [Person, Supplier, City, State, Country, Staff, Product, Goat, Sale, Vaccine, Output];
    
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

