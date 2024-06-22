import { Injectable, NotFoundException } from '@nestjs/common';
import { AddQuestionDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';

@Injectable()
export class QuestionService {

    constructor(private pirsmaService: PrismaService){}

    async findOne(id: number) {
        const question = await this.pirsmaService.question.findUnique({
            where: { id },
            include: { QuestionOption: true },
          });
          if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
          }
          return question;
    }


    create(dto: AddQuestionDto) {
        const { question, level, points, options } = dto;
        return  this.pirsmaService.question.create({
          data: {
            question,
            level,
            points,
            QuestionOption: {
              create: options,
            },
          },
          include:{
            QuestionOption:true
          }
        });
    }


    async update(id: number, dto: UpdateQuestionDto) {
       
        const existingQuestion = await this.pirsmaService.question.findUnique({
          where: { id },
        });
    
        if (!existingQuestion) {
          throw new NotFoundException(`Question with ID ${id} not found`);
        }
    
        const { options, ...questionData } = dto;

        const updateData = {
          ...questionData,
          ...(options && options.length > 0
            ? {
                QuestionOption: {
                  deleteMany: { questionId: id },
                  create: options,
                },
              }
            : {}),
        };
    
        return this.pirsmaService.question.update({
          where: { id },
          data: updateData,
          include:{
            QuestionOption:true
          }
        });
    }


    async delete(id: number) {
        const question = await this.pirsmaService.question.findUnique({ where: { id } });
        if (!question) {
          throw new NotFoundException(`Question with ID ${id} not found`);
        }
        await this.pirsmaService.question.delete({ where: { id } });
        return { message: `Question with ID ${id} deleted` };
    }
}
