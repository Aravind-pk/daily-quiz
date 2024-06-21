import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionList } from '../../prisma/mockdata/questions';
import { AuthDto } from 'src/auth/dto';
import * as pactum from 'pactum';


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

  let questionsAsked = [];
  let userprogress = {}

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '123',
    };
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

});
