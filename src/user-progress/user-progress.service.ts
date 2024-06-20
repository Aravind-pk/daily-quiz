import { Injectable, NotFoundException } from '@nestjs/common';
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

    async getById(userId: number) {
        const userProgress = await this.prismaService.userProgress.findUnique({
          where: {
            userId: userId,
          }
        });
    
        if (!userProgress) throw new NotFoundException(`The user with id ${userId} not found`);
    
        return userProgress;
      }

}
