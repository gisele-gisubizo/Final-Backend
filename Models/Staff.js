import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ['kitchen', 'waiter'],
        default: 'kitchen',
        required: true,
    },
    shift: { 
        type: String,
        enum: ['day', 'evening', null],
        default: null,
        validate: {
            validator: function(value) {
                if (this.role === 'waiter') {
                    return value === 'day' || value === 'evening';
                }
                return value === null;
            },
            message: 'Shift must be "day" or "evening" for waiters and null for kitchen staff'
        }
    },
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);