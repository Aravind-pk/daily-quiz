import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserProgressService {

    constructor(private prismaService: PrismaService){}

    async getUserProgress(user:User) {
        return await this.prismaService.userProgress.findUnique({
            where:{
                userId:user.id
            }
        })
    }
}
