import client from '../database'

export interface ScreenSize {
  screen_size_id: number | null,
  size: string,
}

export class ScreenSizeRepository {
  async findAll(): Promise<ScreenSize[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM ScreenSizes'
      const result = await conn.query<ScreenSize>(sql)
      return result.rows
    } catch (error) {
      throw new Error(`Unable to fetch all screen sizes: ${error}`)
    } finally {
      conn.release()
    }
  }

  async findById(screen_size_id: number): Promise<ScreenSize> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM ScreenSizes WHERE screen_size_id = $1'
      const result = await conn.query<ScreenSize>(sql, [screen_size_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to fetch screen size with id ${screen_size_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async create(screenSize: ScreenSize): Promise<ScreenSize> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO ScreenSizes(size) VALUES($1) RETURNING *'
      const result = await conn.query(sql, [screenSize.size])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to create screen size: ${error}`)
    } finally {
      conn.release()
    }
  }

  async update(screenSize: ScreenSize): Promise<ScreenSize> {
    const conn = await client.connect()
    try {
      let queryBase = 'UPDATE ScreenSizes SET'
      let queryParts: string[] = []
      let queryValues: any[] = []
      let counter = 1

      for(const [key, value] of Object.entries(screenSize)) {
        if(value && key !== 'screen_size_id') {
          queryParts.push(`${key} = $${counter}`);
          queryValues.push(value);
          counter++;
        } 
      }

      queryBase += queryParts.join(',')
      queryBase += `WHERE screen_size_id = $${counter} RETURNING *`

      queryValues.push(screenSize.screen_size_id)
      
      const result = await conn.query(queryBase, queryValues)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to update screen size with id ${screenSize.screen_size_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async delete(screen_size_id: number): Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM ScreenSizes WHERE screen_size_id = $1'
      await conn.query(sql, [screen_size_id])
    } catch (error) {
      throw new Error(`Unable to delete screen size with id ${screen_size_id}: ${error}`)
    } finally {
      conn.release()
    }
  }
}
