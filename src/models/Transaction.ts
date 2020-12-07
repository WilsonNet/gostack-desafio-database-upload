import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from './Category';

export enum TransactionType {
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
    enum: TransactionType,
    default: TransactionType.INCOME,
  })
  type: TransactionType;

  @Column()
  value: number;

  @ManyToMany(() => Category)
  @JoinColumn({ name: 'category_id' })
  @Column()
  category_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}

export default Transaction;
