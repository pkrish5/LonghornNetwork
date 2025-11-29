import java.util.*;

public class StudentGraph {

    // Edge represents a connection from one student to a neighbor with a given weight.
    public static class Edge {
        public UniversityStudent neighbor;
        public int weight;

        public Edge(UniversityStudent neighbor, int weight) {
            this.neighbor = neighbor;
            this.weight = weight;
        }

        @Override
        public String toString() {
            return "(" + neighbor.name + ", " + weight + ")";
        }
    }

    private Map<UniversityStudent, List<Edge>> adjacencyList;

    // Constructor: builds an undirected graph by adding all students as nodes
    // and adding an edge between every pair (if connection strength > 0).
    public StudentGraph(List<UniversityStudent> students) {
        adjacencyList = new HashMap<>();

        // Initialize nodes.
        for (UniversityStudent s : students) {
            adjacencyList.put(s, new ArrayList<>());
        }

        // Create edges between every pair of students.
        for (int i = 0; i < students.size(); i++) {
            for (int j = i + 1; j < students.size(); j++) {
                UniversityStudent s1 = students.get(i);
                UniversityStudent s2 = students.get(j);
                int weight = s1.calculateConnectionStrength(s2);
                if (weight > 0) {
                    addEdge(s1, s2, weight);
                }
            }
        }
    }

    // Adds a weighted undirected edge between two students.
    public void addEdge(UniversityStudent s1, UniversityStudent s2, int weight) {
        adjacencyList.get(s1).add(new Edge(s2, weight));
        adjacencyList.get(s2).add(new Edge(s1, weight));
    }

    // Returns the list of edges (neighbors and weights) for a given student.
    public List<Edge> getNeighbors(UniversityStudent s) {
        return adjacencyList.get(s);
    }

    // Returns all students (nodes) in the graph.
    public Set<UniversityStudent> getAllNodes() {
        return adjacencyList.keySet();
    }

    // Displays the graph via the console.
    public void displayGraph() {
        System.out.println("\nStudent Graph:");
        for (UniversityStudent s : adjacencyList.keySet()) {
            System.out.println(s.name + " -> " + adjacencyList.get(s));
        }
    }
}
