import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,

  secretKey: process.env.NEXT_PUBLIC_THIRDWEB_KEY!,
});
export default client;
