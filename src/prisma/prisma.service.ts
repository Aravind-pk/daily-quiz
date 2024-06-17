import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor( config: ConfigService){
        super({
            datasources:{
                db:{
                    url:config.get('DATABASE_URL')
                }
            }
        })
    }

    async cleanDB(){
        await this.questionOption.deleteMany();
        await this.question.deleteMany();
        await this.userQuestion.deleteMany();
        await this.userProgress.deleteMany();
        await this.user.deleteMany();
    }
}
