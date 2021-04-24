const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    mail_author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Mail", MailSchema);
