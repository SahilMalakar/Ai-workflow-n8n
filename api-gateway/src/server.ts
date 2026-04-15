import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`🚀 Gateway running on http://localhost:${env.PORT}`);
  console.log(`📡 Proxying to n8n at ${env.N8N_BASE_URL}`);
});
