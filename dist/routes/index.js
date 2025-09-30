"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = require("../controllers/clientController");
const purchaseController_1 = require("../controllers/purchaseController");
const router = (0, express_1.Router)();
router.post('/client', clientController_1.ClientController.registerClient);
router.post('/purchase', purchaseController_1.PurchaseController.processPurchase);
exports.default = router;
