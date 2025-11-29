import java.util.*;

/**
 * Uses the {@link StudentGraph} to form pods (groups) of students
 * based on their connection strengths.
 * <p>
 * This implementation builds a maximum spanning forest: for each
 * connected component in the graph it runs a Prim-style algorithm
 * that always picks the strongest available edge. The resulting
 * tree structure is then traversed and students are grouped into
 * pods of approximately the requested {@code podSize}.
 */
public class PodFormation {

    /** Underlying graph of students and weighted connections. */
    private final StudentGraph graph;

    /** List of pods formed from the graph. */
    private final List<List<UniversityStudent>> pods;

    /**
     * Constructs a new {@code PodFormation} helper for the given graph.
     *
     * @param graph the student graph that contains all students and edges
     *              used when building pods
     */
    public PodFormation(StudentGraph graph) {
        this.graph = graph;
        this.pods = new ArrayList<>();
    }

    /**
     * Returns the list of pods formed by the last call to {@link #formPods(int)}.
     *
     * @return list of pods, where each pod is a list of {@link UniversityStudent}s
     */
    public List<List<UniversityStudent>> getPods() {
        return pods;
    }

    /**
     * Forms pods of students using the underlying graph.
     * <p>
     * The algorithm works in two phases:
     * <ol>
     *   <li><b>Maximum spanning forest (Prim-style):</b><br>
     *       For each connected component we build a maximum spanning tree
     *       (MST but picking strongest edges first). This ensures that
     *       strongly connected students are close in the tree.</li>
     *   <li><b>Pod grouping:</b><br>
     *       We traverse each tree and pack students into pods of size
     *       at most {@code podSize}, trying to keep closely connected
     *       nodes together.</li>
     * </ol>
     *
     * @param podSize desired number of students per pod (must be &gt; 0)
     * @throws IllegalArgumentException if {@code podSize} is not positive
     */
    public void formPods(int podSize) {
        if (podSize <= 0) {
            throw new IllegalArgumentException("podSize must be positive");
        }

        pods.clear();

        Set<UniversityStudent> allNodes = graph.getAllNodes();
        if (allNodes.isEmpty()) {
            return;
        }

        // This will hold the adjacency list of the maximum spanning forest
        Map<UniversityStudent, List<UniversityStudent>> mstAdj = new HashMap<>();

        // Track which nodes we've already included in the forest
        Set<UniversityStudent> visited = new HashSet<>();

        // Build a maximum spanning tree for each connected component
        for (UniversityStudent start : allNodes) {
            if (visited.contains(start)) {
                continue;
            }

            // Prim-style for one component
            buildMaxSpanningTreeComponent(start, visited, mstAdj);
        }

        // Now traverse the forest and pack nodes into pods
        buildPodsFromForest(mstAdj, podSize);

        // Optional: print pods for debugging / console output
        printPodsToConsole();
    }

    /**
     * Builds a maximum spanning tree (component) starting from {@code start},
     * updating {@code visited} and {@code mstAdj}.
     */
    private void buildMaxSpanningTreeComponent(UniversityStudent start,
                                               Set<UniversityStudent> visited,
                                               Map<UniversityStudent, List<UniversityStudent>> mstAdj) {

        // Edge wrapper for priority queue
        class MSTEdge {
            UniversityStudent from;
            UniversityStudent to;
            int weight;

            MSTEdge(UniversityStudent from, UniversityStudent to, int weight) {
                this.from = from;
                this.to = to;
                this.weight = weight;
            }
        }

        // PriorityQueue that picks the highest-weight edge first
        PriorityQueue<MSTEdge> pq = new PriorityQueue<>(
                (a, b) -> Integer.compare(b.weight, a.weight)
        );

        visited.add(start);
        // Seed PQ with edges from the start node
        for (StudentGraph.Edge e : graph.getNeighbors(start)) {
            pq.offer(new MSTEdge(start, e.neighbor, e.weight));
        }

        while (!pq.isEmpty()) {
            MSTEdge e = pq.poll();
            UniversityStudent u = e.from;
            UniversityStudent v = e.to;

            if (visited.contains(v)) {
                continue;
            }

            // Add edge (u, v) to MST adjacency
            mstAdj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
            mstAdj.computeIfAbsent(v, k -> new ArrayList<>()).add(u);

            visited.add(v);

            // Add new frontier edges from v
            for (StudentGraph.Edge edge : graph.getNeighbors(v)) {
                UniversityStudent w = edge.neighbor;
                if (!visited.contains(w)) {
                    pq.offer(new MSTEdge(v, w, edge.weight));
                }
            }
        }
    }

    /**
     * Given a maximum spanning forest (mstAdj), traverse each tree and pack
     * students into pods of size at most {@code podSize}.
     */
    private void buildPodsFromForest(Map<UniversityStudent, List<UniversityStudent>> mstAdj,
                                     int podSize) {

        Set<UniversityStudent> assigned = new HashSet<>();
        List<UniversityStudent> currentPod = new ArrayList<>();

        for (UniversityStudent root : mstAdj.keySet()) {
            if (assigned.contains(root)) {
                continue;
            }

            // BFS over this tree/component
            Queue<UniversityStudent> queue = new LinkedList<>();
            queue.offer(root);

            while (!queue.isEmpty()) {
                UniversityStudent u = queue.poll();
                if (assigned.contains(u)) {
                    continue;
                }

                // If current pod is full, start a new one
                if (currentPod.size() >= podSize) {
                    pods.add(currentPod);
                    currentPod = new ArrayList<>();
                }

                currentPod.add(u);
                assigned.add(u);

                for (UniversityStudent neighbor :
                        mstAdj.getOrDefault(u, Collections.emptyList())) {
                    if (!assigned.contains(neighbor)) {
                        queue.offer(neighbor);
                    }
                }
            }
        }

        // Handle any leftover students not in mstAdj at all (isolated nodes)
        for (UniversityStudent s : graph.getAllNodes()) {
            if (!assigned.contains(s)) {
                if (currentPod.size() >= podSize) {
                    pods.add(currentPod);
                    currentPod = new ArrayList<>();
                }
                currentPod.add(s);
                assigned.add(s);
            }
        }

        // Add the last pod if it has any members
        if (!currentPod.isEmpty()) {
            pods.add(currentPod);
        }
    }

    /**
     * Convenience method to print pods to the console for debugging / output.
     */
    private void printPodsToConsole() {
        int idx = 1;
        for (List<UniversityStudent> pod : pods) {
            System.out.print("Pod " + idx++ + ": ");
            for (int i = 0; i < pod.size(); i++) {
                System.out.print(pod.get(i).name);
                if (i < pod.size() - 1) {
                    System.out.print(", ");
                }
            }
            System.out.println();
        }
    }
}
