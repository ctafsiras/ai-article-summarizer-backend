"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), user_controller_1.UserControllers.createUser);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLE.user), user_controller_1.UserControllers.getMe);
router.patch('/update-me', (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserValidationSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.user), user_controller_1.UserControllers.updateUser);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user), user_controller_1.UserControllers.deleteUser);
exports.UserRoutes = router;
