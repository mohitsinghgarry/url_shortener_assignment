import mongoose, { Document, Schema } from 'mongoose';

// Interface for individual click data
interface IClickData {
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  referrer?: string;
}

// Main URL interface
export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt?: Date;
  clicks: number;
  clickData: IClickData[];
  isExpired(): boolean;
}

const UrlSchema: Schema = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickData: [{
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    ip: String,
    userAgent: String,
    referrer: String
  }]
});

// Add method to check expiration
UrlSchema.methods.isExpired = function(): boolean {
  return this.expiresAt && this.expiresAt < new Date();
};

export default mongoose.model<IUrl>('Url', UrlSchema);