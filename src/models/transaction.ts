import mongoose, { Schema, Document } from 'mongoose';

// Define a transaction interface
interface Transaction extends Document {
  userId: string;
  transactionType: string;
  formData: Record<string, any>;
  createdAt: Date;
}

// Define the schema
const TransactionSchema = new Schema<Transaction>({
  userId: { type: String, required: true },
  transactionType: { type: String, required: true },
  formData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export the model (ensure it's not recompiled during hot reloads)
export default mongoose.models.Transaction ||
  mongoose.model<Transaction>('Transaction', TransactionSchema);
