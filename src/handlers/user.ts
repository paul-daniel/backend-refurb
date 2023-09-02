import express, { Request, Response } from 'express'
import { User, UserRepository } from '../models/user'

const userRepository = new UserRepository()

const findAllUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await userRepository.findAll()
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(500).send(error)
  }
}

const findUserById = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params
    if (!user_id) return res.status(400).send('user_id is required')
    const user = await userRepository.findById(Number(user_id))
    if (!user) return res.status(404).send('User not found')
    res.status(200).json(user)
  } catch (error) {
    res.status(500).send(error)
  }
}

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, hashed_password, is_admin, is_banned } = req.body
    if (!email || !hashed_password) return res.status(400).send('Email and hashed_password are required')
    const newUser: User = { user_id: null, email, hashed_password, is_admin, is_banned }
    const user = await userRepository.create(newUser)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).send(error)
  }
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params
    const { email, hashed_password, is_admin, is_banned } = req.body
    if (!user_id) return res.status(400).send('user_id is required')
    const updatedUser: User = { user_id: Number(user_id), email, hashed_password, is_admin, is_banned }
    const user = await userRepository.update(updatedUser)
    if (!user) return res.status(404).send('User not found')
    res.status(200).json(user)
  } catch (error) {
    res.status(500).send(error)
  }
}

const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params
    if (!user_id) return res.status(400).send('user_id is required')
    await userRepository.delete(Number(user_id))
    res.status(204).send()
  } catch (error) {
    res.status(500).send(error)
  }
}

const userRoutes = (app: express.Application) => {
  app.get('/users', findAllUsers)
  app.get('/users/:user_id', findUserById)
  app.post('/users', createUser)
  app.put('/users/:user_id', updateUser)
  app.delete('/users/:user_id', deleteUserById)
}

export default userRoutes
