import app from './src/app.js';
import { config } from "./src/config/env.js";

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
})
