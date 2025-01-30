import mongoose, {Schema, Document} from 'mongoose';

interface IGroup extends Document {
  name: string;
  description?: string;
  roles: string[];
  parentId?: string | null;
}

const GroupSchema: Schema = new Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String},
  roles: [{type: Schema.Types.ObjectId, ref: 'Role'}],
  parentId: {type: Schema.Types.ObjectId, ref: 'Group', default: null},
});

export const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);
