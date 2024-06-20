import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { UserProgressService } from './user-progress.service';
import { Roles } from 'src/auth/decorator/roles.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Controller('user-progress')
export class UserProgressController {
    constructor(private userProgressService: UserProgressService){}

    @Get("me")
    getUserProgress(@GetUser() user:User){
        return this.userProgressService.getUserProgress(user)
    }

    @Roles(Role.ADMIN)
    @Get(':id')
    getById(@Param('id' , ParseIntPipe) id: number){
        return this.userProgressService.getById(id)
    }

}
