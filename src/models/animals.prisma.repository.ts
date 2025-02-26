/* eslint-disable @typescript-eslint/no-unused-vars */
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import createDebug from 'debug';
import { Animal } from './animal.type.js';
import type { Repository } from './repository.type.js';
import { PrismaClient, animals } from '@prisma/client';

const debug = createDebug('demo:repository:animals');

type AnimalRow = Animal & RowDataPacket;

export class AnimalPrismaRepo implements Repository<Animal> {
    connection: PrismaClient;
    constructor() {
        debug('Instanciando repo for animals');
        this.connection = new PrismaClient();
    }

    private animalRowToAnimal(row: animals): Animal {
        return {
            id: row.id,
            name: row.name,
            englishName: row.englishName,
            sciName: row.sciName,
            diet: row.diet,
            lifestyle: row.lifestyle as 'Diurno' | 'Nocturno',
            location: row.location,
            slogan: row.slogan as string,
            group: row.group_,
            image: row.image,
        };
    }

    async read(): Promise<Animal[]> {
        const rows = await this.connection.animals.findMany();
        const animals = rows.map((row) => this.animalRowToAnimal(row));
        return animals;
    }

    async readById(id: string): Promise<Animal> {
        const rows = await this.connection.animals.findUniqueOrThrow({
            where: {
                id: id,
            },
        });

        const animal = this.animalRowToAnimal(row);
        return animal;
    }

    async create(data: Omit<Animal, 'id'>): Promise<Animal> {
        const uuid = crypto.randomUUID();
        const q = `insert into animals (
                    animalID,
                    name,
                    englishName,
                    sciName,
                    diet,
                    lifestyle,
                    location,
                    slogan,
                    bioGroup,
                    image) 
                VALUES (UUID_TO_BIN('${uuid}'), ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        debug('Query:', q);
        await Animal.parseAsync({ ...data, id: '0' });
        const [result] = await this.connection.query<ResultSetHeader>(q, [
            data.name,
            data.englishName,
            data.sciName,
            data.diet,
            data.lifestyle,
            data.location,
            data.slogan,
            data.group,
            data.image,
        ]);

        if (result.affectedRows !== 1) {
            throw new Error('Animal not created');
        }
        const animal = await this.readById(uuid);
        return animal;
    }

    async update(
        id: string,
        data: Partial<Omit<Animal, 'id'>>,
    ): Promise<Animal> {
        await Animal.partial().parseAsync({ ...data, id });
        const validFields: Record<string, string> = {
            name: 'name',
            englishName: 'englishName',
            sciName: 'sciName',
            diet: 'diet',
            lifestyle: 'lifestyle',
            location: 'location',
            slogan: 'slogan',
            group: 'bioGroup',
            image: 'image',
        };

        const fields: string[] = [];
        const values: unknown[] = [];

        Object.entries(data).forEach(([key, value]) => {
            if (!validFields[key]) {
                throw new Error(`Invalid search field: ${key}`);
            }
            fields.push(`${validFields[key]} = ?`);
            values.push(value);
        });

        const q = `update animals set ${fields.join(', ')}
        where animalID = UUID_TO_BIN(?);`;

        const [result] = await this.connection.query<ResultSetHeader>(q, [
            ...values,
            id,
        ]);

        if (result.affectedRows !== 1) {
            throw new Error('Animal not updated');
        }

        console.log('Animal updated with id:', id);
        const animal = await this.readById(id);
        return animal;
    }

    async delete(id: string): Promise<Animal> {
        const animal = await this.readById(id);

        const q = `delete from animals where animalID = UUID_TO_BIN(?);`;
        const [result] = await this.connection.query<ResultSetHeader>(q, [id]);

        if (result.affectedRows !== 1) {
            throw new Error('Animal not deleted');
        }

        console.log('Animal deleted with id:', id);
        return animal;
    }
}
