import { Injectable, NotImplementedException } from '@nestjs/common';
import { Question, User, UserQuestion } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnswerQuestionReqDto } from './dto';

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

    async answerQuestion(user :User , answerQuestionReq : AnswerQuestionReqDto) {
        //check if the user was asked this question today.
        const dayTimeRange = this.getDayRangeUTC(new Date())
        const userQuestion = await this.prismaService.userQuestion.findFirst({
            where:{
                userId:user.id,
                questionId:answerQuestionReq.questionId,
                askedAt:{
                    gte:dayTimeRange.startTime,
                    lte:dayTimeRange.endTime
                },
            },
            include:{
                question:{
                    select:{
                        points:true,
                        QuestionOption:{
                            select:{
                                id:true,
                                option:true,
                                description:true,
                                correct:true
                            }
                        }
                    }
                }
            }
        })

        if(!userQuestion) return "user cant answer this question"

        //check if already answered
        
        //get option
        const option = userQuestion.question.QuestionOption.find(option => option.id == answerQuestionReq.optionId)
        if(!option) return "no option found"

        //if correct add points to user  
        if (option.correct){
            await this.prismaService.userProgress.update({
                where:{
                    userId:user.id,
                },
                data:{
                    totalPoints:{
                        increment: userQuestion.question.points
                    },
                
                }
            })

            await this.prismaService.userQuestion.update({
                where:{
                    id:userQuestion.id,
                },
                data:{
                    answered: option.correct,
                
                }
            })

        }
        

        //reveal the answers : return all option with descriptons
        return userQuestion.question.QuestionOption
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
