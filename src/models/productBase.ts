import client from '../database'

export interface ProductBase {
  product_base_id: number | null,
  category_id: number,
  name: string,
  description: string | null,
  image_url: string | null,
}

export class ProductBaseRepository {
  async findAll(): Promise<ProductBase[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM ProductBase'
      const result = await conn.query<ProductBase>(sql)
      return result.rows
    } catch (error) {
      throw new Error(`Unable to fetch all product bases: ${error}`)
    } finally {
      conn.release()
    }
  }

  async findById(product_base_id: number): Promise<ProductBase> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM ProductBase WHERE product_base_id = $1'
      const result = await conn.query<ProductBase>(sql, [product_base_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to fetch product base with id ${product_base_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async create(productBase: ProductBase): Promise<ProductBase> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO ProductBase(category_id, name, description, image_url) VALUES($1, $2, $3, $4) RETURNING *'
      const result = await conn.query(sql, [productBase.category_id, productBase.name, productBase.description, productBase.image_url])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to create product base: ${error}`)
    } finally {
      conn.release()
    }
  }

  async update(productBase: ProductBase): Promise<ProductBase> {
    const conn = await client.connect()
    try {
      const sql = 'UPDATE ProductBase SET category_id=$1, name=$2, description=$3, image_url=$4 WHERE product_base_id = $5 RETURNING *'
      const result = await conn.query<ProductBase>(sql, [productBase.category_id, productBase.name, productBase.description, productBase.image_url, productBase.product_base_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to update product base with id ${productBase.product_base_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async delete(product_base_id: number): Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM ProductBase WHERE product_base_id = $1'
      await conn.query(sql, [product_base_id])
    } catch (error) {
      throw new Error(`Unable to delete product base with id ${product_base_id}: ${error}`)
    } finally {
      conn.release()
    }
  }
}
