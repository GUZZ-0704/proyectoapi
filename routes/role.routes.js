

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/role.controller.js");

    router.get('/',  controller.listRole);
    router.get('/:id',  controller.getRoleById);
    router.post('/',  controller.createRole);
    router.put('/:id',  controller.updateRolePut);
    router.patch('/:id',  controller.updateRolePatch);
    router.delete('/:id',  controller.deleteRole);
    app.use('/roles', router);

};