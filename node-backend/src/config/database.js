import { Sequelize } from 'sequelize';
import { config } from './config.js';
import setupModels from '../models/index.js';
  
const sequelize = new Sequelize(
    config.dbName, // name database
    config.dbUser, // user database
    config.dbPassword, // password database
    {
      host: config.dbHost,
      dialect: 'postgresql' 
    }
  );

sequelize.sync();
setupModels(sequelize);

export default sequelize;

