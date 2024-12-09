const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listMunicipality = async (req, res) => {
    try {
        const municipalitys = await db.municipality.findAll({
           include: [
            {
                model: db.user,
                as: 'municipalityCreator',
            },
            {
                model: db.user,
                as: 'municipalityModifier',
            },
            {
                model: db.point,
                as: 'municipalityPoint',
            }
        ]
        });
        res.json(municipalitys);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getMunicipalityById = async (req, res) => {
    const id = req.params.id;
    try {
        const municipality = await getMunicipalityOr404(id, res);
        if (!municipality) {
            return;
        }
        res.json(municipality);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createMunicipality = async (req, res) => {

    const requiredFields = ['name', 'pointId', 'radius','createdById', 'lastModifiedById'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const municipality = {
            name: req.body.name,
            pointId: req.body.pointId,
            radius: req.body.radius,
            createdBy: req.body.createdById,
            lastModifiedBy: req.body.lastModifiedById
        }
        const municipalityCreada = await db.municipality.create(municipality);

        res.status(201).json(municipalityCreada);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateMunicipalityPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const municipality = await getMunicipalityOr404(id, res);
        if (!municipality) {
            return;
        }
        const requiredFields = ['name', 'pointId', 'radius','lastModifiedById'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        municipality.name = req.body.name || municipality.name;
        municipality.pointId = req.body.pointId || municipality.pointId;
        municipality.radius = req.body.radius || municipality.radius;
        municipality.lastModifiedBy = req.body.lastModifiedById || municipality.lastModifiedById;

        await municipality.save();
        res.json(municipality);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateMunicipalityPut = async (req, res) => {
    const id = req.params.id;
    try {
        const municipality = await getMunicipalityOr404(id, res);
        if (!municipality) {
            return;
        }
        const requiredFields = ['name', 'pointId', 'radius', 'lastModifiedById'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        municipality.name = req.body.name;
        municipality.pointId = req.body.pointId;
        municipality.radius = req.body.radius;
        municipality.lastModifiedBy = req.body.lastModifiedById;

        await municipality.save();

        res.json(municipality);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deleteMunicipality = async (req, res) => {
    const id = req.params.id;
    try {
        const municipality = await getMunicipalityOr404(id, res);
        if (!municipality) {
            return;
        }
        await municipality.destroy();
        res.json({
            msg: 'Municipality eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}

async function getMunicipalityOr404(id, res) {
    const municipality = await db.municipality.findByPk(id, {
        include: [
            {
                model: db.user,
                as: 'municipalityCreator',
            },
            {
                model: db.user,
                as: 'municipalityModifier',
            },
            {
                model: db.point,
                as: 'municipalityPoint',
            }
        ]
    });

    if (!municipality) {
        res.status(404).json({
            msg: 'Municipality no encontrada'
        });
        return;
    }
    return municipality;
}