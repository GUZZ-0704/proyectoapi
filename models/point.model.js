module.exports = (sequelize, Sequelize) => {
    const Point = sequelize.define("point", {
        lat: {
            type: Sequelize.FLOAT
        },
        lng: {
            type: Sequelize.FLOAT
        },
    });
    return Point;
}