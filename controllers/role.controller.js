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
exports.listRole = async (req, res) => {
    try {
        const roles = await db.role.findAll({
            include: [
            {
                model: db.user,
                as: 'users',
            }
        ]
        });
        res.json(roles);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getRoleById = async (req, res) => {
    const id = req.params.id;
    try {
        const role = await getRoleOr404(id, res);
        if (!role) {
            return;
        }
        res.json(role);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createRole = async (req, res) => {

    const requiredFields = ['type'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const role = {
            type: req.body.type,
        }
        const roleCreada = await db.role.create(role);

        res.status(201).json(roleCreada);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateRolePatch = async (req, res) => {
    const id = req.params.id;
    try {
        const role = await getRoleOr404(id, res);
        if (!role) {
            return;
        }
        const requiredFields = ['type'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        role.type = req.body.type;

        await role.save();
        res.json(role);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateRolePut = async (req, res) => {
    const id = req.params.id;
    try {
        const role = await getRoleOr404(id, res);
        if (!role) {
            return;
        }
        const requiredFields = ['type'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        role.type = req.body.type;

        await role.save();

        res.json(role);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deleteRole = async (req, res) => {
    const id = req.params.id;
    try {
        const role = await getRoleOr404(id, res);
        if (!role) {
            return;
        }
        await role.destroy();
        res.json({
            msg: 'Role eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}

async function getRoleOr404(id, res) {
    const role = await db.role.findByPk(id, {
        include: [
            {
                model: db.user,
                as: 'users',
            }
        ]
    });

    if (!role) {
        res.status(404).json({
            msg: 'Role no encontrada'
        });
        return;
    }
    return role;
}