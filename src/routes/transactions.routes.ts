import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import path from 'path';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/uploadConfig';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();
    return response.json({ transactions, balance });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return response.json({ error: 'Internal server serror' });
  }
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, category, type } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    await transactionsRepository.delete({ id });
    return response.json({ message: 'Transaction deleted', status: true });
  } catch (error) {
    return response.json(error);
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const csvFilePath = request.file.path;

    const importTransactionService = new ImportTransactionsService();
    const transactions = await importTransactionService.execute(csvFilePath);
    return response.json(transactions);
  },
);

export default transactionsRouter;
