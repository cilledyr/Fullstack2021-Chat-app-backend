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
import { JoinChatDTO } from '../dtos/join-chat.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(IChatServiceProvider) private chatService: IChatService,
  ) {}

  @WebSocketServer() server;

  @SubscribeMessage('message')
  async handleChatEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log(message);
    const newMsg = await this.chatService.newMessage(message, client.id);
    this.server.emit('newMessage', newMsg);
  }

  @SubscribeMessage('typing')
  async handleTypingEvent(
    @MessageBody() typing: boolean,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const chatClient = await this.chatService.updateTyping(typing, client.id);
    if (chatClient) {
      this.server.emit('clientTyping', chatClient);
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChatEvent(
    @MessageBody() chatClientDTO: JoinChatDTO,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const chatClient: ChatUser = JSON.parse(JSON.stringify(chatClientDTO));
      const thisUser = await this.chatService.newUser(chatClient);
      const allUsers = await this.chatService.getUsers();
      const theMessages = await this.chatService.getMessages();
      const welcome: WelcomeDto = {
        allUsers: allUsers,
        allMessages: theMessages,
        thisClient: thisUser,
      };
      client.emit('welcome', welcome);
      this.server.emit('clients', await this.chatService.getUsers());
      //console.log('Map: ', this.userMap.values());
    } catch (e) {
      client.error(e.message);
    }
  }

  handleConnection(client: Socket, ...args): any {
    client.emit('connect', client.id);
    console.log('Client Connect', client.id);
  }

  async handleDisconnect(client: Socket): Promise<any> {
    await this.chatService.deleteUser(client.id);
    client.emit('disconnect', null);
    this.server.emit('clients', await this.chatService.getUsers());
  }
}
