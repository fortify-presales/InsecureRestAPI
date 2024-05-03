
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user_id: String,
    text: String,
    sent_date: Date,
    read_date: Date,
    is_read: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});
MessageSchema.index({'$**': 'text'});

// Export model.
module.exports = mongoose.model("message", MessageSchema);
