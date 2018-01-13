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

	// TODO: More prompt for customizations; IDE type,
	// app or lib, Nebula or not, etc.

	this.prompt(prompts).then((answers) => {
	    this.config.set(answers);
	    done();
	});

    }

    configuring() {
	this.fs.copy(
	    this.templatePath('gitignore'),
	    this.destinationPath('.gitignore'));

	this.fs.copy(
	    this.templatePath('editorconfig'),
	    this.destinationPath('.editorconfig'));

    }
    
    install() {
	// don't prompt for conflict while replacing build.gradle with our version.
	this.conflicter.force = true;
	this.spawnCommandSync('gradle', ['init', '--type', 'java-application']);
	// TODO: need to template build.gradle for main class param and other configs.
	this.fs.copy(
	    this.templatePath('build.gradle'),
	    this.destinationPath('build.gradle'));
    }

    writing() {
	readme: this.fs.copyTpl(
	    this.templatePath('README.md'),
	    this.destinationPath('README.md'),
	    { appname: this.config.get('appname'),
	      author: this.config.get('author'),
	      description: this.config.get('description')
	    });

	checkstyle: this.fs.copy(
	    this.templatePath('config'),
	    this.destinationPath('config')
	);

	}
    
};
