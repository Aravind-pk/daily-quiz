import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserProgressService } from './user-progress.service';

@UseGuards(JwtGuard)
@Controller('user-progress')
export class UserProgressController {
    constructor(private userProgressService: UserProgressService){}

    @Get("me")
    getUserProgress(@GetUser() user:User){
        return this.userProgressService.getUserProgress(user)
    }

}
