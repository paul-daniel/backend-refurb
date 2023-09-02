import express, { Request, Response } from 'express'
import { Category, CategoryRepository } from '../models/category'

const categoryRepository = new CategoryRepository()

const findAllCategories = async (_req: Request, res: Response) => {
  try {
    const allCategories = await categoryRepository.findAll()
    res.status(200).json(allCategories)
  } catch (error) {
    res.status(500).send(error)
  }
}

const findCategoryById = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.params
    if (!category_id) return res.status(400).send('category_id is required')
    const category = await categoryRepository.findById(Number(category_id))
    if (!category) return res.status(404).send('Category not found')
    res.status(200).json(category)
  } catch (error) {
    res.status(500).send(error)
  }
}

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    if (!name) return res.status(400).send('Name is required')
    const newCategory: Category = { category_id: null, name, description }
    const category = await categoryRepository.create(newCategory)
    res.status(201).json(category)
  } catch (error) {
    res.status(500).send(error)
  }
}

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.params
    const { name, description } = req.body
    if (!category_id) return res.status(400).send('category_id is required')
    const updatedCategory: Category = { category_id: Number(category_id), name, description }
    const category = await categoryRepository.update(updatedCategory)
    if (!category) return res.status(404).send('Category not found')
    res.status(200).json(category)
  } catch (error) {
    res.status(500).send(error)
  }
}

const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.params
    if (!category_id) return res.status(400).send('category_id is required')
    await categoryRepository.delete(Number(category_id))
    res.status(204).send()
  } catch (error) {
    res.status(500).send(error)
  }
}

const categoryRoutes = (app: express.Application) => {
  app.get('/categories', findAllCategories)
  app.get('/categories/:category_id', findCategoryById)
  app.post('/categories', createCategory)
  app.put('/categories/:category_id', updateCategory)
  app.delete('/categories/:category_id', deleteCategoryById)
}

export default categoryRoutes
