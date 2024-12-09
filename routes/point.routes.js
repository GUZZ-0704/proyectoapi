

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/point.controller.js");

    router.get('/',  controller.listPoint);
    router.get('/:id',  controller.getPointById);
    router.post('/',  controller.createPoint);
    router.put('/:id',  controller.updatePointPut);
    router.patch('/:id',  controller.updatePointPatch);
    router.delete('/:id',  controller.deletePoint);
    app.use('/points', router);

};