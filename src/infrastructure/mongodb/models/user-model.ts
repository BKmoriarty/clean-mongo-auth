import mongoose, {Schema, Document} from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  groupIds: mongoose.Types.ObjectId[];
  selectedRoles: mongoose.Types.ObjectId[]; // Array of role IDs selected by the user
}

const userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  password: {type: String, required: true},
  groupIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],
  selectedRoles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}],
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Hash password before update if password is modified
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as any;
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
