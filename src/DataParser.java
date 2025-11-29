import java.io.*;
import java.util.*;
/**
 * Utility class responsible for reading input files and constructing
 * {@link UniversityStudent} objects.
 * <p>
 * The expected format matches the lab's {@code input_sample.txt}, including
 * fields such as name, age, gender, major, GPA, roommate preferences and
 * previous internships. The parsed students are later used to build the
 * {@link StudentGraph}.
 */
public class DataParser {
    /**
     * Parses student information from a file and creates UniversityStudent objects.
     * 
     * @param filename The path to the input file containing student data
     * @return A list of UniversityStudent objects parsed from the file
     * @throws IOException If there's an error reading the file
     * @throws IllegalArgumentException If the file format is incorrect or required fields are missing
     */
    public static List<UniversityStudent> parseStudents(String filename) throws IOException {
        List<UniversityStudent> students = new ArrayList<>();
        BufferedReader reader = new BufferedReader(new FileReader(filename));
        
        String line;
        Map<String, String> currentStudentData = new HashMap<>();
        boolean inStudentBlock = false;
        
        try {
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                
                // Check if we're starting a new student block
                if (line.equals("Student:")) {
                    // If we were already in a student block, process the previous one
                    if (inStudentBlock && !currentStudentData.isEmpty()) {
                        try {
                            UniversityStudent student = UniversityStudent.fromMap(currentStudentData);
                            students.add(student);
                        } catch (IllegalArgumentException e) {
                            System.err.println("Parsing error: " + e.getMessage());
                            throw e;
                        }
                    }
                    // Start a new student block
                    currentStudentData.clear();
                    inStudentBlock = true;
                    continue;
                }
                
                // Skip empty lines
                if (line.isEmpty()) {
                    continue;
                }
                
                // Parse key-value pairs
                if (line.contains(":")) {
                    int colonIndex = line.indexOf(":");
                    String key = line.substring(0, colonIndex).trim();
                    String value = line.substring(colonIndex + 1).trim();
                    currentStudentData.put(key, value);
                } else if (inStudentBlock && !line.isEmpty()) {
                    // Invalid format - line doesn't contain a colon
                    throw new IllegalArgumentException("Incorrect format: Line does not contain ':' separator: " + line);
                }
            }
            
            // Process the last student block if exists
            if (inStudentBlock && !currentStudentData.isEmpty()) {
                try {
                    UniversityStudent student = UniversityStudent.fromMap(currentStudentData);
                    students.add(student);
                } catch (IllegalArgumentException e) {
                    // Error message already formatted correctly by UniversityStudent.fromMap
                    System.err.println("Parsing error: " + e.getMessage());
                    throw e;
                }
            }
            
        } catch (NumberFormatException e) {
            // Handle invalid number formats
            String errorMsg = "Number format error: " + e.getMessage();
            System.err.println(errorMsg);
            throw new IllegalArgumentException(errorMsg, e);
        } finally {
            reader.close();
        }
        
        return students;
    }
}
