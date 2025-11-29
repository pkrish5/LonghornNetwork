import java.util.*;
/**
 * Abstract base class representing a generic student in the Longhorn Network.
 * <p>
 * This class stores common demographic and academic attributes shared by all
 * student types, such as name, age, gender, year, major, GPA, roommate
 * preferences, and previous internships. Concrete subclasses (e.g.
 * {@link UniversityStudent}) provide the implementation for computing
 * connection strength between students.
 */
public abstract class Student {
    protected String name;
    protected int age;
    protected String gender;
    protected int year;
    protected String major;
    protected double gpa;
    protected List<String> roommatePreferences;
    protected List<String> previousInternships;

    public abstract int calculateConnectionStrength(Student other);
}
