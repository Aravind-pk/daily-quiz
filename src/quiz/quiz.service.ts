import { BadRequestException, ForbiddenException, Injectable, NotImplementedException } from '@nestjs/common';
import { Question, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnswerQuestionReqDto } from './dto';

@Injectable()
export class QuizService {
    
    constructor(
        private prismaService: PrismaService
    ){}

    async getDaily(user : User) {
        //if user already have question today return questions with options.
        const today = new Date();
        const dayTimeRange = this.getDayRangeUTC(today)
        const questionsToday = await this.prismaService.userQuestion.count({
            where:{
                userId:user.id,
                askedAt:{
                    gte:dayTimeRange.startTime,
                    lte:dayTimeRange.endTime
                },
            },
        })

        if (questionsToday > 0){
            return this.getTodaysQuestion(user);
        }

        //else pick 5 new questions 
        const newQuestions = await this.pickNewQuestions(user , 1 ,5 )
        const newUserQuestions = newQuestions.map(question => ({
            userId: user.id,
            questionId: question.id,
            maxPoints: question.points,
            askedAt: new Date().toISOString() //store date in UTC
        } ))

        //add the questions to userquestions
        await this.prismaService.userQuestion.createMany({
            data: newUserQuestions
        })

        //return the questions with options
        return this.getTodaysQuestion(user)
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

        if(!userQuestion) throw new BadRequestException("The requested question was not asked to the user today, or wanst asked at all")

        //TODO: check if already answered
        if(userQuestion.answered) throw new ForbiddenException("This question have already been answered")
        
        //check if option is valid
        const option = userQuestion.question.QuestionOption.find(option => option.id == answerQuestionReq.optionId)
        if(!option) throw new BadRequestException("Invalid option for the requested question")

        //if correct -> update userprogress and userquestion
        if (option.correct){
            await this.prismaService.userProgress.update({
                where:{
                    userId:user.id,
                },
                data:{
                    totalPoints:{
                        increment: userQuestion.question.points
                    },
                    totalCorrects:{
                        increment:1
                    }
                
                }
            })
        }

        
        await this.prismaService.userQuestion.update({
            where:{
                id:userQuestion.id,
            },
            data:{
                answered: true,
                answeredAt: new Date().toISOString() //convert to UTC 
            }
        })

        //reveal the answers : return all option with descriptons -- * irrespecitve of the option
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

    private async getTodaysQuestion(user: User){
        const dayTimeRange = this.getDayRangeUTC(new Date())
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
        return questions
    }

}
