export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    try {
      if (url.pathname === "/wallet-set" && request.method === "POST") {
        return json({
          ok: false,
          message: "Scaffold only. Connect this route to Circle POST /v1/w3s/developer/walletSets and return walletSetId."
        });
      }

      if (url.pathname === "/wallets/create" && request.method === "POST") {
        return json({
          ok: false,
          message: "Scaffold only. Connect this route to Circle POST /v1/w3s/developer/wallets on ARC-TESTNET and return wallet A + wallet B."
        });
      }

      if (url.pathname === "/wallets/balances" && request.method === "GET") {
        return json({
          ok: false,
          message: "Scaffold only. Connect this route to Circle GET /v1/w3s/developer/wallets/balances or GET /v1/w3s/wallets/{id}/balances."
        });
      }

      if (url.pathname === "/transfer" && request.method === "POST") {
        return json({
          ok: false,
          message: "Scaffold only. Connect this route to Circle POST /v1/w3s/developer/transactions/transfer and return tx hash + state."
        });
      }

      return json({ ok: false, message: "Route not found." }, 404);
    } catch (error) {
      return json({ ok: false, message: error instanceof Error ? error.message : "Backend error." }, 500);
    }
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}
