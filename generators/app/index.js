'use strict';

var Generator = require('yeoman-generator');
var Promise   = require('bluebird');
var validator = require('validator')
  , yosay     = require('yosay')
  , chalk     = require('chalk')
  , execa = require('execa');

module.exports = class extends Generator {
  constructor(args, opts) {
      super(args, opts);
  }
};

module.exports = class extends Generator {

    initializing() {

	var done = this.async();
	var response;
	var gradleVersion;

	this.log(yosay(
            chalk.blue('Welcome to Jopinari, an opinionated Java project generator!')
	));

	this.log('Checking prerequisites...');
	
	Promise.coroutine(function *(response) {
	    var response = yield execa('gradle', ['--version']);
	    return yield Promise.resolve(response);
	})(response)
	    .catch(e =>
		   { this.env.error(
		       chalk.red('\u274C  Gradle not found in path!')
		   );
		   })
	    .then(
		m => {
		    gradleVersion = m.stdout.match(/Gradle (\d+(\.\d)*)/i)[1];
		    this.log('\u2705  Found Gradle version: ' + gradleVersion + '\n');
		    done();
		}
	    );

    }
    
    prompting() {

	var done = this.async();
	
	var prompts = [
	    {
		type: 'input',
		name: 'projname',
		message: 'Project name:',
		default: this.projname,
		validate: function (input) {
		    return input ? true : false;
		}
	    },
	    {
		type: 'input',
		name: 'description',
		message: 'A summary of the project (optional):',
		default: this.config.get('description') || null
	    },
	    {
		type: 'input',
		name: 'author',
		message: 'Author\'s name:',
		default: this.config.get('author'),
		store: true,
		validate: function (input) {
		    return input ? true : false;
		}
	    },
	    {
		type: 'input',
		name: 'email',
		message: 'Author\'s email:',
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
	    { projname: this.config.get('projname'),
	      author: this.config.get('author'),
	      description: this.config.get('description')
	    });

	checkstyle: this.fs.copy(
	    this.templatePath('config'),
	    this.destinationPath('config')
	);

    }

    end() {
	goodbye: this.log(chalk.blue('Goodbye!'));
    }
    
};
