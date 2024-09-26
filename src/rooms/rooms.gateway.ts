import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/auth/auth.guard';
import { RoomsService } from './rooms.service';
@UseGuards(WsAuthGuard)
@WebSocketGateway()
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly roomsService: RoomsService) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(RoomsGateway.name);
  private readonly clients: Map<string, Socket> = new Map();
  afterInit(server: any) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: any) {
    this.clients.delete(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    const { roomId } = payload;
    const user = client['user'];
    client.to(roomId).emit('message', {
      message: `${user.username} joined the room: ${roomId}`,
      payload: payload,
    });
  }

  @SubscribeMessage('room')
  async handleJoinRoom(client: Socket, payload: any) {
    const { roomId, action } = payload;
    const user = client['user'];
    const room = await this.roomsService.get(roomId);
    if (room) {
      const isIn = room.participants.some(
        (id) => id.toString() === user._id.toString(),
      );
      if (isIn) {
        client[action](roomId);
      }
    }
  }
}
