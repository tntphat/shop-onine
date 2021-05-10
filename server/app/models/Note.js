const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema(
    {
        goods: [{
            product: {type: Schema.Types.ObjectId,ref: 'Product'},
            quantity: {type: Number}
        }],
        total_price: {type: Number,default: 0},
        supplier: {type:String}
    },
    {
        timestamps: true
    }
)

module.exports= mongoose.model('Note',NoteSchema)