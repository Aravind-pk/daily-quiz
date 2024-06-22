import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal:true
    }),
    AuthModule, 
    UserModule, 
    PrismaModule, UserProgressModule, QuizModule, QuestionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
