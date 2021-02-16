import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatMessage } from '../models/chat-message.model';
import { ChatUser } from '../models/chat-user.model';
import { IChatService } from '../primary-ports/chat.service.interface';

@Injectable()
export class ChatService implements IChatService {
  users: ChatUser[] = [];
  allMessages: ChatMessage[] = [];

  newMessage(msg: string, sender: string): ChatMessage {
    const theChatMessage: ChatMessage = {
      message: msg,
      chatUser: this.users.find((c) => c.id === sender),
    };
    this.allMessages.push(theChatMessage);
    return theChatMessage;
  }
  newUser(theId: string, theNickName: string): ChatUser {
    const chatClient = this.users.find(
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
      };
      this.users.push(user);
      return user;
    }
  }

  getUsers(): ChatUser[] {
    return this.users;
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((c) => c.id != id);
  }

  updateTyping(typing: boolean, id: string) : ChatUser {
    const chatUser = this.users.find(c => c.id === id);
    if(chatUser && chatUser.typing !== typing){
     chatUser.typing = typing;
     return chatUser;
    }
    return undefined;
  }
}
