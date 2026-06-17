import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    userName: { type: String, required: true },
    userChats:{type: [Number], required: true},
    password: { type: String, required: true }
});

const ContentSchema = new mongoose.Schema({
    content: String,
    type: String,
})

const MessageSchema = new mongoose.Schema({
    messageId: Number,
    messageContent: ContentSchema,
    ownerId: Number,
    ownerName: String,
    time: String
});

const ChatSchema = new mongoose.Schema({
    chatId: { type: Number, required: true, unique: true },
    chatParticipants: [Number],
    chatHistory: [MessageSchema]
});

export const UserModel = mongoose.model('User', UserSchema, 'users');
export const ChatModel = mongoose.model('Chat', ChatSchema, 'chats');