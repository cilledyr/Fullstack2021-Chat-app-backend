import { ChatMessage } from '../models/chat-message.model';
import { ChatUser } from '../models/chat-user.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  newMessage(msg: string, sender: string): ChatMessage;

  newUser(theId: string, theNickName: string): ChatUser;

  getUsers(): ChatUser[];

  getMessages(): ChatMessage[];

  deleteUser(id: string): void;

  updateTyping(typing: boolean, id: string): ChatUser;

}
