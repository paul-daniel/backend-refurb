import express, {Request, Response} from 'express';
import { ProductBase, ProductBaseRepository } from "../models/productBase";

const productBaseRepository = new ProductBaseRepository()

const findAllProductBase = async (req: Request, res: Response) => {
  try {
    const products = await productBaseRepository.findAll()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error)
  }
}

const findProductBaseById = async (req: Request, res: Response) => {
  try {
    const {product_base_id} = req.params
    if(!product_base_id) res.status(400).json(`product base id is required`)
    const product = await productBaseRepository.findById(Number(product_base_id))
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
}

const createProductBase = async (req: Request, res: Response) => {
  try {
    const  {category_id, name, description, image_url}= req.body
    if(!category_id || !name || !description || !image_url) res.status(400).send('missing parameters')
    const product = await productBaseRepository.create({
      product_base_id : null,
      category_id,
      name,
      description,
      image_url
    } as ProductBase)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateProductBase = async (req: Request, res: Response) => {
  try {
    const {product_base_id} = req.params
    if(!product_base_id) res.status(400).send('product base id is required')
    const {category_id, name, description, image_url}= req.body
    if( !category_id ||!name ||!description ||!image_url) res.status(400).send('there should be at least one parameter to update')
    const product = await productBaseRepository.update({
      product_base_id : Number(product_base_id),
      category_id,
      name,
      description,
      image_url
    } as ProductBase)
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteProductBase = async (req: Request, res: Response) => {
  try {
    const {product_base_id} = req.params
    if(!product_base_id) res.status(400).send('product base id required')
    await productBaseRepository.delete(Number(product_base_id))
    res.status(204).send()
  } catch (error) {
    res.status(500).json(error)
  }
}

const productRoutes = (app: express.Application) => {
  app.get('/product', findAllProductBase)
  app.get('/product/:product_base_id', findProductBaseById)
  app.post('/product', createProductBase)
  app.put('/product/:product_base_id', updateProductBase)
  app.delete('/product/:product_base_id', deleteProductBase)
}