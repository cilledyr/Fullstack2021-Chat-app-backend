import { ChatMessage } from '../models/chat-message.model';
import { ChatUser } from '../models/chat-user.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  newMessage(msg: string, sender: string): Promise<ChatMessage>;

  newUser(chatUser: ChatUser): Promise<ChatUser>;

  getUsers(): Promise<ChatUser[]>;

  getMessages(): Promise<ChatMessage[]>;

  deleteUser(id: string): void;

  updateTyping(typing: boolean, id: string): Promise<ChatUser>;

}
