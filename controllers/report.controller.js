const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listReport = async (req, res) => {
    try {
        const reports = await db.report.findAll({
           include: [
            {
                model: db.point,
                as: 'point',
            },
            {
                model: db.user,
                as: 'creator',
            },
            {
                model: db.user,
                as: 'acceptor',
            },
            {
                model: db.user,
                as: 'lastModifier',
            }
        ]
        });
        res.json(reports);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getReportById = async (req, res) => {
    const id = req.params.id;
    try {
        const report = await getReportOr404(id, res);
        if (!report) {
            return;
        }
        res.json(report);
    } catch (error) {
        sendError500(error, res);
    }
}


exports.createReport = async (req, res) => {
    try {
        const requiredFields = ['description', 'pointId'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ msg: 'La imagen es obligatoria' });
        }

        const file = req.files.image;

        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExtension = path.extname(file.name).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ msg: 'Formato de archivo no permitido' });
        }

        const uniqueFileName = `${uuidv4()}${fileExtension}`;

        const uploadPath = path.join(__dirname, '../public/uploads', uniqueFileName);

        file.mv(uploadPath, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Error al subir la imagen', error: err });
            }

            const imageUrl = `/uploads/${uniqueFileName}`;
            const report = await db.report.create({
                description: req.body.description,
                pointId: req.body.pointId,
                status: 'Pendiente',
                imageUrl,
            });

            res.status(201).json(report);
        });
    } catch (error) {
        sendError500(error, res);
    }
};


exports.updateReportPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const report = await getReportOr404(id, res);
        if (!report) {
            return;
        }
        const requiredFields = ['description', 'pointId', 'status'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        report.description = req.body.description;
        report.pointId = req.body.pointId;
        report.status = req.body.status;

        await report.save();
        res.json(report);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateReportPut = async (req, res) => {
    const id = req.params.id;
    try {
        const report = await getReportOr404(id, res);
        if (!report) {
            return;
        }
        const requiredFields = ['description', 'pointId', 'status'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        report.description = req.body.description;
        report.pointId = req.body.pointId;
        report.status = req.body.status

        await report.save();

        res.json(report);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deleteReport = async (req, res) => {
    const id = req.params.id;
    try {
        const report = await getReportOr404(id, res);
        if (!report) {
            return;
        }
        await report.destroy();
        res.json({
            msg: 'Report eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}


async function getReportOr404(id, res) {
    const report = await db.report.findByPk(id, {
        include: [
            {
                model: db.point,
                as: 'point',
            },
            {
                model: db.user,
                as: 'creator',
            },
            {
                model: db.user,
                as: 'acceptor',
            },
            {
                model: db.user,
                as: 'lastModifier',
            }
        ]
    });

    if (!report) {
        res.status(404).json({
            msg: 'Report no encontrada'
        });
        return;
    }
    return report;
}