var Handlebars = require('handlebars'),
    fs = require('fs');

var templates = [],
    cache = {};

job('hbs', function(done) {
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

job(function(done, data) {
    if (templates) {
        if (!cache) {
            cache = {};
        }

        if (this.parent) {
            cache[this.parent] = data;
        }

        this.templates.forEach(function(template) {
            var output = template.compiled(cache);
            fs.writeFileSync(template.filename, output, 'utf-8');
        });
    }

    done();
}).after('*');

// Export all of the jobs and attach the handlebars object
module.exports = {};
module.exports.Handlebars = Handlebars;