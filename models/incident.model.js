module.exports = (sequelize, Sequelize) => {
    const Incident = sequelize.define("incident", {
        description: {
            type: Sequelize.STRING
        },
        pointId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING
        },
        imageUrl: {
            type: Sequelize.STRING
        },
        acceptedBy: {
            type: Sequelize.INTEGER
        },
        lastModifiedBy: {
            type: Sequelize.INTEGER
        },
    });
    return Incident;
}