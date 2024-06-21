import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { AnswerQuestionReqDto } from './dto';
import { QuizService } from './quiz.service';

@UseGuards(JwtGuard)
@Controller('quiz')
export class QuizController {
    constructor (private quizService: QuizService){}

    @Get('today')
    getDailyQuestion(@GetUser() user: User){
        return this.quizService.getDaily(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('answer')
    answerQuestion(@Body() answerQuestionReq: AnswerQuestionReqDto ,@GetUser() user: User ){
        return this.quizService.answerQuestion(user , answerQuestionReq);
    }

    @Post('answer-multiple')
    answerQuestions(){
        return this.quizService.answerQuestions();
    }

}
