const monogoose = require('mongoose')
const Schema = monogoose.Schema

const ScheduleSChema = new Schema({
    priority:{
        type:String,
        required:true
    },
    task:{
        type:String
    },
    date:{
        type:Date
    },
    owner:{
        type:String,
        ref:'User'
    }
},{timestamps:true})
ScheduleSChema.methods.toJSON = function()
{
    const schedule = this
    const schedulecopy = schedule.toObject()
    delete schedulecopy._id
    return schedulecopy

}
const Schedule = monogoose.model('Schedule',ScheduleSChema)
module.exports = Schedule