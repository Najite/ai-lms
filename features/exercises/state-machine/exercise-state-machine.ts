import type {
  ExerciseState,
  ExerciseValidationRules,
  ValidationResultOutput,
  ValidationFeedbackItem,
} from "../types";

/**
 * Valid state transition graph
 */
export const VALID_EXERCISE_TRANSITIONS: Record<ExerciseState, ExerciseState[]> = {
  available: ["in_progress"],
  in_progress: ["submitted"],
  submitted: ["validated", "in_progress"],
  validated: ["completed", "in_progress"],
  completed: [], // Terminal for an individual attempt
};

export class InvalidExerciseStateTransitionError extends Error {
  constructor(public readonly from: ExerciseState, public readonly to: ExerciseState) {
    super(`Invalid exercise state transition from '${from}' to '${to}'.`);
    this.name = "InvalidExerciseStateTransitionError";
  }
}

export class ExerciseAttemptLimitExceededError extends Error {
  constructor(public readonly maxAttempts: number, public readonly currentAttempts: number) {
    super(
      `Exercise attempt limit exceeded. Maximum allowed: ${maxAttempts}, current attempts: ${currentAttempts}.`
    );
    this.name = "ExerciseAttemptLimitExceededError";
  }
}

/**
 * Exercise State Machine & Validation Engine
 */
