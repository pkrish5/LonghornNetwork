import java.util.*;

public class ReferralPathFinder {
    private StudentGraph graph;

    public ReferralPathFinder(StudentGraph graph) {
        this.graph = graph;
    }

    /**
     * Uses Dijkstra's algorithm to find the "shortest" path (i.e., the path with the strongest connections)
     * from the start student to any student who has an internship at targetCompany.
     * We invert the connection strength by using its reciprocal as the edge "distance":
     *      distance = 1.0 / connectionStrength.
     *
     * @param start         The starting UniversityStudent.
     * @param targetCompany The company name to search for (case-insensitive).
     * @return A list of UniversityStudents representing the referral path.
     *         If no student with the target internship is found, returns an empty list.
     */
    public List<UniversityStudent> findReferralPath(UniversityStudent start, String targetCompany) {
        // Maps to store the best known distance and previous node for path reconstruction.
        Map<UniversityStudent, Double> dist = new HashMap<>();
        Map<UniversityStudent, UniversityStudent> prev = new HashMap<>();
        Set<UniversityStudent> visited = new HashSet<>();

        // Initialize distances to infinity.
        for (UniversityStudent s : graph.getAllNodes()) {
            dist.put(s, Double.MAX_VALUE);
            prev.put(s, null);
        }
        dist.put(start, 0.0);

        // Priority queue orders nodes by their current distance.
        PriorityQueue<UniversityStudent> pq =
                new PriorityQueue<>(Comparator.comparingDouble(dist::get));
        pq.add(start);

        while (!pq.isEmpty()) {
            UniversityStudent u = pq.poll();
            if (visited.contains(u)) {
                continue;
            }
            visited.add(u);

            // Check if this student has interned at the target company.
            for (String internship : u.previousInternships) {
                if (internship.equalsIgnoreCase(targetCompany)) {
                    // Reconstruct the path from start to u.
                    List<UniversityStudent> path = new ArrayList<>();
                    UniversityStudent cur = u;
                    while (cur != null) {
                        path.add(cur);
                        cur = prev.get(cur);
                    }
                    Collections.reverse(path);
                    return path;
                }
            }

            // Relaxation for neighbors.
            for (StudentGraph.Edge edge : graph.getNeighbors(u)) {
                UniversityStudent v = edge.neighbor;
                if (visited.contains(v)) continue;

                // Calculate new "distance": using the reciprocal of the edge weight.
                double newDist = dist.get(u) + (1.0 / edge.weight);
                if (newDist < dist.get(v)) {
                    dist.put(v, newDist);
                    prev.put(v, u);
                    pq.add(v);
                }
            }
        }

        // No student found with the target internship.
        return new ArrayList<>();
    }
}
