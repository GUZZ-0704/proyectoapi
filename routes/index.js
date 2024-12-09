module.exports = app => {
    require("./auth.routes")(app);
    require("./incident.routes")(app);
    require("./incidentType.routes")(app);
    require("./municipality.routes")(app);
    require("./point.routes")(app);
    require("./report.routes")(app);
    require("./role.routes")(app);
    require("./route.routes")(app);
    require("./user.routes")(app);
}