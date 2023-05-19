const express = require("express");
const app = express();
const PORT = process.env.PORT || 3540;
const bodyparser = require("body-parser");
const cors = require("cors");
const connection = require("./modules/connection");
const allRoutes = require("./routes/routes")


// Adding midlewares
app.use(bodyparser.json());
app.use(
  cors({
    origin: "*",
  })
);

//Routes//

app.use("/api", allRoutes)



app.listen(PORT, () => console.log(`Service up and running at ${PORT}`));