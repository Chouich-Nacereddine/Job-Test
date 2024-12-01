import express from "express"; // this is the express backend server we are using
import dotenv from "dotenv"; // this is just to load environment variables from .env file
import cors from "cors";
import MongoDBconnection from "./config/MongoDB"; // this the first connection to MongoDB usigng the mongoose modeling tool
/** this is the function that will be adding the data 
from the files in src/data to mongoDB when we first start 
the server*/
import InjectData from "./config/DataInjectiontoDB";
import salesRouter from "./routes/sale.route"; // this is to use api endpoints from sale.route nested to /api/analytics...
import productsRouter from "./routes/product.route"; // this is to use api endpoints from product.route nested to /...

dotenv.config();

const app = express();
app.use(express.json()); // this is used t specify that the communication will be usign json files
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);





// Start Server 'PORT value shoold be added to .env file or the default one 5000 will be used instead'
const PORT = process.env.PORT || 5000;

/** in this part of code we are trying to connect 
to MongoDB and if the connection is succesful we move 
to first data initialisation then we run the backend server  */
MongoDBconnection().then(async () => {
  await InjectData();
  app.listen(PORT, () => console.log(`The server is running on port ${PORT}!`));
});

// this is a get Api endpoint that is used to verify if the server is running with no errors after the npm start
app.get("/", (req, res) => {
  res.send("Server is runing! perfect!");
});

app.use("/api/analytics", salesRouter);
app.use("/", productsRouter);
