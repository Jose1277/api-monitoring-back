import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  data: {
    userId?: string;
    authenticated?: boolean;
    authTimeout?: ReturnType<typeof setTimeout>;
  };
}

export interface CheckUpdatePayload {
  endpointId: string;
  isUp: boolean;
  responseTime: number;
  checkedAt: Date;
}

// Time a socket has to send an authenticate event if no token was provided at handshake
const AUTH_TIMEOUT_MS = 5_000;

@WebSocketGateway({
  cors: {
    // In production, restrict this to your frontend domain via env var
    origin: '*',
    credentials: false,
  },
})
export class MonitoringGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(MonitoringGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(socket: AuthenticatedSocket) {
    const token =
      (socket.handshake.auth?.token as string | undefined) ??
      (socket.handshake.query?.token as string | undefined);

    if (token) {
      const authenticated = await this.authenticateSocket(socket, token);
      if (!authenticated) {
        socket.disconnect(true);
      }
      return;
    }

    // No token at handshake — give the client AUTH_TIMEOUT_MS to send authenticate event
    socket.data.authTimeout = setTimeout(() => {
      if (!socket.data.authenticated) {
        this.logger.warn(`Socket ${socket.id} timed out waiting for authentication`);
        socket.emit('error', { message: 'Authentication timeout' });
        socket.disconnect(true);
      }
    }, AUTH_TIMEOUT_MS);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    if (socket.data.authTimeout) {
      clearTimeout(socket.data.authTimeout);
    }

    if (socket.data.userId) {
      this.logger.log(`Socket ${socket.id} disconnected (user: ${socket.data.userId})`);
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuthenticate(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: unknown,
  ) {
    if (socket.data.authenticated) {
      return { success: true };
    }

    const token = (data as { token?: string })?.token;
    if (!token || typeof token !== 'string') {
      socket.emit('error', { message: 'Token required in authenticate event' });
      socket.disconnect(true);
      return { success: false, error: 'Token required' };
    }

    if (socket.data.authTimeout) {
      clearTimeout(socket.data.authTimeout);
      socket.data.authTimeout = undefined;
    }

    const authenticated = await this.authenticateSocket(socket, token);
    if (!authenticated) {
      socket.disconnect(true);
      return { success: false, error: 'Invalid or expired token' };
    }

    return { success: true };
  }

  /**
   * Emits a check:update event only to the sockets belonging to the endpoint owner.
   * The userId is resolved server-side — clients never dictate which room they receive.
   */
  emitCheckUpdate(userId: string, payload: CheckUpdatePayload) {
    this.server.to(`user:${userId}`).emit('check:update', payload);
  }

  private async authenticateSocket(socket: AuthenticatedSocket, token: string): Promise<boolean> {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token, { secret });

      if (!payload?.sub) {
        socket.emit('error', { message: 'Invalid token payload' });
        return false;
      }

      socket.data.userId = payload.sub;
      socket.data.authenticated = true;

      // Join a private room scoped to this user — used for targeted event delivery
      await socket.join(`user:${payload.sub}`);

      this.logger.log(`Socket ${socket.id} authenticated for user ${payload.sub}`);
      socket.emit('authenticated', { userId: payload.sub });
      return true;
    } catch {
      socket.emit('error', { message: 'Invalid or expired token' });
      return false;
    }
  }
}
