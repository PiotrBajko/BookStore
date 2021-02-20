import * as mongoose from "mongoose";


export class User{
    constructor(
        public id:Number,
        public username:String,
        public password:String,
    ){}
}

export const UserSchema = new mongoose.Schema({
    username:{ type:String, required:true},
    password:{type:String, required:true},
})