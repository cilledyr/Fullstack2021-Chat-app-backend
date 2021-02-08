import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatMessage } from '../chat-message.model';
import { ChatUser } from '../chat-user.model';

@Injectable()
export class ChatService {
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
  newUser(theId: string, theNickName: string): void {
    const user: ChatUser = {
      nickName: theNickName,
      id: theId,
    };
    this.users.push(user);
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
}
