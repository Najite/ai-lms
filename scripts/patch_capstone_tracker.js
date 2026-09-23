import fs from "fs";

const file = "components/dashboard/capstone-tracker.tsx";
let content = fs.readFileSync(file, "utf8");

const target = `          const status: "VERIFIED" | "IN_PROGRESS" | "NOT_STARTED" =
            completedInPhase === pNodes.length && pNodes.length > 0
              ? "VERIFIED"
              : completedInPhase > 0
              ? "IN_PROGRESS"
              : "NOT_STARTED";

          return {
            ...spec,
            id: \`cap-\${String(displayPhaseNum).padStart(2, "0")}\`,
            phaseId: p.order_index,
            displayPhaseNumber: displayPhaseNum,
            phaseName: formatPhaseTitle(p.order_index, p.title),
            status,
            repoUrl: undefined,
            lastScore: status === "VERIFIED" ? 100 : undefined,
          };`;

const replacement = `          const capId = \`cap-\${String(displayPhaseNum).padStart(2, "0")}\`;
          const verifiedMap = getVerifiedCapstones();
          const verifiedRecord = verifiedMap[capId];

          const status: "VERIFIED" | "IN_PROGRESS" | "NOT_STARTED" =
            verifiedRecord
              ? "VERIFIED"
              : completedInPhase === pNodes.length && pNodes.length > 0
              ? "VERIFIED"
              : completedInPhase > 0
              ? "IN_PROGRESS"
              : "NOT_STARTED";

          return {
            ...spec,
            id: capId,
            phaseId: p.order_index,
            displayPhaseNumber: displayPhaseNum,
            phaseName: formatPhaseTitle(p.order_index, p.title),
            status,
            repoUrl: verifiedRecord?.repoUrl || undefined,
            lastScore: verifiedRecord ? verifiedRecord.score : (status === "VERIFIED" ? 100 : undefined),
          };`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, "utf8");
  console.log("Updated capstone-tracker.tsx successfully!");
} else {
  console.log("Target not found!");
}
