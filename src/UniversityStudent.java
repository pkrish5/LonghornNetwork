import java.util.*;
/**
 * Concrete implementation of {@link Student} used in the Longhorn Network.
 * <p>
 * A {@code UniversityStudent} keeps track of its assigned roommate, a set of
 * friends, and a chat history with other students. It also implements the
 * connection-strength rule specified in the lab:
 * <ul>
 *   <li>+4 if the two students are roommates</li>
 *   <li>+3 for each shared internship</li>
 *   <li>+2 if they share the same major</li>
 *   <li>+1 if they have the same age</li>
 * </ul>
 */
public class UniversityStudent extends Student {
    private UniversityStudent roommate;
    private Set<UniversityStudent> friends;
    private Map<UniversityStudent, List<String>> chatHistory;
    /**
     * Constructs a new {@code UniversityStudent} with the given properties.
     *
     * @param name                the student's name (unique identifier)
     * @param age                 the student's age
     * @param gender              the student's gender
     * @param year                the academic year (e.g. 1–4)
     * @param major               the student's major
     * @param gpa                 the student's GPA
     * @param roommatePreferences ordered list of preferred roommate names
     * @param previousInternships list of company names where the student has interned
     */
    public UniversityStudent(String name, int age, String gender, int year, String major, double gpa, List<String> roommatePreferences, List<String> previousInternships){
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.year = year;
        this.major = major;
        this.roommatePreferences = roommatePreferences;
        this.previousInternships = previousInternships;
        this.roommate = null;
        this.friends = new HashSet<>();
        this.chatHistory = new HashMap<>();
    }
    /**
     * Sets this student's roommate reference.
     *
     * @param roommate the student assigned as this student's roommate, or
     *                 {@code null} if the student is unpaired
     */
    public void setRoommate(UniversityStudent roommate){
        this.roommate = roommate;
    }
    /**
     * Returns this student's roommate, or {@code null} if none is assigned.
     *
     * @return the roommate student or {@code null}
     */
    public UniversityStudent getRoommate(){
        return roommate;
    }

    /**
     * Returns the set of friends of this student.
     * <p>
     * The set may be empty but is never {@code null}.
     *
     * @return an unmodifiable view or mutable set of friend students
     */
    public Set<UniversityStudent> getFriends() {
        return friends;
    }

    /**
     * Returns the chat history between this student and all others.
     * <p>
     * The map keys are conversation partners; each value is the list of
     * messages exchanged with that partner, in chronological order.
     *
     * @return a map from {@code UniversityStudent} to list of messages
     */
    public Map<UniversityStudent, List<String>> getChatHistory() {
        return chatHistory;
    }
    /**
     * Adds a new friend to this student's friend set.
     * <p>
     * This method does not enforce bidirectionality by itself; callers (or
     * {@link FriendRequestThread}) are responsible for adding the inverse
     * relationship if desired.
     *
     * @param friend the student to add as a friend
     */
    public void addFriend(UniversityStudent friend) {
        friends.add(friend);
    }
    /**
     * Appends a chat message to the conversation with the given student.
     * <p>
     * If no conversation exists yet, a new entry is created in the chat
     * history map.
     *
     * @param other   the conversation partner
     * @param message the text of the message
     */

