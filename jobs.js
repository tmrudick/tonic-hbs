var Handlebars = require('handlebars'),
    path = require('path'),
    fs = require('fs');

var templates = [],
    cache = {};

var compile = function(done, data) {
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
}

// Load and compile any templates defined in the config
job(function(done) {
    var isDebug = this.config.debug;
    if (this.config.handlebars && this.config.handlebars.templates) {
        this.config.handlebars.templates.forEach(function(template) {
            var template_data = {
                    filename: template.filename,
                    compiled: Handlebars.compile(fs.readFileSync(template.template, 'utf-8'))
            };

            templates.push(template_data)

            if (isDebug) {
                console.log("Watching " + template.template + " for changes");
                fs.watch(template.template, function(type, filename) {
                    console.log(filename + " has changed -- recompiling");
                    template_data.compiled = Handlebars.compile(fs.readFileSync(template.template, 'utf-8'));
                    compile(function() {});
                });
            }

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
job(compile).after('*');
