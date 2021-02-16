import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '../../core/services/chat.service';
import { ChatUser } from '../../core/models/chat-user.model';
import { WelcomeDto } from '../dtos/welcome.dto';
import {
  IChatService,
  IChatServiceProvider,
} from '../../core/primary-ports/chat.service.interface';
import { Inject } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(IChatServiceProvider) private chatService: IChatService,
  ) {}

  @WebSocketServer() server;

  @SubscribeMessage('message')
  handleChatEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(message);
    const newMsg = this.chatService.newMessage(message, client.id);
    this.server.emit('newMessage', newMsg);
  }

  @SubscribeMessage('typing')
  handleTypingEvent(
    @MessageBody() typing: boolean,
    @ConnectedSocket() client: Socket,
  ): void {
    const chatClient = this.chatService.updateTyping(typing, client.id);
    if (chatClient) {
      this.server.emit('clientTyping', chatClient);
    }
  }

  @SubscribeMessage('name')
  handleNameEvent(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): void {
    try {
      const thisUser = this.chatService.newUser(client.id, name);
      const welcome: WelcomeDto = {
        allUsers: this.chatService.getUsers(),
        allMessages: this.chatService.getMessages(),
        thisClient: thisUser,
      };
      client.emit('welcome', welcome);
      this.server.emit('clients', this.chatService.getUsers());
      //console.log('Map: ', this.userMap.values());
    } catch (e) {
      client.error(e.message);
    }
  }

  handleConnection(client: Socket, ...args): any {
    console.log('Client Connect', client.id);
    //client.emit('allMessages', this.service.getMessages());
  }

  handleDisconnect(client: Socket): any {
    this.chatService.deleteUser(client.id);
    this.server.emit('clients', this.chatService.getUsers());
    //console.log('Client Disconnect', client.id);
  }
}
