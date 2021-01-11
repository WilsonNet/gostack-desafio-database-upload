import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.findOne(id);
    if (!transaction) {
      console.log('Chegou aqui');
      throw new AppError('Transaction not found', 401);
    }
    await transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
