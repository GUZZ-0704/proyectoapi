module.exports = (sequelize, Sequelize) => {
    const IncidentType = sequelize.define("incident_type", {
        name: {
            type: Sequelize.ENUM('Restriccion Vehicular',
                'Transitable con desvios',
                'No transitable por conflictos sociales',
                'No transible trafico cerrado',
                'Restriccion vehicular especial')
        },
        isPassable: {
            type: Sequelize.BOOLEAN
        },
    });
    return IncidentType;
}