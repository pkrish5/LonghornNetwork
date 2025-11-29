# Longhorn Network - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Getting the Code](#getting-the-code)
3. [Running the Java Application](#running-the-java-application)
4. [Setting Up and Running the React UI](#setting-up-and-running-the-react-ui)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, you need to install the following software on your computer:

### 1. Java Development Kit (JDK)

**For Windows:**
1. Go to [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
2. Download JDK 11 or higher (JDK 17 recommended)
3. Run the installer and follow the installation wizard
4. **Important**: Make sure to check "Add to PATH" during installation
5. Verify installation by opening Command Prompt and typing:
   
   java -version
   javac -version
      You should see version information. If you get an error, Java is not in your PATH.

**For macOS:**
1. Open Terminal
2. Install using Homebrew (if you have it):
   
   brew install openjdk@17
   3. Or download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [Adoptium](https://adoptium.net/)
4. Verify installation:
   java -version
   javac -version
   **For Linux (Ubuntu/Debian):**
sudo apt update
sudo apt install openjdk-17-jdk
java -version
javac -version### 2. Node.js and npm

**For Windows:**
1. Go to [Node.js official website](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version (v18 or higher recommended)
3. Run the installer
4. **Important**: Make sure to check "Add to PATH" during installation
5. Verify installation by opening Command Prompt:
   
   node -v
   npm -v
      You should see version numbers (e.g., v18.17.0 and 9.6.7)

**For macOS:**
1. Go to [Node.js official website](https://nodejs.org/)
2. Download the **LTS** version
3. Run the installer package (.pkg file)
4. Verify installation:
   
   node -v
   npm -v
   **For Linux (Ubuntu/Debian):**ash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v### 3. Git (Optional but Recommended)

If you don't have Git installed:
- **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
- **macOS**: Usually pre-installed, or install via Homebrew: `brew install git`
- **Linux**: `sudo apt install git`

---

## Getting the Code

### Option 1: Clone from GitHub (Recommended)

1. Open Terminal (macOS/Linux) or Command Prompt/Git Bash (Windows)
2. Navigate to where you want to save the project:
   cd ~/Desktop
   # or
   cd ~/Documents
   # or any directory you prefer
   3. Clone the repository:
   git clone https://github.com/<your-username>/LonghornNetwork.git
      Replace `<your-username>` with the actual GitHub username or repository URL.

4. Navigate into the project directory:
   cd LonghornNetwork
   ### Option 2: Download as ZIP

1. Go to the GitHub repository
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your desired location
5. Open Terminal/Command Prompt and navigate to the extracted folder:
 
   cd ~/Downloads/LonghornNetwork
   # or wherever you extracted it
   ---

## Running the Java Application

### Step 1: Navigate to the Source Directory

Open Terminal/Command Prompt and navigate to the project's `src` directory:
sh
cd LonghornNetwork
cd src### Step 2: Compile the Java Files

Compile all Java files:

javac *.java**What this does**: This compiles all `.java` files in the current directory into `.class` files.

**Expected output**: If successful, you'll see no output (this is good!). If there are errors, they will be displayed.

**Common errors**:
- `javac: command not found` → Java is not installed or not in PATH
- `error: file not found` → You're not in the correct directory
- Compilation errors → Check the error messages and fix the code

### Step 3: Run the Main Application

Run the main class:

java Main**What this does**: This executes the `Main.java` file, which runs test cases and displays results.

**Expected output**: You should see:
- Test case information
- Student graph visualization
- Roommate pairings
- Thread-safe operations
- Referral path finder results
- Scores for each test case

### Step 4: (Optional) Run with Custom Input File

If you want to parse a custom input file:

1. Create or use an existing input file in the `testing/testing_checkpointone/inputs/` directory
2. Modify `Main.java` to use `DataParser.parseStudents()` with your file path, or create a simple test:

// Example: Add this to Main.java temporarily
try {
    List<UniversityStudent> students = DataParser.parseStudents("../testing/testing_checkpointone/inputs/normal_1.txt");
    for (UniversityStudent s : students) {
        System.out.println(s);
    }
} catch (IOException e) {
    e.printStackTrace();
}
3. Recompile and run:sh
javac *.java
java Main---

## Setting Up and Running the React UI

### Step 1: Navigate to the UI Directory

Open a new Terminal/Command Prompt window (keep the Java one open if you want) and navigate to the `ui` directory:
sh
cd LonghornNetwork
cd ui**Verify you're in the right place**: You should see a `package.json` file and a `src` directory when you list files:
- **Windows**: `dir`
- **macOS/Linux**: `ls`

### Step 2: Install Node Dependencies

This downloads all the required packages (React, graph libraries, etc.):

npm install**What this does**: 
- Reads `package.json` to see what packages are needed
- Downloads them from the npm registry
- Creates a `node_modules` folder with all dependencies
- This may take 2-5 minutes depending on your internet connection

**Expected output**: You'll see a progress bar and then: