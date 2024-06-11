import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService {

    getDaily() {
        return "daily questions"
    }

    answerQuestion() {
        throw new Error('Method not implemented.');
    }
}
