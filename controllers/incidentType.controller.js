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
exports.listIncidentType = async (req, res) => {
    try {
        const incidenttypes = await db.incidentType.findAll({
            include: [
            {
                model: db.incident,
                as: 'incidents',
            }
        ]
        });
        res.json(incidenttypes);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getIncidentTypeById = async (req, res) => {
    const id = req.params.id;
    try {
        const incidenttype = await getIncidentTypeOr404(id, res);
        if (!incidenttype) {
            return;
        }
        res.json(incidenttype);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createIncidentType = async (req, res) => {

    const requiredFields = ['name','isPassable'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const incidenttype = {
            name: req.body.name,
            isPassable: req.body.isPassable,
        }
        const incidenttypeCreada = await db.incidentType.create(incidenttype);

        res.status(201).json(incidenttypeCreada);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateIncidentTypePatch = async (req, res) => {
    const id = req.params.id;
    try {
        const incidenttype = await getIncidentTypeOr404(id, res);
        if (!incidenttype) {
            return;
        }
        const requiredFields = ['name','isPassable'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        incidenttype.name = req.body.name || incidenttype.name;
        incidenttype.isPassable = req.body.isPassable || incidenttype.isPassable;

        await incidenttype.save();
        res.json(incidenttype);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateIncidentTypePut = async (req, res) => {
    const id = req.params.id;
    try {
        const incidenttype = await getIncidentTypeOr404(id, res);
        if (!incidenttype) {
            return;
        }
        const requiredFields = ['name','isPassable'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        incidenttype.name = req.body.name;
        incidenttype.isPassable = req.body.isPassable;

        await incidenttype.save();

        res.json(incidenttype);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deleteIncidentType = async (req, res) => {
    const id = req.params.id;
    try {
        const incidenttype = await getIncidentTypeOr404(id, res);
        if (!incidenttype) {
            return;
        }
        await incidenttype.destroy();
        res.json({
            msg: 'IncidentType eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}

async function getIncidentTypeOr404(id, res) {
    const incidentType = await db.incidentType.findByPk(id, {
        include: [
            {
                model: db.incident,
                as: 'incidents',
            }
        ]
    });

    if (!incidentType) {
        res.status(404).json({
            msg: 'IncidentType no encontrada'
        });
        return;
    }
    return incidentType;
}