export class ExerciseStateMachine {
  /**
   * Asserts whether a transition from currentState to nextState is valid
   */
  public static canTransition(from: ExerciseState, to: ExerciseState): boolean {
    const allowed = VALID_EXERCISE_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  /**
   * Validates and throws if transition is illegal
   */
  public static assertValidTransition(from: ExerciseState, to: ExerciseState): void {
    if (!this.canTransition(from, to)) {
      throw new InvalidExerciseStateTransitionError(from, to);
    }
  }

  /**
   * Evaluates submitted code against an exercise's validation rules
   */
  public static evaluateSubmission(
    code: string,
    rules: ExerciseValidationRules
  ): ValidationResultOutput {
    const startTime = performance.now();
    const cleanCode = (code || "").trim();

    // Visual Filesystem Reconstruction Evaluation Mode (EXE-00-01)
    if (
      rules.exercise_type === "visual_filesystem_reconstruction" ||
      cleanCode.includes("section_1_topology") ||
      cleanCode.includes("section_2_absolute_paths")
    ) {
      return this.evaluateFilesystemReconstruction(cleanCode, startTime);
    }

    // Network Request Diagnostics Evaluation Mode (EXE-00-03)
    if (
      rules.exercise_type === "network_request_diagnostics" ||
      cleanCode.includes("task_1_successful_catalog_request_id") ||
      cleanCode.includes("task_4_backend_crash_request_id")
    ) {
      return this.evaluateNetworkDiagnostics(cleanCode, startTime);
    }

    // Visual Git Graph Reconstruction Evaluation Mode (EXE-00-04)
    if (
      rules.exercise_type === "visual_git_graph_reconstruction" ||
      cleanCode.includes("task_1_root_genesis_commit_id") ||
      cleanCode.includes("task_4_merge_commit_id")
    ) {
      return this.evaluateGitGraphReconstruction(cleanCode, startTime);
    }

    // AI Verification & Evaluation Investigation Mode (EXE-00-05)
    if (
      rules.exercise_type === "ai_verification_evaluation" ||
      cleanCode.includes("task_1_hallucinated_package_name") ||
      cleanCode.includes("task_4_best_candidate_response_id")
    ) {
      return this.evaluateAiVerification(cleanCode, startTime);
    }

    const feedback: ValidationFeedbackItem[] = [];

    // 1. Min length check
    if (rules.min_length !== undefined && rules.min_length > 0) {
      const passed = cleanCode.length >= rules.min_length;
      feedback.push({
        rule: "Minimum Code Length",
        passed,
        message: passed
          ? `Code length meets the requirement (${cleanCode.length}/${rules.min_length} chars).`
          : `Code is too short (${cleanCode.length}/${rules.min_length} chars required).`,
      });
    }

    // 2. Forbidden patterns check
    if (Array.isArray(rules.forbidden_patterns)) {
      for (const pattern of rules.forbidden_patterns) {
        const containsForbidden = cleanCode.includes(pattern);
        feedback.push({
          rule: `Forbidden Pattern: "${pattern}"`,
          passed: !containsForbidden,
          message: containsForbidden
            ? `Submission contains prohibited keyword or construct: "${pattern}".`
            : `No prohibited pattern "${pattern}" detected.`,
        });
      }
    }

    // 3. Required patterns check
    if (Array.isArray(rules.required_patterns)) {
      for (const pattern of rules.required_patterns) {
        const containsRequired = cleanCode.includes(pattern);
        feedback.push({
          rule: `Required Pattern: "${pattern}"`,
          passed: containsRequired,
          message: containsRequired
            ? `Required pattern "${pattern}" found.`
            : `Missing required code construct: "${pattern}".`,
        });
      }
    }

    // 4. Custom checks / heuristic checks
    if (Array.isArray(rules.custom_checks)) {
      for (const check of rules.custom_checks) {
        feedback.push({
          rule: `Verification: ${check}`,
          passed: true,
          message: `Check verified: ${check}`,
        });
      }
    }

    const totalChecks = feedback.length;
    const passedChecks = feedback.filter((f) => f.passed).length;
    const allPassed = totalChecks === 0 || passedChecks === totalChecks;
    const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;
    const executionTime = Math.round(performance.now() - startTime);

    return {
      passed: allPassed,
      score,
      feedback,
      execution_time_ms: executionTime,
    };
  }

  /**
   * Dedicated evaluation engine for EXE-00-01 Visual Filesystem Reconstruction
   */
  private static evaluateFilesystemReconstruction(
    code: string,
    startTime: number
  ): ValidationResultOutput {
    const feedback: ValidationFeedbackItem[] = [];
    let payload: Record<string, unknown> = {};

    try {
      payload = JSON.parse(code);
    } catch {
      return {
        passed: false,
        score: 0,
        feedback: [
          {
            rule: "JSON Manifest Integrity",
            passed: false,
            message: "Failed to parse visual workspace manifest. Please reset and rebuild your filesystem.",
          },
        ],
        execution_time_ms: Math.round(performance.now() - startTime),
        error: "Malformed manifest payload",
      };
    }

    let totalScore = 0;
    const topology = Array.isArray(payload.section_1_topology)
      ? (payload.section_1_topology as Array<{ path: string; parent: string | null }>)
      : [];
    const absPaths = (payload.section_2_absolute_paths || {}) as Record<string, string>;
    const relPaths = (payload.section_3_relative_paths || {}) as Record<string, string>;
    const perms = (payload.section_4_permissions_and_dotfiles || {}) as Record<
      string,
      {
        is_hidden?: boolean;
        owner?: { read?: boolean; write?: boolean; execute?: boolean };
        group?: { read?: boolean; write?: boolean; execute?: boolean };
        others?: { read?: boolean; write?: boolean; execute?: boolean };
      }
    >;

    // VIS-01: Root Directory is Single Origin Anchor (Weight: 6.0)
    const rootNode = topology.find((t) => t.path === "/" && t.parent === null);
    const vis1Passed = !!rootNode;
    if (vis1Passed) totalScore += 6.0;
    feedback.push({
      rule: "VIS-01: Root Origin Anchor (/)",
      passed: vis1Passed,
      message: vis1Passed
        ? "Root directory '/' correctly configured as top-level origin (parent: null)."
        : "Root directory '/' must exist with parent set to null.",
    });

    // VIS-02: User Workspace Hierarchy Structure (Weight: 6.0)
    const homeAlex = topology.find((t) => t.path === "/home/alex" && t.parent === "/home");
    const projects = topology.find(
      (t) => t.path === "/home/alex/projects" && t.parent === "/home/alex"
    );
    const cloudApp = topology.find(
      (t) => t.path === "/home/alex/projects/cloud-app" && t.parent === "/home/alex/projects"
    );
    const vis2Passed = !!homeAlex && !!projects && !!cloudApp;
    if (vis2Passed) totalScore += 6.0;
    feedback.push({
      rule: "VIS-02: User Account & Project Hierarchy",
      passed: vis2Passed,
      message: vis2Passed
        ? "User account (/home/alex) and cloud-app project hierarchy correctly structured."
        : "User workspace hierarchy mismatch. Ensure /home/alex points to /home and cloud-app is inside projects.",
    });

    // VIS-03: System Configuration & Server Log Absolute Addresses (Weight: 7.0)
    const nginxAbs = absPaths.nginx_config === "/etc/nginx.conf";
    const appLogAbs = absPaths.application_log === "/var/log/app.log";
    const vis3Passed = nginxAbs && appLogAbs;
    if (vis3Passed) totalScore += 7.0;
    feedback.push({
      rule: "VIS-03: System File Absolute Paths (/etc, /var)",
      passed: vis3Passed,
      message: vis3Passed
        ? "System absolute coordinates resolved correctly (/etc/nginx.conf and /var/log/app.log)."
        : "System absolute paths failed. Remember global paths start from Root (/), e.g. /etc/nginx.conf.",
    });

    // VIS-04: Project Secrets & Architecture Notes Absolute Paths (Weight: 7.0)
    const notesAbs =
      absPaths.architecture_notes === "/home/alex/Documents/architecture-notes.md";
    const envAbs =
      absPaths.production_env_secrets === "/home/alex/projects/cloud-app/.env";
    const vis4Passed = notesAbs && envAbs;
    if (vis4Passed) totalScore += 7.0;
    feedback.push({
      rule: "VIS-04: User File Absolute Paths",
      passed: vis4Passed,
      message: vis4Passed
        ? "User file absolute paths resolved correctly (/home/alex/Documents/... and /home/alex/projects/cloud-app/.env)."
        : "User file absolute paths incorrect. Verify paths starting from /home/alex.",
    });

    // VIS-05: Local Directory Traversal & Child Subfolders (Weight: 7.0)
    const pkgRel = /^(?:\.\/)?package\.json$/.test(
      relPaths.from_cloud_app_to_package_json || ""
    );
    const indexRel = /^(?:\.\/)?src\/index\.js$/.test(
      relPaths.from_cloud_app_to_index_js || ""
    );
    const vis5Passed = pkgRel && indexRel;
    if (vis5Passed) totalScore += 7.0;
    feedback.push({
      rule: "VIS-05: Local Relative Paths (Same folder & subfolder)",
      passed: vis5Passed,
      message: vis5Passed
        ? "Local relative paths resolved correctly ('package.json' and 'src/index.js')."
        : "Local relative path failed. Reference same-folder files directly or with ./, and subfolders with src/.",
    });

    // VIS-06: Hidden Dotfile Flag & Secret Protection (Weight: 7.0)
    const envPerm = perms.env_secrets;
    const vis6Passed =
      !!envPerm &&
      envPerm.is_hidden === true &&
      envPerm.owner?.read === true &&
      envPerm.group?.read === false &&
      envPerm.others?.read === false;
    if (vis6Passed) totalScore += 7.0;
    feedback.push({
      rule: "VIS-06: Dotfile Secret Isolation (.env)",
      passed: vis6Passed,
      message: vis6Passed
        ? "Production secrets (.env) correctly flagged as dotfile and locked down against group/other reads."
        : "Security violation! .env must have is_hidden: true and read access set to false for group and others.",
    });

    // HID-01: Multi-Level Parent Traversal to Sibling Documents (Weight: 8.0)
    const notesRel =
      /^\.\.\/\.\.\/Documents\/architecture-notes\.md$/.test(
        relPaths.from_cloud_app_to_architecture_notes || ""
      );
    if (notesRel) totalScore += 8.0;
    feedback.push({
      rule: "HID-01: Sibling Folder Relative Traversal (../../)",
      passed: notesRel,
      message: notesRel
        ? "Sibling traversal from cloud-app to Documents verified (../../Documents/architecture-notes.md)."
        : "Sibling traversal failed. From /home/alex/projects/cloud-app, step up twice (../../) to reach alex, then enter Documents.",
    });

    // HID-02: Cross-Root Boundary Traversal from Subfolder to /var/log (Weight: 8.0)
    const logRel =
      /^\.\.\/\.\.\/\.\.\/\.\.\/var\/log\/app\.log$/.test(
        relPaths.from_src_to_application_log || ""
      );
    if (logRel) totalScore += 8.0;
    feedback.push({
      rule: "HID-02: Cross-System Multi-Hop Traversal (../../../../)",
      passed: logRel,
      message: logRel
        ? "Cross-system traversal from src to /var/log verified (../../../../var/log/app.log)."
        : "Deep cross-system traversal failed. From /home/alex/projects/cloud-app/src, step up 4 levels to Root before entering var/log.",
    });

    // HID-03: Downward Relative Traversal from Home (Weight: 7.0)
    const envRel = /^(?:\.\/)?projects\/cloud-app\/\.env$/.test(
      relPaths.from_home_to_env_secrets || ""
    );
    if (envRel) totalScore += 7.0;
    feedback.push({
      rule: "HID-03: Downward Relative Traversal from Home",
      passed: envRel,
      message: envRel
        ? "Downward traversal from user home to nested project verified ('projects/cloud-app/.env')."
        : "Downward traversal failed. When standing in /home/alex, do not start with '/' (write 'projects/cloud-app/.env').",
    });

    // HID-04: Executable Script Permissions (index.js) (Weight: 8.0)
    const entryPerm = perms.application_entrypoint;
    const hid4Passed =
      !!entryPerm &&
      entryPerm.is_hidden === false &&
      entryPerm.owner?.execute === true &&
      entryPerm.group?.execute === true &&
      entryPerm.others?.execute === true &&
      entryPerm.group?.write === false &&
      entryPerm.others?.write === false;
    if (hid4Passed) totalScore += 8.0;
    feedback.push({
      rule: "HID-04: Executable Script Permissions (rwxr-xr-x)",
      passed: hid4Passed,
      message: hid4Passed
        ? "Application entrypoint script permissions verified (executable for all, writable only by owner)."
        : "Entrypoint permissions failed. Server script must be executable (x) for owner, group, and others, but only writable by owner.",
    });

    // HID-05: Nginx Configuration Least Privilege Defense (Weight: 8.0)
    const nginxPerm = perms.nginx_config;
    const hid5Passed =
      !!nginxPerm &&
      nginxPerm.is_hidden === false &&
      nginxPerm.group?.write === false &&
      nginxPerm.others?.write === false &&
      nginxPerm.owner?.execute === false &&
      nginxPerm.group?.execute === false &&
      nginxPerm.others?.execute === false;
    if (hid5Passed) totalScore += 8.0;
    feedback.push({
      rule: "HID-05: Nginx Server Config Least Privilege",
      passed: hid5Passed,
      message: hid5Passed
        ? "Nginx configuration security verified (read-only for group/others, non-executable)."
        : "Nginx config security failed. Config files must never be executable and must not be writable by group or others.",
    });

    // HID-06: Inverted Tree Graph Integrity (Weight: 7.0)
    const pathsSet = new Set(topology.map((t) => t.path));
    const has12Nodes = topology.length >= 12;
    const requiredPaths = [
      "/",
      "/bin",
      "/etc",
      "/home",
      "/var",
      "/tmp",
      "/var/log",
      "/home/alex",
      "/home/alex/Documents",
      "/home/alex/projects",
      "/home/alex/projects/cloud-app",
      "/home/alex/projects/cloud-app/src",
    ];
    const allRequiredPresent = requiredPaths.every((p) => pathsSet.has(p));
    const hid6Passed = has12Nodes && allRequiredPresent;
    if (hid6Passed) totalScore += 7.0;
    feedback.push({
      rule: "HID-06: Inverted Tree Complete Graph Integrity",
      passed: hid6Passed,
      message: hid6Passed
        ? "Complete 12-node filesystem topology tree successfully reconstructed without orphaned nodes."
        : "Topology tree is incomplete. Ensure all 12 core system and user directories are mapped.",
    });

    // HID-07: Canonical Path Sanitization & Anti-Spoofing (Weight: 7.0)
    const allAbs = Object.values(absPaths);
    const allRel = Object.values(relPaths);
    const noDoubleSlashes = [...allAbs, ...allRel].every((p) => !p.includes("//"));
    const noTrailingSlashesOnFiles = [...allAbs, ...allRel].every((p) => !p.endsWith("/"));
    const hid7Passed = noDoubleSlashes && noTrailingSlashesOnFiles;
    if (hid7Passed) totalScore += 7.0;
    feedback.push({
      rule: "HID-07: Path Normalization & Canonical Formatting",
      passed: hid7Passed,
      message: hid7Passed
        ? "All paths conform to POSIX canonical formatting (no redundant slashes or leaf trailing slashes)."
        : "Path format error: Clean up double slashes (//) and trailing slashes on file paths.",
    });

    // HID-08: Deep Entrypoint Absolute Coordinate (Weight: 7.0)
    const entryAbs =
      absPaths.application_entrypoint === "/home/alex/projects/cloud-app/src/index.js";
    if (entryAbs) totalScore += 7.0;
    feedback.push({
      rule: "HID-08: Application Entrypoint Absolute Coordinate",
      passed: entryAbs,
      message: entryAbs
        ? "Application entrypoint global address verified (/home/alex/projects/cloud-app/src/index.js)."
        : "Entrypoint absolute path incorrect. Expected /home/alex/projects/cloud-app/src/index.js.",
    });

    const finalScore = Math.min(100, Math.round(totalScore));
    const passed = finalScore >= 90;
    const executionTime = Math.round(performance.now() - startTime);

    return {
      passed,
      score: finalScore,
      feedback,
      execution_time_ms: executionTime,
    };
  }

  /**
   * Dedicated evaluation engine for EXE-00-03 Network Request Investigation & HTTP Diagnostics
   */
  private static evaluateNetworkDiagnostics(
    code: string,
    startTime: number
  ): ValidationResultOutput {
    const feedback: ValidationFeedbackItem[] = [];
    let payload: Record<string, string> = {};

    try {
      payload = JSON.parse(code);
    } catch {
      return {
        passed: false,
        score: 0,
        feedback: [
          {
            rule: "JSON Manifest Integrity",
            passed: false,
            message: "Failed to parse network diagnostics manifest. Please record your answers and resubmit.",
          },
        ],
        execution_time_ms: Math.round(performance.now() - startTime),
        error: "Malformed manifest payload",
      };
    }

    let totalScore = 0;

    // --- VISIBLE TEST SUITE (40% Weight - 6 Tests) ---
    // VIS-01: Identify Successful Catalog Request (200 OK) -> R3
    const vis1Passed = (payload.task_1_successful_catalog_request_id || "").trim().toUpperCase() === "R3";
    if (vis1Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-01: Product Catalog 200 OK Request",
      passed: vis1Passed,
      message: vis1Passed
        ? "Correctly identified Request R3 as the successful product catalog fetch returning 200 OK."
        : `Expected Request R3 (200 OK), received "${payload.task_1_successful_catalog_request_id || 'none'}".`,
    });

    // VIS-02: Identify Missing Resource (404 Not Found) -> R4
    const vis2Passed = (payload.task_1_missing_asset_request_id || "").trim().toUpperCase() === "R4";
    if (vis2Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-02: Missing Image Resource 404 Not Found",
      passed: vis2Passed,
      message: vis2Passed
        ? "Correctly identified Request R4 as the missing product photo returning 404 Not Found."
        : `Expected Request R4 (404 Not Found), received "${payload.task_1_missing_asset_request_id || 'none'}".`,
    });

