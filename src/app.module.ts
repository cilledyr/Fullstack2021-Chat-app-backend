import { Module } from '@nestjs/common';
import { ChatModule } from './chat/api/chat.module';
import { NestFactory } from '@nestjs/core';

@Module({
  imports: [ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

