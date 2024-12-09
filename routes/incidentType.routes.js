

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/incidentType.controller.js");

    router.get('/',  controller.listIncidentType);
    router.get('/:id',  controller.getIncidentTypeById);
    router.post('/',  controller.createIncidentType);
    router.put('/:id',  controller.updateIncidentTypePut);
    router.patch('/:id',  controller.updateIncidentTypePatch);
    router.delete('/:id',  controller.deleteIncidentType);
    app.use('/incidenttypes', router);

};