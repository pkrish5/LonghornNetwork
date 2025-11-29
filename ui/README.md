# Longhorn Network React UI

A React-based user interface for visualizing the Longhorn Network student social network.

## Features

- 📊 **Graph Visualization**: Interactive force-directed graph showing students and their connections
- 🏠 **Roommate View**: Display roommate pairs assigned using Gale-Shapley algorithm
- 🔍 **Referral Path Finder**: Find the shortest path to a student who interned at a specific company
- 👤 **Student Details**: View detailed information about each student including friends and chat history

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the `ui` directory:
```bash
cd ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Usage

1. **Select Test Case**: Use the dropdown to switch between different test cases
2. **View Modes**:
   - **Graph**: Visualize the student network as an interactive graph
   - **Roommates**: View all roommate pairings
   - **Referral Path**: Find paths to students with specific internships
   - **Student Details**: View detailed information about individual students

3. **Interact with Graph**: Click on nodes to select students and view their details

## Components

- `App.js`: Main application component
- `GraphVisualization.js`: Force-directed graph visualization
- `RoommateView.js`: Roommate pairing display
- `ReferralPathFinder.js`: Dijkstra's algorithm implementation for finding referral paths
- `StudentDetails.js`: Individual student information display
- `ControlPanel.js`: UI controls for test case and view selection

## Data Format

Test case data is stored in JSON format in `src/data/`:
- `testCase1.json`
- `testCase2.json`
- `testCase3.json`

Each test case contains an array of student objects with the following structure:
```json
{
  "name": "Student Name",
  "age": 20,
  "gender": "Male/Female",
  "year": 2,
  "major": "Major Name",
  "gpa": 3.5,
  "roommatePreferences": ["Name1", "Name2"],
  "previousInternships": ["Company1", "Company2"]
}
```

## Technologies Used

- React 18
- react-force-graph-2d for graph visualization
- D3.js for graph algorithms

