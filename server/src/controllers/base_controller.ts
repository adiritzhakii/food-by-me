import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const ownerFilter = req.query.owner;
    try {
      if (ownerFilter) {
        const posts = await this.model.find({ owner: ownerFilter });
        res.status(200).send(posts);
      } else {
        const posts = await this.model.find();
        res.status(200).send(posts);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const itemId = req.params.id;
    try {
      const item = await this.model.findById(itemId);
      if (item === null) {
        res.status(404).send("not found");
      } else {
        res.status(200).send(item);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const item = req.body;
    try {
      const newItem = await this.model.create(item);
      res.status(201).send(newItem);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const itemId = req.params.id;
    const updateData = req.body;
    console.log("Update data:", updateData);
    console.log("Item ID:", itemId);
    try {
      const updatedItem = await this.model.findByIdAndUpdate(itemId, updateData, { new: true });
      if (!updatedItem) {
        res.status(404).send("not found");
      }
      res.status(200).send(updatedItem);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    const itemId = req.params.id;
    try {
      await this.model.findByIdAndDelete(itemId);
      res.status(200).send();
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default BaseController;