import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Message from './message.entity';

@Entity()
class Client {
  @PrimaryColumn({ unique: true })
  public id: string;

  @Column({ unique: true })
  public nickName: string;

  @Column()
  public typing: boolean;

  @OneToMany(() => Message, (message: Message) => message.chatUser)
  public messages: Message[];
}

export default Client;
