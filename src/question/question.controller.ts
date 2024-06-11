import { Controller, Get, Post } from '@nestjs/common';
import { get } from 'http';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
    constructor( private questionService: QuestionService){}

    @Get('today')
    getDailyQuestion(){
        return this.questionService.getDaily();
    }

    @Post('answer')
    answerQuestions(){
        return this.questionService.answerQuestion();
    }

}
