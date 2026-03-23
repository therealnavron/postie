import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Phyllo API configuration
const PHYLLO_BASE_URL = process.env.PHYLLO_ENV === "production"
  ? "https://api.getphyllo.com"
  : "https://api.sandbox.getphyllo.com";

const PHYLLO_CLIENT_ID = process.env.PHYLLO_CLIENT_ID || "";
const PHYLLO_CLIENT_SECRET = process.env.PHYLLO_CLIENT_SECRET || "";

function getPhylloAuth(): string {
  return "Basic " + Buffer.from(`${PHYLLO_CLIENT_ID}:${PHYLLO_CLIENT_SECRET}`).toString("base64");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Phyllo: Create user ────────────────────────────────────
  app.post("/api/phyllo/user", async (req, res) => {
    try {
      const { name, external_id } = req.body;
      const response = await fetch(`${PHYLLO_BASE_URL}/v1/users`, {
        method: "POST",
        headers: {
          "Authorization": getPhylloAuth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, external_id: String(external_id) }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      res.json(data);
    } catch (err) {
      console.error("Phyllo create user error:", err);
      res.status(500).json({ error: "Failed to create Phyllo user" });
    }
  });

  // ── Phyllo: Create SDK token ───────────────────────────────
  app.post("/api/phyllo/token", async (req, res) => {
    try {
      const { user_id, products } = req.body;
      const response = await fetch(`${PHYLLO_BASE_URL}/v1/sdk-tokens`, {
        method: "POST",
        headers: {
          "Authorization": getPhylloAuth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          products: products || ["IDENTITY", "ENGAGEMENT", "IDENTITY.AUDIENCE"],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      res.json(data);
    } catch (err) {
      console.error("Phyllo create token error:", err);
      res.status(500).json({ error: "Failed to create SDK token" });
    }
  });

  // ── Phyllo: Get account profile ────────────────────────────
  app.get("/api/phyllo/profile/:accountId", async (req, res) => {
    try {
      const response = await fetch(
        `${PHYLLO_BASE_URL}/v1/social/contents?account_id=${req.params.accountId}`,
        {
          headers: {
            "Authorization": getPhylloAuth(),
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      res.json(data);
    } catch (err) {
      console.error("Phyllo profile error:", err);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // ── Phyllo: Get audience demographics ──────────────────────
  app.get("/api/phyllo/audience/:accountId", async (req, res) => {
    try {
      const response = await fetch(
        `${PHYLLO_BASE_URL}/v1/social/audience?account_id=${req.params.accountId}`,
        {
          headers: {
            "Authorization": getPhylloAuth(),
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      res.json(data);
    } catch (err) {
      console.error("Phyllo audience error:", err);
      res.status(500).json({ error: "Failed to fetch audience data" });
    }
  });

  // ── Phyllo: Check config status ────────────────────────────
  app.get("/api/phyllo/status", async (_req, res) => {
    const configured = Boolean(PHYLLO_CLIENT_ID && PHYLLO_CLIENT_SECRET);
    if (!configured) {
      return res.json({ configured: false, mode: "demo" });
    }
    // Quick check if credentials are valid
    try {
      const response = await fetch(`${PHYLLO_BASE_URL}/v1/work-platforms?limit=1`, {
        headers: {
          "Authorization": getPhylloAuth(),
          "Content-Type": "application/json",
        },
      });
      res.json({ configured: true, mode: response.ok ? "live" : "demo", env: process.env.PHYLLO_ENV || "sandbox" });
    } catch {
      res.json({ configured: true, mode: "demo" });
    }
  });

  return httpServer;
}
