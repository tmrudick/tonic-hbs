var Handlebars = require('handlebars'),
    path = require('path'),
    fs = require('fs');

var templates = [],
    cache = {};

// Load and compile any templates defined in the config
job(function(done) {
    if (this.config.handlebars && this.config.handlebars.templates) {
        this.config.handlebars.templates.forEach(function(template) {
            var template_data = fs.readFileSync(template.template, 'utf-8');

            templates.push({
                filename: template.filename,
                compiled: Handlebars.compile(template_data)
            })
        });
    }

    done();
}).once();

// Allow for registering any helpers
job(function(done) {
    if (this.config.handlebars && this.config.handlebars.helpers) {
        require(path.join(process.cwd(), this.config.handlebars.helpers))(Handlebars);
    }
    done();
}).once();

// Create all templates when any named job finishes
job(function(done, data) {
    if (templates) {
        if (!cache) {
            cache = {};
        }

        if (this.parent) {
            cache[this.parent] = data;
        }

        templates.forEach(function(template) {
            var output = template.compiled(cache);
            fs.writeFileSync(template.filename, output, 'utf-8');
        });
    }

    done();
}).after('*');
