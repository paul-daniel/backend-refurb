import client from '../database'

export interface Cart {
  cart_id: number | null,
  user_id: number,
  variant_id: number,
  quantity: number,
}

export class CartRepository {
  async findAll(): Promise<Cart[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Carts'
      const result = await conn.query<Cart>(sql)
      return result.rows
    } catch (error) {
      throw new Error(`Unable to fetch all carts: ${error}`)
    } finally {
      conn.release()
    }
  }

  async findById(cart_id: number): Promise<Cart> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Carts WHERE cart_id = $1'
      const result = await conn.query<Cart>(sql, [cart_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to fetch cart with id ${cart_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async create(cart: Cart): Promise<Cart> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO Carts(user_id, variant_id, quantity) VALUES($1, $2, $3) RETURNING *'
      const result = await conn.query(sql, [cart.user_id, cart.variant_id, cart.quantity])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to create cart: ${error}`)
    } finally {
      conn.release()
    }
  }

  async update(cart: Cart): Promise<Cart> {
    const conn = await client.connect()
    try {
      const sql = 'UPDATE Carts SET user_id=$1, variant_id=$2, quantity=$3 WHERE cart_id = $4 RETURNING *'
      const result = await conn.query<Cart>(sql, [cart.user_id, cart.variant_id, cart.quantity, cart.cart_id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Unable to update cart with id ${cart.cart_id}: ${error}`)
    } finally {
      conn.release()
    }
  }

  async delete(cart_id: number): Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM Carts WHERE cart_id = $1'
      await conn.query(sql, [cart_id])
    } catch (error) {
      throw new Error(`Unable to delete cart with id ${cart_id}: ${error}`)
    } finally {
      conn.release()
    }
  }
}
