import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(RoomsGateway.name);
  private clients: Map<string, Socket> = new Map();
  private roomManager: Map<string, Socket[]> = new Map();
  afterInit (server: any)
  {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection (client: any, ...args: any[])
  {
    this.clients.set(client.id, client);
  }

  handleDisconnect (client: any)
  {
    this.clients.delete(client.id);
  }

  @SubscribeMessage('message')
  handleMessage (client: Socket, payload: any): string
  {
    client.send("Hello world!");
    return 'Hello world!';
  }
}
