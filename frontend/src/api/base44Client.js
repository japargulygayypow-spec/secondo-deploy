import { createClient } from "@base44/sdk";

export const base44 = createClient({
    // The SDK will automatically use the environment variables if available
    // or you can provide the appId and apiKey here.
});
