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

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  userMap: Map<string, string> = new Map<string, string>(); //id, name
  allMessages: string[] = [];

  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() message: string): string {
    console.log(message);
    this.allMessages.push(message);
    this.server.emit('newMessage', message);
    return message + 'Hello';
  }

  @SubscribeMessage('name')
  handleNameEvent(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log(name);
    this.userMap.set(client.id, name);
    this.server.emit('clients', Array.from(this.userMap.values()));
    console.log('Map: ', this.userMap);
    return 'Hello' + name;
  }

  handleConnection(client: Socket, ...args): any {
    console.log('Client Connect', client.id);
    client.emit('allMessages', this.allMessages);
  }

  handleDisconnect(client: any): any {
    this.userMap.delete(client.id);
    this.server.emit('clients', this.userMap.values());
    console.log('Client Disconnect', client.id);
  }
}
