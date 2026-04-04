
// Example only. This is not a working Arc House auth integration.
// Use this as a starting point only when you have a supported authenticated flow.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth/start') {
      return new Response(JSON.stringify({
        ok: false,
        message: 'Configure this endpoint only when a supported Arc House auth flow exists.'
      }), { headers: { 'content-type': 'application/json' } });
    }

    if (url.pathname === '/profile') {
      return new Response(JSON.stringify({
        ok: false,
        message: 'Private Arc House profile retrieval requires a supported authenticated integration.'
      }), { headers: { 'content-type': 'application/json' } });
    }

    return new Response('ArcLume connected mode example worker', { status: 200 });
  }
};
