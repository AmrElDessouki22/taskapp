const express = require('express')
const user = require('../db/model/User')
const schedule = require('../db/model/Schedule')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const uploadMulter = require('../src/uploadMulter')
const grid = require('../src/sendGrid')


const app = new express.Router()


app.post('/adduser',async(req,res)=>
{
    try{
        const adduser = await user(req.body).save()
        await adduser.token()
      
        res.send(adduser)
    }catch(e){
        res.status(404).send(e)
    }
})

app.post('/login',async(req,res)=>
{
    try{
        const adduser = await user.crdination(req.body.email,req.body.password)
        await adduser.token()
        res.send(adduser)
    }catch(e){
        res.status(404).send(e)
    }
})

app.post('/logout',auth,async(req,res)=>
{
    try{
        console.log(req.user);
         req.user.Token = req.user.Token.filter((t)=>
        {
            return t.tokens  !== req.token
        })
        
        
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(404).send(e)
    }
})
app.post('/logoutall',auth,async(req,res)=>
{
    try{
         req.user.Token = [] 

        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(404).send(e)
    }
})
app.patch('/updateuser',auth,async(req,res)=>
{
         const allawed = ['email','password']
         const keys = Object.keys(req.body)
         const isallawed = keys.every((key)=>allawed.includes(key))
    try{
        if(isallawed){
         keys.forEach((key)=>
         {
             req.user[key]=req.body[key]
         })
        await req.user.save()
        res.send(req.user)
        }else{
            throw new Error('erro not allawed keys')
        }
    }catch(e){
        res.status(404).send(e)
    }
})
app.post('/addtask',auth,async(req,res)=>
{
    
    try{
         const task = await schedule({...req.body , owner:req.user._id , date:new Date()})
         await task.save()
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

app.get('/mytask',auth,async(req,res)=>
{
    const sorted = req.query.sortBy.split(':')
    const sort = {}
    const part0 = sorted[0]
    const part1 = sorted[1]
    if(req.query.sortBy)
    {
        sort[part0] = part1 === 'desc' ? -1 : 1
    }
   
    try{
         const tasks = await req.user.populate({
             path:'tasks',
             match:{
                 priority:req.query.priority.toString()
             },
             options: {
                 limit:parseInt(req.query.limit),
                 skip:parseInt(req.query.skip),
                 sort

             }
         }).execPopulate()
         console.log(part0 + part1);
         
         
        res.send(tasks.tasks)
    }catch(e){
        res.status(404).send(e)
    }
})
app.post('/updatetask/:id',auth,async(req,res)=>
{
    const allawed = ['priority','task']
    const keys = Object.keys(req.body)
    const isallawed = keys.every((key)=> allawed.includes(key))
    console.log(isallawed)  
    const task = await schedule.findOne({_id:req.params.id})
    console.log(req.user._id);
    console.log(task);
    try{
        if(req.user._id == task.owner)
        {
           
            
        keys.forEach((key)=>
        {
            task[key] = req.body[key]
            
        })
        await task.save()
        res.send(task)
    }else
    {
        throw new Error('cant edite task')
    }
    }catch(e){
        res.status(404).send(e)
    }
})
app.delete('/deletetask/:id',auth,async(req,res)=>
{
         
    try{
         const deletetask = await schedule.deleteOne({_id:req.params.id})
         await deletetask.save()
        res.send('delete done')
    }catch(e){
        res.status(404).send(e)
    }
})

app.get('/getowner/:id',auth,async(req,res)=>
{
    try{
        const task = await schedule.findById(req.params.id)
        const owner =  await task.populate('owner').execPopulate()
        res.send(owner.owner)
    }catch(e){
        res.status(404).send(e)
    }
})
app.delete('/remove',auth,async(req,res)=>
{
    try{
        await req.user.remove()
        res.send(owner.owner)
    }catch(e){
        res.status(404).send(e)
    }
})

app.post('/users/me/avatars',auth,uploadMulter.single('avatars'),async(req,res)=>
{
    
    try{

    const buffer = await sharp(req.file.buffer)
    .rotate()
    .resize({height:250,width: 250})
    .png()
    .toBuffer()
    req.user.avatar = buffer
    await req.user.save()
        res.send('done')
    }catch(e){
        res.status(404).send(e)
    }
},(error,req,res,next)=>
{
    res.send({error:error.message})
})
app.delete('/users/avatars',auth,async(req,res)=>
{
    
    try{
    if(!req.user.avatar)
    {
        return new Error('not found')

    }
    req.user.avatar = undefined
    req.user.save()
    res.send(req.user.avatar)
    }catch(e){
        res.status(404).send(e)
    }
},(error,req,res,next)=>
{
    res.send({error:error.message})
})
app.get('/users/:id/avatars',async(req,res)=>
{
    
    try{
    const user_avatar = await user.findById(req.params.id) 
    if(!user_avatar && !user_avatar.avatar)
    {
        return new Error('not found')

    }
    res.set('Content-Type','image/jpg')
    res.send(user_avatar.avatar)
    }catch(e){
        res.status(404).send(e)
    }
},(error,req,res,next)=>
{
    res.send({error:error.message})
})
//const msg = {
//    from: 'test@example.com',
//    subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//  }
  app.post('/email',auth,async(req,res)=>
{
    
    try{
    const msg = { ...req.body,from:req.user.email}
    grid.send(msg)
    res.send(msg)
    }catch(e){
        res.status(404).send(e.message)
    }
},(error,req,res,next)=>
{
    res.send({error:error.message})
})




app.get('',(req,res)=>
{
    res.render('index',{url : 'http://localhost:3000/users/5e443c4aa2b629495c4db54a/avatars'})
})

module.exports = app