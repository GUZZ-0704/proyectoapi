module.exports = (sequelize, Sequelize) => {
    const Report = sequelize.define("report", {
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
    });
    return Report;
}