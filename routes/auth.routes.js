

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/auth.controller.js");

    router.post('/login', controller.login);
    router.post('/logout', controller.logout);
    router.get('/me', controller.me);

    app.use('/auth', router);

};