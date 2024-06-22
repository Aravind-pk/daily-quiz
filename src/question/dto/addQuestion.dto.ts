import { ArrayNotEmpty, IsArray, IsEmpty, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { QuestionOptionDto } from "./questionOption.dto";
import { Type } from "class-transformer";

export class AddQuestionDto {

    @IsString()  
    @IsNotEmpty()
    question: string;

    @IsInt()
    level: number;

    @IsInt()
    points:number;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => QuestionOptionDto)
    options:QuestionOptionDto[]

  }

