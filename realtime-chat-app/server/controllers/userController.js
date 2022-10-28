const User = require("../model/userModel")
const bcrypt = require("bcrypt")
module.exports.register =  async (req, res, next) => {
    try {
     const {username, email, password} = req.body
     const usernameCheck = await User.findOne({username})
     if (usernameCheck) {
        return res.json({msg: "Username already used", status: false})
     }
     const emailCheck = await User.findOne({email})
     if (emailCheck) {
        return res.json({msg: "Email already used", status: false})
     }
     const hashedPass = await bcrypt.hash(password, 10)
     const account = User.create({
        email,
        username,
        password: hashedPass,
     })
     delete account.password
     return res.json({status: true, account})
   }
   catch (ex) {
      next(ex)
   }
}
module.exports.login =  async (req, res, next) => {
   try {
    const {username, password} = req.body
    const account = await User.findOne({username})
    if (!account) {
       return res.json({msg: "Incorrect username or password", status: false})
    }
    const passwordCheck = await bcrypt.compare(password, account.password)
    if (!passwordCheck) {
       return res.json({msg: "Incorrect username or password", status: false})
    }
    delete account.password
    return res.json({status: true, account})
  }
  catch (ex) {
     next(ex)
  }
}
module.exports.setAvatar = async (req, res, next) => {
   try {
     const userId = req.params.id;
     const avatarImage = req.body.image;
     const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
     })
     return res.json({
      isSet : userData.isAvatarImageSet,
      image: userData.avatarImage,
     })
   }
   catch(ex) {
      next(ex)
   }
}
module.exports.getAllusers = async (req,res, next) => {
   try {
      const allusersdata = await User.find({_id : {$ne: req.params.id}}).select([
         "email",
         "username",
         "avatarImage",
         "_id"
      ])
      return res.json(allusersdata)
   }
   catch(ex) {
      next(ex)
   }
}