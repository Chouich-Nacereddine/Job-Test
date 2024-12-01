import Sale from "../models/sale.model"; // Use the correct model (Sale)
import Product from "../models/product.model"; // Use the correct model (Sale)
import express, { Request, Response, Router } from "express";
import { filter } from "../utils/functions"; // this is documented in ../utils/functions.ts file
const router = Router();

router.get("/products", async (req: Request, res: Response) => {
  try {
    const { startDate, currentDate } = filter(req.query.days); // this uses the filter function to return start date and currente date

    const productSales = await Sale.aggregate([
      {
        $match: {
          Date: {
            $gte: startDate,
            $lte: currentDate,
          },
        },
      },
      {
        $group: {
          _id: "$ProductID", 
          totalQuantity: { $sum: { $toInt: "$Quantity" } }, 
          totalAmount: { $sum: { $toDecimal: "$TotalAmount" } }, 
        },
      },
    ]);

    const productIds = productSales.map((sale) => sale._id);
    const products = await Product.find({ ProductID: { $in: productIds } });

    const productsWithSalesData = productSales.map((sale) => {
      const product = products.find((p) => p.ProductID === sale._id);

      if (product) {
        return {
          ProductID: product.ProductID,
          ProductName: product.ProductName,
          Category: product.Category,
          Price: product.Price,
          QuantitySold: sale.totalQuantity, 
          TotalAmountSold: sale.totalAmount, 
        };
      }

      return null;
    }).filter((product) => product !== null);

    res.status(200).json({ products: productsWithSalesData });
  } catch (error) {
    console.error("there is probleme with returning the products details due to this error ", error);
    res.status(500).json({ message: "server error" });
  }
});

export default router;