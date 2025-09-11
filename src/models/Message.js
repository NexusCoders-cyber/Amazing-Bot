import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    messageId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    from: {
        type: String,
        required: true,
        index: true
    },
    sender: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    content: {
        type: String,
        default: ''
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'document', 'sticker', 'contact', 'location', 'liveLocation', 'poll', 'buttonResponse', 'listResponse'],
        default: 'text'
    },
    isGroup: {
        type: Boolean,
        default: false,
        index: true
    },
    hasMedia: {
        type: Boolean,
        default: false
    },
    isCommand: {
        type: Boolean,
        default: false
    },
    userData: {
        phone: String,
        name: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true,
    versionKey: false
});

MessageSchema.index({ from: 1, timestamp: -1 });
MessageSchema.index({ sender: 1, timestamp: -1 });
MessageSchema.index({ isCommand: 1, timestamp: -1 });

const Message = mongoose.model('Message', MessageSchema);

export const createMessage = async (messageData) => {
    try {
        const message = new Message(messageData);
        return await message.save();
    } catch (error) {
        throw error;
    }
};

export const getMessage = async (messageId) => {
    try {
        return await Message.findOne({ messageId });
    } catch (error) {
        throw error;
    }
};

export const getMessagesByUser = async (sender, limit = 50) => {
    try {
        return await Message.find({ sender }).sort({ timestamp: -1 }).limit(limit);
    } catch (error) {
        throw error;
    }
};

export const getMessagesByGroup = async (from, limit = 100) => {
    try {
        return await Message.find({ from, isGroup: true }).sort({ timestamp: -1 }).limit(limit);
    } catch (error) {
        throw error;
    }
};

export const deleteMessage = async (messageId) => {
    try {
        return await Message.findOneAndDelete({ messageId });
    } catch (error) {
        throw error;
    }
};

export const getMessageStats = async () => {
    try {
        const total = await Message.countDocuments();
        const commands = await Message.countDocuments({ isCommand: true });
        const media = await Message.countDocuments({ hasMedia: true });
        const group = await Message.countDocuments({ isGroup: true });
        const privateMessages = total - group;

        return { total, commands, media, group, private: privateMessages };
    } catch (error) {
        throw error;
    }
};

export { Message };