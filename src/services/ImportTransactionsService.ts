import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';
import CreateTransactionService, {
  Request as TransactionRequest,
} from './CreateTransactionService';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    // TODO
    const createTransactionService = new CreateTransactionService();

    const csvFilePath = path.resolve(__dirname, '..', '..', 'mock', 'test.csv');

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

    // eslint-disable-next-line no-console
    console.log(transactionRequests);

    const transactions = await Promise.all(
      transactionRequests.map(transactionRequest =>
        createTransactionService.execute(transactionRequest),
      ),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
