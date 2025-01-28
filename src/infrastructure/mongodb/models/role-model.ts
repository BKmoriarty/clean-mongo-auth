import mongoose, {Schema, Document} from 'mongoose';

interface IRole extends Document {
  name: string;
  level: number;
  description?: string;
}

const RoleSchema: Schema = new Schema({
  name: {type: String, required: true, unique: true},
  level: {type: Number, required: true, default: 1},
  description: {type: String},
});

export const RoleModel = mongoose.model<IRole>('Role', RoleSchema);
