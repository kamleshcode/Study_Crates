
// import React, { useState } from 'react';

// const subjects = [
//   { name: 'AI', pdf: 'AI.pdf' },
//   { name: 'ML', pdf: 'ML.pdf' },
//   { name: 'ReactJS', pdf: 'React JS.pdf' },
//   { name: 'Data Structures', pdf: 'Data Structures.pdf' },
//   { name: 'Operating Systems', pdf: 'Operating Systems.pdf' },
//   { name: 'DBMS', pdf: 'DBMS.pdf' },
//   { name: 'Networking', pdf: 'Networking.pdf' },
//   { name: 'Python', pdf: 'Python.pdf' },
//   { name: 'Java', pdf: 'Java.pdf' },
// ];

// const Notes = () => {
//   const [selected, setSelected] = useState('');
//   const [comment, setComment] = useState('');
//   const [comments, setComments] = useState({});

//   const handleSelect = (e) => {
//     setSelected(e.target.value);
//   };

//   const handleCommentSubmit = (e) => {
//     e.preventDefault();
//     if (selected && comment.trim()) {
//       setComments(prev => ({
//         ...prev,
//         [selected]: [...(prev[selected] || []), comment.trim()]
//       }));
//       setComment('');
//     }
//   };

//   const selectedSubject = subjects.find(sub => sub.name === selected);
//   const pdfPath = selectedSubject ? `/src/assets/pdf/${selectedSubject.pdf}` : '';

//   return (
//     <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center px-4 py-40">
//       <div className="w-full max-w-6xl flex flex-col items-center">
//         <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center font-google">StudyCrate Notes</h1>
//         <div className="w-full flex flex-col items-center">
//           {/* Dropdown for subjects */}
//           <select
//             value={selected}
//             onChange={handleSelect}
//             className="w-full md:w-2/3 px-6 py-4 rounded-full border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg transition mb-6 bg-white"
//           >
//             <option value="">Select a subject...</option>
//             {subjects.map(subject => (
//               <option key={subject.name} value={subject.name}>
//                 {subject.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         {/* PDF and Comment Section Side by Side */}
//         {selected && (
//           <div className="w-full flex flex-col md:flex-row gap-8 mt-4 items-stretch">
//             {/* PDF Viewer (West/Left) */}
//             <div className="flex-1 bg-white rounded-xl shadow-lg border border-blue-100 p-4 flex flex-col justify-start">
//               <h2 className="text-xl font-bold text-blue-800 mb-4">{selected} Notes</h2>
//               {selectedSubject && selectedSubject.pdf ? (
//                 <div className="w-full h-[70vh] border rounded-lg shadow overflow-hidden bg-gray-50">
//                   <iframe
//                     title={selected}
//                     src={pdfPath}
//                     className="w-full h-full"
//                     frameBorder="0"
//                   />
//                 </div>
//               ) : (
//                 <div className="w-full h-40 flex items-center justify-center text-red-600 font-semibold text-lg">
//                   Notes not uploaded yet.
//                 </div>
//               )}
//             </div>
//             {/* Download & Comment Section (East/Right) */}
//             <div className="w-full md:w-1/3 flex flex-col gap-6 justify-start">
//               {selectedSubject && selectedSubject.pdf && (
//                 <a
//                   href={pdfPath}
//                   download
//                   className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition text-center"
//                 >
//                   Download PDF
//                 </a>
//               )}
//               <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
//                 <input
//                   type="text"
//                   placeholder="Add a comment about this PDF..."
//                   value={comment}
//                   onChange={e => setComment(e.target.value)}
//                   className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
//                 >
//                   Add Comment
//                 </button>
//               </form>
//               {/* Show comments for this PDF */}
//               {comments[selected] && comments[selected].length > 0 && (
//                 <div>
//                   <h3 className="font-semibold text-blue-700 mb-2">Comments:</h3>
//                   <ul className="list-disc ml-6 space-y-1">
//                     {comments[selected].map((c, idx) => (
//                       <li key={idx} className="text-gray-800">{c}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Notes;


import React, { useState, useEffect } from 'react';
import bg2 from '../assets/bg2.jpg'; // Background image
// Changed the import method for notesBg to use a direct public path
// This assumes 'light.png' will be placed in the 'public/assets/' directory
// For example, if your project root is 'my-app/', then the image should be at 'my-app/public/assets/light.png'
// If your image is directly in 'public/', use '/light.png'
// If your image is in 'public/images/', use '/images/light.png'
const notesBgPath = '/assets/light.png'; 

