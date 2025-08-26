const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    userGoogleId: {
        type: String,
        default: null
    },
    history: [{
        chatId: String,
        chats: [
            {
                sender: String,
                msg: String
            }
        ],

    }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.password) return next();
    const hashedPass = await bcrypt.hash(this.password, 10);
    this.password = hashedPass;
    next();
});

userSchema.methods.verifyPassword = async function (userInput) {
    if (!this.password) return false;
    return await bcrypt.compare(userInput, this.password);
}

const User = model('users', userSchema);

module.exports = User