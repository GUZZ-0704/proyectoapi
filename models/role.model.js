module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        type: {
            type: Sequelize.ENUM('admin', 'moderator'),
        },
    });
    return Role;
}
