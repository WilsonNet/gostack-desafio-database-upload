import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import ImportTransactionsService from '../services/ImportTransactionsService';

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
  try {
    const { id } = request.params;
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    await transactionsRepository.delete({ id });
    return response.json({ message: 'Transaction deleted', status: true });
  } catch (error) {
    return response.json(error);
  }
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
  const importTransactionService = new ImportTransactionsService();
  try {
    const transactions = await importTransactionService.execute();
    return response.json(transactions);
  } catch (error) {
    return response.json(error);
  }
});

export default transactionsRouter;
