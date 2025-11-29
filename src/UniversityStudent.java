import java.util.*;

public class UniversityStudent extends Student {
    private UniversityStudent roommate;

    public UniversityStudent(String name, int age, String gender, int year, String major, double gpa, List<String> roommatePreferences, List<String> previousInternships){
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.year = year;
        this.major = major;
        this.roommatePreferences = roommatePreferences;
        this.previousInternships = previousInternships;
        this.roommate = null;
    }
    public void setRoommate(UniversityStudent roommate){
        this.roommate = roommate;
    }
    public UniversityStudent getRoommate(){
        return roommate;
    }

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
        throw new IllegalArgumentException("Missing required field: Name");
    }
    if (ageStr == null) {
        throw new IllegalArgumentException("Missing required field: Age for " + name);
    }
    if (gender == null) {
        throw new IllegalArgumentException("Missing required field: Gender for " + name);
    }
    if (yearStr == null) {
        throw new IllegalArgumentException("Missing required field: Year for " + name);
    }
    if (major == null) {
        throw new IllegalArgumentException("Missing required field: Major for " + name);
    }
    if (gpaStr == null) {
        throw new IllegalArgumentException("Missing required field: GPA for " + name);
    }
    if (roommatePrefStr == null) {
        throw new IllegalArgumentException("Missing required field: RoommatePreferences for " + name);
    }
    if (previousInternshipsStr == null) {
        throw new IllegalArgumentException("Missing required field: PreviousInternships for " + name);
    }
    int age;
    int year;
    double gpa;

    try {
        age = Integer.parseInt(ageStr);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid Age format for " + name + ": " + ageStr);
    }

    try {
        year = Integer.parseInt(yearStr);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid Year format for " + name + ": " + yearStr);
    }

    try {
        gpa = Double.parseDouble(gpaStr);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid GPA format for " + name + ": " + gpaStr);
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

