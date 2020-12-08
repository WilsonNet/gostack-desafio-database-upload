// import AppError from '../errors/AppError';

import Transaction, { TransactionType } from '../models/Transaction';

interface Request {
  type: 'income' | 'outcome';
  title: string;
  category: string;
  value: number;
}

class CreateTransactionService {
  public async execute({
    type,
    title,
    category,
    value,
  }: Request): Promise<Transaction> {
    // TODO
  }
}

export default CreateTransactionService;
