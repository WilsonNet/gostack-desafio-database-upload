import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();
    return response.json({ transactions, balance });
  } catch (error) {
    console.error(error);
    return response.json({ error: 'Internal server serror' });
  }
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  try {
    const { title, value, category } = request.body;
    const type = 'income';

    const createTransactionService = new CreateTransactionService();

    const transaction = await createTransactionService.execute({
      title,
      value,
      type,
      category,
    });

    return response.json(transaction);
  } catch (error) {
    return response.json({ error });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
