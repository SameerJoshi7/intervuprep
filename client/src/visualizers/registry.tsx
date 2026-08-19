import type { ComponentType } from "react";
import SortingVisualizer from "./sorting/SortingVisualizer";
import BinarySearchVisualizer from "./binarysearch/BinarySearchVisualizer";
import GraphVisualizer from "./graph/GraphVisualizer";
import LinkedListVisualizer from "./linkedlist/LinkedListVisualizer";
import BSTVisualizer from "./bst/BSTVisualizer";
import DijkstraVisualizer from "./dijkstra/DijkstraVisualizer";
import RequestFlowVisualizer from "./sysdesign/RequestFlowVisualizer";

export interface VisualizerMeta {
  id: string;
  title: string;
  description: string;
  category: string;
  component: ComponentType;
}

export const visualizers: VisualizerMeta[] = [
  {
    id: "sorting",
    title: "Sorting Algorithms",
    description:
      "Step through bubble, selection, insertion, and quick sort with live comparisons, swaps, and pointers.",
    category: "DSA",
    component: SortingVisualizer,
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description:
      "Watch the search space halve each step with lo/mid/hi pointers on a sorted array.",
    category: "DSA",
    component: BinarySearchVisualizer,
  },
  {
    id: "graph-traversal",
    title: "Graph Traversal (BFS / DFS)",
    description:
      "Compare breadth-first and depth-first traversal with a live queue/stack and visit order.",
    category: "DSA",
    component: GraphVisualizer,
  },
  {
    id: "linked-list",
    title: "Linked List Reversal",
    description:
      "Watch pointers flip one node at a time with prev / curr / saved-next during an in-place reversal.",
    category: "DSA",
    component: LinkedListVisualizer,
  },
  {
    id: "bst",
    title: "Binary Search Tree Traversal",
    description:
      "Build a BST and step through in-, pre-, and post-order traversals — in-order yields sorted values.",
    category: "DSA",
    component: BSTVisualizer,
  },
  {
    id: "dijkstra",
    title: "Dijkstra's Shortest Path",
    description:
      "Watch shortest distances propagate through a weighted graph as each node is finalized.",
    category: "DSA",
    component: DijkstraVisualizer,
  },
  {
    id: "request-flow",
    title: "Request Flow & Caching",
    description:
      "Follow a request through client -> load balancer -> API -> cache -> DB, comparing cache hit vs miss.",
    category: "System Design",
    component: RequestFlowVisualizer,
  },
];

export const visualizerById = (id: string) =>
  visualizers.find((v) => v.id === id);
