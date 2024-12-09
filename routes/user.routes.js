

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/user.controller.js");

    router.get('/',  controller.listUsers);
    router.get('/:id',  controller.getUserById);
    router.post('/register',  controller.createUser);
    router.put('/:id',  controller.updateUserPut);
    router.patch('/:id',  controller.updateUserPatch);
    router.patch('/:id/change-password',  controller.updatePassword);
    router.delete('/:id',  controller.deleteUser);
    app.use('/users', router);

};