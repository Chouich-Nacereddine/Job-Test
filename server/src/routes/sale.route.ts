// To test endpoints declared in this route make sure you add '/api/analytics' before every endpoint

import Sale from "../models/sale.model"; // Use the correct model (Sale)
import Product from "../models/product.model"; // Use the correct model (Sale)
import express, { Request, Response, Router } from "express";
import { filter } from "../utils/functions"; // this is documented in ../utils/functions.ts file
const router = Router();


// this is the get '/total_sales' api endpoint that counts the total sales amount depending on selected period
router.get("/total_sales", async (req: Request, res: Response) => {
  try {
    const { startDate, currentDate } = filter(req.query.days); // this uses the filter function to return start date and currente date

    // this is to select data  'startDate <= data <= current day'
    const sales = await Sale.aggregate([
      {
        // this match filter the data from startDate to current date
        $match: {
          Date: {
            $gte: startDate, // $gte is MongoDB operator that means greater than or equal to '<='
            $lte: currentDate, // $lte is MongoDB operator that means less than or equal to '>='
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$TotalAmount" } }, // parsing TotalAmount to double type and summing
        },
      },
    ]);

    // console.log(sales);

    // this is to check if we have sales data for the selected period
    if (!sales || sales.length == 0) {
      res.status(200).json({ totalAmount: 0 });
      return;
    }

    const totalAmount = sales[0].totalAmount;
    res.status(200).json({ totalAmount });
  } catch (error) {
    console.error("we can't get total sales due to this error:", error);
    res.status(500).json({ message: "server error" });
  }
});

// this is the get '/trending_products' api endpoint that return top 5 sold products in selected periode
router.get("/trending_products", async (req: Request, res: Response) => {
  try {
    const { startDate, currentDate } = filter(req.query.days); // this uses the filter function to return start date and currente date

    const trendingProducts = await Sale.aggregate([
      {
        // this match filter the data from startDate to current date
        $match: {
          Date: {
            $gte: startDate, // $gte is MongoDB operator that means greater than or equal to '<='
            $lte: currentDate, // $lte is MongoDB operator that means less than or equal to '>='
          },
        },
      },
      {
        $group: {
          _id: "$ProductID",
          totalQuantity: { $sum: { $toInt: "$Quantity" } }, // this is suming the total Quantity of a product using it's Id in selected period
          totalSales: { $sum: { $toDouble: "$TotalAmount" } }, // this is suming the total Sales of a product using it's Id in selected period
        },
      },
      { $sort: { totalQuantity: -1 } }, // this is sorting from sup to inf
      { $limit: 3 }, // this can be adjusted, it specify the number of items to return
    ]);

    // here we need to find the products names using thier id so we need to map trow the products collection since MongoDB is non relational DB
    const productIds = trendingProducts.map((product) => product._id); // this returns unique Ids
    const products = await Product.find({ ProductID: { $in: productIds } }); // this looks for a product details unsing it Id

    const result = trendingProducts.map((product) => {
      const productData = products.find((p) => p.ProductID === product._id);
      return {
        productName:
          productData?.ProductName ||
          "Product not found in products collection 'missing product id && details'",
        totalQuantity: product.totalQuantity,
        totalSales: product.totalSales,
      };
    });

    res.status(200).json({ trendingProducts: result });
  } catch (error) {
    console.error(
      "there is probleme with returning the trending products due to this error :",
      error
    );
    res.status(500).json({ message: "server error" });
  }
});

// this is the get '/category_sales' api endpoint that return Sales % by category in the selected periode
router.get("/category_sales", async (req: Request, res: Response) => {
  try {
    const { startDate, currentDate } = filter(req.query.days); // this uses the filter function to return start date and currente date

    const categorySales = await Sale.aggregate([
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
        },
      },
    ]);

    const productIds = categorySales.map((sale) => sale._id);
    const products = await Product.find({ ProductID: { $in: productIds } });

    // this collects data by category and sum total quantity for every unique category
    const categorySalesMap: {
      [key: string]: { totalQuantity: number; totalProducts: number };
    } = {};

    categorySales.forEach((sale) => {
      const product = products.find((p) => p.ProductID === sale._id);
      if (product) {
        const category = product.Category;

        if (!categorySalesMap[category]) {
          categorySalesMap[category] = {
            totalQuantity: 0,
            totalProducts: 0,
          };
        }

        categorySalesMap[category].totalQuantity += sale.totalQuantity;
        categorySalesMap[category].totalProducts += 1;
      }
    });

    // this return the quantities -> 100%
    const totalSalesQuantity = Object.values(categorySalesMap).reduce(
      (acc, category) => acc + category.totalQuantity,
      0
    );

    // this counts the % for every category using quantities
    const categorySalesWithPercentage = Object.entries(categorySalesMap).map(
      ([category, data]) => {
        const categoryPercentage = (
          (data.totalQuantity / totalSalesQuantity) *
          100
        ).toFixed(2);

        return {
          category,
          totalQuantity: data.totalQuantity,
          categoryPercentage,
        };
      }
    );

    categorySalesWithPercentage.sort((a, b) => b.totalQuantity - a.totalQuantity); // this is for sup to inf sorting

    res.status(200).json({ categorySales: categorySalesWithPercentage });
  } catch (error) {
    console.error("there is probleme with returning the categories % due to this error :", error);
    res.status(500).json({ message: "server error" });
  }
});

export default router;
