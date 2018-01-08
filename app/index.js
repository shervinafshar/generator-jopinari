'use strict';

var Generator = require('yeoman-generator');
var validator = require('validator');

module.exports = class extends Generator {
  constructor(args, opts) {
      super(args, opts);
  }
};

module.exports = class extends Generator {

    prompting() {

	var done = this.async();
	
	var prompts = [
	    {
		type: 'input',
		name: 'appname',
		message: 'Your application name',
		default: this.appname,
		validate: function (input) {
		    return input ? true : false;
		}
	    },
	    {
		type: 'input',
		name: 'description',
		message: 'A summary of the application (optional)',
		default: this.config.get('description') || null
	    },
	    {
		type: 'input',
		name: 'author',
		message: 'Author\'s name?',
		default: this.config.get('author'),
		store: true,
		validate: function (input) {
		    return input ? true : false;
		}
	    },
	    {
		type: 'input',
		name: 'email',
		message: 'Author\'s email?',
		default: this.config.get('email'),
		store: true,
		validate: function (input) {
		    return validator.isEmail(input);
		}
	    }
	];

	this.prompt(prompts).then((answers) => {
	    this.config.set(answers);
	    done();
	});

    }

    writing() {
	this.fs.copyTpl(
	    this.templatePath('README.md'),
	    this.destinationPath('README.md'),
	    { appname: this.config.get('appname'),
	      author: this.config.get('author'),
	      description: this.config.get('description')
	    });
	}
    
};