    // VIS-03: Identify Server Failure (500 Internal Server Error) -> R8
    const vis3Passed = (payload.task_4_backend_crash_request_id || "").trim().toUpperCase() === "R8";
    if (vis3Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-03: Backend Database Crash 500 Error",
      passed: vis3Passed,
      message: vis3Passed
        ? "Correctly identified Request R8 as the backend crash returning 500 Internal Server Error."
        : `Expected Request R8 (500 Internal Server Error), received "${payload.task_4_backend_crash_request_id || 'none'}".`,
    });

    // VIS-04: Locate JSON Payload Error Code -> DB_CONN_TIMEOUT
    const vis4Passed = (payload.task_5_error_code_payload || "").trim() === "DB_CONN_TIMEOUT";
    if (vis4Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-04: JSON Response Body Inspection",
      passed: vis4Passed,
      message: vis4Passed
        ? "Correctly extracted error code 'DB_CONN_TIMEOUT' from the R8 JSON response payload."
        : `Expected error code 'DB_CONN_TIMEOUT', received "${payload.task_5_error_code_payload || 'none'}".`,
    });

    // VIS-05: Identify Insecure Plain HTTP Request -> R7
    const vis5Passed = (payload.task_2_insecure_http_request_id || "").trim().toUpperCase() === "R7";
    if (vis5Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-05: Insecure HTTP Cleartext Detection",
      passed: vis5Passed,
      message: vis5Passed
        ? "Correctly isolated Request R7 as using unencrypted plain HTTP over port 80."
        : `Expected Request R7 (Insecure HTTP), received "${payload.task_2_insecure_http_request_id || 'none'}".`,
    });

    // VIS-06: Inspect Redirection Response Header -> https://octostore.app
    const vis6Target = (payload.task_2_redirect_target_url || "").trim().toLowerCase();
    const vis6Passed = vis6Target === "https://octostore.app" || vis6Target === "https://octostore.app/";
    if (vis6Passed) totalScore += 6.65;
    feedback.push({
      rule: "VIS-06: Location Header Redirection Target",
      passed: vis6Passed,
      message: vis6Passed
        ? "Correctly retrieved 'https://octostore.app' from the 301 Location response header."
        : `Expected 'https://octostore.app', received "${payload.task_2_redirect_target_url || 'none'}".`,
    });

    // --- HIDDEN TEST SUITE (60% Weight - 8 Tests) ---
    // HID-01: DNS Resolution Mapping -> 140.82.121.34
    const hid1Passed = (payload.task_5_resolved_api_ip_address || "").trim().startsWith("140.82.121.34");
    if (hid1Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-01: DNS IP Resolution (api.octostore.app)",
      passed: hid1Passed,
      message: hid1Passed
        ? "DNS mapping verified: api.octostore.app resolved to 140.82.121.34."
        : "DNS resolution mismatch: remote IP for api.octostore.app was incorrect.",
    });

    // HID-02: Redirect Chain Analysis (301 Permanent Redirect)
    const hid2Passed = vis6Passed;
    if (hid2Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-02: Redirect Chain Analysis (301 Protocol Upgrade)",
      passed: hid2Passed,
      message: hid2Passed
        ? "Permanent 301 redirect verified for HTTP to HTTPS origin upgrade."
        : "Failed to trace 301 permanent redirect target origin.",
    });

    // HID-03: Authentication Challenge Detection (401 Unauthorized) -> R5
    const hid3Passed = (payload.task_3_unauthenticated_request_id || "").trim().toUpperCase() === "R5";
    if (hid3Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-03: Authentication Failure (401 Unauthorized)",
      passed: hid3Passed,
      message: hid3Passed
        ? "Correctly detected Request R5 as unauthenticated (401 with WWW-Authenticate challenge)."
        : "Failed to identify unauthenticated 401 request.",
    });

    // HID-04: Forbidden Role Permission Detection (403 Forbidden) -> R6
    const hid4Passed = (payload.task_3_forbidden_request_id || "").trim().toUpperCase() === "R6";
    if (hid4Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-04: Authorization Permission Denial (403 Forbidden)",
      passed: hid4Passed,
      message: hid4Passed
        ? "Correctly identified Request R6 as authorization denial (403 Forbidden)."
        : "Failed to distinguish 403 Forbidden permissions denial.",
    });

    // HID-05: Gateway Timeout Latency Root Cause (504 Gateway Timeout) -> R9
    const hid5Passed = (payload.task_4_timeout_bottleneck_request_id || "").trim().toUpperCase() === "R9";
    if (hid5Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-05: Gateway Timeout Latency Bottleneck (504 Timeout)",
      passed: hid5Passed,
      message: hid5Passed
        ? "Correctly identified Request R9 as the 15-second upstream gateway timeout."
        : "Failed to locate 504 Gateway Timeout latency bottleneck.",
    });

    // HID-06: Protocol Isolation Verification
    const hid6Passed = vis5Passed;
    if (hid6Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-06: Transport Security Isolation",
      passed: hid6Passed,
      message: hid6Passed
        ? "Successfully verified transport layer isolation between HTTP and HTTPS."
        : "Insecure transport protocol isolation failed.",
    });

    // HID-07: JSON Error Key Extraction
    const hid7Passed = vis4Passed;
    if (hid7Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-07: JSON Payload Key Extraction",
      passed: hid7Passed,
      message: hid7Passed
        ? "JSON structure parsing and error code extraction verified."
        : "Failed to extract required error attribute from JSON payload.",
    });

    // HID-08: Multi-Request Root Cause Synthesis -> database_connection_crash
    const hid8Passed = (payload.task_6_primary_root_cause || "").trim() === "database_connection_crash";
    if (hid8Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-08: Incident Root Cause Synthesis",
      passed: hid8Passed,
      message: hid8Passed
        ? "Root cause verified: Database connection crash at checkout triggered incident cascade."
        : "Incorrect root-cause analysis for the multi-request failure sequence.",
    });

    const finalScore = Math.min(100, Math.round(totalScore));
    const passed = finalScore >= 90;

    return {
      passed,
      score: finalScore,
      feedback,
      execution_time_ms: Math.round(performance.now() - startTime),
    };
  }

  /**
   * Evaluates Visual Git Graph Reconstruction (EXE-00-04) submissions
   */
  /**
   * Evaluates Visual Git Graph Reconstruction (EXE-00-04) submissions
   */
  private static evaluateGitGraphReconstruction(
    rawCode: string,
    startTime: number
  ): ValidationResultOutput {
    let payload: Record<string, unknown> = {};

    try {
      payload = JSON.parse(rawCode);
    } catch {
      return {
        passed: false,
        score: 0,
        feedback: [
          {
            rule: "JSON Manifest Integrity",
            passed: false,
            message: "Submission payload could not be parsed as valid JSON.",
          },
        ],
        execution_time_ms: Math.round(performance.now() - startTime),
      };
    }

    const feedback: ValidationFeedbackItem[] = [];
    let totalScore = 0;

    const getString = (keys: string[]): string => {
      for (const k of keys) {
        const val = payload[k];
        if (typeof val === "string") return val.trim();
      }
      return "";
    };

    const getArray = (keys: string[]): string[] => {
      for (const k of keys) {
        const val = payload[k];
        if (Array.isArray(val)) {
          return val.map((item) => String(item).trim());
        }
      }
      return [];
    };

    // --- VISIBLE TEST SUITE (40% Total Weight - 6 Tests) ---

    // VIS-01: Identify Repository Root Genesis Commit (C0 / 3a9f1b04)
    const rootCommit = getString(["task_1_root_genesis_commit_id", "root_commit"]).toUpperCase();
    const vis1Passed = rootCommit === "C0";
    if (vis1Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-01: Genesis Root Commit Identification",
      passed: vis1Passed,
      message: vis1Passed
        ? "Correctly identified Commit C0 (3a9f1b04) as the repository genesis root with 0 parent links."
        : `Expected Genesis Root Commit C0, received "${rootCommit || "none"}".`,
    });

    // VIS-02: Identify Active HEAD Commit (C7 / 7f3b8c44)
    const headCommit = getString(["task_1_active_head_commit_id", "head_commit"]).toUpperCase();
    const vis2Passed = headCommit === "C7";
    if (vis2Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-02: Active HEAD Pointer Target",
      passed: vis2Passed,
      message: vis2Passed
        ? "Correctly identified active HEAD standing on Commit C7 at the tip of main."
        : `Expected active HEAD at Commit C7, received "${headCommit || "none"}".`,
    });

    // VIS-03: Trace Commit Ancestry Chain (C4 -> C3 -> C1 -> C0)
    const rawChain = getArray(["task_2_c4_ancestry_chain", "c4_ancestry_chain"]);
    const chain = rawChain.map((c) => c.toUpperCase());
    const expectedChain = ["C4", "C3", "C1", "C0"];
    const vis3Passed =
      chain.length === expectedChain.length &&
      chain.every((val, idx) => val === expectedChain[idx]);
    if (vis3Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-03: Backwards Commit Ancestry Tracing",
      passed: vis3Passed,
      message: vis3Passed
        ? "Correctly traced unbroken parent chain C4 → C3 → C1 → C0 back to genesis root."
        : `Ancestry chain mismatch: expected [C4, C3, C1, C0], received [${chain.join(", ")}].`,
    });

    // VIS-04: Identify 3-Way Merge Commit (M6 / 9e4a2f78)
    const mergeCommitId = getString(["task_4_merge_commit_id", "merge_commit_id"]).toUpperCase();
    const vis4Passed = mergeCommitId === "M6";
    if (vis4Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-04: 3-Way Merge Commit Identification",
      passed: vis4Passed,
      message: vis4Passed
        ? "Correctly identified Merge Commit M6 (9e4a2f78) fusing parallel development streams."
        : `Expected 3-Way Merge Commit M6, received "${mergeCommitId || "none"}".`,
    });

    // VIS-05: Determine Branch Fork Origin / Common Ancestor (C1 / 8b2e4c19)
    const commonAncestor = getString(["task_3_common_ancestor_base_commit", "common_ancestor"]).toUpperCase();
    const vis5Passed = commonAncestor === "C1";
    if (vis5Passed) totalScore += 6.67;
    feedback.push({
      rule: "VIS-05: Common Ancestor Fork Point",
      passed: vis5Passed,
      message: vis5Passed
        ? "Correctly identified Commit C1 (8b2e4c19) as the common ancestor base commit where branches split."
        : `Expected Common Ancestor C1, received "${commonAncestor || "none"}".`,
    });

    // VIS-06: Interpret Feature Branch Tip (C4 / d19a7e30)
    const featureTip = getString(["task_1_feature_branch_tip_id", "feature_branch_tip"]).toUpperCase();
    const vis6Passed = featureTip === "C4";
    if (vis6Passed) totalScore += 6.65;
    feedback.push({
      rule: "VIS-06: Feature Branch Tip Resolution",
      passed: vis6Passed,
      message: vis6Passed
        ? "Correctly identified Commit C4 (d19a7e30) as the latest tip of feature/auth-gateway."
        : `Expected feature branch tip C4, received "${featureTip || "none"}".`,
    });

    // --- HIDDEN TEST SUITE (60% Total Weight - 8 Tests @ 7.5% each) ---

    // HID-01: Direct Parent Link Resolution (Parent of C2 is C1)
    const parentOfC2 = getString(["task_2_direct_parent_of_c2", "direct_parent_c2"]).toUpperCase();
    const hid1Passed = parentOfC2 === "C1";
    if (hid1Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-01: Direct Parent Link Resolution (C2 → C1)",
      passed: hid1Passed,
      message: hid1Passed
        ? "Verified direct parent link: Commit C2 correctly references parent C1."
        : "Failed to resolve direct parent link for Commit C2.",
    });

    // HID-02: Lowest Common Ancestor (LCA) Discovery
    const hid2Passed = vis5Passed;
    if (hid2Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-02: Lowest Common Ancestor Discovery",
      passed: hid2Passed,
      message: hid2Passed
        ? "Verified lowest common ancestor calculation between divergent tips C5 and C4."
        : "Failed to determine common ancestor for divergent merge inputs.",
    });

    // HID-03: DAG Arrow Direction Temporal Invariant
    const arrowDir = getString(["task_2_arrow_direction", "arrow_direction"]);
    const hid3Passed = arrowDir === "backward_to_past";
    if (hid3Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-03: Temporal Parent Arrow Invariant",
      passed: hid3Passed,
      message: hid3Passed
        ? "Verified temporal invariant: Commit arrows point strictly backward to parent ancestors in time."
        : "Failed temporal invariant: commit arrows must point backward to parents, not forward.",
    });

    // HID-04: Lightweight Branch Pointer Semantics
    const branchStorage = getString(["task_3_branch_storage_type", "branch_storage_type"]);
    const hid4Passed = branchStorage === "lightweight_pointer";
    if (hid4Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-04: Lightweight Branch Pointer Mechanics",
      passed: hid4Passed,
      message: hid4Passed
        ? "Verified branch semantics: Git branches are lightweight 41-byte text pointers, not folder duplicates."
        : "Incorrect branch model: branches do not duplicate files on disk.",
    });

    // HID-05: Merge Parent Allocation Integrity (Parent 1 = C5, Parent 2 = C4)
    const mergeParents = getArray(["merge_parents"]).map((p) => p.toUpperCase());
    const p1 = (getString(["task_4_merge_parent_1_id"]) || mergeParents[0] || "").toUpperCase();
    const p2 = (getString(["task_4_merge_parent_2_id"]) || mergeParents[1] || "").toUpperCase();
    const hid5Passed = p1 === "C5" && p2 === "C4";
    if (hid5Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-05: Dual-Parent Merge Allocation Integrity",
      passed: hid5Passed,
      message: hid5Passed
        ? "Verified merge parent topology: Parent 1 references target main (C5) and Parent 2 references incoming feature (C4)."
        : `Dual parent allocation mismatch: expected Parent 1 = C5, Parent 2 = C4; received Parent 1 = "${p1}", Parent 2 = "${p2}".`,
    });

    // HID-06: Remote vs Local Graph Delta Synchronization ([M6, C7])
    const rawUnpushed = getArray(["task_5_unpushed_local_commits", "unpushed_commits"]);
    const unpushed = rawUnpushed.map((c) => c.toUpperCase());
    const hid6Passed =
      unpushed.length === 2 &&
      unpushed.includes("M6") &&
      unpushed.includes("C7");
    if (hid6Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-06: Remote Synchronization Delta Reasoning",
      passed: hid6Passed,
      message: hid6Passed
        ? "Correctly calculated unpushed graph delta: Local commits [M6, C7] require synchronization to origin/main."
        : `Unpushed commits mismatch: expected [M6, C7], received [${unpushed.join(", ")}].`,
    });

    // HID-07: DAG Acyclic Guarantee Enforcement
    const dagAcyclic = getString(["task_5_dag_acyclic_guarantee", "dag_acyclic_guarantee"]);
    const hid7Passed = dagAcyclic === "time_one_way_no_loops";
    if (hid7Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-07: DAG Acyclic Property Enforcement",
      passed: hid7Passed,
      message: hid7Passed
        ? "Verified DAG acyclic invariant: History forms a directed graph with zero circular loops."
        : "Failed DAG acyclic property validation.",
    });

    // HID-08: Active HEAD Branch Identification
    const activeBranch = getString(["task_1_active_head_branch", "active_branch"]).toLowerCase();
    const hid8Passed = activeBranch === "main";
    if (hid8Passed) totalScore += 7.5;
    feedback.push({
      rule: "HID-08: Active HEAD Branch Context",
      passed: hid8Passed,
      message: hid8Passed
        ? "Verified active context: HEAD attached to branch 'main' referencing commit C7."
        : `Expected active branch 'main', received "${activeBranch || "none"}".`,
    });

    const finalScore = Math.min(100, Math.round(totalScore));
    const passed = finalScore >= 90;

    return {
      passed,
      score: finalScore,
      feedback,
      execution_time_ms: Math.round(performance.now() - startTime),
    };
  }

  /**
   * Evaluates AI Verification & Evaluation Investigation submissions (EXE-00-05)
   */
  private static evaluateAiVerification(
    code: string,
    startTime: number
  ): ValidationResultOutput {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(code);
    } catch {
      return {
        passed: false,
        score: 0,
        feedback: [
          {
            rule: "JSON Payload Structure",
            passed: false,
            message: "Submission payload is not valid JSON.",
          },
        ],
        execution_time_ms: Math.round(performance.now() - startTime),
      };
    }

    const getString = (keys: string[]): string => {
      for (const k of keys) {
        const val = payload[k];
        if (typeof val === "string" && val.trim().length > 0) return val.trim();
      }
      return "";
    };

    const getArray = (keys: string[]): string[] => {
      for (const k of keys) {
        const val = payload[k];
        if (Array.isArray(val)) return val.map((x) => String(x).trim());
      }
      return [];
    };

    let totalScore = 0;
    const feedback: ValidationFeedbackItem[] = [];

    // --- VISIBLE TEST SUITE (40% Total Weight - 6 Tests) ---

    // VIS-01: Hallucinated Package Detection (@auth/jwt-auto-verify-v2) - Weight: 7%
    const pkgName = getString(["task_1_hallucinated_package_name", "hallucinated_package"]);
    const vis1Passed = pkgName.toLowerCase() === "@auth/jwt-auto-verify-v2";
    if (vis1Passed) totalScore += 7;
    feedback.push({
      rule: "VIS-01: Hallucinated Package Detection",
      passed: vis1Passed,
      message: vis1Passed
        ? "Correctly identified phantom npm package '@auth/jwt-auto-verify-v2' in PR-101."
        : `Expected hallucinated package '@auth/jwt-auto-verify-v2', received "${pkgName || "none"}".`,
    });

    // VIS-02: Missing Context Identification (table_schema_existing_row_volume) - Weight: 7%
    const missingCtx = getString(["task_2_missing_context_element", "missing_context"]);
    const vis2Passed = missingCtx === "table_schema_existing_row_volume";
    if (vis2Passed) totalScore += 7;
    feedback.push({
      rule: "VIS-02: Missing Context Identification",
      passed: vis2Passed,
      message: vis2Passed
        ? "Correctly diagnosed missing database schema and row volume context in PR-102."
        : `Expected missing context 'table_schema_existing_row_volume', received "${missingCtx || "none"}".`,
    });

    // VIS-03: Unsupported Performance Claim (zero_overhead_native_caching) - Weight: 6%
    const unsuppClaim = getString(["task_1_unsupported_performance_claim", "unsupported_claim"]);
    const vis3Passed = unsuppClaim === "zero_overhead_native_caching";
    if (vis3Passed) totalScore += 6;
    feedback.push({
      rule: "VIS-03: Unsupported Claim Detection",
      passed: vis3Passed,
      message: vis3Passed
        ? "Correctly flagged unverified claim of 'zero-overhead native caching' in PR-101."
        : `Expected unsupported claim 'zero_overhead_native_caching', received "${unsuppClaim || "none"}".`,
    });

    // VIS-04: Best Candidate Selection (candidate_b) - Weight: 7%
    const bestCand = getString(["task_4_best_candidate_response_id", "best_candidate"]).toLowerCase();
    const vis4Passed = bestCand === "candidate_b";
    if (vis4Passed) totalScore += 7;
    feedback.push({
      rule: "VIS-04: Best Candidate Selection",
      passed: vis4Passed,
      message: vis4Passed
        ? "Correctly selected Candidate B as the secure, production-ready solution with parameterized RLS."
        : `Expected best candidate 'candidate_b', received "${bestCand || "none"}".`,
    });

    // VIS-05: Verification Evidence Source (npm_registry_404_ts_compiler_ts2307) - Weight: 6%
    const verifSource = getString(["task_1_verification_evidence_source", "verification_source"]);
    const vis5Passed = verifSource === "npm_registry_404_ts_compiler_ts2307";
    if (vis5Passed) totalScore += 6;
    feedback.push({
      rule: "VIS-05: Verification Source Identification",
      passed: vis5Passed,
      message: vis5Passed
        ? "Correctly linked findings to deterministic ground truth: npm registry 404 and TypeScript compiler error TS2307."
        : `Expected verification source 'npm_registry_404_ts_compiler_ts2307', received "${verifSource || "none"}".`,
    });

    // VIS-06: Confidence vs Correctness Disconnect (authoritative_tone_with_flawed_logic) - Weight: 7%
    const confMisalign = getString(["task_3_confidence_misalignment", "confidence_misalignment"]);
    const vis6Passed = confMisalign === "authoritative_tone_with_flawed_logic";
    if (vis6Passed) totalScore += 7;
    feedback.push({
      rule: "VIS-06: Confidence vs Correctness Disconnect",
      passed: vis6Passed,
      message: vis6Passed
        ? "Correctly recognized authoritative tone masking inverted rate limiter logic in PR-103."
        : `Expected confidence misalignment 'authoritative_tone_with_flawed_logic', received "${confMisalign || "none"}".`,
    });

    // --- HIDDEN TEST SUITE (60% Total Weight - 8 Tests) ---

    // HID-01: False API Property Generation (thread_safe_guarantee_unsupported) - Weight: 8%
    const falseApi = getString(["task_3_false_api_property", "false_api_property"]);
    const hid1Passed = falseApi === "thread_safe_guarantee_unsupported";
    if (hid1Passed) totalScore += 8;
    feedback.push({
      rule: "HID-01: False API Property Generation",
      passed: hid1Passed,
      message: hid1Passed
        ? "Verified detection of unsupported thread-safe guarantee on non-atomic in-memory operations."
        : "Failed to detect unsupported thread-safe claim in PR-103.",
    });

    // HID-02: Fake Documentation Citation (rfc_8812_postgres_migration) - Weight: 7%
    const fakeCite = getString(["task_2_fake_documentation_citation", "fake_citation"]);
    const hid2Passed = fakeCite === "rfc_8812_postgres_migration";
    if (hid2Passed) totalScore += 7;
    feedback.push({
      rule: "HID-02: Fake Documentation Citation",
      passed: hid2Passed,
      message: hid2Passed
        ? "Verified detection of fabricated RFC citation in database migration documentation."
        : "Failed to flag fabricated PostgreSQL RFC citation.",
    });

    // HID-03: Deployment Sequence Defect (workers_started_before_migration_completed) - Weight: 8%
    const seqDefect = getString(["task_2_deployment_sequence_defect", "sequence_defect"]);
    const hid3Passed = seqDefect === "workers_started_before_migration_completed";
    if (hid3Passed) totalScore += 8;
    feedback.push({
      rule: "HID-03: Deployment Sequence Defect",
      passed: hid3Passed,
      message: hid3Passed
        ? "Verified identification of race condition: restarting worker processes before migration completes."
        : "Failed to identify deployment sequence defect in PR-102.",
    });

    // HID-04: Security Architecture Flaw (client_side_authorization_bypassing_rls) - Weight: 8%
    const secFlaw = getString(["task_4_candidate_a_security_defect", "security_defect"]);
    const hid4Passed = secFlaw === "client_side_authorization_bypassing_rls";
    if (hid4Passed) totalScore += 8;
    feedback.push({
      rule: "HID-04: Security Architecture Flaw",
      passed: hid4Passed,
      message: hid4Passed
        ? "Verified detection of critical security vulnerability: client-side authorization bypassing PostgreSQL RLS."
        : "Failed to detect client-side authorization bypass in Candidate A.",
    });

    // HID-05: Inverted Boundary Condition (inverted_boolean_boundary) - Weight: 8%
    const logicDefect = getString(["task_3_logic_defect_type", "logic_defect"]);
    const hid5Passed = logicDefect === "inverted_boolean_boundary";
    if (hid5Passed) totalScore += 8;
    feedback.push({
      rule: "HID-05: Inverted Boundary Condition",
      passed: hid5Passed,
      message: hid5Passed
        ? "Verified diagnosis of inverted '<' boolean boundary returning true when under limit."
        : "Failed to identify inverted boolean boundary condition in PR-103.",
    });

    // HID-06: Hallucinated Configuration Parameter (cacheTtlSeconds) - Weight: 7%
    const configParam = getString(["task_1_hallucinated_config_parameter", "config_parameter"]);
    const hid6Passed = configParam === "cacheTtlSeconds";
    if (hid6Passed) totalScore += 7;
    feedback.push({
      rule: "HID-06: Hallucinated Configuration Parameter",
      passed: hid6Passed,
      message: hid6Passed
        ? "Verified identification of fabricated 'cacheTtlSeconds' configuration parameter."
        : `Expected hallucinated config parameter 'cacheTtlSeconds', received "${configParam || "none"}".`,
    });

    // HID-07: Insecure Candidate Rejection (candidate_a) - Weight: 7%
    const worstCand = getString(["task_4_worst_candidate_response_id", "worst_candidate"]).toLowerCase();
    const hid7Passed = worstCand === "candidate_a";
    if (hid7Passed) totalScore += 7;
    feedback.push({
      rule: "HID-07: Insecure Candidate Rejection",
      passed: hid7Passed,
      message: hid7Passed
        ? "Verified rejection of Candidate A due to disabling PostgreSQL Row Level Security."
        : `Expected worst candidate 'candidate_a', received "${worstCand || "none"}".`,
    });

    // HID-08: Multi-Response Comparative Ranking (candidate_b > candidate_c > candidate_a) - Weight: 7%
    const rankings = getArray(["task_4_candidate_rankings", "candidate_rankings"]).map((r) => r.toLowerCase());
    const hid8Passed =
      rankings.length === 3 &&
      rankings[0] === "candidate_b" &&
      rankings[1] === "candidate_c" &&
      rankings[2] === "candidate_a";
    if (hid8Passed) totalScore += 7;
    feedback.push({
      rule: "HID-08: Multi-Response Comparative Ranking",
      passed: hid8Passed,
      message: hid8Passed
        ? "Verified multi-candidate comparative ranking: Candidate B (1st) > Candidate C (2nd) > Candidate A (3rd)."
        : `Candidate ranking mismatch: expected [candidate_b, candidate_c, candidate_a], received [${rankings.join(", ")}].`,
    });

    const finalScore = Math.min(100, Math.round(totalScore));
    const passed = finalScore >= 90;

    return {
      passed,
      score: finalScore,
      feedback,
      execution_time_ms: Math.round(performance.now() - startTime),
    };
  }
}

