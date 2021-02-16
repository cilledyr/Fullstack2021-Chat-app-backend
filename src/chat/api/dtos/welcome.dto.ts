import { ChatUser } from '../../core/models/chat-user.model';
import { ChatMessage } from '../../core/models/chat-message.model';

export interface WelcomeDto {
  allUsers: ChatUser[];
  thisClient: ChatUser;
  allMessages: ChatMessage[];
}
