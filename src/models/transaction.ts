import mongoose, { Schema, Document } from 'mongoose';

interface Transaction extends Document {
  userId: string;
  transactionType: string;
  formData: Record<string, any>;
  createdAt: Date;
}

const TransactionSchema = new Schema<Transaction>({
  userId: { type: String, required: true },
  transactionType: { type: String, required: true },
  formData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model<Transaction>('Transaction', TransactionSchema);
