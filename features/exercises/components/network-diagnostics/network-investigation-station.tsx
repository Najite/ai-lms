"use client";

import React from "react";
import {
  AlertCircle,
  ShieldAlert,
  Server,
  Key,
  Globe,
  Database,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface InvestigationAnswers {
  task_1_successful_catalog_request_id: string;
  task_1_missing_asset_request_id: string;
  task_2_redirect_target_url: string;
  task_2_insecure_http_request_id: string;
  task_3_unauthenticated_request_id: string;
  task_3_forbidden_request_id: string;
  task_4_backend_crash_request_id: string;
  task_4_timeout_bottleneck_request_id: string;
  task_5_resolved_api_ip_address: string;
  task_5_error_code_payload: string;
  task_6_primary_root_cause: string;
}

export interface NetworkInvestigationStationProps {
  answers: InvestigationAnswers;
  onChange: (field: keyof InvestigationAnswers, value: string) => void;
  onRequestSelectHint?: (requestId: string) => void;
}

export function NetworkInvestigationStation({
  answers,
  onChange,
  onRequestSelectHint,
}: NetworkInvestigationStationProps) {
  const handleSelectRequest = (field: keyof InvestigationAnswers, value: string) => {
    onChange(field, value);
    if (onRequestSelectHint && value) {
      onRequestSelectHint(value);
    }
  };

  const requestOptions = [
    { id: "R1", label: "R1: GET http://octostore.app/ (301)" },
    { id: "R2", label: "R2: GET https://octostore.app/ (200)" },
    { id: "R3", label: "R3: GET api.octostore.app/v1/products (200)" },
    { id: "R4", label: "R4: GET cdn.octostore.app/.../phone_v2.png (404)" },
    { id: "R5", label: "R5: GET api.octostore.app/v1/user/profile (401)" },
    { id: "R6", label: "R6: GET api.octostore.app/v1/admin/revenue (403)" },
    { id: "R7", label: "R7: GET http://legacy-inventory.octostore... (200)" },
    { id: "R8", label: "R8: POST api.octostore.app/v1/checkout/process (500)" },
    { id: "R9", label: "R9: POST gateway.octostore.app/v1/pay (504)" },
  ];

  return (
    <div className="space-y-6">
      {/* Station Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            <span>Diagnostics Investigation Station (Incident #4081)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use Network Tab evidence to answer the 6 diagnostic inquiries below.
          </p>
        </div>
      </div>

      {/* Task 1: Success & Missing Assets */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3.5 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary border-b border-border/50 pb-2">
          <Globe className="w-4 h-4" />
          <span>Task 1: Successful Catalog Fetch & Missing Image Asset</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-foreground font-semibold flex items-center gap-1.5">
              <span>1A. Which request successfully fetched the electronics catalog (200 OK)?</span>
            </label>
            <select
              value={answers.task_1_successful_catalog_request_id}
              onChange={(e) => handleSelectRequest("task_1_successful_catalog_request_id", e.target.value)}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            >
              <option value="">-- Select Request ID --</option>
              {requestOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground font-semibold flex items-center gap-1.5">
              <span>1B. Which request failed because a product image was missing (404 Not Found)?</span>
            </label>
            <select
              value={answers.task_1_missing_asset_request_id}
              onChange={(e) => handleSelectRequest("task_1_missing_asset_request_id", e.target.value)}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            >
              <option value="">-- Select Request ID --</option>
              {requestOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task 2: Security & Redirection */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3.5 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-border/50 pb-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Task 2: Transport Security & Redirection Inspection</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              2A. What destination URL is specified in the 301 `Location` response header of Request R1?
            </label>
            <input
              type="text"
              placeholder="e.g. https://example.com"
              value={answers.task_2_redirect_target_url}
              onChange={(e) => onChange("task_2_redirect_target_url", e.target.value.trim())}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              2B. Which request transmitted sensitive data over unencrypted cleartext HTTP (Port 80)?
            </label>
            <select
              value={answers.task_2_insecure_http_request_id}
              onChange={(e) => onChange("task_2_insecure_http_request_id", e.target.value)}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            >
              <option value="">-- Select Insecure Request --</option>
              {requestOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task 3: Authentication & Permissions */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3.5 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-border/50 pb-2">
          <Key className="w-4 h-4" />
          <span>Task 3: Access Control & Permissions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              3A. Which request was rejected because the user was unauthenticated (401 Unauthorized)?
            </label>
            <select
              value={answers.task_3_unauthenticated_request_id}
              onChange={(e) => onChange("task_3_unauthenticated_request_id", e.target.value)}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            >
              <option value="">-- Select 401 Request --</option>
              {requestOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              3B. Which request failed because a standard user lacked admin rights (403 Forbidden)?
            </label>
            <select
              value={answers.task_3_forbidden_request_id}
              onChange={(e) => onChange("task_3_forbidden_request_id", e.target.value)}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            >
              <option value="">-- Select 403 Request --</option>
              {requestOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task 4: Server Failures & Timeouts */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3.5 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-border/50 pb-2">
          <AlertCircle className="w-4 h-4" />
          <span>Task 4: Server Crashes & Latency Bottlenecks</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              4A. Which checkout request crashed due to an internal server error (500)?
            </label>
            <select
              value={answers.task_4_backend_crash_request_id}
              onChange={(e) => onChange("task_4_backend_crash_request_id", e.target.value)}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            >
              <option value="">-- Select 500 Request --</option>
              {requestOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              4B. Which request timed out after 15,000ms with a 504 Gateway Timeout?
            </label>
            <select
              value={answers.task_4_timeout_bottleneck_request_id}
              onChange={(e) => onChange("task_4_timeout_bottleneck_request_id", e.target.value)}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            >
              <option value="">-- Select 504 Request --</option>
              {requestOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task 5: DNS Resolution & JSON Payload Extraction */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3.5 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-border/50 pb-2">
          <FileCode className="w-4 h-4" />
          <span>Task 5: DNS IP Resolution & JSON Body Parsing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              5A. What IP address was resolved by DNS for `api.octostore.app` (Remote Address in R3)?
            </label>
            <input
              type="text"
              placeholder="e.g. 192.0.2.1"
              value={answers.task_5_resolved_api_ip_address}
              onChange={(e) => onChange("task_5_resolved_api_ip_address", e.target.value.trim())}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              5B. Inspect the JSON body of Request R8. What is the value of the &quot;code&quot; field?
            </label>
            <input
              type="text"
              placeholder="e.g. ERR_EXAMPLE"
              value={answers.task_5_error_code_payload}
              onChange={(e) => onChange("task_5_error_code_payload", e.target.value.trim())}
              className="w-full p-2 rounded bg-background border border-border focus:ring-1 focus:ring-primary text-xs"
            />
          </div>
        </div>
      </div>

      {/* Task 6: Root Cause Incident Synthesis */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3.5 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-border/50 pb-2">
          <Database className="w-4 h-4" />
          <span>Task 6: Root Cause Synthesis</span>
        </div>
        <div className="space-y-2 text-xs font-mono">
          <label className="text-foreground font-semibold block">
            What was the primary root cause that triggered the checkout failure cascade?
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                id: "dns_failure",
                label: "DNS Server Failed: Domain 'octostore.app' could not be resolved to any IP.",
              },
              {
                id: "database_connection_crash",
                label: "Database Connection Pool Crash: Checkout worker failed to acquire a write lock on 'orders_ledger' (HTTP 500 DB_CONN_TIMEOUT).",
              },
              {
                id: "wrong_password",
                label: "User Auth Error: The customer entered an invalid password during checkout.",
              },
              {
                id: "cdn_outage",
                label: "CDN Failure: All product images on the website were permanently deleted.",
              },
            ].map((choice) => (
              <label
                key={choice.id}
                className={cn(
                  "flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors",
                  answers.task_6_primary_root_cause === choice.id
                    ? "bg-primary/15 border-primary text-foreground font-semibold"
                    : "bg-background/40 border-border hover:bg-secondary/40 text-muted-foreground"
                )}
              >
                <input
                  type="radio"
                  name="root_cause"
                  value={choice.id}
                  checked={answers.task_6_primary_root_cause === choice.id}
                  onChange={(e) => onChange("task_6_primary_root_cause", e.target.value)}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <span>{choice.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
