import { Schema, model } from "mongoose";
import { User } from './../interfaces/user';
import bcrypt from 'bcryptjs';


const UserSchema: Schema = new Schema<User>(
    {
        name: {type:String, required:true, trim:true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required:true, minlength:8, maxlength:100},
        image: {type: String},
        wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        addresses : [{
            street: {type:String, required:true, trim:true},
            city: {type:String, required:true, trim:true},
            state: {type:String, required:true, trim:true},
            apartmentNo: {type:String, required:true, trim:true},
        }],
        role: {type:String, required:true, enum: ['manager', 'admin', 'user'], default: 'user'},
        active: { type: Boolean, default: true },
        passwordChangedAt: {type: Date},
        resetCode: {type: String},
        resetCodeExpireTime: {type: Date},
        resetCodeVerify: {type: Boolean}
    },{timestamps: true}
);

UserSchema.pre<User>('save', async function(next) {
    if(!this.isModified('password')){
        return next;
    }
    this.password = await bcrypt.hash(this.password, 13);
});

const UserModel = model<User>('User', UserSchema);

export default UserModel;