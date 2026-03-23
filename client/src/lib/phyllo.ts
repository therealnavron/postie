import { apiRequest } from "./queryClient";

// Phyllo work platform IDs
export const PHYLLO_PLATFORMS: Record<string, string> = {
  instagram: "9bb8913b-ddd9-430b-a66a-d74d846e6c66",
  tiktok: "de55aeec-0dc8-4119-bf90-16b3d1f0c987",
  twitter: "7645460a-96e0-4192-a3ce-a1acc2607362",
};

interface PhylloConfig {
  environment: "sandbox" | "production";
  userId: string;
  token: string;
  clientDisplayName: string;
  workPlatformId?: string | null;
}

interface PhylloConnectInstance {
  on: (event: string, callback: (...args: string[]) => void) => void;
  open: () => void;
}

declare global {
  interface Window {
    PhylloConnect?: {
      initialize: (config: PhylloConfig) => PhylloConnectInstance;
    };
  }
}

// Load Phyllo Connect SDK script
let sdkLoaded = false;
export function loadPhylloSDK(): Promise<void> {
  if (sdkLoaded || window.PhylloConnect) {
    sdkLoaded = true;
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.getphyllo.com/connect/v2/phyllo-connect.js";
    script.onload = () => {
      sdkLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Phyllo SDK"));
    document.head.appendChild(script);
  });
}

// Create a Phyllo user via our backend
export async function createPhylloUser(name: string): Promise<string> {
  const res = await apiRequest("POST", "/api/phyllo/user", {
    name,
    external_id: `postie-${Date.now()}`,
  });
  const data = await res.json();
  return data.id;
}

// Create an SDK token via our backend
export async function createPhylloSDKToken(userId: string): Promise<string> {
  const res = await apiRequest("POST", "/api/phyllo/token", {
    user_id: userId,
    products: ["IDENTITY", "ENGAGEMENT", "IDENTITY.AUDIENCE"],
  });
  const data = await res.json();
  return data.sdk_token;
}

// Check if Phyllo is configured
export async function checkPhylloStatus(): Promise<{ configured: boolean; mode: string }> {
  try {
    const res = await apiRequest("GET", "/api/phyllo/status");
    return await res.json();
  } catch {
    return { configured: false, mode: "demo" };
  }
}

// Open Phyllo Connect for a specific platform
export async function openPhylloConnect(
  platformId?: string,
  callbacks?: {
    onAccountConnected?: (accountId: string, workPlatformId: string, userId: string) => void;
    onAccountDisconnected?: (accountId: string, workPlatformId: string, userId: string) => void;
    onExit?: (reason: string, userId: string) => void;
    onConnectionFailure?: (reason: string, workPlatformId: string, userId: string) => void;
  }
): Promise<void> {
  await loadPhylloSDK();

  if (!window.PhylloConnect) {
    throw new Error("Phyllo SDK not available");
  }

  const userId = await createPhylloUser("Postie Creator");
  const token = await createPhylloSDKToken(userId);

  const config: PhylloConfig = {
    environment: "sandbox",
    userId,
    token,
    clientDisplayName: "Postie",
    workPlatformId: platformId || null,
  };

  const phylloConnect = window.PhylloConnect.initialize(config);

  phylloConnect.on("accountConnected", (accountId, workPlatformId, uid) => {
    callbacks?.onAccountConnected?.(accountId, workPlatformId, uid);
  });

  phylloConnect.on("accountDisconnected", (accountId, workPlatformId, uid) => {
    callbacks?.onAccountDisconnected?.(accountId, workPlatformId, uid);
  });

  phylloConnect.on("exit", (reason, uid) => {
    callbacks?.onExit?.(reason, uid);
  });

  phylloConnect.on("connectionFailure", (reason, workPlatformId, uid) => {
    callbacks?.onConnectionFailure?.(reason, workPlatformId, uid);
  });

  phylloConnect.open();
}
