import mongoose, { Schema, Document } from 'mongoose';
import { productsInterface } from '../types/interfaces';

export interface ProductDocument extends productsInterface, Document {}

const ProductSchema: Schema = new Schema({
  ProductID: { type: String, required: true, unique: true }, 
  ProductName: { type: String, required: true },
  Category: { type: String, required: true },
  Price: { type: String, required: true },  
});

export default mongoose.model<ProductDocument>('Product', ProductSchema);
