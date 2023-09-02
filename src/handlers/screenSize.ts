import express, { Request, Response } from 'express';
import { ScreenSize, ScreenSizeRepository } from '../models/screenSize';

const screenSizeRepository = new ScreenSizeRepository();

const findAllScreenSizes = async (_req: Request, res: Response) => {
  try {
    const allScreenSizes = await screenSizeRepository.findAll();
    res.status(200).json(allScreenSizes);
  } catch (error) {
    res.status(500).send(error);
  }
};

const findScreenSizeById = async (req: Request, res: Response) => {
  try {
    const { screen_size_id } = req.params;
    if (!screen_size_id) return res.status(400).send('screen_size_id is required');
    const screenSize = await screenSizeRepository.findById(Number(screen_size_id));
    if (!screenSize) return res.status(404).send('Screen size not found');
    res.status(200).json(screenSize);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createScreenSize = async (req: Request, res: Response) => {
  try {
    const { size } = req.body;
    if (!size) {
      return res.status(400).send('Size is required');
    }
    const newScreenSize: ScreenSize = { screen_size_id: null, size };
    const screenSize = await screenSizeRepository.create(newScreenSize);
    res.status(201).json(screenSize);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateScreenSize = async (req: Request, res: Response) => {
  try {
    const { screen_size_id } = req.params;
    const { size } = req.body;
    if (!screen_size_id) return res.status(400).send('screen_size_id is required');
    const updatedScreenSize: ScreenSize = { screen_size_id: Number(screen_size_id), size };
    const screenSize = await screenSizeRepository.update(updatedScreenSize);
    if (!screenSize) return res.status(404).send('Screen size not found');
    res.status(200).json(screenSize);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteScreenSizeById = async (req: Request, res: Response) => {
  try {
    const { screen_size_id } = req.params;
    if (!screen_size_id) return res.status(400).send('screen_size_id is required');
    await screenSizeRepository.delete(Number(screen_size_id));
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const screenSizeRoutes = (app: express.Application) => {
  app.get('/screenSizes', findAllScreenSizes);
  app.get('/screenSizes/:screen_size_id', findScreenSizeById);
  app.post('/screenSizes', createScreenSize);
  app.put('/screenSizes/:screen_size_id', updateScreenSize);
  app.delete('/screenSizes/:screen_size_id', deleteScreenSizeById);
};

export default screenSizeRoutes;
