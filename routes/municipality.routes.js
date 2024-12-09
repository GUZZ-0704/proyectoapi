

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/municipality.controller.js");

    router.get('/',  controller.listMunicipality);
    router.get('/:id',  controller.getMunicipalityById);
    router.post('/',  controller.createMunicipality);
    router.put('/:id',  controller.updateMunicipalityPut);
    router.patch('/:id',  controller.updateMunicipalityPatch);
    router.delete('/:id',  controller.deleteMunicipality);
    app.use('/municipalitys', router);

};