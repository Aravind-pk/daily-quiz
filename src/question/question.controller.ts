import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { QuestionService } from './question.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('questions')
export class QuestionController {
    constructor( private questionService: QuestionService){}

    @Get('today')
    getDailyQuestion(@GetUser() user: User){
        return this.questionService.getDaily(user);
    }

    @Post('answer')
    answerQuestion(){
        return this.questionService.answerQuestion();
    }

    @Post('answer-multiple')
    answerQuestions(){
        return this.questionService.answerQuestion();
    }

}
