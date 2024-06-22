import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionList } from '../../prisma/mockdata/questions';
import { AuthDto } from 'src/auth/dto';
import * as pactum from 'pactum';
import { AddQuestionDto } from 'src/question/dto';
import { Role } from '@prisma/client';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );

    for (const q of QuestionList) {
      const question = await prisma.question.create({
        data: {
          question: q.question,
          level: q.level,
          points: q.points,
          QuestionOption: {
            create: q.options,
          },
        },
      });
    }
  });

  afterAll(() => {
    app.close();
  });

  const dto: AuthDto = {
    email: 'test@gmail.com',
    password: '123',
  };

  let questionsAsked = [];
  let userprogress = {}


  describe('Auth', () => {



    describe('Signup', () => {
      it('should throw if email empty', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', async () => {
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe("Login", ()=>{
      it('should login', async () => {
        await pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
    })


  });

  describe('UserProgress', () => {
    it('should get userprogress', async () => {
      userprogress = await pactum
        .spec()
        .get('/user-progress/me')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .expectStatus(200)
        .returns('')
    });
  });


  describe('Quiz', () => {
    it('should get questions', async () => {
      await pactum
        .spec()
        .get('/quiz/today')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .expectStatus(200)
        .expectJsonLength(5)
        .stores('questions','')
    });

    it('should get same questions again', async () => {
        questionsAsked = await pactum
        .spec()
        .get('/quiz/today')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .expectStatus(200)
        .expectBody('$S{questions}')
        .returns('')
    })


  });


  describe('Answer Question', () => {

    it('should throw on no optionId', async () => {
      await pactum
        .spec()
        .post('/quiz/answer')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withJson({
          "questionId": 111,
          "optionId": 1
        })
        .expectStatus(400)
        .expectBodyContains("The requested question was not asked to the user today, or wanst asked at all")
    });

    it('should throw on invalid optionId', async () => {
      await pactum
        .spec()
        .post('/quiz/answer')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withJson({
          "questionId": questionsAsked[0].questionId,
          "optionId": 111
        })
        .expectStatus(400)
        .expectBodyContains("Invalid option for the requested question")
    });

    it('should throw on invalid questionId', async () => {
      await pactum
        .spec()
        .post('/quiz/answer')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withJson({
          "questionId": questionsAsked[0].questionId,
          "optionId": 111
        })
        .expectStatus(400)
        .expectBodyContains("Invalid option for the requested question")
    });

    it('should answer question', async () => {
      console.log(questionsAsked[0].question)
      await pactum
        .spec()
        .post('/quiz/answer')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withJson({
          "questionId": questionsAsked[0].questionId,
          "optionId": questionsAsked[0].question.QuestionOption[0].id
        })
        .expectStatus(200)
        .expectJsonLength(questionsAsked[0].question.QuestionOption.length)
    });

    it('should throw on re-answer attempt', async () => {
      console.log(questionsAsked[0].question)
      await pactum
        .spec()
        .post('/quiz/answer')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withJson({
          "questionId": questionsAsked[0].questionId,
          "optionId": questionsAsked[0].question.QuestionOption[0].id
        })
        .expectStatus(403)
        .expectBodyContains("This question have already been answered")
    });
  });



  describe('Questions', () => {

    const question: AddQuestionDto = {
      "question": "New test qustion",
      "level": 1,
      "points": 100,
      "options": [
        {
          "option": "Earth",
          "correct": false,
          "description": "Earth is not the largest planet."
        },
        {
          "option": "Jupiter",
          "correct": true,
          "description": "Jupiter is the largest planet."
        },
        {
          "option": "Saturn",
          "correct": false,
          "description": "Saturn is the second largest planet."
        }
      ]
    }


    it('should throw on Role USER', async () => {
      await pactum
        .spec()
        .post('/question/add')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withJson(question)
        .expectStatus(403)
    });

    it('should create new question', async () => {
      //elevate user permission to editor
      await prisma.user.update({
        where:{
          email:dto.email
        },
        data:{
          role:Role.EDITOR
        }
      })
      await pactum
        .spec()
        .post('/question/add')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withJson(question)
        .expectStatus(201)
        .stores('newQuestionId', 'id');
    });

    it('should get new question', async () => {

      await pactum
        .spec()
        .get('/question/$S{newQuestionId}')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .expectStatus(200)
    });


    it('should update question', async () => {

      question.question = "new question text"
      await pactum
        .spec()
        .patch('/question/$S{newQuestionId}')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .withJson(question)
        .expectStatus(200)
        .expectBodyContains(question.question)
    });

    it('should delete question', async () => {

      question.question = "new question text"
      await pactum
        .spec()
        .delete('/question/$S{newQuestionId}')
        .withHeaders({
          'Authorization': 'Bearer $S{userToken}'
        })
        .expectStatus(200)
        .expectBodyContains('Question with ID $S{newQuestionId} deleted')
    });
   
  });

});
