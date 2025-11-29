import React, { useState, useEffect } from 'react';
import './App.css';
import GraphVisualization from './components/GraphVisualization';
import RoommateView from './components/RoommateView';
import ReferralPathFinder from './components/ReferralPathFinder';
import StudentDetails from './components/StudentDetails';
import ControlPanel from './components/ControlPanel';

function App() {
  const [students, setStudents] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [roommatePairs, setRoommatePairs] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState('graph'); // 'graph', 'roommates', 'referral', 'details'
  const [testCase, setTestCase] = useState(1);

  // Load test case data
  useEffect(() => {
    loadTestCase(testCase);
  }, [testCase]);

  const loadTestCase = async (caseNum) => {
    try {
      // Import the test case data
      const testCaseData = await import(`./data/testCase${caseNum}.json`);
      const studentData = testCaseData.default;
      
      setStudents(studentData);
      
      // Build graph data
      const nodes = studentData.map(s => ({
        id: s.name,
        name: s.name,
        major: s.major,
        age: s.age,
        year: s.year,
        gpa: s.gpa,
        internships: s.previousInternships || []
      }));

      const links = [];
      const processedPairs = new Set();

      // Calculate connections between all pairs
      for (let i = 0; i < studentData.length; i++) {
        for (let j = i + 1; j < studentData.length; j++) {
          const s1 = studentData[i];
          const s2 = studentData[j];
          
          // Calculate connection strength
          let strength = 0;
          
          // Check if roommates (will be updated after Gale-Shapley)
          // For now, we'll calculate based on shared attributes
          
          // Shared internships
          const sharedInternships = (s1.previousInternships || []).filter(
            intern => (s2.previousInternships || []).includes(intern)
          );
          strength += sharedInternships.length * 3;
          
          // Same major
          if (s1.major === s2.major) {
            strength += 2;
          }
          
          // Same age
          if (s1.age === s2.age) {
            strength += 1;
          }
          
          if (strength > 0) {
            const pairKey = [s1.name, s2.name].sort().join('-');
            if (!processedPairs.has(pairKey)) {
              links.push({
                source: s1.name,
                target: s2.name,
                weight: strength,
                value: strength
              });
              processedPairs.add(pairKey);
            }
          }
        }
      }

      setGraphData({ nodes, links });

      // Run Gale-Shapley algorithm to assign roommates
      const pairs = assignRoommates(studentData);
      setRoommatePairs(pairs);

      // Update graph with roommate connections (add +4 to strength)
      const updatedLinks = links.map(link => {
        const sourceName = typeof link.source === 'string' ? link.source : link.source.id || link.source.name;
        const targetName = typeof link.target === 'string' ? link.target : link.target.id || link.target.name;
        const isRoommatePair = pairs.some(
          pair => 
            (pair[0] === sourceName && pair[1] === targetName) ||
            (pair[0] === targetName && pair[1] === sourceName)
        );
        if (isRoommatePair) {
          return { ...link, weight: link.weight + 4, value: link.weight + 4 };
        }
        return link;
      });
      setGraphData({ nodes, links: updatedLinks });

    } catch (error) {
      console.error('Error loading test case:', error);
    }
  };
  const handleAddStudent = (rawStudent) => {
    if (!rawStudent.name || !rawStudent.name.trim()) {
      return;
    }

    const cleanedStudent = {
      name: rawStudent.name.trim(),
      age: rawStudent.age ? Number(rawStudent.age) : null,
      gender: rawStudent.gender || 'Unknown',
      year: rawStudent.year ? Number(rawStudent.year) : null,
      major: rawStudent.major || 'Undeclared',
      gpa: rawStudent.gpa ? Number(rawStudent.gpa) : null,
      roommatePreferences: rawStudent.roommatePreferences
        ? rawStudent.roommatePreferences
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : [],
      previousInternships: rawStudent.previousInternships
        ? rawStudent.previousInternships
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : []
    };

    setStudents(prevStudents => {
      const studentData = [...prevStudents, cleanedStudent];

      // === SAME graph-building logic as in loadTestCase, just using studentData ===
      const nodes = studentData.map(s => ({
        id: s.name,
        name: s.name,
        major: s.major,
        age: s.age,
        year: s.year,
        gpa: s.gpa,
        internships: s.previousInternships || []
      }));

      const links = [];
      const processedPairs = new Set();

      // Calculate connections between all pairs
      for (let i = 0; i < studentData.length; i++) {
        for (let j = i + 1; j < studentData.length; j++) {
          const s1 = studentData[i];
          const s2 = studentData[j];

          let strength = 0;

          // Shared internships
          const sharedInternships = (s1.previousInternships || []).filter(
            intern => (s2.previousInternships || []).includes(intern)
          );
          strength += sharedInternships.length * 3;

          // Same major
          if (s1.major === s2.major) {
            strength += 2;
          }

          // Same age
          if (s1.age === s2.age) {
            strength += 1;
          }

          if (strength > 0) {
            const pairKey = [s1.name, s2.name].sort().join('-');
            if (!processedPairs.has(pairKey)) {
              links.push({
                source: s1.name,
                target: s2.name,
                weight: strength,
                value: strength
              });
              processedPairs.add(pairKey);
            }
          }
        }
      }

      // Run Gale-Shapley to assign roommates with the updated list
      const pairs = assignRoommates(studentData);
      setRoommatePairs(pairs);

      const updatedLinks = links.map(link => {
        const sourceName = typeof link.source === 'string'
          ? link.source
          : link.source.id || link.source.name;
        const targetName = typeof link.target === 'string'
          ? link.target
          : link.target.id || link.target.name;

        const isRoommatePair = pairs.some(
          pair =>
            (pair[0] === sourceName && pair[1] === targetName) ||
            (pair[0] === targetName && pair[1] === sourceName)
        );
        if (isRoommatePair) {
          const newWeight = (link.weight || 0) + 4;
          return { ...link, weight: newWeight, value: newWeight };
        }
        return link;
      });

      setGraphData({ nodes, links: updatedLinks });

      return studentData;
    });
  };
  // Simplified Gale-Shapley implementation
  // Gale–Shapley roommate matching
const assignRoommates = (studentList) => {
  const nameToStudent = {};
  studentList.forEach(s => {
    nameToStudent[s.name] = s;
  });

  // Normalize preferences: only include valid students and keep order
  const preferences = {};
  studentList.forEach(s => {
    const prefs = (s.roommatePreferences || []).filter(p => nameToStudent[p]);
    preferences[s.name] = prefs;
  });

  // Initially everyone is free
  const free = new Set(studentList.map(s => s.name));
  const nextProposalIndex = {};
  studentList.forEach(s => { nextProposalIndex[s.name] = 0; });

  // For each "receiver", store current partner name
  const currentPartner = {};

  const prefers = (receiverName, candidateA, candidateB) => {
    const prefs = preferences[receiverName] || [];
    const idxA = prefs.indexOf(candidateA);
    const idxB = prefs.indexOf(candidateB);
    if (idxA === -1 && idxB === -1) return false; // doesn’t prefer either
    if (idxA === -1) return false;
    if (idxB === -1) return true;
    return idxA < idxB; // earlier in list = better
  };

  while (free.size > 0) {
    const proposer = free.values().next().value;
    const prefs = preferences[proposer] || [];
    const i = nextProposalIndex[proposer];

    // If proposer has exhausted their list, they remain unmatched
    if (i >= prefs.length) {
      free.delete(proposer);
      continue;
    }

    const receiver = prefs[i];
    nextProposalIndex[proposer] = i + 1;

    // Propose to receiver
    const current = currentPartner[receiver];
    if (!current) {
      // Receiver is free
      currentPartner[receiver] = proposer;
      free.delete(proposer);
    } else if (prefers(receiver, proposer, current)) {
      // Receiver prefers new proposer
      currentPartner[receiver] = proposer;
      free.delete(proposer);
      free.add(current); // previous partner becomes free again
    }
    // else receiver keeps current, proposer stays free and will try next preference
  }

  // Build unique, sorted pairs
  const pairs = [];
  const seen = new Set();
  Object.entries(currentPartner).forEach(([receiver, proposer]) => {
    const a = receiver;
    const b = proposer;
    const key = [a, b].sort().join('-');
    if (!seen.has(key)) {
      seen.add(key);
      pairs.push([a, b]);
    }
  });

  return pairs;
};
const recomputeRoommates = () => {
  if (!students || students.length === 0) return;

  const newPairs = assignRoommates(students);
  setRoommatePairs(newPairs);

  // Update graph edges: add +4 for roommate pairs or create new edges
  setGraphData(prev => {
    if (!prev || !prev.nodes) return prev;

    const links = [...(prev.links || [])];
    const linkKey = (a, b) => [a, b].sort().join('-');

    // Build a quick lookup for existing edges
    const edgeMap = new Map();
    links.forEach((l, idx) => {
      const src = typeof l.source === 'string' ? l.source : l.source.id || l.source.name;
      const tgt = typeof l.target === 'string' ? l.target : l.target.id || l.target.name;
      edgeMap.set(linkKey(src, tgt), { index: idx, src, tgt });
    });

    newPairs.forEach(([a, b]) => {
      const key = linkKey(a, b);
      if (edgeMap.has(key)) {
        // Update existing edge
        const { index } = edgeMap.get(key);
        const old = links[index];
        const oldWeight = old.weight || old.value || 0;
        const newWeight = oldWeight + 4; // roommate bonus
        links[index] = {
          ...old,
          weight: newWeight,
          value: newWeight,
          isRoommate: true
        };
      } else {
        // Create a brand new roommate-only edge
        const newEdge = {
          source: a,
          target: b,
          weight: 4,
          value: 4,
          isRoommate: true
        };
        links.push(newEdge);
      }
    });

    return { ...prev, links };
  });
};


  return (
    <div className="App">
      <header className="App-header">
        <h1>🐂 Longhorn Network</h1>
        <p>Student Social Network Visualization</p>
      </header>

      <ControlPanel
        testCase={testCase}
        setTestCase={setTestCase}
        viewMode={viewMode}
        setViewMode={setViewMode}
        students={students}
        setSelectedStudent={setSelectedStudent}
        onAddStudent={handleAddStudent}
      />


      <main className="App-main">
        {viewMode === 'graph' && (
          <GraphVisualization
            graphData={graphData}
            roommatePairs={roommatePairs}
            onNodeClick={setSelectedStudent}
            selectedStudent={selectedStudent}
          />
        )}

        {viewMode === 'roommates' && (
          <RoommateView
            roommatePairs={roommatePairs}
            students={students}
            onRecomputeRoommates={recomputeRoommates}
          />
        )}


        {viewMode === 'referral' && (
          <ReferralPathFinder
            students={students}
            graphData={graphData}
          />
        )}

        {viewMode === 'details' && selectedStudent && (
          <StudentDetails
            student={selectedStudent}
            allStudents={students}
            roommatePairs={roommatePairs}
          />
        )}
      </main>
    </div>
  );
}

export default App;

