import { AddQuestionDto } from "./addQuestion.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateQuestionDto extends PartialType(AddQuestionDto) {}
