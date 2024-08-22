import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [courses, setCourses] = useState([]);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [courseId, setCourseId] = useState('');
  const [newInstanceData] = useState({
    year: '',
    semester: '',
    course_id: ''
  });
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    course_code: '',
    content: ''
  });
  const [deleteCourseId, setDeleteCourseId] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/CourseList/');
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching CourseList data:', err);
      }
    };

    fetchData();
  }, []);

  const showPopup = (message, data = null) => {
    setPopupContent({ message, data });
    setPopupVisible(true);
  };

  const fetchCourseInstances = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/instances/${year}/${semester}/`);
      console.log('Fetched CourseInstances:', response.data);
      showPopup('Successfully fetched course instances.', response.data);
    } catch (err) {
      console.error('Error fetching CourseInstances:', err);
      showPopup('Error fetching course instances.');
    }
  };

  const deleteCourseInstance = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/instances/${year}/${semester}/${courseId}/delete/`);
      console.log('Deleted CourseInstance');
      showPopup('Successfully deleted course instance.');
    } catch (err) {
      console.error('Error deleting CourseInstance:', err);
      showPopup('Error deleting course instance.');
    }
  };

  const createCourseInstance = async () => {
    try {
      console.log('Data being sent:', newInstanceData);
      const response = await axios.post('http://127.0.0.1:8000/instances/', {
        year,
        semester,
        course_id: courseId, 
      });
      console.log('Created CourseInstance:', response.data);
      showPopup('Successfully created course instance.', response.data);
    } catch (err) {
      console.error('Error creating CourseInstance:', err);
      showPopup('Error creating course instance.');
    }
  };

  const createCourse = async () => {
    try {
      console.log('Data being sent:', newCourseData);
      const response = await axios.post('http://127.0.0.1:8000/CourseList/', newCourseData);
      console.log('Created Course:', response.data);
      showPopup('Successfully created course.', response.data);
    } catch (err) {
      console.error('Error creating Course:', err);
      showPopup('Error creating course.');
    }
  };

  const deleteCourse = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/CourseList/${deleteCourseId}/`);
      console.log('Deleted Course');
      showPopup('Successfully deleted course.');
    } catch (err) {
      console.error('Error deleting Course:', err);
      showPopup('Error deleting course.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Course Management</h1>
      </header>

      {/* Pop-up for displaying success messages and details */}
      {popupVisible && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h4>{popupContent.message}</h4>
            {popupContent.data && (
              <pre style={styles.pre}>{JSON.stringify(popupContent.data, null, 2)}</pre>
            )}
            <button onClick={() => setPopupVisible(false)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}

      <section style={styles.section}>
        <h3>Manage Course Instances</h3>
        <div style={styles.formGroup}>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Semester:</label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Course ID:</label>
          <input
            type="number"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={fetchCourseInstances} style={styles.button}>
            View Course Instances
          </button>
          <button onClick={deleteCourseInstance} style={styles.button}>
            Delete Course Instance
          </button>
          <button onClick={createCourseInstance} style={styles.button}>
            Create Course Instance
          </button>
        </div>
      </section>

      <section style={styles.section}>
        <h3>Create New Course</h3>
        <div style={styles.formGroup}>
          <label>Title:</label>
          <input
            type="text"
            value={newCourseData.title}
            onChange={(e) => setNewCourseData({ ...newCourseData, title: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Course Code:</label>
          <input
            type="text"
            value={newCourseData.course_code}
            onChange={(e) => setNewCourseData({ ...newCourseData, course_code: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Description:</label>
          <input
            type="text"
            value={newCourseData.content}
            onChange={(e) => setNewCourseData({ ...newCourseData, content: e.target.value })}
            style={styles.input}
          />
        </div>
        <button onClick={createCourse} style={styles.button}>
          Create Course
        </button>
      </section>

      <section style={styles.section}>
        <h3>Delete Course</h3>
        <div style={styles.formGroup}>
          <label>Course ID to Delete:</label>
          <input
            type="number"
            value={deleteCourseId}
            onChange={(e) => setDeleteCourseId(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={deleteCourse} style={styles.button}>
          Delete Course
        </button>
      </section>

      <section style={styles.section}>
        <h3>Course List</h3>
        <div style={styles.courseList}>
          {courses.map((course) => (
            <Course key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Course({ course }) {
  return (
    <div style={styles.courseCard}>
      <h4>{course.course_code} - {course.title}</h4>
      <p><strong>ID:</strong> {course.id}</p>
      <p><strong>Description:</strong> {course.content}</p>
      <p><strong>Published Date:</strong> {course.published_date}</p>
    </div>
  );
}

const styles = {
  container: {
    margin: '0 auto',
    padding: '20px',
    maxWidth: '800px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    padding: '10px 0',
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '8px',
  },
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: '1',
    margin: '0 5px',
    textAlign: 'center',
  },
  courseList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '15px',
  },
  courseCard: {
    backgroundColor: '#f4f4f4',
    paddingall: '15px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  popupOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  pre: {
    overflowX: 'auto',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '10px 15px',
    marginTop: '10px',
  },
};

export default App;
