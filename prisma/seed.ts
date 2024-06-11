import { PrismaClient } from '@prisma/client';
import { QuestionList } from './mockdata/questions';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});

  // Seed questions and options

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
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })