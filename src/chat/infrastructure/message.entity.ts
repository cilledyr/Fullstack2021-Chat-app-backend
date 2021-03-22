import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatUser } from '../core/models/chat-user.model';
import Client from './client.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public message: string;

  @ManyToOne(() => Client, (author: Client) => author.messages, {
    eager: true,
  })
  public chatUser: ChatUser;
}

export default Message;
