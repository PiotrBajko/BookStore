import * as mongoose from "mongoose";


export class Book{
    constructor(
        public id:Number,
        public author:String,
        public title:String,
        public length:Number,
        public price:Number
    ){}
}

export const BookSchema = new mongoose.Schema({
    title:{ type:String, required:true},
    author:{type:String, required:true},
    length:{type:Number, required:true},
    price:{type:Number, require:true}
})
