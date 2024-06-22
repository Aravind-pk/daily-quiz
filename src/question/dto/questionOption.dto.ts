import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class QuestionOptionDto{
    
    @IsNotEmpty()
    @IsString()
    option: string;

    @IsNotEmpty()
    @IsBoolean()
    correct: boolean;

    @IsNotEmpty()
    @IsString()
    description: string;

}