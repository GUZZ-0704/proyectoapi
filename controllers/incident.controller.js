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
exports.listIncident = async (req, res) => {
    try {
        const incidents = await db.incident.findAll({
           include: [
            {
                model: db.user,
                as: 'incidentAcceptor',
            },
            {
                model: db.user,
                as: 'incidentModifier',
            },
            {
                model: db.point,
                as: 'point',
            },
            {
                model: db.incidentType,
                as: 'incidentType',
            }
        ]
        });
        res.json(incidents);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getIncidentById = async (req, res) => {
    const id = req.params.id;
    try {
        const incident = await getIncidentOr404(id, res);
        if (!incident) {
            return;
        }
        res.json(incident);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createIncident = async (req, res) => {

    const requiredFields = ['description', 'pointId','acceptedById', 'lastModifiedById', 'imageUrl', 'incidentTypeId'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const incident = {
            description: req.body.description,
            pointId: req.body.pointId,
            status: 'active',
            acceptedBy: req.body.acceptedById,
            lastModifiedBy: req.body.lastModifiedById,
            imageUrl: req.body.imageUrl,
            incidentTypeId: req.body.incidentTypeId
        }
        const incidentCreada = await db.incident.create(incident);

        res.status(201).json(incidentCreada);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateIncidentPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const incident = await getIncidentOr404(id, res);
        if (!incident) {
            return;
        }
        const requiredFields = ['description', 'pointId', 'status','lastModifiedById', 'imageUrl', 'incidentTypeId'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        incident.description = req.body.description || incident.description;
        incident.pointId = req.body.pointId || incident.pointId;
        incident.status = req.body.status || incident.status;
        incident.lastModifiedById = req.body.lastModifiedById || incident.lastModifiedById;
        incident.imageUrl = req.body.imageUrl || incident.imageUrl;
        incident.incidentTypeId = req.body.incidentTypeId || incident.incidentTypeId;

        await incident.save();
        res.json(incident);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.updateIncidentPut = async (req, res) => {
    const id = req.params.id;
    try {
        const incident = await getIncidentOr404(id, res);
        if (!incident) {
            return;
        }
        const requiredFields = ['description', 'pointId', 'status', 'lastModifiedById'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        incident.description = req.body.description;
        incident.pointId = req.body.pointId;
        incident.status = req.body.status;
        incident.lastModifiedById = req.body.lastModifiedById;

        await incident.save();

        res.json(incident);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deleteIncident = async (req, res) => {
    const id = req.params.id;
    try {
        const incident = await getIncidentOr404(id, res);
        if (!incident) {
            return;
        }
        await incident.destroy();
        res.json({
            msg: 'Incident eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}

exports.uploadPicture = async (req, res) => {
    const id = req.params.id;
    try {
        const incident = await getIncidentOr404(id, res);
        if (!incident) {
            return;
        }
        if (!req.files) {
            res.status(400).json({
                msg: 'No se ha enviado el archivo'
            });
            return;
        }
        const file = req.files.image;
        const fileName = incident.id + '.jpg';
        file.mv(`public/uploads/${fileName}`);
        incident.imageUrl = fileName;
        await incident.save();
        res.json(incident);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.deletePicture = async (req, res) => {
    const id = req.params.id;
    try {
        const incident = await getIncidentOr404(id, res);
        if (!incident) {
            return;
        }
        incident.imageUrl = null;
        await incident.save();
        res.json(incident);
    } catch (error) {
        sendError500(error, res);
    }
}

async function getIncidentOr404(id, res) {
    const incident = await db.incident.findByPk(id, {
        include: [
            {
                model: db.user,
                as: 'incidentAcceptor',
            },
            {
                model: db.user,
                as: 'incidentModifier',
            },
            {
                model: db.point,
                as: 'point',
            },
            {
                model: db.incidentType,
                as: 'incidentType',
            }
        ]
    });

    if (!incident) {
        res.status(404).json({
            msg: 'Incident no encontrada'
        });
        return;
    }
    return incident;
}