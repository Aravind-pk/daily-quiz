import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { QuestionService } from './question.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { AnswerQuestionReqDto } from './dto';

@UseGuards(JwtGuard)
@Controller('questions')
export class QuestionController {
    constructor( private questionService: QuestionService){}

    @Get('today')
    getDailyQuestion(@GetUser() user: User){
        return this.questionService.getDaily(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('answer')
    answerQuestion(@Body() answerQuestionReq: AnswerQuestionReqDto ,@GetUser() user: User ){
        return this.questionService.answerQuestion(user , answerQuestionReq);
    }

    @Post('answer-multiple')
    answerQuestions(){
        return this.questionService.answerQuestions();
    }

}
