import client from '../database'

export interface Category {
  category_id: number | null,
  name: string,
  description: string | null,
}

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Categories'
      const result = await conn.query<Category>(sql)
      return result.rows
    } catch (error) {
      throw new Error(`Unable to fetch all categories: ${error}`)
    } finally {
      conn.release()
    }
  }

  async findById(category_id: number): Promise<Category> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Categories WHERE category_id = $1'
      const result = await conn.query<Category>(sql, [category_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to fetch category with id ${category_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async create(category: Category): Promise<Category> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO Categories(name, description) VALUES($1, $2) RETURNING *'
      const result = await conn.query(sql, [category.name, category.description])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to create category: ${error}`)
    } finally {
      conn.release()
    }
  }

  async update(category: Category): Promise<Category> {
    const conn = await client.connect()
    try {
      let queryBase = 'UPDATE Categories SET'
      let queryParts: string[] = []
      let queryValues: any[] = []
      let counter = 1

      for(const [key, value] of Object.entries(category)) {
        if(value && key !== 'category_id') {
          queryParts.push(`${key} = $${counter}`);
          queryValues.push(value);
          counter++;
        } 
      }

      queryBase += queryParts.join(',')
      queryBase += `WHERE category_id = $${counter} RETURNING *`

      queryValues.push(category.category_id)
      
      const result = await conn.query(queryBase, queryValues)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to update category with id ${category.category_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async delete(category_id: number): Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM Categories WHERE category_id = $1'
      await conn.query(sql, [category_id])
    } catch (error) {
      throw new Error(`Unable to delete category with id ${category_id}: ${error}`)
    } finally {
      conn.release()
    }
  }
}
