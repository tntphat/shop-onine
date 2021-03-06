const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema(
  {
    goods: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        quantityLeft: { type: Number },
      },
    ],
    import_notes: [{ type: Schema.Types.ObjectId, ref: "ImportNote" }],
    orderer: { type: Schema.Types.ObjectId, ref: "Employee" },
    total_price: { type: Number, default: 0 },
    supplier: { type: String },
    status: { type: Boolean, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", NoteSchema);
