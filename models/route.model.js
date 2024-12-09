module.exports = (sequelize, Sequelize) => {
    const Route = sequelize.define("route", {
        name: {
            type: Sequelize.STRING
        },
        startMunicipalityId: {
            type: Sequelize.INTEGER
        },
        endMunicipalityId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        lastModifiedBy: {
            type: Sequelize.INTEGER
        },
    });
    return Route;
}
