import { ChatUser } from './chat-user.model';

export interface ChatMessage {
  id: number;
  message: string;
  chatUser: ChatUser;
}
