import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    users: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: [true, 'User already exists in this room'],
          },
          role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member',
          },
          status: {
            type: String,
            enum: ['pending', 'accepted'],
            default: 'pending',
          },
        },
      ],
      default: [],
    },
    messages: {
      type: [
        {
          senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          message: {
            type: String,
            required: [true, 'Message is required'],
            maxlength: [1000, 'Message cannot be more than 1000 characters'],
          },
        },
        {
          timestamps: true,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
