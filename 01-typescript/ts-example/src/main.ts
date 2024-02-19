type Question = { question: string; answers: Array<string>; correct: number };

const ALL_QUESTIONS: Array<Question> = [
  {
    question: "What is the velocity of a swallow carrying a coconut?",
    answers: [
      "A swallow cannot hold a coconut",
      "50 mph",
      "Is it an Asian or African swallow?",
      "I don't know that!",
    ],
    correct: 3,
  },
  {
    question:
      "How many times do you need to fold a paper sheet such that it reaches the top of Eiffel's tower?",
    answers: ["10", "23", "103", "1303"],
    correct: 2,
  },
  {
    question:
      "What did inspire Guido van Rossum (Python's original author) to name of the Python programming language?",
    answers: [
      "Guido is a big fan of The Monty Python, an English comedy group",
      "Guido is a big fan of snakes",
      "Because we can write recursive functions in Python, like a snake biting its tail",
      "Guido randomly chose a name in the dictionary",
    ],
    correct: 1,
  },
];

game(ALL_QUESTIONS);

function game(questions: Array<Question>) {
  let score = 0;

  for (const question of questions) {
    score += play_question(question);
  }

  alert(`Your score is ${score}/${questions.length}!`);
}

function play_question(question: Question): number {
  const answers = question.answers;

  const answers_string = answers
    .map((answer, index) => `${index + 1}. ${answer}`)
    .join("\n");
  const message = question.question + "\n\n" + answers_string;

  const user_answer_int = ask_answer(answers.length, message);

  if (user_answer_int == question.correct) {
    return 1;
  } else {
    return 0;
  }
}

function ask_answer(message, max_answer): number {
  let user_answer_final = null;
  while (user_answer_final === null) {
    const user_answer_string = window.prompt(
      message + "\n\n" + `Choose your answer (1 to ${max_answer})`
    );

    const user_answer_int = parseInt(user_answer_string);
    if (isNaN(user_answer_int)) {
      alert("Illegal input!");
      continue;
    }

    if (1 <= user_answer_int && user_answer_int <= max_answer) {
      user_answer_final = user_answer_int;
    } else {
      alert("Illegal input!");
      continue;
    }
  }
  return user_answer_final;
}
