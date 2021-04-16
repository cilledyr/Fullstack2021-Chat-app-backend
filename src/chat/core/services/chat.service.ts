import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatMessage } from '../models/chat-message.model';
import { ChatUser } from '../models/chat-user.model';
import { IChatService } from '../primary-ports/chat.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import Client from '../../infrastructure/client.entity';
import { Repository } from 'typeorm';
import Message from '../../infrastructure/message.entity';
import { constants } from 'http2';

@Injectable()
export class ChatService implements IChatService {
  users: ChatUser[] = [];
  allMessages: ChatMessage[] = [];

  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async newMessage(msg: string, sender: string): Promise<ChatMessage> {
    const theSender = await this.clientRepository.findOne(sender);

    if (theSender) {
      let message = this.messageRepository.create();
      message.chatUser = theSender;
      message.message = msg;
      message = await this.messageRepository.save(message);
      return message;
    }
    throw new HttpException('Could not find this sender', HttpStatus.NOT_FOUND);

    /*const theChatMessage: ChatMessage = {
      message: msg,
      chatUser: this.users.find((c) => c.id === sender),
    };
    this.allMessages.push(theChatMessage);
    return theChatMessage;*/
  }
  async newUser(theUser: ChatUser): Promise<ChatUser> {
    const clientFromDb = await this.clientRepository.findOne({
      id: theUser.id,
    });
    if (clientFromDb) {
      return JSON.parse(JSON.stringify(clientFromDb));
    }
    const chatClientFoundByName = await this.clientRepository.findOne({
      nickName: theUser.nickName,
    });
    if (chatClientFoundByName) {
      throw new Error('Nickname is already used.');
    }
    let client = this.clientRepository.create();
    client.nickName = theUser.nickName;
    client.typing = false;
    client = await this.clientRepository.save(client);
    const newChatUser = JSON.parse(JSON.stringify(client));
    return newChatUser;

    /*const clientFromDb = await this.clientRepository.findOne(theUser.id);
    if (!clientFromDb) {
      let client = this.clientRepository.create();
      client.nickName = theUser.nickName;
      //client.id = theId;
      client.typing = false;
      client = await this.clientRepository.save(client);
      return client;
    }
    if (theUser.id) {
      if (clientFromDb) {
        return {
          id: clientFromDb.id,
          nickName: clientFromDb.nickName,
          typing: false,
        };
      } else {
        throw new Error('Nickname is already used.');
      }
    }*/

    /*const chatClient = this.users.find(
      (c) => c.nickName === theNickName && c.id === theId,
    );
    if (chatClient) {
      return chatClient;
    }
    else if(this.users.find(c => c.nickName === theNickName)){
      throw new Error('Nickname allready in use.');
    }
    else {
      const user: ChatUser = {
        nickName: theNickName,
        id: theId,
        typing: false,
      };*/
    //this.users.push(user);
  }

  async getUsers(): Promise<ChatUser[]> {
    const allClients = await this.clientRepository.find();
    const chatUsers: ChatUser[] = JSON.parse(JSON.stringify(allClients));
    return chatUsers;
  }

  async getMessages(): Promise<ChatMessage[]> {
    const allMessages = await this.messageRepository.find();
    const messages: ChatMessage[] = JSON.parse(JSON.stringify(allMessages));
    return messages;
  }

  async deleteUser(theId: string): Promise<void> {
    const userToDelete = await this.clientRepository.findOne(theId);
    await this.messageRepository.delete({ chatUser: userToDelete });
    await this.clientRepository.delete(theId);
  }

  async updateTyping(typing: boolean, id: string): Promise<ChatUser> {
    const theChatUser = await this.clientRepository.findOne(id);
    theChatUser.typing = typing;
    await this.clientRepository.update(id, theChatUser);
    const updatedUser = await this.clientRepository.findOne(id);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException(
      'Could not find user to update',
      HttpStatus.NOT_FOUND,
    );
    /*const chatUser = this.users.find((c) => c.id === id);
    if (chatUser && chatUser.typing !== typing) {
      chatUser.typing = typing;
      return chatUser;
    }
    return undefined; */
  }
}
