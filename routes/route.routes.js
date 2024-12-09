

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/route.controller.js");

    router.get('/',  controller.listRoute);
    router.get('/startMunicipality/:startMunicipalityId',  controller.getRoutesByStartMunicipalityId);
    router.get('/endMunicipality/:endMunicipalityId',  controller.getRoutesByEndMunicipalityId);
    router.get('/:id',  controller.getRouteById);
    router.post('/',  controller.createRoute);
    router.put('/:id',  controller.updateRoutePut);
    router.patch('/:id',  controller.updateRoutePatch);
    router.post('/:id/points', controller.addPointToRoute);
    router.delete('/:id/points/:pointId', controller.removePointFromRoute);
    router.delete('/:id',  controller.deleteRoute);
    app.use('/routes', router);

};