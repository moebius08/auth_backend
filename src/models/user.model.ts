import mongoose from "mongoose";
import { comparePassword, hashValue } from "../utils/bcrypt";


export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: false }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }

    this.password = await hashValue(this.password)
    next()
})

userSchema.methods.comparePassword = async function (val: string) {
    return comparePassword(val, this.password)
}

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;