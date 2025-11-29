import React, { useState } from 'react';

const ReferralPathFinder = ({ students, graphData }) => {
  const [startStudent, setStartStudent] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [path, setPath] = useState([]);
  const [error, setError] = useState('');

  const findPath = () => {
    setError('');
    setPath([]);

    if (!startStudent || !targetCompany) {
      setError('Please select a student and enter a company name.');
      return;
    }

    const start = students.find(s => s.name === startStudent);
    if (!start) {
      setError('Student not found.');
      return;
    }

    // Dijkstra's algorithm implementation
    const dist = new Map();
    const prev = new Map();
    const visited = new Set();
    const unvisited = new Set(students.map(s => s.name));

    // Initialize distances
    students.forEach(s => {
      dist.set(s.name, s.name === startStudent ? 0 : Infinity);
      prev.set(s.name, null);
    });

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let minNode = null;
      let minDist = Infinity;
      
      unvisited.forEach(nodeName => {
        const d = dist.get(nodeName);
        if (d < minDist) {
          minDist = d;
          minNode = nodeName;
        }
      });

      if (minNode === null || minDist === Infinity) break;

      unvisited.delete(minNode);
      visited.add(minNode);

      // Check if this student has the target internship
      const currentStudent = students.find(s => s.name === minNode);
      if (currentStudent && 
          currentStudent.previousInternships?.some(
            intern => intern.toLowerCase() === targetCompany.toLowerCase()
          )) {
        // Reconstruct path
        const pathNodes = [];
        let current = minNode;
        while (current !== null) {
          pathNodes.unshift(current);
          current = prev.get(current);
        }
        setPath(pathNodes);
        return;
      }

      // Relax neighbors
      const neighbors = graphData.links
        .filter(link => {
          const sourceName = typeof link.source === 'object' ? link.source.id : link.source;
          const targetName = typeof link.target === 'object' ? link.target.id : link.target;
          return sourceName === minNode || targetName === minNode;
        })
        .map(link => {
          const sourceName = typeof link.source === 'object' ? link.source.id : link.source;
          const targetName = typeof link.target === 'object' ? link.target.id : link.target;
          return {
            name: sourceName === minNode ? targetName : sourceName,
            weight: link.weight || link.value
          };
        });

      neighbors.forEach(neighbor => {
        if (visited.has(neighbor.name)) return;

        // Use inverted weight (1/weight) for Dijkstra
        const alt = dist.get(minNode) + (1.0 / neighbor.weight);
        if (alt < dist.get(neighbor.name)) {
          dist.set(neighbor.name, alt);
          prev.set(neighbor.name, minNode);
        }
      });
    }

    setError('No referral path found to a student who interned at ' + targetCompany);
  };

  const getAllCompanies = () => {
    const companies = new Set();
    students.forEach(s => {
      s.previousInternships?.forEach(company => {
        if (company && company.toLowerCase() !== 'none') {
          companies.add(company);
        }
      });
    });
    return Array.from(companies).sort();
  };

  return (
    <div className="referral-container">
      <h2>🔍 Referral Path Finder</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Find the shortest path (strongest connection) to a student who interned at a specific company.
      </p>

      <div className="input-group">
        <select
          value={startStudent}
          onChange={(e) => setStartStudent(e.target.value)}
          style={{ padding: '12px', border: '2px solid #667eea', borderRadius: '5px', fontSize: '1em' }}
        >
          <option value="">Select starting student...</option>
          {students.map(s => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={targetCompany}
          onChange={(e) => setTargetCompany(e.target.value)}
          placeholder="Enter company name..."
          list="companies"
          style={{ padding: '12px', border: '2px solid #667eea', borderRadius: '5px', fontSize: '1em' }}
        />
        <datalist id="companies">
          {getAllCompanies().map(company => (
            <option key={company} value={company} />
          ))}
        </datalist>

        <button onClick={findPath}>Find Path</button>
      </div>

      {error && (
        <div className="no-path">
          {error}
        </div>
      )}

      {path.length > 0 && (
        <div className="path-display">
          <h3>Referral Path Found!</h3>
          <div className="path-steps">
            {path.map((studentName, index) => {
              const student = students.find(s => s.name === studentName);
              return (
                <React.Fragment key={index}>
                  <div className="path-step">
                    {studentName}
                    {student && student.previousInternships?.some(
                      intern => intern.toLowerCase() === targetCompany.toLowerCase()
                    ) && (
                      <span style={{ marginLeft: '10px' }}>⭐</span>
                    )}
                  </div>
                  {index < path.length - 1 && (
                    <span className="path-arrow">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '5px' }}>
            <strong>Path Details:</strong>
            <ul style={{ marginTop: '10px', lineHeight: '1.8' }}>
              {path.map((studentName, index) => {
                const student = students.find(s => s.name === studentName);
                if (!student) return null;
                return (
                  <li key={index}>
                    <strong>{studentName}</strong> - {student.major} 
                    {student.previousInternships?.some(
                      intern => intern.toLowerCase() === targetCompany.toLowerCase()
                    ) && (
                      <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {' '}(Interned at {targetCompany})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralPathFinder;

