import { CurriculumNode, CurriculumEdge } from "./supabase";

export type NodeStatus = "locked" | "available" | "in_progress" | "tests_passed" | "defense_passed" | "mastered";

/**
 * Computes whether a node is locked or unlocked based on the DAG edges and completed prerequisites.
 */
export function getNodeStatus(
  nodeId: string,
  edges: CurriculumEdge[],
  userProgress: Record<string, string>
): NodeStatus {
  const currentStatus = userProgress[nodeId];

  // If already completed or mastered, retain that state
  if (
    currentStatus === "mastered" ||
    currentStatus === "defense_passed" ||
    currentStatus === "tests_passed"
  ) {
    return currentStatus as NodeStatus;
  }

  // Find all prerequisites (incoming edges targeting this node)
  const incomingEdges = edges.filter((edge) => edge.target_node_id === nodeId);

  // If it's a root foundation node (no prerequisites), it is available
  if (incomingEdges.length === 0) {
    return (currentStatus as NodeStatus) || "in_progress";
  }

  // To unlock, ALL prerequisite source nodes must be completed (mastered or defense_passed)
  const allPrereqsMet = incomingEdges.every((edge) => {
    const prereqStatus = userProgress[edge.source_node_id];
    return prereqStatus === "mastered" || prereqStatus === "defense_passed";
  });

  if (!allPrereqsMet) {
    return "locked";
  }

  return (currentStatus as NodeStatus) || "available";
}

/**
 * Returns the list of prerequisite nodes that must be completed to unlock a given node.
 */
export function getMissingPrerequisites(
  nodeId: string,
  nodes: CurriculumNode[],
  edges: CurriculumEdge[],
  userProgress: Record<string, string>
): CurriculumNode[] {
  const incomingEdges = edges.filter((edge) => edge.target_node_id === nodeId);
  const incompleteEdges = incomingEdges.filter((edge) => {
    const prereqStatus = userProgress[edge.source_node_id];
    return prereqStatus !== "mastered" && prereqStatus !== "defense_passed";
  });

  return incompleteEdges
    .map((edge) => nodes.find((n) => n.id === edge.source_node_id))
    .filter((n): n is CurriculumNode => n !== undefined);
}
