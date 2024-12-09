module.exports = (sequelize, Sequelize) => {
    const AuthToken = sequelize.define("auth_token", {
        token: {
            type: Sequelize.STRING,
            unique: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return AuthToken;
}
