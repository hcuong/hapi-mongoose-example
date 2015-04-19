'use strict';

import mongoose, { Schema } from 'mongoose';

/**
 * Question Schema
 */
const QuestionSchema = new Schema({
  title: String,
  type: String,
  choices: Array,
  answers: [{
    content: String,
    ip: String,
    author: Object,
    createdAt: { type: Date, default: Date.now }
  }],
  order: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

/**
 * Validations
 */

QuestionSchema.path('title').required(true, 'Question title cannot be blank');

QuestionSchema.methods = {
  addAnswer: function(answer, cb) {
    this.answers.push(answer);
    this.save(cb);
  }
}

QuestionSchema.statics = {
  load: function(id, cb) {
    this.findOne({ _id: id })
      .exec(cb)
  },

  list: function(options, cb) {
    const criteria = options.criteria || {};

    this.find(criteria)
      .populate('')
      .sort({ 'order': -1, 'createdAt': -1 })
      .exec(cb)
  }
}

mongoose.model('question', QuestionSchema);
