import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
export default class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find();

    function calculateBalance(
      accumulator: Balance,
      transaction: Transaction,
    ): Balance {
      const { total, income, outcome } = accumulator;

      if (transaction.type === 'income') {
        return {
          ...accumulator,
          income: income + transaction.value,
          total: total + transaction.value,
        };
      }
      return {
        ...accumulator,
        outcome: outcome + transaction.value,
        total: total - transaction.value,
      };
    }

    const balance = transactions.reduce(calculateBalance, {
      income: 0,
      outcome: 0,
      total: 0,
    });

    return balance;
  }
}
