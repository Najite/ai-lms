export interface NetworkRequestItem {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: number;
  statusText: string;
  domain: string;
  path: string;
  scheme: "http" | "https";
  type: "doc" | "fetch" | "img" | "stylesheet" | "script";
  size: string;
  timeMs: number;
  remoteAddress: string;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  queryParams?: Record<string, string>;
  requestBody?: string | null;
  responseBody: string;
  responseType: "json" | "html" | "image" | "text";
  timing: {
    queueingMs: number;
    dnsLookupMs: number;
    tcpHandshakeMs: number;
    tlsHandshakeMs: number;
    requestSentMs: number;
    ttfbMs: number;
    contentDownloadMs: number;
  };
}

export const MOCK_OCTOSTORE_NETWORK_TRACE: NetworkRequestItem[] = [
  {
    id: "R1",
    name: "/",
    url: "http://octostore.app/",
    method: "GET",
    status: 301,
    statusText: "Moved Permanently",
    domain: "octostore.app",
    path: "/",
    scheme: "http",
    type: "doc",
    size: "312 B",
    timeMs: 24,
    remoteAddress: "140.82.121.34:80",
    requestHeaders: {
      "Host": "octostore.app",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Upgrade-Insecure-Requests": "1",
    },
    responseHeaders: {
      "Status": "301 Moved Permanently",
      "Location": "https://octostore.app",
      "Content-Type": "text/html; charset=utf-8",
      "Date": "Wed, 30 Sep 2026 14:22:01 GMT",
      "Server": "CloudFront",
    },
    responseBody: "<!DOCTYPE html><html><head><title>301 Moved Permanently</title></head><body><h1>301 Moved Permanently</h1><p>The document has moved <a href=\"https://octostore.app\">here</a>.</p></body></html>",
    responseType: "html",
    timing: {
      queueingMs: 1.2,
      dnsLookupMs: 4.1,
      tcpHandshakeMs: 8.5,
      tlsHandshakeMs: 0, // Plain HTTP, no TLS
      requestSentMs: 0.4,
      ttfbMs: 8.2,
      contentDownloadMs: 1.6,
    },
  },
  {
    id: "R2",
    name: "/",
    url: "https://octostore.app/",
    method: "GET",
    status: 200,
    statusText: "OK",
    domain: "octostore.app",
    path: "/",
    scheme: "https",
    type: "doc",
    size: "14.2 KB",
    timeMs: 48,
    remoteAddress: "140.82.121.34:443",
    requestHeaders: {
      "Host": "octostore.app",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0",
      "Accept": "text/html,application/xhtml+xml",
      "Sec-Fetch-Mode": "navigate",
    },
    responseHeaders: {
      "Status": "200 OK",
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "max-age=3600, public",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Date": "Wed, 30 Sep 2026 14:22:02 GMT",
    },
    responseBody: "<!DOCTYPE html><html lang=\"en\"><head><title>OctoStore - Global Cloud Marketplace</title></head><body><header><h1>OctoStore</h1></header><main id=\"app\"></main></body></html>",
    responseType: "html",
    timing: {
      queueingMs: 1.0,
      dnsLookupMs: 0, // Cached
      tcpHandshakeMs: 12.1,
      tlsHandshakeMs: 18.3,
      requestSentMs: 0.5,
      ttfbMs: 12.5,
      contentDownloadMs: 3.6,
    },
  },
  {
    id: "R3",
    name: "products?category=electronics",
    url: "https://api.octostore.app/v1/products?category=electronics",
    method: "GET",
    status: 200,
    statusText: "OK",
    domain: "api.octostore.app",
    path: "/v1/products",
    queryParams: { "category": "electronics" },
    scheme: "https",
    type: "fetch",
    size: "4.2 KB",
    timeMs: 82,
    remoteAddress: "140.82.121.34:443",
    requestHeaders: {
      "Host": "api.octostore.app",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0",
      "Accept": "application/json",
      "Origin": "https://octostore.app",
    },
    responseHeaders: {
      "Status": "200 OK",
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "https://octostore.app",
      "Cache-Control": "public, max-age=120",
      "Date": "Wed, 30 Sep 2026 14:22:03 GMT",
    },
    responseBody: JSON.stringify({
      status: "success",
      total: 2,
      category: "electronics",
      data: [
        {
          sku: "OCTO-PHN-01",
          name: "OctoPhone Pro 16",
          price_usd: 899.00,
          in_stock: true,
          image_url: "https://cdn.octostore.app/images/products/phone_v2.png",
        },
        {
          sku: "OCTO-LAP-02",
          name: "OctoBook Ultra M3",
          price_usd: 1499.00,
          in_stock: true,
          image_url: "https://cdn.octostore.app/images/products/laptop_v1.png",
        }
      ]
    }, null, 2),
    responseType: "json",
    timing: {
      queueingMs: 1.5,
      dnsLookupMs: 12.0,
      tcpHandshakeMs: 15.0,
      tlsHandshakeMs: 22.0,
      requestSentMs: 0.8,
      ttfbMs: 28.5,
      contentDownloadMs: 2.2,
    },
  },
  {
    id: "R4",
    name: "phone_v2.png",
    url: "https://cdn.octostore.app/images/products/phone_v2.png",
    method: "GET",
    status: 404,
    statusText: "Not Found",
    domain: "cdn.octostore.app",
    path: "/images/products/phone_v2.png",
    scheme: "https",
    type: "img",
    size: "512 B",
    timeMs: 35,
    remoteAddress: "140.82.121.34:443",
    requestHeaders: {
      "Host": "cdn.octostore.app",
      "User-Agent": "Mozilla/5.0 Chrome/120.0",
      "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Referer": "https://octostore.app/",
    },
    responseHeaders: {
      "Status": "404 Not Found",
      "Content-Type": "text/html; charset=utf-8",
      "Date": "Wed, 30 Sep 2026 14:22:04 GMT",
      "X-Cache": "Error from cloudfront",
    },
    responseBody: "<!DOCTYPE html><html><body><h1>404 Not Found</h1><p>Key 'images/products/phone_v2.png' does not exist in bucket.</p></body></html>",
    responseType: "html",
    timing: {
      queueingMs: 0.9,
      dnsLookupMs: 5.2,
      tcpHandshakeMs: 11.0,
      tlsHandshakeMs: 12.5,
      requestSentMs: 0.3,
      ttfbMs: 4.1,
      contentDownloadMs: 1.0,
    },
  },
  {
    id: "R5",
    name: "profile",
    url: "https://api.octostore.app/v1/user/profile",
    method: "GET",
    status: 401,
    statusText: "Unauthorized",
    domain: "api.octostore.app",
    path: "/v1/user/profile",
    scheme: "https",
    type: "fetch",
    size: "420 B",
    timeMs: 41,
    remoteAddress: "140.82.121.34:443",
    requestHeaders: {
      "Host": "api.octostore.app",
      "User-Agent": "Mozilla/5.0 Chrome/120.0",
      "Accept": "application/json",
      "Origin": "https://octostore.app",
    },
    responseHeaders: {
      "Status": "401 Unauthorized",
      "WWW-Authenticate": "Bearer realm=\"OctoStore Auth\", error=\"invalid_token\"",
      "Content-Type": "application/json; charset=utf-8",
      "Date": "Wed, 30 Sep 2026 14:22:05 GMT",
    },
    responseBody: JSON.stringify({
      error: "Unauthorized",
      message: "No Authorization header supplied or session token expired.",
      code: "AUTH_TOKEN_MISSING"
    }, null, 2),
    responseType: "json",
    timing: {
      queueingMs: 1.1,
      dnsLookupMs: 0,
      tcpHandshakeMs: 0, // Reused socket
      tlsHandshakeMs: 0,
      requestSentMs: 0.4,
      ttfbMs: 38.0,
      contentDownloadMs: 1.5,
    },
  },
  {
    id: "R6",
    name: "revenue",
    url: "https://api.octostore.app/v1/admin/revenue",
    method: "GET",
    status: 403,
    statusText: "Forbidden",
    domain: "api.octostore.app",
    path: "/v1/admin/revenue",
    scheme: "https",
    type: "fetch",
    size: "380 B",
    timeMs: 39,
    remoteAddress: "140.82.121.34:443",
    requestHeaders: {
      "Host": "api.octostore.app",
      "User-Agent": "Mozilla/5.0 Chrome/120.0",
      "Authorization": "Bearer usr_token_guest_9918",
      "Accept": "application/json",
    },
    responseHeaders: {
      "Status": "403 Forbidden",
      "Content-Type": "application/json; charset=utf-8",
      "Date": "Wed, 30 Sep 2026 14:22:06 GMT",
    },
    responseBody: JSON.stringify({
      error: "Forbidden",
      message: "User role 'standard_customer' does not possess 'admin:read' permissions.",
      required_role: "administrator"
    }, null, 2),
    responseType: "json",
    timing: {
      queueingMs: 0.8,
      dnsLookupMs: 0,
      tcpHandshakeMs: 0,
      tlsHandshakeMs: 0,
      requestSentMs: 0.3,
      ttfbMs: 36.4,
      contentDownloadMs: 1.5,
    },
  },
  {
    id: "R7",
    name: "check?sku=9821",
    url: "http://legacy-inventory.octostore.internal/check?sku=9821",
    method: "GET",
    status: 200,
    statusText: "OK",
    domain: "legacy-inventory.octostore.internal",
    path: "/check",
    queryParams: { "sku": "9821" },
    scheme: "http",
    type: "fetch",
    size: "1.1 KB",
    timeMs: 65,
    remoteAddress: "10.0.4.15:80",
    requestHeaders: {
      "Host": "legacy-inventory.octostore.internal",
      "User-Agent": "Mozilla/5.0 Chrome/120.0",
      "Accept": "application/json",
    },
    responseHeaders: {
      "Status": "200 OK",
      "Content-Type": "application/json",
      "X-Insecure-Warning": "Cleartext transmission across unencrypted HTTP",
      "Date": "Wed, 30 Sep 2026 14:22:07 GMT",
    },
    responseBody: JSON.stringify({
      sku: "9821",
      available_units: 42,
      warehouse: "Frankfurt-01",
      protocol_warning: "UNENCRYPTED_PLAINTEXT_TRANSMISSION"
    }, null, 2),
    responseType: "json",
    timing: {
      queueingMs: 1.8,
      dnsLookupMs: 8.5,
      tcpHandshakeMs: 14.2,
      tlsHandshakeMs: 0,
      requestSentMs: 0.6,
      ttfbMs: 38.1,
      contentDownloadMs: 1.8,
    },
  },
  {
    id: "R8",
    name: "process",
    url: "https://api.octostore.app/v1/checkout/process",
    method: "POST",
    status: 500,
    statusText: "Internal Server Error",
    domain: "api.octostore.app",
    path: "/v1/checkout/process",
    scheme: "https",
    type: "fetch",
    size: "890 B",
    timeMs: 320,
    remoteAddress: "140.82.121.34:443",
    requestHeaders: {
      "Host": "api.octostore.app",
      "Content-Type": "application/json",
      "Authorization": "Bearer usr_token_registered_104",
      "User-Agent": "Mozilla/5.0 Chrome/120.0",
    },
    requestBody: JSON.stringify({
      order_id: "ORD-9481",
      items: [{ sku: "OCTO-PHN-01", quantity: 1 }],
      shipping_address: "10 Downing St, London",
      payment_method_id: "pm_card_visa_4242"
    }, null, 2),
    responseHeaders: {
      "Status": "500 Internal Server Error",
      "Content-Type": "application/json; charset=utf-8",
      "X-Backend-Service": "checkout-worker-pod-8",
      "Date": "Wed, 30 Sep 2026 14:22:08 GMT",
    },
    responseBody: JSON.stringify({
      error: "DatabaseConnectionException",
      code: "DB_CONN_TIMEOUT",
      message: "Failed to acquire write lock on table 'orders_ledger' after 300ms. Database pool exhausted.",
      service: "checkout-worker"
    }, null, 2),
    responseType: "json",
    timing: {
      queueingMs: 2.1,
      dnsLookupMs: 0,
      tcpHandshakeMs: 0,
      tlsHandshakeMs: 0,
      requestSentMs: 1.2,
      ttfbMs: 314.5,
      contentDownloadMs: 2.2,
    },
  },
  {
    id: "R9",
    name: "pay",
    url: "https://gateway.octostore.app/v1/pay",
    method: "POST",
    status: 504,
    statusText: "Gateway Timeout",
    domain: "gateway.octostore.app",
    path: "/v1/pay",
    scheme: "https",
    type: "fetch",
    size: "210 B",
    timeMs: 15000,
    remoteAddress: "140.82.121.88:443",
    requestHeaders: {
      "Host": "gateway.octostore.app",
      "Content-Type": "application/json",
      "Authorization": "Bearer usr_token_registered_104",
      "User-Agent": "Mozilla/5.0 Chrome/120.0",
    },
    requestBody: JSON.stringify({
      amount_cents: 89900,
      currency: "USD",
      source_token: "tok_visa_4242"
    }, null, 2),
    responseHeaders: {
      "Status": "504 Gateway Timeout",
      "Content-Type": "text/html; charset=utf-8",
      "Server": "nginx/1.24.0",
      "Date": "Wed, 30 Sep 2026 14:22:23 GMT",
    },
    responseBody: "<!DOCTYPE html><html><head><title>504 Gateway Timeout</title></head><body><center><h1>504 Gateway Timeout</h1></center><hr><center>nginx/1.24.0 (Upstream payment provider did not respond within 15000ms)</center></body></html>",
    responseType: "html",
    timing: {
      queueingMs: 3.5,
      dnsLookupMs: 15.0,
      tcpHandshakeMs: 20.0,
      tlsHandshakeMs: 25.0,
      requestSentMs: 1.5,
      ttfbMs: 14930.0, // Upstream timed out
      contentDownloadMs: 5.0,
    },
  },
];

export const MOCK_NETWORK_REQUESTS = MOCK_OCTOSTORE_NETWORK_TRACE;

