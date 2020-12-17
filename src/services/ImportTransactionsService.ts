import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';
import CreateTransactionService, {
  Request as TransactionRequest,
} from './CreateTransactionService';
import Transaction from '../models/Transaction';
import transactionsRouter from '../routes/transactions.routes';

class ImportTransactionsService {
  async execute(csvFilePath: fs.PathLike): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      ltrim: true,
      rtrim: true,
      columns: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const transactionRequests: TransactionRequest[] = [];
    parseCSV.on('data', data => {
      try {
        transactionRequests.push(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    async function processTransactions(
      requests: TransactionRequest[],
      current: number,
      processedTransactions: Transaction[],
    ): Promise<Transaction[]> {
      if (current >= requests.length) {
        return processedTransactions;
      }
      const currentTransaction = transactionRequests[current];
      const transaction = await createTransactionService.execute(
        currentTransaction,
      );
      const transactionsReturned = processedTransactions.concat(transaction);
      const nextIndex = current + 1;
      return processTransactions(
        transactionRequests,
        nextIndex,
        transactionsReturned,
      );
    }

    const transactions = await processTransactions(transactionRequests, 0, []);

    return transactions;
  }
}

export default ImportTransactionsService;
