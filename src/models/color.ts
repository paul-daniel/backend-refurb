import client from '../database'

export interface Color {
  color_id: number | null,
  name: string,
  hex_code: string,
}

export class ColorRepository {
  async findAll(): Promise<Color[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Colors'
      const result = await conn.query<Color>(sql)
      return result.rows
    } catch (error) {
      throw new Error(`Unable to fetch all colors: ${error}`)
    } finally {
      conn.release()
    }
  }

  async findById(color_id: number): Promise<Color> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Colors WHERE color_id = $1'
      const result = await conn.query<Color>(sql, [color_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to fetch color with id ${color_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async create(color: Color): Promise<Color> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO Colors(name, hex_code) VALUES($1, $2) RETURNING *'
      const result = await conn.query(sql, [color.name, color.hex_code])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to create color: ${error}`)
    } finally {
      conn.release()
    }
  }

  async update(color: Color): Promise<Color> {
    const conn = await client.connect()
    try {
      let queryBase = 'UPDATE Colors SET'
      let queryParts: string[] = []
      let queryValues: any[] = []
      let counter = 1

      for(const [key, value] of Object.entries(color)) {
        if(value && key !== 'color_id') {
          queryParts.push(`${key} = $${counter}`);
          queryValues.push(value);
          counter++;
        } 
      }

      queryBase += queryParts.join(',')
      queryBase += `WHERE color_id = $${counter} RETURNING *`

      queryValues.push(color.color_id)
      
      const result = await conn.query(queryBase, queryValues)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to update color with id ${color.color_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async delete(color_id: number): Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM Colors WHERE color_id = $1'
      await conn.query(sql, [color_id])
    } catch (error) {
      throw new Error(`Unable to delete color with id ${color_id}: ${error}`)
    } finally {
      conn.release()
    }
  }
}
