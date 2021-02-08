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
import { ChatService } from './shared/chat/chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private service: ChatService) {}

  @WebSocketServer() server;

  @SubscribeMessage('message')
  handleChatEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(message);
    const newMsg = this.service.newMessage(message, client.id);
    this.server.emit('newMessage', newMsg);
  }

  @SubscribeMessage('name')
  handleNameEvent(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.service.newUser(client.id, name);
    this.server.emit('clients', this.service.getUsers());
    //console.log('Map: ', this.userMap.values());
  }

  handleConnection(client: Socket, ...args): any {
    console.log('Client Connect', client.id);
    client.emit('allMessages', this.service.getMessages());
  }

  handleDisconnect(client: Socket): any {
    this.service.deleteUser(client.id);
    this.server.emit('clients', this.service.getUsers());
    //console.log('Client Disconnect', client.id);
  }
}
