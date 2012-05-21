// Generated by CoffeeScript 1.3.1
(function() {
  var nodemailer, util, winston,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  util = require('util');

  winston = require('winston');

  nodemailer = require('nodemailer');

  module.exports = winston.transports.Email = (function(_super) {

    __extends(Email, _super);

    Email.name = 'Email';

    Email.prototype.name = 'email';

    function Email(options) {
      if (options == null) {
        options = {};
      }
      Email.__super__.constructor.apply(this, arguments);
      this.to = options.to, this.from = options.from;
      if (!(this.to && this.from)) {
        throw new Error("Winston-email Specify to and from");
      }
      this.smtpTransport = nodemailer.createTransport('SMTP', {
        service: options.service,
        auth: {
          user: options.auth.user,
          pass: options.auth.pass
        }
      });
    }

    Email.prototype.log = function(level, msg, meta, cb) {
      var subject, text;
      if (msg == null) {
        msg = '';
      }
      if (this.silent) {
        cb(null, true);
      }
      subject = "[" + level + "] " + msg.slice(0, 51);
      text = msg;
      if (meta) {
        msg += "---\n" + (util.inspect(meta, null, 5));
      }
      return this.smtpTransport.sendMail({
        from: this.from,
        to: this.to,
        subject: subject,
        text: text
      }, cb);
    };

    return Email;

  })(winston.Transport);

}).call(this);