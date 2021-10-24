import { Report } from '../reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  LogInsert() {
    console.log('Inserted User with id ', this.id);
  }

  @AfterUpdate()
  LogUpdate() {
    console.log('Updated User with id ', this.id);
  }

  @AfterRemove()
  LogRemove() {
    console.log('Removed User with id ', this.id);
  }
}
