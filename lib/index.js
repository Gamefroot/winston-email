var util = require('util'),
    winston = require('winston'),
    nodemailer = require('nodemailer'),
    cron = require("cron").CronJob;

/**
 * module exports
 */

module.exports = winston.transports.Email = Email;

/**
 * Email transport constructor
 */

function Email(options) {
    winston.Transport.apply(this, arguments);

    if (!options) options = {};
    this.to = options.to;
    this.from = options.from;

    if (!(this.to && this.from)) {
        throw new Error("Winston-email Specify to and from");
    }

    if (options.tags) {
        this.tags = options.tags.map(function(tag) {
            return "[" + tag + "] ";
        }).join('');
    }

    this.smtpTransport = nodemailer.createTransport({
        service: options.service,
        auth: {
            user: options.auth.user,
            pass: options.auth.pass
        }
    });

    var self = this;
    new cron({
        cronTime: "00 30 8 * * 1-7",
        onTick: function() {
            if ( logs.length < 1 ){
                return
            }

            var t = "";
            for ( var i = 0; i < logs.length; i++){
                t += "error:   " + logs[i].sub + "\n";
                t += "moreinfo:  " + logs[i].error + "\n\n\n";
            }

            logs = []; //reset logs

            self.smtpTransport.sendMail({
                from: self.from,
                to: self.to,
                subject: "Your daily error messages...",
                text: t
            });
        },
        start: true,
        timeZone: 'Pacific/Auckland'
    }).start();
}

/**
 * inherit winston transport
 */

util.inherits(Email, winston.Transport);


/**
 * transport name
 */

Email.prototype.name = 'email';

/**
 * log data
 *
 * @param  {String}   level
 * @param  {String}   msg
 * @param  {Object}   meta
 * @param  {Function} cb
 *
 * @api public
 */

var logs = [];

Email.prototype.log = function(level, msg, meta, cb) {
    if (this.silent) return cb(null, true);
    if (!msg) msg = '';

    var text = msg.toString(),
        subject = "" + (this.tags || '') + "[" + level + "] " + text.slice(0, 51);

    if (meta) text += "\n---\n" + util.inspect(meta);

    logs.push({
        error: text,
        sub: subject
    });

    cb();
};
