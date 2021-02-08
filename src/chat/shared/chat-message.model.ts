import { ChatUser } from './chat-user.model';

export interface ChatMessage {
  message: string;
  chatUser: ChatUser;
}
