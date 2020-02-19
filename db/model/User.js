const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const task = require('../model/Schedule')
const Schema = mongoose.Schema

  const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required:true
    },
    Token:
    [{
        tokens:{
            type:String
        }
    }],
    avatar:{
        type: Buffer
    }
  },{timestamps:true})
  UserSchema.virtual('tasks',{
      ref:'Schedule',
      localField:'_id',
      foreignField:'owner'
  })
  UserSchema.methods.toJSON = function()
  {
      const user = this
      const objectfromuser = user.toObject()
      delete objectfromuser.password
      delete objectfromuser.Token
      delete objectfromuser._id
      return objectfromuser
  }
  UserSchema.methods.token = async function()
  {
      console.log('start');
      
      try{
      const user = this
      const code = jwt.sign( {_id:user._id.toString()},process.env.JWT_SIGN)
      user.Token = await user.Token.concat({tokens:code})
      await user.save()
      return decoded
      }catch(e)
      {
          
      }

  }
  UserSchema.statics.crdination = async (email,password)=>
  {
      
      const getuser = await user.findOne({email:email})
      if(!getuser)
      {
          throw new Error('not found email')
          
      }
      const realpassword = getuser.password
      const passwordcompare =await bcrypt.compare(password,realpassword)
      if(!passwordcompare)
      {
          throw new Error('password not compare')

      }
      return getuser


  }
  UserSchema.pre('save', async function (next)
  {
      const user = this

      if(user.isModified('password'))
      {
          const password = await bcrypt.hash(user.password, process.env.BCRYPT_TOKEN);
          user.password = password
      }
      next()


  })
  UserSchema.pre('remove',async function (next){
      const user = this
      await task.deleteMany({owner:user._id})
      next()
  })
  const user = mongoose.model('User',UserSchema)
  module.exports = user

