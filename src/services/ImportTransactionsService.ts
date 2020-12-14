import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute() {
    // TODO
    const csvFilePath = path.resolve(__dirname, '..', '..', 'mock', 'text.csv');

    const readCSVStream = fs.createReadStream(csvFilePath);
    console.log(readCSVStream);
  }
}

export default ImportTransactionsService;
