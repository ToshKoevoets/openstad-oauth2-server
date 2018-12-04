const loginFields = require('../config/user').loginFields;
const User                  = require('../models').User;

exports.validateLogin = (req, res, next) => {
  req.check(loginFields);

  req.getValidationResult();

  //  const errors = req.validationResult();
  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    res.redirect(req.header('Referer') || '/account');
  } else {
    next();
  }
}

exports.check = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    const url = '/login?clientId=' + req.client.clientId

    if (req.session) {
      req.session.returnTo = req.originalUrl || req.url;
    }

    return res.redirect(url);
  } else {
    new User({ id: req.user.id })
      .fetch()
      .then((user) => {
        req.userModel = user;
        req.user = user.serialize();
        next();
      })
      .catch((err) => {
        next(err);
      });
  }
}
