// this is the products interface
export interface productsInterface {
    ProductID: string;
    ProductName: string;
    Category: string;
    Price: string;
  }
  
  // this is the sales interface
  export interface salesInterface {
    SaleID: number;
    ProductID: string;
    Quantity: string;
    Date: Date;
    TotalAmount: string;
  }
  