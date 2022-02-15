const express = require("express");
const router = express.Router();
const group = require("../controllers/groupController");
const { userAuthentication } = require("../middleware/authVerification");

router.post("/createGroup", userAuthentication, group.createGroup);
router.get("/searchPublicGroups", userAuthentication, group.searchPublicGroups);
router.get("/getUserGroups", userAuthentication, group.getUserGroups);
router.get("/getListOfMembersInGroup/:id", userAuthentication, group.getListOfMembersInGroup);
router.post("/addMemberToGroup", userAuthentication, group.addMemberToGroup);
router.put("/contributeAmountToGroup", userAuthentication, group.contributeAmountToGroup);

module.exports = router;