    public void addChatMessage(UniversityStudent other, String message) {
        chatHistory.putIfAbsent(other, new ArrayList<>());
        chatHistory.get(other).add(message);
    }
    /**
     * Utility factory method to build a {@code UniversityStudent} from a
     * simple string-keyed map (e.g., parsed CSV or JSON).
     *
     * @param data a map of attribute names to string values
     * @return a newly constructed {@code UniversityStudent}
     * @throws IllegalArgumentException if required fields are missing or invalid
     */
    public static UniversityStudent fromMap(Map<String, String> data){
        String name = data.get("Name");
        String ageStr = data.get("Age");
        String gender = data.get("Gender");
        String yearStr = data.get("Year");
        String major = data.get("Major");
        String gpaStr = data.get("GPA");
        String roommatePrefStr = data.get("RoommatePreferences");
        String previousInternshipsStr = data.get("PreviousInternships");
        if (name == null) {
        throw new IllegalArgumentException("Missing required field 'Name' in student entry.");
    }
    if (ageStr == null) {
        throw new IllegalArgumentException("Missing required field 'Age' in student entry for " + name + ".");
    }
    if (gender == null) {
        throw new IllegalArgumentException("Missing required field 'Gender' in student entry for " + name + ".");
    }
    if (yearStr == null) {
        throw new IllegalArgumentException("Missing required field 'Year' in student entry for " + name + ".");
    }
    if (major == null) {
        throw new IllegalArgumentException("Missing required field 'Major' in student entry for " + name + ".");
    }
    if (gpaStr == null) {
        throw new IllegalArgumentException("Missing required field 'GPA' in student entry for " + name + ".");
    }
    if (roommatePrefStr == null) {
        throw new IllegalArgumentException("Missing required field 'RoommatePreferences' in student entry for " + name + ".");
    }
    if (previousInternshipsStr == null) {
        throw new IllegalArgumentException("Missing required field 'PreviousInternships' in student entry for " + name + ".");
    }
    int age;
    int year;
    double gpa;

    try {
        age = Integer.parseInt(ageStr);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid number format for age: '" + ageStr + "' in student entry for " + name + ".");
    }

    try {
        year = Integer.parseInt(yearStr);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid number format for year: '" + yearStr + "' in student entry for " + name + ".");
    }

    try {
        gpa = Double.parseDouble(gpaStr);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid number format for GPA: '" + gpaStr + "' in student entry for " + name + ".");
    }
    
    List<String> roommatePreferences = new ArrayList<>();
    if (roommatePrefStr != null && !roommatePrefStr.equalsIgnoreCase("None")) {
        for (String pref : roommatePrefStr.split(",")) {
            pref = pref.trim();
            if (!pref.isEmpty()) {
                roommatePreferences.add(pref);
            }
        }
    }

    // previous internships
    List<String> previousInternships = new ArrayList<>();
    if (previousInternshipsStr != null && !previousInternshipsStr.equalsIgnoreCase("None")) {
        for (String intern : previousInternshipsStr.split(",")) {
            intern = intern.trim();
            if (!intern.isEmpty()) {
                previousInternships.add(intern);
            }
        }
    }

    return new UniversityStudent(
            name,
            age,
            gender,
            year,
            major,
            gpa,
            roommatePreferences,
            previousInternships
    );
    
}
    /**
     * Computes the connection strength between this student and another
     * student according to the lab rules (roommates, shared internships,
     * same major, same age).
     *
     * @param other the other {@code Student} to compare to
     * @return an integer score representing how strong the connection is
     */
 @Override
    public int calculateConnectionStrength(Student other) {
        int strength = 0;

        if (other instanceof UniversityStudent) {
            UniversityStudent o = (UniversityStudent) other;

            // If o is the assigned roommate, add +4 bonus.
            if (this.roommate != null && this.roommate.equals(o)) {
                strength += 4;
            }

            // +3 for each shared internship.
            for (String internship : this.previousInternships) {
                if (o.previousInternships.contains(internship)) {
                    strength += 3;
                }
            }

            // +2 if same major.
            if (this.major.equals(o.major)) {
                strength += 2;
            }

            // +1 if same age.
            if (this.age == o.age) {
                strength += 1;
            }
        }

        return strength;
    }
    /**
     * Returns a human-readable representation of the student, typically
     * including the name and key attributes.
     *
     * @return a string representation of this student
     */
    @Override
    public String toString() {
        return "UniversityStudent{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", year=" + year +
                ", major='" + major + '\'' +
                ", GPA=" + gpa +
                ", roommatePreferences=" + roommatePreferences +
                ", previousInternships=" + previousInternships +
                '}';
    }
}

