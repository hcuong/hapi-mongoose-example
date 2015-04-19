'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';

const Question = mongoose.model('question');

const handleError = (reply, err) => {
  reply(err.message).code(400);
};

export default {

  load: (request, reply) => {
    const id = request.params.questionId;

    Question.load(id, (err, result) => {
      if (err) {
        return reply(err);
      }

      return reply(result);
    });
  },

  // Get list
  list: (request, reply) => {
    const { isActive } = request.query;
    let options = {};

    if (!_.isUndefined(isActive)) {
      options.criteria = { isActive };
    }

    Question.list(options, function(err, questions){
      if (err) {
        return handleError(reply, err.message);
      }

      reply(JSON.stringify(questions));
    });
  },

  // Create new question
  create: (request, reply) => {
    const question = new Question(request.payload);

    question.save((err, result) => {
      if (err) {
        return handleError(reply, err);
      }

      reply(JSON.stringify(result));
    });
  },

  // update a question
  update: (request, reply) => {
    let { question } = request.pre;

    _.assign(question, request.payload);

    question.save((err, result)=>{
      if (err) {
        return handleError(reply, err);
      }

      reply(JSON.stringify(result));
    });
  },

  // answer a question
  addAnswer: (request, reply) => {

    let { payload, pre: { question } } = request;
    const { info: { remoteAddress } } = request;

    _.assign(payload, { ip: remoteAddress });

    question.addAnswer(payload, (err, result) => {
      if (err) {
        return handleError(reply, err);
      }

      reply(JSON.stringify(result));
    });
  }
}
