const mongoose = require("mongoose");
const {ModificationNote} = require("./common");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: String,
    name: {
        type: {
            first_name: String,
            middle_name: String,
            last_name: String
        }
    },
    email: String,
    phone_number: String,
    address: {
        type: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String
        }
    },
    is_enabled: {
        type: Boolean,
        default: false
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [ModificationNote]
});
UserSchema.index({'$**': 'text'});


/*
// Virtual for users full.
UserSchema.childSchemasvirtual("name").get(function () {
    return this.first_name + this. + this.first_name;
});

// Virtual for this user instance URL.
UserSchema.virtual("url").get(function () {
    return "/catalog/user/" + this._id;
});
*/

// Export model.
module.exports = mongoose.model("user", UserSchema);
