require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	var _fs = __webpack_require__(/*! fs */ 1);
	
	var _fs2 = _interopRequireWildcard(_fs);
	
	var _Hapi = __webpack_require__(/*! hapi */ 2);
	
	var _Hapi2 = _interopRequireWildcard(_Hapi);
	
	var _mongoose = __webpack_require__(/*! mongoose */ 3);
	
	var _mongoose2 = _interopRequireWildcard(_mongoose);
	
	var server = new _Hapi2['default'].Server();
	var port = process.env.PORT || 3000;
	var dbURI = process.env.dbURI || 'mongodb://localhost/cuongcua';
	
	// connect mongo
	_mongoose2['default'].connect(dbURI);
	
	// When successfully connected
	_mongoose2['default'].connection.on('connected', function () {
	  console.log('Mongoose default connection open to ' + dbURI);
	});
	
	// If the connection throws an error
	_mongoose2['default'].connection.on('error', function (err) {
	  console.log('Mongoose default connection error: ' + err);
	});
	
	// When the connection is disconnected
	_mongoose2['default'].connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	});
	
	// When the connection is open
	_mongoose2['default'].connection.on('open', function () {
	  console.log('Mongoose default connection is open');
	});
	
	// bootstrap models
	__webpack_require__(/*! ./src/models/question */ 5);
	
	server.connection({
	  port: port,
	  routes: {
	    validate: {
	      options: {
	        allowUnknown: true,
	        stripUnknown: true
	      }
	    }
	  }
	});
	
	// routes
	var routes = __webpack_require__(/*! ./src/config/routes */ 6);
	
	for (var route in routes) {
	  server.route(routes[route]);
	}
	
	server.start(function () {
	  console.log('Server running at: ', server.info.uri);
	});

/***/ },
/* 1 */
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("fs");

/***/ },
/* 2 */
/*!***********************!*\
  !*** external "hapi" ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("hapi");

/***/ },
/* 3 */
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("mongoose");

/***/ },
/* 4 */,
/* 5 */
/*!********************************!*\
  !*** ./src/models/question.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	var _mongoose$Schema = __webpack_require__(/*! mongoose */ 3);
	
	var _mongoose$Schema2 = _interopRequireWildcard(_mongoose$Schema);
	
	/**
	 * Question Schema
	 */
	var QuestionSchema = new _mongoose$Schema.Schema({
	  title: String,
	  type: String,
	  choices: Array,
	  answers: [{
	    content: String,
	    ip: String,
	    author: Object,
	    createdAt: { type: Date, 'default': Date.now }
	  }],
	  order: Number,
	  isActive: { type: Boolean, 'default': true },
	  createdAt: { type: Date, 'default': Date.now } });
	
	/**
	 * Validations
	 */
	
	QuestionSchema.path('title').required(true, 'Question title cannot be blank');
	
	QuestionSchema.methods = {
	  addAnswer: function addAnswer(answer, cb) {
	    this.answers.push(answer);
	    this.save(cb);
	  }
	};
	
	QuestionSchema.statics = {
	  load: function load(id, cb) {
	    this.findOne({ _id: id }).exec(cb);
	  },
	
	  list: function list(options, cb) {
	    var criteria = options.criteria || {};
	
	    this.find(criteria).populate('').sort({ order: -1, createdAt: -1 }).exec(cb);
	  }
	};
	
	_mongoose$Schema2['default'].model('question', QuestionSchema);

/***/ },
/* 6 */
/*!******************************!*\
  !*** ./src/config/routes.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _questions = __webpack_require__(/*! ../controllers/questions */ 7);
	
	var _questions2 = _interopRequireWildcard(_questions);
	
	exports['default'] = [
	// Get the list of questions
	{
	  method: 'GET',
	  path: '/questions',
	  handler: _questions2['default'].list
	},
	// Create new question
	{
	  method: 'POST',
	  path: '/questions',
	  handler: _questions2['default'].create
	},
	// Update a question
	{
	  method: 'PUT',
	  path: '/questions/{questionId}',
	  handler: _questions2['default'].update,
	  config: {
	    pre: [{ method: _questions2['default'].load, assign: 'question' }]
	  }
	},
	// Post an answer
	{
	  method: 'POST',
	  path: '/questions/{questionId}/answers',
	  handler: _questions2['default'].addAnswer,
	  config: {
	    pre: [{ method: _questions2['default'].load, assign: 'question' }]
	  }
	}];
	module.exports = exports['default'];

/***/ },
/* 7 */
/*!**************************************!*\
  !*** ./src/controllers/questions.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _import = __webpack_require__(/*! lodash */ 8);
	
	var _import2 = _interopRequireWildcard(_import);
	
	var _mongoose = __webpack_require__(/*! mongoose */ 3);
	
	var _mongoose2 = _interopRequireWildcard(_mongoose);
	
	'use strict';
	
	var Question = _mongoose2['default'].model('question');
	
	var handleError = function handleError(reply, err) {
	  reply(err.message).code(400);
	};
	
	exports['default'] = {
	
	  load: function load(request, reply) {
	    var id = request.params.questionId;
	
	    Question.load(id, function (err, result) {
	      if (err) {
	        return reply(err);
	      }
	
	      return reply(result);
	    });
	  },
	
	  // Get list
	  list: function list(request, reply) {
	    var isActive = request.query.isActive;
	
	    var options = {};
	
	    if (!_import2['default'].isUndefined(isActive)) {
	      options.criteria = { isActive: isActive };
	    }
	
	    Question.list(options, function (err, questions) {
	      if (err) {
	        return handleError(reply, err.message);
	      }
	
	      reply(JSON.stringify(questions));
	    });
	  },
	
	  // Create new question
	  create: function create(request, reply) {
	    var question = new Question(request.payload);
	
	    question.save(function (err, result) {
	      if (err) {
	        return handleError(reply, err);
	      }
	
	      reply(JSON.stringify(result));
	    });
	  },
	
	  // update a question
	  update: function update(request, reply) {
	    var question = request.pre.question;
	
	    _import2['default'].assign(question, request.payload);
	
	    question.save(function (err, result) {
	      if (err) {
	        return handleError(reply, err);
	      }
	
	      reply(JSON.stringify(result));
	    });
	  },
	
	  // answer a question
	  addAnswer: function addAnswer(request, reply) {
	    var payload = request.payload;
	    var question = request.pre.question;
	    var remoteAddress = request.info.remoteAddress;
	
	    _import2['default'].assign(payload, { ip: remoteAddress });
	
	    question.addAnswer(payload, function (err, result) {
	      if (err) {
	        return handleError(reply, err);
	      }
	
	      reply(JSON.stringify(result));
	    });
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 8 */
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("lodash");

/***/ }
/******/ ]);
//# sourceMappingURL=backend.js.map