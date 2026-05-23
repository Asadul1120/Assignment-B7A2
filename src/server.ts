import app from "./app.js";
import config from "./config/index.js";
import { initDB } from "./config/db.js";

const main = () => {
  initDB();
  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
};

main();
