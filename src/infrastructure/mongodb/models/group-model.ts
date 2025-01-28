import mongoose, {Schema, Document} from 'mongoose';

interface IGroup extends Document {
  name: string;
  description?: string;
  roles: string[];
}

const GroupSchema: Schema = new Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String},
  roles: [{type: Schema.Types.ObjectId, ref: 'Role'}],
});

export const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);
