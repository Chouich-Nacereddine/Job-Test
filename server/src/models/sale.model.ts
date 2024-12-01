import mongoose, { Schema, Document } from "mongoose";
import { salesInterface } from "../types/interfaces";

export interface SaleDocument extends salesInterface, Document {}

const SaleSchema: Schema = new Schema({
  SaleID: { type: String, required: true, unique: true },
  ProductID: { type: String, required: true },
  Quantity: { type: String, required: true },
  Date: { type: Date, required: true },
  TotalAmount: { type: String, required: true },
});

export default mongoose.model<SaleDocument>("Sale", SaleSchema);
