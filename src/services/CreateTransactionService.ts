// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

export interface Request {
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
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    let categoryEntity: Category;

    const balance = await transactionRepository.getBalance();
    const balanceTotal = balance.total;

    if (type === 'outcome' && balanceTotal < value) {
      throw new AppError('Not enough funds');
    }

    if (!checkCategoryExists) {
      categoryEntity = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(categoryEntity);
    } else {
      categoryEntity = checkCategoryExists;
    }

    const transaction = await transactionRepository.create({
      type,
      title,
      value,
      category_id: categoryEntity.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
