export interface SnapshotFileItem {
  path: string;
  status: "added" | "modified" | "unchanged" | "deleted";
  size: string;
  contentPreview: string;
}

export interface GitCommitNode {
  id: string; // e.g. "C0", "C1", "M6"
  hash: string; // 40-character SHA-1
  shortHash: string; // 8-character SHA-1
  authorName: string;
  authorEmail: string;
  timestamp: string;
  relativeTime: string;
  message: string;
  treeHash: string;
  parentIds: string[]; // e.g. [] or ["C0"] or ["C5", "C4"]
  parentHashes: string[];
  branchTags: string[]; // e.g. ["main"], ["feature/auth-gateway"], ["origin/main"]
  isMerge: boolean;
  isRoot: boolean;
  isHead: boolean;
  lane: number; // 0 for main, 1 for feature/auth-gateway
  depth: number; // topological order x-axis (0 to 6)
  snapshotFiles: SnapshotFileItem[];
}

export interface GitBranchInfo {
  name: string;
  currentCommitId: string;
  currentCommitHash: string;
  description: string;
  color: string;
  isRemote?: boolean;
}

export interface GitInvestigationFormState {
  task1_rootGenesisCommitId: string;
  task1_activeHeadBranch: string;
  task1_activeHeadCommitId: string;
  task1_featureBranchTipId: string;
  task2_directParentOfC2: string;
  task2_c4AncestryChain: string[];
  task2_arrowDirection: string;
  task3_commonAncestorBaseCommit: string;
  task3_branchStorageType: string;
  task4_mergeCommitId: string;
  task4_mergeParent1Id: string;
  task4_mergeParent2Id: string;
  task5_dagAcyclicGuarantee: string;
  task5_unpushedLocalCommits: string[];
}
