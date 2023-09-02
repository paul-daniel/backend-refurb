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
      const sql = 'UPDATE Storages SET size=$1 WHERE storage_id = $2 RETURNING *'
      const result = await conn.query<Storage>(sql, [storage.size, storage.storage_id])
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
