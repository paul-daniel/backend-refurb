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
      let queryBase = 'UPDATE Users SET'
      let queryParts: string[] = []
      let queryValues: any[] = []
      let counter = 1

      for(const [key, value] of Object.entries(user)) {
        if(value && key !== 'user_id') {
          queryParts.push(`${key} = $${counter}`);
          queryValues.push(value);
          counter++;
        } 
      }

      queryBase += queryParts.join(',')
      queryBase += `WHERE user_id = $${counter} RETURNING *`

      queryValues.push(user.user_id)
      
      const result = await conn.query(queryBase, queryValues)
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
