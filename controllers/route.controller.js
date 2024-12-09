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
exports.listRoute = async (req, res) => {
    try {
        const routes = await db.route.findAll({
            include: [
            {
                model: db.user,
                as: 'routeCreator',
            },
            {
                model: db.user,
                as: 'routeModifier',
            },
            {
                model: db.point,
                as: 'routePoints', // Alias definido en la relación
                through: { attributes: [] }, // Para excluir atributos adicionales de la tabla intermedia
            },
            {
                model: db.municipality,
                as: 'startMunicipality',
            },
            {
                model: db.municipality,
                as: 'endMunicipality',
            },
        ]
        });
        res.json(routes);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getRoutesByStartMunicipalityId = async (req, res) => {
    const startMunicipalityId = req.params.startMunicipalityId;
    try {

        const routes = await db.route.findAll({
            where: {
                startMunicipalityId: startMunicipalityId
            },
           include: [
            {
                model: db.user,
                as: 'routeCreator',
            },
            {
                model: db.user,
                as: 'routeModifier',
            },
            {
                model: db.point,
                as: 'routePoints', // Alias definido en la relación
                through: { attributes: [] }, // Para excluir atributos adicionales de la tabla intermedia
            },
            {
                model: db.municipality,
                as: 'startMunicipality',
            },
            {
                model: db.municipality,
                as: 'endMunicipality',
            },
        ]
        });
        res.json(routes);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getRoutesByEndMunicipalityId = async (req, res) => {
    const endMunicipalityId = req.params.endMunicipalityId;
    try {

        const routes = await db.route.findAll({
            where: {
                endMunicipalityId: endMunicipalityId
            },
           include: [
            {
                model: db.user,
                as: 'routeCreator',
            },
            {
                model: db.user,
                as: 'routeModifier',
            },
            {
                model: db.point,
                as: 'routePoints', // Alias definido en la relación
                through: { attributes: [] }, // Para excluir atributos adicionales de la tabla intermedia
            },
            {
                model: db.municipality,
                as: 'startMunicipality',
            },
            {
                model: db.municipality,
                as: 'endMunicipality',
            },
        ]
        });
        res.json(routes);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getRouteById = async (req, res) => {
    const id = req.params.id;
    try {
        const route = await getRouteOr404(id, res);
        if (!route) {
            return;
        }
        res.json(route);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createRoute = async (req, res) => {

    const requiredFields = ['name', 'startMunicipalityId', 'endMunicipalityId' ,'createdById', 'lastModifiedById'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const route = {
            name: req.body.name,
            startMunicipalityId: req.body.startMunicipalityId,
            endMunicipalityId: req.body.endMunicipalityId,
            createdById: req.body.createdById,
            lastModifiedById: req.body.lastModifiedById,
            status: 'active'
        }
        const routeCreada = await db.route.create(route);

        res.status(201).json(routeCreada);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateRoutePatch = async (req, res) => {
    const id = req.params.id;
    try {
        const route = await getRouteOr404(id, res);
        if (!route) {
            return;
        }
        const requiredFields = ['name', 'startMunicipalityId', 'endMunicipalityId' , 'lastModifiedById'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        route.name = req.body.name || route.name;
        route.startMunicipalityId = req.body.startMunicipalityId || route.startMunicipalityId;
        route.endMunicipalityId = req.body.endMunicipalityId || route.endMunicipalityId;
        route.lastModifiedById = req.body.lastModifiedById || route.lastModifiedById;

        await route.save();
        res.json(route);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateRoutePut = async (req, res) => {
    const id = req.params.id;
    try {
        const route = await getRouteOr404(id, res);
        if (!route) {
            return;
        }
        const requiredFields = ['name', 'startMunicipalityId', 'endMunicipalityId' , 'lastModifiedById'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        route.name = req.body.name;
        route.startMunicipalityId = req.body.startMunicipalityId;
        route.endMunicipalityId = req.body.endMunicipalityId;
        route.lastModifiedById = req.body.lastModifiedById;

        await route.save();

        res.json(route);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.addPointToRoute = async (req, res) => {
    const id = req.params.id;
    try {
        const route = await getRouteOr404(id, res);
        if (!route) {
            return;
        }
        if (!req.body.pointId) {
            res.status(400).json({
                msg: 'El campo pointId es requerido'
            });
            return;
        }
        const point = await db.point.findByPk(req.body.pointId);
        if (!point) {
            res.status(404).json({
                msg: 'Punto no encontrado'
            });
            return;
        }
        lastModifiedById = req.body.lastModifiedById || route.lastModifiedById;
        route.lastModifiedById = lastModifiedById;
        route.save();

        await route.addRoutePoints(point);
        res.json(route);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.removePointFromRoute = async (req, res) => {
    const id = req.params.id;
    try {
        const route = await getRouteOr404(id, res);
        if (!route) {
            return;
        }
        if (!req.body.pointId) {
            res.status(400).json({
                msg: 'El campo pointId es requerido'
            });
            return;
        }
        const point = await db.point.findByPk(req.body.pointId);
        if (!point) {
            res.status(404).json({
                msg: 'Punto no encontrado'
            });
            return;
        }
        lastModifiedById = req.body.lastModifiedById || route.lastModifiedById;
        route.lastModifiedById = lastModifiedById;
        route.save();

        await route.removeRoutePoints(point);
        res.json(route);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.deleteRoute = async (req, res) => {
    const id = req.params.id;
    try {
        const route = await getRouteOr404(id, res);
        if (!route) {
            return;
        }
        await route.destroy();
        res.json({
            msg: 'Route eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}

async function getRouteOr404(id, res) {
    const route = await db.route.findByPk(id, {
        include: [
            {
                model: db.user,
                as: 'routeCreator',
            },
            {
                model: db.user,
                as: 'routeModifier',
            },
            {
                model: db.point,
                as: 'routePoints', // Alias definido en la relación
                through: { attributes: [] }, // Para excluir atributos adicionales de la tabla intermedia
            },
            {
                model: db.municipality,
                as: 'startMunicipality',
            },
            {
                model: db.municipality,
                as: 'endMunicipality',
            },
        ],
    });

    if (!route) {
        res.status(404).json({
            msg: 'Route no encontrada',
        });
        return;
    }
    return route;
}