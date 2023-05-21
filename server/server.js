const express = require("express");
const app = express();
const PORT = process.env.PORT || 3540;
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connection = require("./modules/connection");
const allRoutes = require("./routes/routes")



// Adding midlewares
app.use(bodyparser.json());

// CORS ayarları
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.use(
//   cors({
//     origin: "*",
//   })
// );

//Parsing Cookies
app.use(cookieParser());

//Routes//

app.use("/api", allRoutes)



app.listen(PORT, () => console.log(`Service up and running at ${PORT}`));