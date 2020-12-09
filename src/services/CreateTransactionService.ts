// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

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
    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);
    const checkCategoryExists = await categoryRepository.findOne({
      title: category,
    });

    let categoryEntity: Category;

    if (!checkCategoryExists) {
      categoryEntity = categoryRepository.create({
        title: category,
      });
    } else {
      categoryEntity = checkCategoryExists;
    }

    const transaction = await transactionRepository.create({
      type,
      title,
      value,
      category_id: categoryEntity.id,
    });

    return transaction;
  }
}

export default CreateTransactionService;
