import client from '../database'

export interface User {
  user_id: number | null,
  email: string,
  hashed_password: string,
  is_admin: boolean,
  is_banned: boolean,
}

export class UserRepository {
  async findAll(): Promise<User[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Users'
      const result = await conn.query<User>(sql)
      return result.rows
    } finally {
      conn.release()
    }
  }

  async findById(user_id: number): Promise<User> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM Users WHERE user_id = $1'
      const result = await conn.query<User>(sql, [user_id])
      return result.rows[0]
    } finally {
      conn.release()
    }
  }

  async create(user: User): Promise<User> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO Users(email, hashed_password, is_admin, is_banned) VALUES($1, $2, $3, $4) RETURNING *'
      const result = await conn.query(sql, [user.email, user.hashed_password, user.is_admin, user.is_banned])
      return result.rows[0]
    } finally {
      conn.release()
    }
  }

  async update(user: User): Promise<User> {
    const conn = await client.connect()
    try {
      const sql = 'UPDATE Users SET email=$1, hashed_password=$2, is_admin=$3, is_banned=$4 WHERE user_id = $5 RETURNING *'
      const result = await conn.query<User>(sql, [user.email, user.hashed_password, user.is_admin, user.is_banned, user.user_id])
      return result.rows[0]
    } finally {
      conn.release()
    }
  }

  async delete(user_id: number): Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM Users WHERE user_id = $1'
      await conn.query(sql, [user_id])
    } finally {
      conn.release()
    }
  }
}
