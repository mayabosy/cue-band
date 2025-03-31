/**
 * 
 * Journal Page
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useState, useEffect } from 'react';
import '/src/index.css';
import 'react-calendar/dist/Calendar.css';
import withAccessibilityStyles from '../components/withAccessibilityStyles';
import HeatmapCalendar from '../components/CalendarHeatmap';
import NoteComponent from '../components/NoteComponent';
import { IoMdCloseCircle } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { BsEmojiFrownFill } from "react-icons/bs";
import { BsEmojiNeutralFill } from "react-icons/bs";
import { BsEmojiGrinFill } from "react-icons/bs";
import { LiaCalendar } from "react-icons/lia";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Journal({ server, fetchScheduleStatus, accessibilityOptions, style, userID, setUserID }) {
  // State variables
  const [currentDay, setCurrentDay] = useState(new Date());
  const [journal, setJournal] = useState([]);
  const [showNoteOverlay, setShowNoteOverlay] = useState(false);
  const [showHeatmapOverlay, setHeatmapOverlay] = useState(false);
  const [showEditNoteOverlay, setShowEditNoteOverlay] = useState(false);
  const [note, setNote] = useState('');
  const [diaryID, setDiaryID] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Function to parse JWT token
  const parseJwt = (token) => {
    const decode = JSON.parse(atob(token.split('.')[1]));
    return decode;
  };

  // Effect hook to fetch diary entries on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      setUserID(decodedToken.id);
      if (decodedToken.id) {
        getDiary(decodedToken.id);
      }
    }
  }, []);

  // Styles for different mood icons
  const iconStyles = {
    happy: { color: '#87D182' }, // Green
    vHappy: { color: '#5AB8F9 ' }, // Blue
    neutral: { color: '#FFAB47' }, // Orange
    bad: { color: '#FF6666' }, // Red
  };

  // Map of mood labels to corresponding emoji icons
  const emojiMap = {
    'Today was great': <BsEmojiGrinFill style={iconStyles.vHappy} />,
    'Today was okay': <BsEmojiSmileFill style={iconStyles.happy} />,
    'Today was not bad': <BsEmojiNeutralFill style={iconStyles.neutral} />,
    'Today was bad': <BsEmojiFrownFill style={iconStyles.bad} />,
  };

  // Function to update diary entry
  const updateDiary = () => {
    let formData = new FormData();
    formData.append('note', note);
    formData.append('user', userID);
    formData.append('diary_id', diaryID);

    fetch(`https://w20037161.nuwebspace.co.uk/cueband/api/diary?note=${note}&user=${userID}&diary_id=${diaryID}`, {
      method: 'PUT',
    })
      .then(response => {
        if (response.status === 204) {
          toast.success('Note updated successfully!', {
            autoClose: 500, // Auto-closing toast after 500 milliseconds
            onClose: () => {
              window.location.reload();
            },
            className: 'toast-success'
          });
          return;
        } else if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update the data. Server returned status: ' + response.status);
        }
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  // Function to fetch diary entries
  const getDiary = (userID) => {
    fetch('https://w20037161.nuwebspace.co.uk/cueband/api/diary?user=' + userID, {
      method: 'GET',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 204) {
          return [];

        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          const sortedJournal = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setJournal(sortedJournal);
        } else {
          setJournal([]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
      })
  }

  // Mapping journal entries to JSX elements
  const diaryJSX = journal.map((item, index) => (
    <div key={index} className="bg-blue-50 shadow-md p-8 mb-10" style={style}>
      {/* Date and Hour */}
      <div className="flex justify-between mb-8">
        {/* Date */}
        <div className="flex items-center text-gray-600 relative">
          {/* Emoji */}
          <span className="mr-2">{emojiMap[item.label]}</span>
          <p className='text-sky-900 font-bold'>{item.date}</p>
          <div className="underscore"></div>
        </div>
        {/* Hour */}
        <div className=" text-sky-900 font-bold relative">
          <p>{item.hour}</p>
          <div className="underscore"></div>
        </div>
      </div>
      {/* Note Content */}
      <div className="mb-4" style={{ display: 'flex', alignItems: 'center' }}>
        {/* Note content */}
        <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: item.note }} />
      </div>
      <div className='container-edit-note-button'>
        <button

          onClick={() => handleEdit(item)}
          className='rounded-md edit-note-button bg-blue-100'
        >
          Edit
        </button>
      </div>
    </div>
  ));

  // State hook for the current day
  const [theDay, getTheDay] = useState('');

  // Effect hook to update the current day and set a timer for the next day
  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Current date
    const now = new Date();
    getTheDay(days[now.getDay()]);

    const timer = setTimeout(() => {
      const tomorrow = new Date();
      setCurrentDay(days[tomorrow.getDay()]);
    }, (24 - now.getHours()) * 3600 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to close the note overlay
  const closeNoteOverlay = () => {
    setShowNoteOverlay(false);
  };

  // Function to close the heatmap overlay
  const closeHeatmapOverlay = () => {
    setHeatmapOverlay(false);
  };

  // Function to toggle the note overlay
  const toggleNoteOverlay = () => {
    setShowNoteOverlay(!showNoteOverlay);
  };

  // Function to toggle the heatmap overlay
  const toggleHeatmapOverlay = () => {
    setHeatmapOverlay(!showHeatmapOverlay);
  };

  // Function to handle saving diary entry
  const handleSave = () => {
    updateDiary();
    setShowEditNoteOverlay(false);
  };

  // Function to decode HTML entities
  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Function to handle editing diary entry
  const handleEdit = (item) => {
    const decodedNote = decodeHtml(item.note);
    setNote(decodedNote);
    setDiaryID(item.diary_id);
    setShowEditNoteOverlay(true);
  };

  return (
    <div className='note-container'>
      <h1 className="font-extrabold text-3xl mb-10 border-b-2 border-slate-400 text-custom-blue font-serif">Your Notes</h1>
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 ">
        <button
          className="note-button rounded-md"
          style={style}
          onClick={toggleNoteOverlay}
        >
          + New Note
        </button>
        <button
          className="heatmap-button rounded-md"
          style={style}
          onClick={toggleHeatmapOverlay}
        >
          <LiaCalendar className="calendar-icon" />
          <span className="heatmap-text">Heatmap</span>
        </button>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="font-extrabold text-xl mb-10 text-custom-blue font-serif">Loading...</h1>
        </div>
      ) : journal.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-xl font-semibold mb-4">Sorry, there are no notes found in your Journal!</h3>
          <p className="text-gray-500">Start noting your symptoms by clicking "New Note"</p>
        </div>

      ) : (
        <div className="">
          {diaryJSX}
        </div>
      )}
      {showNoteOverlay && (
        <div className="overlay" style={style}>
          <div className="content-overlay">
            <button className="close-add-note-button" onClick={closeNoteOverlay}>
              <IoMdCloseCircle />
            </button>
            <NoteComponent userID={userID} setUserID={setUserID} />
          </div>
        </div>
      )}
      {showHeatmapOverlay && (
        <div className="overlay2" style={style}>
          <div className="heatmap-calendar-container">
            <button className="close-heatmap-button" onClick={closeHeatmapOverlay}>
              <IoMdCloseCircle />
            </button>
            <HeatmapCalendar diaryData={journal} />
          </div>
        </div>
      )}
      {showEditNoteOverlay && (
        <div className="overlay-update-note" >
          <div className="modal-update-note">
            <h2 style={style}>Edit Note</h2>
            <textarea
              style={style}
              className='textarea-update-note'
              placeholder="Type your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
            <div className="buttons-container">
              <button className='save-update-note-button' onClick={handleSave} style={style}>
                Save
              </button>
              <button className='cancel-update-note-button' onClick={() => setShowEditNoteOverlay(false)} style={style}>
                Cancel

              </button>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}


export default withAccessibilityStyles(Journal);

