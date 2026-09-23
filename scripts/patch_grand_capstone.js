import fs from "fs";

const file = "components/dashboard/capstone-tracker.tsx";
let content = fs.readFileSync(file, "utf8");

const target = `    try {
      const res = await fetch("/api/capstone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoInput,
          phaseId: selected.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          success: true,
          message: data.message || "Repository verified against grading harness.",
          details: data.details,
        });
      } else {`;

const replacement = `    try {
      const res = await fetch("/api/capstone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoInput,
          phaseId: selected.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        saveVerifiedCapstone(selected.id, repoInput, data.overallScore || 100);
        setFeedback({
          success: true,
          message: data.message || "Repository verified against grading harness and saved.",
          details: data.details,
        });
      } else {`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, "utf8");
  console.log("GrandEnterpriseCapstonesTab patched!");
} else {
  console.log("Grand target not found");
}
