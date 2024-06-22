# Quiz Game API 

Welcome to the Quiz Game API documentation. This API provides a straightforward way for users to engage in daily quizzes consisting of multiple-choice questions.

This project was build to provides a hands-on experience in developing with Next.js, utilizing Prisma with leveraging PostgreSQL.


## Features

- **Daily Quizzes:** Users receive five new multiple-choice questions daily.
- **Answer Feedback:** After answering, users can view all answer options and their explanations.
- **TIme zone imunity:** Timestamps for questions asked and answered are stored and processed at UTC to elememinate any possible loss or gain of the answering window.
- **Role-Based Access:** Editors can manage questions, while administrators have broader access to manage both questions and users.
- **JWT Authentication:** Secure authentication using JSON Web Tokens (JWT) ensures authorized access to API endpoints.

## Endpoints Overview

### Get Today's Questions

**Endpoint:** `GET /quiz/today`

- check if the user already have questions today : return
- get current user level
- pick 5 new questions of appropriate level
- add questins to userquestions: return with options (without discription)

### Answer Question

**Endpoint:** `POST /quiz/answer`

- check if valid Question ( asked today for the user, not answered already)
- check if valid option
- update user progress with points, mark question as answered
- update userlevel if total score exceed current level threshold
- return all options for the question with description (explanation) **even if answer is wrong


### Add, Edit, Update, Delete Question

**Endpoint:** 

Basic `CRUD` for question, Role based Autthentication for **EDITOR, ADMIN**

### Get Users

**Endpoint:** 

**User** can get their own user details and **ADMIN** can get users by ID

### Users and UserProgress

**Endpoint:** 

**User** can get their own user and progress details and **ADMIN** can get both by ID
## Database Schema

### Users Table (`users`)

| Column       | Type     | Description                        |
|--------------|----------|------------------------------------|
| id           | Int      | Unique identifier for each user.    |
| email        | String   | User's email address.               |
| password     | String   | User's password (hashed).           |
| firstName    | String   | User's first name (optional).       |
| lastName     | String   | User's last name (optional).        |
| role         | Enum     | User's role (ADMIN, EDITOR, USER).  |
| createdAt    | DateTime | Date and time of user creation.     |
| updatedAt    | DateTime | Date and time of last update.       |

### UserProgresses Table (`user_progresses`)

| Column         | Type     | Description                          |
|----------------|----------|--------------------------------------|
| userId         | Int      | Foreign key referencing the Users table. |
| totalQuestions | Int      | Total number of questions attempted.  |
| totalCorrects  | Int      | Total number of correct answers.      |
| totalPoints    | Int      | Total points accumulated by the user. |
| level          | Int      | User's current level.                 |
| createdAt      | DateTime | Date and time of creation.            |
| updatedAt      | DateTime | Date and time of last update.         |

### Questions Table (`questions`)

| Column       | Type     | Description                       |
|--------------|----------|-----------------------------------|
| id           | Int      | Unique identifier for each question. |
| question     | String   | The question text.                 |
| level        | Int      | Difficulty level of the question.  |
| points       | Int      | Points assigned to the question.   |
| createdAt    | DateTime | Date and time of question creation.|
| updatedAt    | DateTime | Date and time of last update.      |

### QuestionOptions Table (`question_options`)

| Column       | Type     | Description                             |
|--------------|----------|-----------------------------------------|
| id           | Int      | Unique identifier for each option.       |
| option       | String   | The answer option text.                  |
| correct      | Boolean  | Indicates if the option is correct.      |
| description  | String   | Explanation or description of the option.|
| questionId   | Int      | Foreign key referencing the Questions table. |
| createdAt    | DateTime | Date and time of option creation.        |
| updatedAt    | DateTime | Date and time of last update.            |

### UserQuestions Table (`user_questions`)

| Column       | Type     | Description                                |
|--------------|----------|--------------------------------------------|
| id           | Int      | Unique identifier for each user-question pair. |
| userId       | Int      | Foreign key referencing the Users table.    |
| questionId   | Int      | Foreign key referencing the Questions table.|
| answered     | Boolean  | Indicates if the question has been answered. |
| maxPoints    | Int      | Maximum points for the question.            |
| earnedPoints | Int      | Points earned by the user for this question.|
| askedAt      | DateTime | Date and time when the question was asked.  |
| answeredAt   | DateTime | Date and time when the question was answered.|




## End to End Tests

The end-to-end tests for this application validate its core functionalities across various scenarios.Implemented using Buit-in Testing Module, **Pactum** for HTTP request assertions, these tests cover authentication, user progress tracking, quiz interactions, and question management.





## Scripts

```bash
$ yarn install 
$ yarn db:dev:reset #resets the postgress db on docker.
$ yarn db:dev:seed #preloads 20 mock question
$ yarn start:dev

##Tests
# presets the test db, preloads 20 questions and start the e2e tsts
yan test:e2e:watch
```

## Tech Stack/Tools used

- Nest JS
- Prisma
- Postgress
- Pactum
- Passport
- Docker
- Insomnia

-----