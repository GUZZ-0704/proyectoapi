module.exports = (sequelize, Sequelize) => {
    const Municipality = sequelize.define("municipality", {
        name: {
            type: Sequelize.STRING
        },
        pointId: {
            type: Sequelize.INTEGER
        },
        radius: {
            type: Sequelize.FLOAT
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        lastModifiedBy: {
            type: Sequelize.INTEGER
        },
    });
    return Municipality;
}