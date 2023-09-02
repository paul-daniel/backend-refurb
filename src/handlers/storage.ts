import express, { Request, Response } from 'express';
import { Storage, StorageRepository } from '../models/storage';

const storageRepository = new StorageRepository();

const findAllStorages = async (_req: Request, res: Response) => {
  try {
    const allStorages = await storageRepository.findAll();
    res.status(200).json(allStorages);
  } catch (error) {
    res.status(500).send(error);
  }
};

const findStorageById = async (req: Request, res: Response) => {
  try {
    const { storage_id } = req.params;
    if (!storage_id) return res.status(400).send('storage_id is required');
    const storage = await storageRepository.findById(Number(storage_id));
    if (!storage) return res.status(404).send('Storage not found');
    res.status(200).json(storage);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createStorage = async (req: Request, res: Response) => {
  try {
    const { size } = req.body;
    if (!size) {
      return res.status(400).send('Size is required');
    }
    const newStorage: Storage = { storage_id: null, size };
    const storage = await storageRepository.create(newStorage);
    res.status(201).json(storage);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateStorage = async (req: Request, res: Response) => {
  try {
    const { storage_id } = req.params;
    const { size } = req.body;
    if (!storage_id) return res.status(400).send('storage_id is required');
    const updatedStorage: Storage = { storage_id: Number(storage_id), size };
    const storage = await storageRepository.update(updatedStorage);
    if (!storage) return res.status(404).send('Storage not found');
    res.status(200).json(storage);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteStorageById = async (req: Request, res: Response) => {
  try {
    const { storage_id } = req.params;
    if (!storage_id) return res.status(400).send('storage_id is required');
    await storageRepository.delete(Number(storage_id));
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const storageRoutes = (app: express.Application) => {
  app.get('/storages', findAllStorages);
  app.get('/storages/:storage_id', findStorageById);
  app.post('/storages', createStorage);
  app.put('/storages/:storage_id', updateStorage);
  app.delete('/storages/:storage_id', deleteStorageById);
};

export default storageRoutes;
