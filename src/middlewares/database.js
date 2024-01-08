import { json } from './json.js'
import fs from 'node:fs/promises'

const databasePath = new URL('../../db.json', import.meta.url)

function updateObject(existingObject, newData) {
  const updatedObject = { ...existingObject, ...newData };

  return updatedObject;
}

export class Database {
  #database = {}

  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      const data = await fs.readFile(databasePath, 'utf8');
      this.#database = JSON.parse(data);
    } catch (error) {
      this.#persist();
    }
  }
  

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table) {
    const data = this.#database[table] ?? {}
    return data;
  }

  insert (table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1, updateObject(this.#database[table][rowIndex], data))

      this.#persist()
    }

  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update_completed_at(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    
    if (rowIndex > -1) {
      if (this.#database[table][rowIndex].completed_at) {
        this.#database[table][rowIndex].completed_at = null
      } else {
        this.#database[table].splice(rowIndex, 1, updateObject(this.#database[table][rowIndex], data))
      }
      this.#persist()
    }
  }

  update_batch(table) {
    // if (Array.isArray(this.#database[table])) {
    //   this.#database[table].push(data)
    // } else {
    //   this.#database[table] = [data]
    // }

    // this.#persist();

    // return data;

    
  }
}