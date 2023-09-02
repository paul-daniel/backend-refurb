import express, { Request, Response } from 'express';
import { Cart, CartRepository } from '../models/cart';

const cartRepository = new CartRepository();

const findAllCarts = async (_req: Request, res: Response) => {
  try {
    const allCarts = await cartRepository.findAll();
    res.status(200).json(allCarts);
  } catch (error) {
    res.status(500).send(error);
  }
};

const findCartById = async (req: Request, res: Response) => {
  try {
    const { cart_id } = req.params;
    if (!cart_id) return res.status(400).send('cart_id is required');
    const cart = await cartRepository.findById(Number(cart_id));
    if (!cart) return res.status(404).send('Cart not found');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createCart = async (req: Request, res: Response) => {
  try {
    const { user_id, variant_id, quantity } = req.body;
    if (!user_id || !variant_id || quantity === undefined) {
      return res.status(400).send('All fields are required');
    }
    const newCart: Cart = { cart_id: null, user_id, variant_id, quantity };
    const cart = await cartRepository.create(newCart);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCart = async (req: Request, res: Response) => {
  try {
    const { cart_id } = req.params;
    const { user_id, variant_id, quantity } = req.body;
    if (!cart_id) return res.status(400).send('cart_id is required');
    const updatedCart: Cart = { cart_id: Number(cart_id), user_id, variant_id, quantity };
    const cart = await cartRepository.update(updatedCart);
    if (!cart) return res.status(404).send('Cart not found');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteCartById = async (req: Request, res: Response) => {
  try {
    const { cart_id } = req.params;
    if (!cart_id) return res.status(400).send('cart_id is required');
    await cartRepository.delete(Number(cart_id));
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const cartRoutes = (app: express.Application) => {
  app.get('/carts', findAllCarts);
  app.get('/carts/:cart_id', findCartById);
  app.post('/carts', createCart);
  app.put('/carts/:cart_id', updateCart);
  app.delete('/carts/:cart_id', deleteCartById);
};

export default cartRoutes;
