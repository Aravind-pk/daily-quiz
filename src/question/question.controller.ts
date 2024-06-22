import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AddQuestionDto } from './dto';
import { QuestionService } from './question.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.EDITOR , Role.ADMIN)
@Controller('question')
export class QuestionController {

    constructor(private questionService: QuestionService){}

    @Get(':id')
    findOne(@Param('id' , ParseIntPipe) id: number){
        return this.questionService.findOne(id);
    }

    @Post('add')
    create(@Body() dto: AddQuestionDto){
        return this.questionService.create(dto);
    }

    @Patch(':id')
    update(@Param('id' , ParseIntPipe) id: number , @Body() dto: UpdateQuestionDto){
        return this.questionService.update(id,dto)
    }

    @Delete(':id')
    delete(@Param('id' , ParseIntPipe) id: number){
        return this.questionService.delete(id)
    }

}
