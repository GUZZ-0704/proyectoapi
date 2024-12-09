const dbConfig = require("../database/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: "mysql",
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.authToken = require("./authToken.model.js")(sequelize, Sequelize);
db.report = require("./report.model.js")(sequelize, Sequelize);
db.point = require("./point.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.incident = require("./incident.model.js")(sequelize, Sequelize);
db.incidentType = require("./incidentType.model.js")(sequelize, Sequelize);
db.municipality = require("./municipality.model.js")(sequelize, Sequelize);
db.route = require("./route.model.js")(sequelize, Sequelize);

// Relaciones entre modelos
db.user.belongsTo(db.role, {
  foreignKey: "roleId",
  as: "role",
});
db.role.hasMany(db.user, {
  foreignKey: "roleId",
  as: "users",
});

db.report.belongsTo(db.point, {
  foreignKey: "pointId",
  as: "point",
});
db.point.hasMany(db.report, {
  foreignKey: "pointId",
  as: "reports",
});

db.report.belongsTo(db.user, {
  foreignKey: "createdBy",
  as: "creator",
});
db.user.hasMany(db.report, {
  foreignKey: "createdBy",
  as: "createdReports",
});

db.report.belongsTo(db.user, {
  foreignKey: "lastModifiedBy",
  as: "lastModifier",
});
db.user.hasMany(db.report, {
  foreignKey: "lastModifiedBy",
  as: "modifiedReports",
});

db.report.belongsTo(db.user, {
  foreignKey: "acceptedBy",
  as: "acceptor",
});
db.user.hasMany(db.report, {
  foreignKey: "acceptedBy",
  as: "acceptedReports",
});

db.incident.belongsTo(db.point, {
  foreignKey: "pointId",
  as: "point",
});
db.point.hasMany(db.incident, {
  foreignKey: "pointId",
  as: "incidents",
});

db.incident.belongsTo(db.user, {
  foreignKey: "acceptedBy",
  as: "incidentAcceptor",
});
db.user.hasMany(db.incident, {
  foreignKey: "acceptedBy",
  as: "acceptedIncidents",
});

db.incident.belongsTo(db.user, {
  foreignKey: "lastModifiedBy",
  as: "incidentModifier",
});
db.user.hasMany(db.incident, {
  foreignKey: "lastModifiedBy",
  as: "modifiedIncidents",
});

db.incident.belongsTo(db.incidentType, {
  foreignKey: "incidentTypeId",
  as: "incidentType",
});
db.incidentType.hasMany(db.incident, {
  foreignKey: "incidentTypeId",
  as: "incidents",
});

db.municipality.belongsTo(db.point, {
  foreignKey: "pointId",
  as: "municipalityPoint",
});
db.point.hasMany(db.municipality, {
  foreignKey: "pointId",
  as: "municipalities",
});

db.municipality.belongsTo(db.user, {
  foreignKey: "createdBy",
  as: "municipalityCreator",
});
db.user.hasMany(db.municipality, {
  foreignKey: "createdBy",
  as: "createdMunicipalities",
});

db.municipality.belongsTo(db.user, {
  foreignKey: "lastModifiedBy",
  as: "municipalityModifier",
});
db.user.hasMany(db.municipality, {
  foreignKey: "lastModifiedBy",
  as: "modifiedMunicipalities",
});

db.route.belongsTo(db.municipality, {
  foreignKey: "startMunicipalityId",
  as: "startMunicipality",
});
db.municipality.hasMany(db.route, {
  foreignKey: "startMunicipalityId",
  as: "startingRoutes",
});

db.route.belongsTo(db.municipality, {
  foreignKey: "endMunicipalityId",
  as: "endMunicipality",
});
db.municipality.hasMany(db.route, {
  foreignKey: "endMunicipalityId",
  as: "endingRoutes",
});

db.route.belongsTo(db.user, {
  foreignKey: "createdBy",
  as: "routeCreator",
});
db.user.hasMany(db.route, {
  foreignKey: "createdBy",
  as: "createdRoutes",
});

db.route.belongsTo(db.user, {
  foreignKey: "lastModifiedBy",
  as: "routeModifier",
});
db.user.hasMany(db.route, {
  foreignKey: "lastModifiedBy",
  as: "modifiedRoutes",
});

db.authToken.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});
db.user.hasMany(db.authToken, {
  foreignKey: "userId",
  as: "authTokens",
  onDelete: "CASCADE",
});

db.route.belongsToMany(db.point, {
  through: 'route_point',
  as: 'routePoints',
  foreignKey: 'routeId',
  otherKey: 'pointId',
});

db.point.belongsToMany(db.route, {
  through: 'route_point',
  as: 'pointRoutes',
  foreignKey: 'pointId',
  otherKey: 'routeId',
});

module.exports = db;
