import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { QuestionModule } from './question/question.module';
import { UserProgressModule } from './user-progress/user-progress.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal:true
    }),
    AuthModule, 
    UserModule, 
    PrismaModule, QuestionModule, UserProgressModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
