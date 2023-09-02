import client from '../database'

export interface Storage {
  storage_id: number | null,
  size: string,
}

export class StorageRepository {
  async findAll(): Promise<Storage[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Storages'
      const result = await conn.query<Storage>(sql)
      return result.rows
    } catch (error) {
      throw new Error(`Unable to fetch all storages: ${error}`)
    } finally {
      conn.release()
    }
  }

  async findById(storage_id: number): Promise<Storage> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Storages WHERE storage_id = $1'
      const result = await conn.query<Storage>(sql, [storage_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to fetch storage with id ${storage_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async create(storage: Storage): Promise<Storage> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO Storages(size) VALUES($1) RETURNING *'
      const result = await conn.query(sql, [storage.size])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to create storage: ${error}`)
    } finally {
      conn.release()
    }
  }

  async update(storage: Storage): Promise<Storage> {
    const conn = await client.connect()
    try {
      let queryBase = 'UPDATE Storages SET'
      let queryParts: string[] = []
      let queryValues: any[] = []
      let counter = 1

      for(const [key, value] of Object.entries(storage)) {
        if(value && key !== 'storage_id') {
          queryParts.push(`${key} = $${counter}`);
          queryValues.push(value);
          counter++;
        } 
      }

      queryBase += queryParts.join(',')
      queryBase += `WHERE storage_id = $${counter} RETURNING *`

      queryValues.push(storage.storage_id)
      
      const result = await conn.query(queryBase, queryValues)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to update storage with id ${storage.storage_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async delete(storage_id: number): Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM Storages WHERE storage_id = $1'
      await conn.query(sql, [storage_id])
    } catch (error) {
      throw new Error(`Unable to delete storage with id ${storage_id}: ${error}`)
    } finally {
      conn.release()
    }
  }
}
