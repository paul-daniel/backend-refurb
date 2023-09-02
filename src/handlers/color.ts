import express, { Request, Response } from 'express';
import { Color, ColorRepository } from '../models/color';

const colorRepository = new ColorRepository();

const findAllColors = async (_req: Request, res: Response) => {
  try {
    const allColors = await colorRepository.findAll();
    res.status(200).json(allColors);
  } catch (error) {
    res.status(500).send(error);
  }
};

const findColorById = async (req: Request, res: Response) => {
  try {
    const { color_id } = req.params;
    if (!color_id) return res.status(400).send('color_id is required');
    const color = await colorRepository.findById(Number(color_id));
    if (!color) return res.status(404).send('Color not found');
    res.status(200).json(color);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createColor = async (req: Request, res: Response) => {
  try {
    const { name, hex_code } = req.body;
    if (!name || !hex_code) {
      return res.status(400).send('Name and hex_code are required');
    }
    const newColor: Color = { color_id: null, name, hex_code };
    const color = await colorRepository.create(newColor);
    res.status(201).json(color);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateColor = async (req: Request, res: Response) => {
  try {
    const { color_id } = req.params;
    const { name, hex_code } = req.body;
    if (!color_id) return res.status(400).send('color_id is required');
    const updatedColor: Color = { color_id: Number(color_id), name, hex_code };
    const color = await colorRepository.update(updatedColor);
    if (!color) return res.status(404).send('Color not found');
    res.status(200).json(color);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteColorById = async (req: Request, res: Response) => {
  try {
    const { color_id } = req.params;
    if (!color_id) return res.status(400).send('color_id is required');
    await colorRepository.delete(Number(color_id));
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const colorRoutes = (app: express.Application) => {
  app.get('/colors', findAllColors);
  app.get('/colors/:color_id', findColorById);
  app.post('/colors', createColor);
  app.put('/colors/:color_id', updateColor);
  app.delete('/colors/:color_id', deleteColorById);
};

export default colorRoutes;
