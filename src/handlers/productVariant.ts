import express, { Request, Response } from 'express';
import { ProductVariant, ProductVariantRepository } from '../models/productVariant';

const productVariantRepository = new ProductVariantRepository();

const findAllProductVariants = async (_req: Request, res: Response) => {
  try {
    const allProductVariants = await productVariantRepository.findAll();
    res.status(200).json(allProductVariants);
  } catch (error) {
    res.status(500).send(error);
  }
};

const findProductVariantById = async (req: Request, res: Response) => {
  try {
    const { variant_id } = req.params;
    if (!variant_id) return res.status(400).send('variant_id is required');
    const productVariant = await productVariantRepository.findById(Number(variant_id));
    if (!productVariant) return res.status(404).send('ProductVariant not found');
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createProductVariant = async (req: Request, res: Response) => {
  try {
    const { product_base_id, color_id, storage_id, screen_size_id, price, stock_quantity } = req.body;
    if (!product_base_id || !color_id || !storage_id || !screen_size_id || price === undefined || stock_quantity === undefined) {
      return res.status(400).send('All fields are required');
    }
    const newProductVariant: ProductVariant = { variant_id: null, product_base_id, color_id, storage_id, screen_size_id, price, stock_quantity };
    const productVariant = await productVariantRepository.create(newProductVariant);
    res.status(201).json(productVariant);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateProductVariant = async (req: Request, res: Response) => {
  try {
    const { variant_id } = req.params;
    const { product_base_id, color_id, storage_id, screen_size_id, price, stock_quantity } = req.body;
    if (!variant_id) return res.status(400).send('variant_id is required');
    const updatedProductVariant: ProductVariant = { variant_id: Number(variant_id), product_base_id, color_id, storage_id, screen_size_id, price, stock_quantity };
    const productVariant = await productVariantRepository.update(updatedProductVariant);
    if (!productVariant) return res.status(404).send('ProductVariant not found');
    res.status(200).json(productVariant);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteProductVariantById = async (req: Request, res: Response) => {
  try {
    const { variant_id } = req.params;
    if (!variant_id) return res.status(400).send('variant_id is required');
    await productVariantRepository.delete(Number(variant_id));
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const productVariantRoutes = (app: express.Application) => {
  app.get('/productVariants', findAllProductVariants);
  app.get('/productVariants/:variant_id', findProductVariantById);
  app.post('/productVariants', createProductVariant);
  app.put('/productVariants/:variant_id', updateProductVariant);
  app.delete('/productVariants/:variant_id', deleteProductVariantById);
};

export default productVariantRoutes;