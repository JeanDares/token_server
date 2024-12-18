const express = require("express")
const router = express.Router()
const JwtController = require("./controllers/jwt")

router.get("/", (req, res) => {
    res.send("Hello World!")
});

router.post("/generate-token", JwtController.generateToken)
router.get("/validate-token", JwtController.validateToken)
router.post("/refresh-token", JwtController.refreshToken)

module.exports = router