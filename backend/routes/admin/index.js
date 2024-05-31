const router = require("express").Router();
const { adminMiddleware } = require("../../utils/middleware/auth");
const positionRoutes = require("./positionRoutes");
const overtimeRoutes = require("./overtimeRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const salaryCutRoutes = require("./salaryCutRoutes");

router.use(adminMiddleware);
router.use("/position", positionRoutes);
router.use("/overtimes", overtimeRoutes);
router.use("/attendances", attendanceRoutes);
router.use("/salarycuts", salaryCutRoutes);

module.exports = router;
