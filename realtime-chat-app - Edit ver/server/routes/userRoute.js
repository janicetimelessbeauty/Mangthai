const {register, login, setAvatar, getAllusers, saveBusyTime, loadData} = require("../controllers/userController")
const router = require("express").Router()
router.post("/register", register )
router.post("/login", login )
router.post("/setavatar/:id", setAvatar)
router.get("/allusers/:id", getAllusers)
router.post("/getsavedata/:id", saveBusyTime)
router.get("/loadingdata/:id", loadData)
module.exports = router