/**
 * Web3 Client Configuration
 */
import { createThirdwebClient } from "thirdweb";
import config from "./index.js";

export const client = createThirdwebClient({
  clientId: config.thirdweb.clientId,
  secretKey: config.thirdweb.secretKey,
});

export default client;
