import questions from '../controllers/questions';

export default [
  // Get the list of questions
  {
    method: 'GET',
    path: '/questions',
    handler: questions.list
  },
  // Create new question
  {
    method: 'POST',
    path: '/questions',
    handler: questions.create
  },
  // Update a question
  {
    method: 'PUT',
    path: '/questions/{questionId}',
    handler: questions.update,
    config: {
      pre: [
        { method: questions.load, assign: 'question' }
      ]
    }
  },
  // Post an answer
  {
    method: 'POST',
    path: '/questions/{questionId}/answers',
    handler: questions.addAnswer,
    config: {
      pre: [
        { method: questions.load, assign: 'question' }
      ]
    }
  }
]