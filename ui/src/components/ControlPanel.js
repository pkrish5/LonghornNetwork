import React, { useState } from 'react';

const ControlPanel = ({
  testCase,
  setTestCase,
  viewMode,
  setViewMode,
  students,
  setSelectedStudent,
  onAddStudent
}) => {
  // show / hide the Add Student section
  const [showAddStudent, setShowAddStudent] = useState(false);

  // local state for the form fields
  const [newStudent, setNewStudent] = useState({
    name: '',
    major: '',
    age: '',
    year: '',
    gpa: '',
    roommatePreferences: '',
    previousInternships: ''
  });

  const handleInputChange = (field, value) => {
    setNewStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleAddClick = () => {
    if (onAddStudent) {
      onAddStudent(newStudent);
    }
    // clear form after add
    setNewStudent({
      name: '',
      major: '',
      age: '',
      year: '',
      gpa: '',
      roommatePreferences: '',
      previousInternships: ''
    });
  };

  return (
    <div className="control-panel">
      {/* top row: test case + view mode */}
      <div className="control-group">
        <label>Test Case</label>
        <select
          value={testCase}
          onChange={(e) => setTestCase(Number(e.target.value))}
        >
          <option value={1}>Test Case 1</option>
          <option value={2}>Test Case 2</option>
          <option value={3}>Test Case 3</option>
        </select>
      </div>

      <div className="control-group">
        <label>View Mode</label>
        <div className="view-mode-buttons">
          <button
            className={viewMode === 'graph' ? 'active' : ''}
            onClick={() => setViewMode('graph')}
          >
            📊 Graph
          </button>
          <button
            className={viewMode === 'roommates' ? 'active' : ''}
            onClick={() => setViewMode('roommates')}
          >
            🏠 Roommates
          </button>
          <button
            className={viewMode === 'referral' ? 'active' : ''}
            onClick={() => setViewMode('referral')}
          >
            🔍 Referral Path
          </button>
          <button
            className={viewMode === 'details' ? 'active' : ''}
            onClick={() => setViewMode('details')}
          >
            👤 Student Details
          </button>
        </div>
      </div>

      {/* student selector only in details mode */}
      {viewMode === 'details' && (
        <div className="control-group">
          <label>Select Student</label>
          <select
            onChange={(e) => {
              const student = students.find(s => s.name === e.target.value);
              setSelectedStudent(student || null);
            }}
          >
            <option value="">Choose a student...</option>
            {students.map(s => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* toggle button for the Add Student section */}
      <div className="control-group" style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => setShowAddStudent(prev => !prev)}
        >
          {showAddStudent ? 'Hide Add Student Form' : '➕ Add Student'}
        </button>
      </div>

      {/* Add Student form – only visible when showAddStudent is true */}
      {showAddStudent && (
        <div className="control-group" style={{ minWidth: '260px', marginTop: '8px' }}>
          <label>Add Student (test new node)</label>
          <div
            className="input-group"
            style={{ flexDirection: 'column', gap: '8px', margin: 0 }}
          >
            <input
              type="text"
              placeholder="Name *"
              value={newStudent.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Major"
              value={newStudent.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="Age"
                value={newStudent.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
              <input
                type="number"
                placeholder="Year"
                value={newStudent.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                placeholder="GPA"
                value={newStudent.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
              />
            </div>
            <input
              type="text"
              placeholder="Roommate prefs (comma-separated names)"
              value={newStudent.roommatePreferences}
              onChange={(e) =>
                handleInputChange('roommatePreferences', e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Internships (comma-separated)"
              value={newStudent.previousInternships}
              onChange={(e) =>
                handleInputChange('previousInternships', e.target.value)
              }
            />
            <button
              type="button"
              onClick={handleAddClick}
              disabled={!newStudent.name.trim()}
            >
              ➕ Add Student
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
