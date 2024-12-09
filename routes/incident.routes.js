

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/incident.controller.js");

    router.get('/',  controller.listIncident);
    router.get('/:id',  controller.getIncidentById);
    router.post('/',  controller.createIncident);
    router.put('/:id',  controller.updateIncidentPut);
    router.patch('/:id',  controller.updateIncidentPatch);
    router.post('/:id/upload',  controller.uploadPicture);
    router.delete('/:id/picture',  controller.deletePicture);
    router.delete('/:id',  controller.deleteIncident);
    app.use('/incidents', router);

};