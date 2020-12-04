import { Router } from "../deps.js";
import * as viewsController from "./controllers/viewsController.js";
import * as reportingController from "./controllers/reportingController.js";
import * as authController from "./controllers/authController.js";

const router = new Router();

router.get('/auth/registration', authController.register_get);
router.post('/auth/registration', authController.register_post);
router.get('/auth/login', authController.login_get);
router.post('/auth/login', authController.login_post);
router.post('/auth/logout', authController.logout);
router.get('/behaviour/reporting', reportingController.reporting);
router.post('/behaviour/reporting/morning', reportingController.morning_post);
router.get('/behaviour/reporting/morning', reportingController.morning_get);
router.post('/behaviour/reporting/evening', reportingController.evening_post);
router.get('/behaviour/reporting/evening', reportingController.evening_get);
router.get('/behaviour/summary', viewsController.summary);
router.get('/', viewsController.main);

router.get('/api/summary');
router.get('/api/summary/:year/:month/:day');

export { router };