import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from './Category';

export enum TransactionEnum {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: TransactionEnum,
    default: TransactionEnum.INCOME,
  })
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  @Column()
  category_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}

export default Transaction;
