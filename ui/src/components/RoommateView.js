import React from 'react';

const RoommateView = ({ roommatePairs, students, onRecomputeRoommates }) => {
  // Build set of all paired names
  const pairedNames = new Set();
  roommatePairs.forEach(([a, b]) => {
    pairedNames.add(a);
    pairedNames.add(b);
  });

  // All unmatched students
  const unmatchedStudents = students.filter(s => !pairedNames.has(s.name));

  const getStudentInfo = (name) => {
    return students.find(s => s.name === name);
  };

  return (
    <div className="roommate-container">
      <h2>🏠 Roommate Assignments</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Roommate pairs assigned using the Gale-Shapley stable matching algorithm.
      </p>

      {roommatePairs.length === 0 ? (
        <div className="card">
          <p>No roommate pairs assigned. Students may not have mutual preferences.</p>
        </div>
      ) : (
        <div className="student-list">
          {roommatePairs.map((pair, index) => {
            const student1 = getStudentInfo(pair[0]);
            const student2 = getStudentInfo(pair[1]);

            return (
              <div
              
                key={index}
                className="card"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                  
                }}
                
              >
                
                <h3 style={{ color: 'white', marginBottom: '15px' }}>
                  Pair {index + 1}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '20px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4>{student1?.name || pair[0]}</h4>
                    {student1 && (
                      <>
                        <p style={{ color: 'white' }}>Major: {student1.major}</p>
                        <p style={{ color: 'white' }}>
                          Age: {student1.age} | Year: {student1.year}
                        </p>
                        <p style={{ color: 'white' }}>GPA: {student1.gpa}</p>
                        <p style={{ color: 'white' }}>
                          Internships:{' '}
                          {student1.previousInternships?.join(', ') || 'None'}
                        </p>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '2em',
                      alignSelf: 'center',
                      opacity: 0.8
                    }}
                  >
                    ↔️
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4>{student2?.name || pair[1]}</h4>
                    {student2 && (
                      <>
                        <p style={{ color: 'white' }}>Major: {student2.major}</p>
                        <p style={{ color: 'white' }}>
                          Age: {student2.age} | Year: {student2.year}
                        </p>
                        <p style={{ color: 'white' }}>GPA: {student2.gpa}</p>
                        <p style={{ color: 'white' }}>
                          Internships:{' '}
                          {student2.previousInternships?.join(', ') || 'None'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unpaired / unmatched section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Unpaired Students</h3>
        {unmatchedStudents.length === 0 ? (
          <p>All students are currently paired.</p>
        ) : (
          <>
            <ul style={{ paddingLeft: '20px' }}>
              {unmatchedStudents.map(student => (
                <li key={student.name} style={{ marginBottom: '6px' }}>
                  <strong>{student.name}</strong> – {student.major}
                  {(!student.roommatePreferences ||
                    student.roommatePreferences.length === 0) && (
                    <span style={{ color: '#999', marginLeft: '10px' }}>
                      (No roommate preferences)
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {onRecomputeRoommates && (
              <button
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#667eea',
                  color: 'white',
                  cursor: 'pointer'
                }}
                onClick={onRecomputeRoommates}
              >
                🔁 Run Gale–Shapley Again
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoommateView;