// Updated dummy data for subjects with specific PDF names
const subjects = [
  { name: 'AI', pdf: 'React JS.pdf' },
  { name: 'ML', pdf: 'React JS.pdf' },
  { name: 'ReactJS', pdf: 'React JS.pdf' },
  { name: 'Data Structures', pdf: 'React JS.pdf' },
  { name: 'Operating Systems', pdf: 'React JS.pdf' },
  { name: 'DBMS', pdf: 'React JS.pdf' },
  { name: 'Networking', pdf: 'React JS.pdf' },
  { name: 'Python', pdf: 'React JS.pdf' },
  { name: 'Java', pdf: 'React JS.pdf' },
];

const Notes = () => {
  // State for the currently selected subject from dropdown/recents
  const [selected, setSelected] = useState('');
  // State for comments specific to the selected PDF
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState({});
  // State for recently viewed subjects (for "Recent Folders" section)
  const [recentSubjects, setRecentSubjects] = useState(() => {
    // Initialize recent subjects from localStorage or an empty array
    try {
      const storedRecents = localStorage.getItem('recentSubjects');
      return storedRecents ? JSON.parse(storedRecents) : [];
    } catch (error) {
      console.error("Failed to parse recent subjects from localStorage", error);
      return [];
    }
  });
  // State for user's personal notes (for "My Notes" section)
  const [userNotes, setUserNotes] = useState(() => {
    // Initialize user notes from localStorage or an empty array
    try {
      const storedNotes = localStorage.getItem('userNotes');
      return storedNotes ? JSON.parse(storedNotes) : [];
    } catch (error) {
      console.error("Failed to parse user notes from localStorage", error);
      return [];
    }
  });
  // State for new note input fields
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Save recentSubjects to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentSubjects', JSON.stringify(recentSubjects));
  }, [recentSubjects]);

  // Save userNotes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userNotes', JSON.stringify(userNotes));
  }, [userNotes]);

  // Handle subject selection from dropdown or recent folders
  const handleSelect = (subjectName) => {
    setSelected(subjectName);
    // Add to recents, ensuring uniqueness and limiting to a certain number (e.g., 5)
    setRecentSubjects(prevRecents => {
      const updatedRecents = [subjectName, ...prevRecents.filter(name => name !== subjectName)];
      return updatedRecents.slice(0, 5); // Keep only the last 5 unique subjects
    });
  };

  // Handle submission of a comment for the current PDF
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (selected && comment.trim()) {
      setComments(prev => ({
        ...prev,
        [selected]: [...(prev[selected] || []), comment.trim()]
      }));
      setComment('');
    }
  };

  // Handle adding a new personal note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const newNote = {
        id: Date.now().toString(), // Unique ID for the note
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      setUserNotes(prevNotes => [...prevNotes, newNote]);
      setNewNoteTitle('');
      setNewNoteContent('');
    }
  };

  // Find the selected subject's details
  const selectedSubject = subjects.find(sub => sub.name === selected);
  // Adjusted PDF path to use a public directory, similar to the image
  // This assumes PDF files are in 'public/assets/pdf/'
  const pdfPath = selectedSubject ? `/src/assets/pdf/${selectedSubject.pdf}` : '';

  // Function to remove a note by its ID
  const handleRemoveNote = (id) => {
    setUserNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center px-4 py-16 sm:py-24 md:py-32 lg:py-40"
      style={{
        // backgroundImage: `url(${bg2})`,// Use the public path for the background image
        background: 'white',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-7xl flex flex-col items-center bg-white/50 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-8 text-center font-inter">My Notes</h1>

        {/* Search Bar and User Profile - Placeholder as per image */}
        {/* <div className="w-full flex justify-between items-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-5 py-3 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-sm"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div className="flex items-center space-x-2 hidden md:flex">
            <span className="text-lg font-medium text-gray-700">Kamlesh Patel</span>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">R</div>
          </div>
        </div> */}

        {/* Subject Dropdown - Always visible */}
        <div className="w-full flex flex-col items-center mb-8">
          <select
            value={selected}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-full md:w-2/3 px-6 py-4 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg transition bg-white text-gray-700"
          >
            <option value="">Select a subject to view notes...</option>
            {subjects.map(subject => (
              <option key={subject.name} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Notes Dashboard or PDF View */}
        {selected ? (
          // --- PDF Viewer and Comment Section ---
          <div className="w-full flex flex-col gap-8 mt-4 items-stretch">
            <div className="w-full flex justify-end">
              <button
                onClick={() => setSelected('')} // Clear selection to go back to main notes dashboard
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold shadow hover:bg-gray-300 transition flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Back to All Notes</span>
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              {/* PDF Viewer (West/Left) */}
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-blue-100 p-4 flex flex-col justify-start">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 font-inter">{selected} Notes</h2>
                {selectedSubject && selectedSubject.pdf ? (
                  <div className="w-full h-[70vh] border rounded-lg shadow-inner overflow-hidden bg-gray-50">
                    <iframe
                      title={selected}
                      src={pdfPath}
                      className="w-full h-full"
                      frameBorder="0"
                      // Add onerror to handle cases where PDF might not load
                      onError={(e) => {
                        console.error("Error loading PDF:", e);
                        e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center text-red-600 font-semibold text-lg bg-gray-100 rounded-lg">Failed to load PDF. Please ensure the PDF file is in the correct public path.</div>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center text-red-600 font-semibold text-lg bg-gray-100 rounded-lg">
                    Notes not uploaded yet for {selected}.
                  </div>
                )}
              </div>
              {/* Download & Comment Section (East/Right) */}
              <div className="w-full md:w-1/3 flex flex-col gap-6 justify-start">
                {selectedSubject && selectedSubject.pdf && (
                  <a
                    href={pdfPath}
                    download
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:bg-green-700 transition text-center text-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Download PDF</span>
                  </a>
                )}
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-blue-800 mb-2 font-inter">Add PDF Comment</h3>
                  <textarea
                    placeholder="Add a comment about this PDF..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base resize-y min-h-[80px]"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition text-lg"
                  >
                    Add Comment
                  </button>
                </form>
                {/* Show comments for this PDF */}
                {comments[selected] && comments[selected].length > 0 && (
                  <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-blue-800 mb-3 font-inter">Recent Comments:</h3>
                    <ul className="space-y-3">
                      {comments[selected].map((c, idx) => (
                        <li key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-800 text-base shadow-sm">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // --- Main Notes Dashboard (Recent Folders and My Notes) ---
          <div className="w-full flex flex-col gap-10">
            {/* Recent Folders */}
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-inter">Recent Folders</h2>
              <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                {recentSubjects.length > 0 ? (
                  recentSubjects.map((subName, index) => {
                    const subjectColor = ['bg-blue-100', 'bg-red-100', 'bg-yellow-100', 'bg-purple-100', 'bg-green-100'][index % 5];
                    return (
                      <div
                        key={subName}
                        onClick={() => handleSelect(subName)}
                        className={`relative w-48 h-48 ${subjectColor} rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between items-start`}
                      >
                        <div className="absolute top-4 right-4 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mt-auto">{subName}</h3>
                        <p className="text-sm text-gray-600">Folder</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600 text-lg">No recent subjects viewed. Select one from the dropdown above!</p>
                )}
                {/* New Folder Placeholder */}
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span className="mt-2 text-lg font-medium">New Folder</span>
                </div>
              </div>
            </div>

            {/* My Notes */}
            <div className="w-full mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-inter">My Notes</h2>
              <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                {userNotes.length > 0 ? (
                  userNotes.map((note, index) => {
                    const noteColor = ['bg-yellow-100', 'bg-pink-100', 'bg-blue-100', 'bg-green-100'][index % 4];
                    return (
                      <div key={note.id} className={`relative w-72 h-64 ${noteColor} rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}>
                        <button
                          onClick={() => handleRemoveNote(note.id)}
                          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors duration-200"
                          title="Remove Note"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 font-inter">{note.title}</h3>
                        <p className="text-sm text-gray-700 flex-grow overflow-hidden text-ellipsis whitespace-normal">
                          {note.content}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                          <span>{note.date}</span>
                          <span>
                            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {/* Placeholder for time, you can add actual time if needed */}
                            10:30 AM Today
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600 text-lg mb-4">No personal notes yet. Add one below!</p>
                )}
                {/* New Note Placeholder/Form */}
                <div className="w-72 h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors duration-300 cursor-pointer p-4">
                  <form onSubmit={handleAddNote} className="flex flex-col w-full h-full justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="mb-4 text-lg font-medium">New Note</span>
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <textarea
                      placeholder="Note Content..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-300 text-sm resize-y min-h-[50px] focus:outline-none focus:ring-1 focus:ring-blue-400"
                      rows="2"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors duration-200"
                    >
                      Add Note
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Notes;
