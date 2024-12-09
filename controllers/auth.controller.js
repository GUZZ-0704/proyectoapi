const sha1 = require('sha1');
const db = require('../models');
const { isRequestValid } = require('../utils/request.utils');
const jwt = require("jsonwebtoken");
const dbConfig = require("../database/db.config.js");


exports.login = async (req, res) => {
    const requiredFields = ['email', 'password'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await db.user.findOne({
        where: {
            email: email,
            password: sha1(password)
        }
    });

    if (!user) {
        res.status(401).json({
            msg: 'Unauthorized'
        });
        return;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        }, dbConfig.JWT_SECRET, {
        expiresIn: '1h'
    }
    )
    await db.authToken.create({
        token: token,
        userId: user.id,
        roleId: user.roleId
    });
    res.json({
        token: token,
        userId: user.id,
    });
}

exports.logout = async (req, res) => {
    const token = req.headers.authorization;
    const splitToken = token.split(' ');
    await db.authToken.destroy({
        where: {
            token: splitToken[1]
        }
    });
    res.json({
        msg: 'Logout'
    });
}

exports.me = async (req, res) => {
    const token = req.headers.authorization;
    const splitToken = token.split(' ');

    const tokenObj = await db.authToken.findOne({
        where: {
            token: splitToken[1]
        }
    });
    if (!tokenObj) {
        res.status(401).json({
            msg: 'Unauthorized'
        });
        return;
    }
    const user = await db.user.findByPk(tokenObj.userId);
    res.json(user);
}