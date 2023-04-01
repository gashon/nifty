import { WebSocket } from "ws";
import logger from '@/lib/logger';

export function closeSocketOnError(target: any, methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      const socket = args.find((arg) => arg instanceof WebSocket);
      logger.error(`Error in ${methodName} for socket ${socket?.url}, ${error}`)
      if (socket) {
        socket.close();
      }
      throw error;
    }
  };

  return descriptor;
}
