const jwt = require('jsonwebtoken')
const user = require('../db/model/User')
const auth = async (req,res,next)=>
{
    try
    {
        const authtoken = req.header('Authorization').replace('Bearer ','')
        const token =  jwt.verify(authtoken,'thisismywebtoken')
        const getuser = await user.findOne({_id:token._id,'Token.tokens':authtoken})
        
        if(!getuser)
        {
            throw new Error('cant find')
        }

        req.token = authtoken
        req.user = getuser
       next()
        
        
        


    }catch(e)
    {
        res.status(404)

    }

}
module.exports = auth