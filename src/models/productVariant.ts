import client from '../database'

export interface ProductVariant {
  variant_id: number | null,
  product_base_id: number,
  color_id: number,
  storage_id: number,
  screen_size_id: number,
  price: number,
  stock_quantity: number,
}

export class ProductVariantRepository {
  async findAll(): Promise<ProductVariant[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM ProductVariants'
      const result = await conn.query<ProductVariant>(sql)
      return result.rows
    } catch (error) {
      throw new Error(`Unable to fetch all product variants: ${error}`)
    } finally {
      conn.release()
    }
  }

  async findById(variant_id: number): Promise<ProductVariant> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM ProductVariants WHERE variant_id = $1'
      const result = await conn.query<ProductVariant>(sql, [variant_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to fetch product variant with id ${variant_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async create(productVariant: ProductVariant): Promise<ProductVariant> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO ProductVariants(product_base_id, color_id, storage_id, screen_size_id, price, stock_quantity) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
      const result = await conn.query(sql, [productVariant.product_base_id, productVariant.color_id, productVariant.storage_id, productVariant.screen_size_id, productVariant.price, productVariant.stock_quantity])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to create product variant: ${error}`)
    } finally {
      conn.release()
    }
  }

  async update(productVariant: ProductVariant): Promise<ProductVariant> {
    const conn = await client.connect()
    try {
      const sql = 'UPDATE ProductVariants SET product_base_id=$1, color_id=$2, storage_id=$3, screen_size_id=$4, price=$5, stock_quantity=$6 WHERE variant_id = $7 RETURNING *'
      const result = await conn.query<ProductVariant>(sql, [productVariant.product_base_id, productVariant.color_id, productVariant.storage_id, productVariant.screen_size_id, productVariant.price, productVariant.stock_quantity, productVariant.variant_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to update product variant with id ${productVariant.variant_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async delete(variant_id: number): Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM ProductVariants WHERE variant_id = $1'
      await conn.query(sql, [variant_id])
    } catch (error) {
      throw new Error(`Unable to delete product variant with id ${variant_id}: ${error}`)
    } finally {
      conn.release()
    }
  }
}
