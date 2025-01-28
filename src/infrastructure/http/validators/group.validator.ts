import mongoose, {Schema} from 'mongoose';

const EmbeddedRoleSchema = new Schema(
  {
    roleId: {type: Schema.Types.ObjectId, ref: 'Role', required: true},
    name: {type: String, required: true},
    description: String,
  },
  {_id: false},
);

const GroupSchema = new Schema({
  name: {type: String, required: true},
  description: String,
  roles: [EmbeddedRoleSchema],
});

export const GroupModel = mongoose.model('Group', GroupSchema);
