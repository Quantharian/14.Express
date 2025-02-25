// Fichero de configuración de la aplicación para el entorno de desarrollo con MySQL

import { AnimalMySqlRepo } from "./models/animals.mysql.repository";
import data from './data/db.json' with type {type: 'json'}

const repo = new AnimalMySqlRepo(); 

repo.connection.query()

const uuid = crypto.randomUUID();
const q = 'INSERT INTO animals  (animalID, name, englishName, sciName, diet, lifestyle, location, slogan, bioGroup, image'
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';