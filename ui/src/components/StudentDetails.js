import React from 'react';

const StudentDetails = ({ student, allStudents, roommatePairs }) => {
  if (!student) return null;

  const roommate = roommatePairs.find(pair => 
    pair[0] === student.name || pair[1] === student.name
  )?.find(name => name !== student.name);

  const roommateInfo = roommate ? allStudents.find(s => s.name === roommate) : null;

  // Mock friend list and chat history (in real implementation, these would come from the Java backend)
  const friends = allStudents.filter(s => 
    s.name !== student.name && 
    (s.major === student.major || 
     (s.previousInternships || []).some(intern => 
       (student.previousInternships || []).includes(intern)
     ))
  ).slice(0, 5); // Limit to 5 for demo

  const chatHistory = [
    { from: friends[0]?.name || 'Friend1', message: 'Hey! How are you?' },
    { from: friends[1]?.name || 'Friend2', message: 'Want to study together?' },
  ];

  return (
    <div className="details-container">
      <h2>👤 Student Details: {student.name}</h2>

      <div className="card">
        <h3>Basic Information</h3>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Age:</strong> {student.age}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>Year:</strong> {student.year}</p>
        <p><strong>Major:</strong> {student.major}</p>
        <p><strong>GPA:</strong> {student.gpa}</p>
      </div>

      <div className="card">
        <h3>Roommate Preferences</h3>
        {student.roommatePreferences && student.roommatePreferences.length > 0 ? (
          <ul>
            {student.roommatePreferences.map((pref, index) => (
              <li key={index}>{pref}</li>
            ))}
          </ul>
        ) : (
          <p>None</p>
        )}
      </div>

      <div className="card">
        <h3>Previous Internships</h3>
        {student.previousInternships && student.previousInternships.length > 0 ? (
          <ul>
            {student.previousInternships.map((intern, index) => (
              <li key={index}>{intern}</li>
            ))}
          </ul>
        ) : (
          <p>None</p>
        )}
      </div>

      <div className="card">
        <h3>Current Roommate</h3>
        {roommateInfo ? (
          <div>
            <p><strong>{roommateInfo.name}</strong></p>
            <p>Major: {roommateInfo.major}</p>
            <p>Age: {roommateInfo.age} | Year: {roommateInfo.year}</p>
            <p>GPA: {roommateInfo.gpa}</p>
          </div>
        ) : (
          <p>None</p>
        )}
      </div>

      <div className="card">
        <h3>Friends</h3>
        {friends.length > 0 ? (
          <ul>
            {friends.map((friend, index) => (
              <li key={index}>
                <strong>{friend.name}</strong> - {friend.major}
              </li>
            ))}
          </ul>
        ) : (
          <p>None</p>
        )}
      </div>

      <div className="card">
        <h3>Chat History</h3>
        {chatHistory.length > 0 ? (
          <div>
            {chatHistory.map((chat, index) => (
              <div key={index} style={{ 
                marginBottom: '15px', 
                padding: '10px', 
                background: '#f0f0f0',
                borderRadius: '5px'
              }}>
                <strong>{chat.from}:</strong> {chat.message}
              </div>
            ))}
          </div>
        ) : (
          <p>None</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;

