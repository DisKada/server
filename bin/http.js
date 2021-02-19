const app = require("../app.js");
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});