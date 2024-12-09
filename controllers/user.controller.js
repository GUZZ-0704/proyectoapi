const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
const sha1 = require('sha1');

exports.listUsers = async (req, res) => {
    try {
        const users = await db.user.findAll({
           include: [
            {
                model: db.role,
                as: 'role',
            },
            {
                model: db.report,
                as: 'createdReports',
            },
            {
                model: db.report,
                as: 'acceptedReports',
            },
            {
                model: db.report,
                as: 'modifiedReports',
            },
            {
                model: db.municipality,
                as: 'createdMunicipalities',
            },
            {
                model: db.municipality,
                as: 'modifiedMunicipalities',
            },
            {
                model: db.route,
                as: 'createdRoutes',
            },
            {
                model: db.route,
                as: 'modifiedRoutes',
            }
        ]
        });
        res.json(users);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await getUserOr404(id, res);
        if (!user) {
            return;
        }
        res.json(user);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createUser = async (req, res) => {
    const requiredFields = ['name', 'email', 'password', 'roleId'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {
        const email = req.body.email;
        const userExistente = await db.user.findOne({
            where: {
                email: email
            }
        });
        if (userExistente) {
            res.status(400).json({
                msg: 'El email ya está registrado'
            });
            return;
        }
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: sha1(req.body.password),
            roleId: req.body.roleId
        }
        const userCreada = await db.user.create(user);
        const userRespuesta = await db.user.findByPk(userCreada.id);

        res.status(201).json(userRespuesta);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateUserPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await getUserOr404(id, res);
        if (!user) {
            return;
        }
        const email = req.body.email;
        const userExistente = await db.user.findOne(
            {
                where: {
                    email: email
                }
            }
        );
        if (userExistente && userExistente.id !== user.id) {
            res.status(400).json({
                msg: 'El email ya está registrado'
            });
            return;
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.roleId = req.body.roleId || user.roleId;

        await user.save();
        res.json(user);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateUserPut = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await getUserOr404(id, res);
        if (!user) {
            return;
        }
        const requiredFields = ['email', 'roleId', 'name'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        const email = req.body.email;
        const userExistente = await db.user.findOne(
            {
                where: {
                    email: email
                }
            }
        );
        if (userExistente && userExistente.id !== user.id) {
            res.status(400).json({
                msg: 'El email ya está registrado'
            });
            return;
        }
        user.name = req.body.name;
        user.email = req.body.email;
        user.roleId = req.body.roleId;

        await user.save();

        res.json(user);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await getUserOr404(id, res);
        if (!user) {
            return;
        }
        await user.destroy();
        res.json({
            msg: 'User eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}

exports.updatePassword = async (req, res) => {
    const id = req.params.id;
    const requiredFields = ['password'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {
        const user = await getUserOr404(id, res);
        if (!user) {
            return;
        }
        user.password = sha1(req.body.password);
        await user.save();
        res.json(user);
    } catch (error) {
        sendError500(error, res);
    }
}

async function getUserOr404(id, res) {
    const user = await db.user.findByPk(id, {
        include: [
            {
                model: db.role,
                as: 'role',
            },
            {
                model: db.report,
                as: 'createdReports',
            },
            {
                model: db.report,
                as: 'acceptedReports',
            },
            {
                model: db.report,
                as: 'modifiedReports',
            },
            {
                model: db.municipality,
                as: 'createdMunicipalities',
            },
            {
                model: db.municipality,
                as: 'modifiedMunicipalities',
            },
            {
                model: db.route,
                as: 'createdRoutes',
            },
            {
                model: db.route,
                as: 'modifiedRoutes',
            }
        ]
    });

    if (!user) {
        res.status(404).json({
            msg: 'User no encontrado'
        });
        return;
    }
    return user;
}