import { IsNotEmpty, IsNumber } from "class-validator";


export class AnswerQuestionReqDto{
    
    @IsNotEmpty()
    @IsNumber()
    questionId: number;

    @IsNotEmpty()
    @IsNumber()
    optionId:number;

}