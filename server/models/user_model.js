const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const hashedPass = await bcrypt.hash(this.password, 10);
    this.password = hashedPass;
    next();
});

userSchema.methods.verifyPassword = async function (userInput) {
    return await bcrypt.compare(userInput, this.password);
}

const User = model('users', userSchema);

module.exports = User