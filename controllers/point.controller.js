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
exports.listPoint = async (req, res) => {
    try {
        const points = await db.point.findAll({
            include: [
            {
                model: db.report,
                as: 'reports',
            },
            {
                model: db.incident,
                as: 'incidents',
            },
            {
                model: db.municipality,
                as: 'municipalities',
            },
            {
                model: db.route,
                through: 'route_point',
                as: 'pointRoutes',
            }
        ]
        });
        res.json(points);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getPointById = async (req, res) => {
    const id = req.params.id;
    try {
        const point = await getPointOr404(id, res);
        if (!point) {
            return;
        }
        res.json(point);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createPoint = async (req, res) => {

    const requiredFields = ['lat', 'lng'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const point = {
            lat: req.body.lat,
            lng: req.body.lng,
        }
        const pointCreada = await db.point.create(point);

        res.status(201).json(pointCreada);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updatePointPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const point = await getPointOr404(id, res);
        if (!point) {
            return;
        }
        const requiredFields = ['lat', 'lng'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        point.lat = req.body.lat || point.lat;
        point.lng = req.body.lng || point.lng;

        await point.save();
        res.json(point);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updatePointPut = async (req, res) => {
    const id = req.params.id;
    try {
        const point = await getPointOr404(id, res);
        if (!point) {
            return;
        }
        const requiredFields = ['lat', 'lng'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        point.lat = req.body.lat;
        point.lng = req.body.lng;

        await point.save();

        res.json(point);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deletePoint = async (req, res) => {
    const id = req.params.id;
    try {
        const point = await getPointOr404(id, res);
        if (!point) {
            return;
        }
        await point.destroy();
        res.json({
            msg: 'Point eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}

async function getPointOr404(id, res) {
    const point = await db.point.findByPk(id, {
        include: [
            {
                model: db.report,
                as: 'reports',
            },
            {
                model: db.incident,
                as: 'incidents',
            },
            {
                model: db.municipality,
                as: 'municipalities',
            },
            {
                model: db.route,
                through: 'route_point',
                as: 'pointRoutes',
            }
        ]
    });

    if (!point) {
        res.status(404).json({
            msg: 'Point no encontrada'
        });
        return;
    }
    return point;
}