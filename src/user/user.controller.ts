import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard,RolesGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService){}
    
    @Get('me')
    getMe(@GetUser() user: User){
        return {user}
    }

    @Roles(Role.ADMIN)
    @Get(':id')
    getById(@Param('id' , ParseIntPipe) id: number){
        return this.userService.getById(id)
    }
}
