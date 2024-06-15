import { Injectable, NotImplementedException } from '@nestjs/common';
import { Question, User, UserQuestion } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionService {

    constructor(
        private prismaService: PrismaService
    ){}

    async getDaily(user : User) {
        //check if user already have questions today: if yes return the questions
        const today = new Date();
        const dayTimeRange = this.getDayRangeUTC(today)
        const questions = await this.prismaService.userQuestion.findMany({
            where:{
                userId:user.id,
                askedAt:{
                    gte:dayTimeRange.startTime,
                    lte:dayTimeRange.endTime
                },
            },
            select:{
                questionId:true,
                answered:true,
                answeredAt:true,
                question:{
                    select:{
                        question:true,
                        QuestionOption:{
                            select:{
                                id:true,
                                option:true,
                            }
                        }
                    }
                }
            }

        })

        if (questions.length > 0){
            return questions
        }

        //else pick 5 new questions 

        const newQuestions = await this.pickNewQuestions(user , 1 ,5 )
        const newUserQuestions = newQuestions.map(question => ({
            userId: user.id,
            questionId: question.id,
            maxPoints: question.points
        } ))

        //add the questions to userquestions

        await this.prismaService.userQuestion.createMany({
            data: newUserQuestions
        })

        //return the questions with options

        return newQuestions
    }

    answerQuestion() {
        throw NotImplementedException
    }

    
    answerQuestions() {
        throw NotImplementedException
    }


    private getDayRangeUTC(date: Date):{startTime:Date , endTime:Date} {
        const startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        const endTime =   new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
        return {
            startTime,endTime
        };
    }

    private async pickNewQuestions(user : User, level: number, noOfQuestions: number ): Promise<Question[]> {

        //get questionIDs previoulsy asked questions
        const askedQuestionIds = await this.prismaService.userQuestion.findMany({
            where: {
                userId: user.id,
            },
            select: {
                questionId: true,
            }
        }).then(result => result.map(userQuestion => userQuestion.questionId))

        const newQuestions = await this.prismaService.question.findMany({
            where: {
              id: {
                notIn: askedQuestionIds,
              },
              level: level, 
            },
            take: noOfQuestions,
            include:{
                QuestionOption: {
                    select:{
                        id:true,
                        option:true
                    }
                },
            }
          });

        return newQuestions
        
    }
}
