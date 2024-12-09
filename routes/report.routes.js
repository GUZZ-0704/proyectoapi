

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/report.controller.js");

    router.get('/',  controller.listReport);
    router.get('/:id',  controller.getReportById);
    router.post('/',  controller.createReport);
    router.put('/:id',  controller.updateReportPut);
    router.patch('/:id',  controller.updateReportPatch);
    router.delete('/:id',  controller.deleteReport);
    app.use('/reports', router);

};