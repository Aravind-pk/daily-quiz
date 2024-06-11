export const QuestionList = [
  // Level 1 Questions
  {
    question: 'What is the capital of France?',
    level: '1',
    points: 100,
    options: [
      { option: 'Paris', correct: true, description: 'Capital of France' },
      { option: 'Berlin', correct: false, description: 'Capital of Germany' },
      { option: 'Madrid', correct: false, description: 'Capital of Spain' },
    ],
  },
  {
    question: 'What is 2 + 2?',
    level: '1',
    points: 100,
    options: [
      { option: '3', correct: false, description: 'Incorrect' },
      { option: '4', correct: true, description: 'Correct' },
      { option: '5', correct: false, description: 'Incorrect' },
    ],
  },
  {
    question: 'What is the largest planet in our solar system?',
    level: '1',
    points: 100,
    options: [
      { option: 'Earth', correct: false, description: 'Earth is not the largest planet.' },
      { option: 'Jupiter', correct: true, description: 'Jupiter is the largest planet.' },
      { option: 'Saturn', correct: false, description: 'Saturn is the second largest planet.' },
    ],
  },
  {
    question: 'What is the boiling point of water?',
    level: '1',
    points: 100,
    options: [
      { option: '90°C', correct: false, description: '90°C is below boiling point.' },
      { option: '100°C', correct: true, description: '100°C is the boiling point of water.' },
      { option: '110°C', correct: false, description: '110°C is above boiling point.' },
    ],
  },
  {
    question: 'Who wrote "Hamlet"?',
    level: '1',
    points: 100,
    options: [
      { option: 'Charles Dickens', correct: false, description: 'Charles Dickens did not write "Hamlet".' },
      { option: 'William Shakespeare', correct: true, description: 'William Shakespeare wrote "Hamlet".' },
      { option: 'Jane Austen', correct: false, description: 'Jane Austen did not write "Hamlet".' },
    ],
  },
  {
    question: 'What is the speed of light?',
    level: '1',
    points: 100,
    options: [
      { option: '300,000 km/s', correct: true, description: 'The speed of light is approximately 300,000 km/s.' },
      { option: '150,000 km/s', correct: false, description: '150,000 km/s is incorrect.' },
      { option: '450,000 km/s', correct: false, description: '450,000 km/s is incorrect.' },
    ],
  },
  {
    question: 'What is the chemical symbol for water?',
    level: '1',
    points: 100,
    options: [
      { option: 'O2', correct: false, description: 'O2 is the symbol for oxygen.' },
      { option: 'H2O', correct: true, description: 'H2O is the chemical symbol for water.' },
      { option: 'CO2', correct: false, description: 'CO2 is the symbol for carbon dioxide.' },
    ],
  },
  {
    question: 'Who was the first president of the United States?',
    level: '1',
    points: 100,
    options: [
      { option: 'Abraham Lincoln', correct: false, description: 'Abraham Lincoln was the 16th president.' },
      { option: 'George Washington', correct: true, description: 'George Washington was the first president.' },
      { option: 'Thomas Jefferson', correct: false, description: 'Thomas Jefferson was the third president.' },
    ],
  },
  {
    question: 'What is the largest ocean on Earth?',
    level: '1',
    points: 100,
    options: [
      { option: 'Atlantic Ocean', correct: false, description: 'Atlantic Ocean is the second largest.' },
      { option: 'Indian Ocean', correct: false, description: 'Indian Ocean is not the largest.' },
      { option: 'Pacific Ocean', correct: true, description: 'Pacific Ocean is the largest ocean.' },
    ],
  },
  {
    question: 'What is the smallest prime number?',
    level: '1',
    points: 100,
    options: [
      { option: '0', correct: false, description: '0 is not a prime number.' },
      { option: '1', correct: false, description: '1 is not a prime number.' },
      { option: '2', correct: true, description: '2 is the smallest prime number.' },
    ],
  },
  
  // Level 2 Questions
  {
    question: 'What is the powerhouse of the cell?',
    level: '2',
    points: 200,
    options: [
      { option: 'Nucleus', correct: false, description: 'Nucleus is the control center of the cell.' },
      { option: 'Mitochondria', correct: true, description: 'Mitochondria is the powerhouse of the cell.' },
      { option: 'Ribosome', correct: false, description: 'Ribosome is involved in protein synthesis.' },
    ],
  },
  {
    question: 'What is the capital of Australia?',
    level: '2',
    points: 200,
    options: [
      { option: 'Sydney', correct: false, description: 'Sydney is the largest city, but not the capital.' },
      { option: 'Canberra', correct: true, description: 'Canberra is the capital of Australia.' },
      { option: 'Melbourne', correct: false, description: 'Melbourne is not the capital.' },
    ],
  },
  {
    question: 'What is the hardest natural substance on Earth?',
    level: '2',
    points: 200,
    options: [
      { option: 'Gold', correct: false, description: 'Gold is not the hardest natural substance.' },
      { option: 'Diamond', correct: true, description: 'Diamond is the hardest natural substance.' },
      { option: 'Iron', correct: false, description: 'Iron is not the hardest natural substance.' },
    ],
  },
  {
    question: 'Who painted the Mona Lisa?',
    level: '2',
    points: 200,
    options: [
      { option: 'Vincent van Gogh', correct: false, description: 'Vincent van Gogh did not paint the Mona Lisa.' },
      { option: 'Pablo Picasso', correct: false, description: 'Pablo Picasso did not paint the Mona Lisa.' },
      { option: 'Leonardo da Vinci', correct: true, description: 'Leonardo da Vinci painted the Mona Lisa.' },
    ],
  },
  {
    question: 'What is the chemical symbol for gold?',
    level: '2',
    points: 200,
    options: [
      { option: 'Go', correct: false, description: 'Go is not the chemical symbol for gold.' },
      { option: 'Gd', correct: false, description: 'Gd is not the chemical symbol for gold.' },
      { option: 'Au', correct: true, description: 'Au is the chemical symbol for gold.' },
    ],
  },
  {
    question: 'What is the tallest mountain in the world?',
    level: '2',
    points: 200,
    options: [
      { option: 'K2', correct: false, description: 'K2 is the second tallest mountain.' },
      { option: 'Mount Everest', correct: true, description: 'Mount Everest is the tallest mountain.' },
      { option: 'Kangchenjunga', correct: false, description: 'Kangchenjunga is the third tallest mountain.' },
    ],
  },
  {
    question: 'What is the longest river in the world?',
    level: '2',
    points: 200,
    options: [
      { option: 'Amazon River', correct: false, description: 'Amazon River is the second longest river.' },
      { option: 'Nile River', correct: true, description: 'Nile River is the longest river.' },
      { option: 'Yangtze River', correct: false, description: 'Yangtze River is not the longest river.' },
    ],
  },
  {
    question: 'Who is known as the father of computers?',
    level: '2',
    points: 200,
    options: [
      { option: 'Bill Gates', correct: false, description: 'Bill Gates is not known as the father of computers.' },
      { option: 'Alan Turing', correct: false, description: 'Alan Turing is not known as the father of computers.' },
      { option: 'Charles Babbage', correct: true, description: 'Charles Babbage is known as the father of computers.' },
    ],
  },
  {
    question: 'What is the main ingredient in traditional Japanese miso soup?',
    level: '2',
    points: 200,
    options: [
      { option: 'Tofu', correct: false, description: 'Tofu is commonly included but not the main ingredient.' },
      { option: 'Soybean paste', correct: true, description: 'Soybean paste (miso) is the main ingredient.' },
      { option: 'Seaweed', correct: false, description: 'Seaweed is commonly included but not the main ingredient.' },
    ],
  },
  {
    question: 'What is the largest desert in the world?',
    level: '2',
    points: 200,
    options: [
      { option: 'Sahara Desert', correct: false, description: 'Sahara Desert is the largest hot desert.' },
      { option: 'Arctic Desert', correct: false, description: 'Arctic Desert is not the largest.' },
      { option: 'Antarctic Desert', correct: true, description: 'Antarctic Desert is the largest desert.' },
    ],
  },
];
