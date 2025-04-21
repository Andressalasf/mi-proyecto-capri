import { Person, PersonSchema } from './person.model.js';

function setupModels(sequelize) {
    Person.init(PersonSchema, Person.config(sequelize));
}

export default setupModels;

