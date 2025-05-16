import { Person, PersonSchema } from './person.model.js';
import { Supplier, SupplierSchema } from './supplier.model.js';
import { City, CitySchema } from './city.model.js';
import { State, StateSchema } from './state.model.js';
import { Country, CountrySchema } from './country.model.js';

function setupModels(sequelize) {
    // Inicializar modelos
    Person.init(PersonSchema, Person.config(sequelize));
    Supplier.init(SupplierSchema, Supplier.config(sequelize));
    City.init(CitySchema, City.config(sequelize));
    State.init(StateSchema, State.config(sequelize));
    Country.init(CountrySchema, Country.config(sequelize));
    
    // Definir asociaciones
    // Supplier asociaciones
    Supplier.belongsTo(City, { as: 'city', foreignKey: 'city_id' });
    Supplier.belongsTo(State, { as: 'state', foreignKey: 'state_id' });
    Supplier.belongsTo(Country, { as: 'country', foreignKey: 'country_id' });
    
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
}

export default setupModels;

