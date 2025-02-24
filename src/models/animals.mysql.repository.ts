import { Animal } from './animal.type';
import { Repository } from './repository.type';

export class AnimalMySqlRepo implements Repository<Animal> {
    constructor() {
        console.log('Instanciando repo for mysql');
    }
    async read(): Promise<Animal[]> {
        throw new Error('Method not implemented.');
    }
    async readById(id: string): Promise<Animal> {
        throw new Error('Method not implemented.');
    }
    async create(item: Animal): Promise<Animal> {
        throw new Error('Method not implemented.');
    }

    async update(item: Animal): Promise<Animal> {
        throw new Error('Method not implemented.');
    }
    async delete(id: string): Promise<Animal> {
        throw new Error('Method not implemented.');
    }
}
