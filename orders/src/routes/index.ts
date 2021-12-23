import express, { Request, Response } from 'express';
import { requireAuth } from '@ay-ms-pain/common';
import { Order } from '../models/orders';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');
  //populate is for getting the tickets associated with each order, from the ref feature in mongoDB.
  res.status(200).send(orders);
});

export { router as indexOrderRouter };
