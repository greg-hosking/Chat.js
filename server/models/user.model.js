import mongoose from 'mongoose';

import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    portrait: {
      type: String,
      default: 'https://s3.amazonaws.com/chat.js/icons/user.png',
    },
    usernameColor: {
      type: String,
      default: '#ffffff',
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    rooms: {
      type: [
        {
          roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
          },
          role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member',
          },
        },
      ],
      default: [],
    },
    friends: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    friendRequests: {
      incoming: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        default: [],
      },
      outgoing: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        default: [],
      },
    },
    blocked: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  let user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
