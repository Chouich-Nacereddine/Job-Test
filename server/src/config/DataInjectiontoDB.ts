import fs from 'fs'; // this is used to interact with the file system of the operating system so that we can read the .csv files
import path from 'path'; // this is used here to get the correct format of the files paths
import csv from 'csv-parser'; // this is used to convert the .csv data to Js objects


import Product from '../models/product.model'; // this is the prducts Entity
import { productsInterface } from '../types/interfaces'; // this is the prducts interface
import Sale from '../models/sale.model'; // this is the sales Entity
import { salesInterface } from '../types/interfaces'; // this is the sales interface

const productFilePath = path.resolve(__dirname, '../data/products.csv'); // here we have the products.csv path stored in the productFilePath variable
const saleFilePath = path.resolve(__dirname, '../data/sales.csv'); // here we have the sales.csv path stored in the saleFilePath variable


// this is a function to post products.csv data to MongoDB collection
const InjectProductData = async (): Promise<void> => {
  const products: productsInterface[] = []; // empty array of type productsInterface

  fs.createReadStream(productFilePath)
    .pipe(csv())
    .on('data', (row) => {
      products.push({
        ProductID: row.ProductID,  
        ProductName: row.ProductName,
        Category: row.Category,
        Price: row.Price,  
      } as productsInterface);
    })
    .on('end', async () => {
      try {
        const count = await Product.countDocuments();
        if (count === 0) {
          await Product.insertMany(products, { ordered: false });
          console.log('Products Data injected from file successfuly!');
        } else {
          console.log('Product Data is already injected');
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    });
};


// this is a function to post sales.csv data to MongoDB collection
const InjectSaleData = async (): Promise<void> => {
  const sales: salesInterface[] = []; // empty array of type salesInterface

  fs.createReadStream(saleFilePath)
    .pipe(csv())
    .on('data', (row) => {
      sales.push({
        SaleID: row.SaleID,  
        ProductID: row.ProductID,  
        Quantity: row.Quantity,  
        Date: row.Date,   
        TotalAmount: row.TotalAmount, 
      } as salesInterface);
    })
    .on('end', async () => {
      try {
        const count = await Sale.countDocuments();
        if (count === 0) {
          await Sale.insertMany(sales, { ordered: false });
          console.log('Sales Data injected from file successfuly!');
        } else {
          console.log('Sale Data is already injected');
        }
      } catch (error) {
        console.error('Error loading sales:', error);
      }
    });
};


// this is a function to post both products and sales data to the mongodb database
const InjectData = async (): Promise<void> => {
  await InjectProductData();
  await InjectSaleData();
};

export default InjectData; // it's exported to be used in the server.ts file to inject the data after connecting to mongoDB
