import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req:Request, res:Response) => {
  res
    .send({ response: 'Server is up and running.' })
    .status(200)
});

export default router;
