import { useState } from "react";
import "./index.css";

const initialAdmin = {
  name: "Main Admin",
  email: "admin@sportflow.com",
  password: "admin123",
  role: "Admin"
};

const initialCourses = [
  { id: 1, name: "Pilates Flow", coach: "", duration: 60, capacity: 20 }
];

export default function App() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState(initialCourses);
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("Dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = (e) => {
    e.preventDefault();

    const user = [initialAdmin, ...users].find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    setCurrentUser(user);
    setPage("Dashboard");
    setError("");
  };

  const logout = () => {
    setCurrentUser(null);
    setEmail("");
    setPassword("");
  };

  if (!currentUser) {
    return (
      <div className="login">
        <form className="login-box" onSubmit={login}>
          <h1>SportFlow</h1>
          <p2>Login to your account</p2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Log In</button>
        </form>
      </div>
    );
  }

  const menu = [
    "Dashboard", "Users", "Courses",
    "Schedule", "Attendance", "Statistics", "Settings"
  ];

  const customers = users.filter(u => u.role === "Customer");
  const coaches = users.filter(u => u.role === "Coach");
  const totalPresent = attendance.filter(a => a.status === "Present").length;
  const totalAttendance = attendance.length;
  const attendanceRate = totalAttendance
    ? Math.round(totalPresent / totalAttendance * 100)
    : 0;

  return (
    <div className="app">
      <aside>
        <h2>SportFlow</h2>
        <p className="menu-title">ADMIN MENU</p>

        {menu.map(item => (
          <button
            key={item}
            className={page === item ? "selected" : ""}
            onClick={() => setPage(item)}
          >
            {item}
          </button>
        ))}

        <button className="logout" onClick={logout}>Log Out</button>
      </aside>

      <main>
        <header>
          <h3>{page}</h3>
          <span>{currentUser.name} · Admin</span>
        </header>

        {page === "Dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your sports complex overview.</p>

            <div className="cards">
              <Card title="Total Customers" value={customers.length} />
              <Card title="Total Coaches" value={coaches.length} />
              <Card title="Active Courses" value={courses.length} />
              <Card title="Attendance Rate" value={attendanceRate + "%"} />
            </div>

            <div className="panel">
              <h3>Upcoming Classes</h3>
              {schedule.length === 0
                ? <p>No scheduled classes yet.</p>
                : schedule.map(s => (
                  <p key={s.id}>{s.course} · {s.day} · {s.time}</p>
                ))}
            </div>

            <div className="panel">
              <h3>Recent Activity</h3>
              <p>Registered customers: {customers.length}</p>
              <p>Registered coaches: {coaches.length}</p>
              <p>Created courses: {courses.length}</p>
            </div>
          </>
        )}

        {page === "Users" && (
          <Users users={users} setUsers={setUsers} />
        )}

        {page === "Courses" && (
          <Courses
            courses={courses}
            setCourses={setCourses}
            coaches={coaches}
          />
        )}

        {page === "Schedule" && (
          <Schedule
            courses={courses}
            schedule={schedule}
            setSchedule={setSchedule}
          />
        )}

        {page === "Attendance" && (
          <Attendance
            customers={customers}
            courses={courses}
            attendance={attendance}
            setAttendance={setAttendance}
          />
        )}

        {page === "Statistics" && (
          <Statistics
            customers={customers}
            coaches={coaches}
            courses={courses}
            attendance={attendance}
          />
        )}

        {page === "Settings" && (
          <Settings />
        )}
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Users({ users, setUsers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Coach");
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const saveUser = (e) => {
    e.preventDefault();

    if (users.some(u => u.email === email && u.id !== editing)) {
      setMessage("This email is already registered.");
      return;
    }

    if (editing) {
      setUsers(users.map(u =>
        u.id === editing
          ? { ...u, name, email, password: password || u.password, role }
          : u
      ));
      setMessage("User updated successfully.");
    } else {
      setUsers([...users, {
        id: Date.now(), name, email, password, role
      }]);
      setMessage("User added successfully.");
    }

    setName("");
    setEmail("");
    setPassword("");
    setRole("Coach");
    setEditing(null);
  };

  const editUser = (user) => {
    setEditing(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);
  };

  return (
    <>
      <h1>User Management</h1>
      <p>Add and manage coaches and customers.</p>

      <div className="panel">
        <h3>{editing ? "Edit User" : "Add New User"}</h3>
        <form className="user-form" onSubmit={saveUser}>
          <input placeholder="Full Name" value={name}
            onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required />
          <input type="password"
            placeholder={editing ? "New password (optional)" : "Password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required={!editing} />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="Coach">Coach</option>
            <option value="Customer">Customer</option>
          </select>
          <button type="submit">{editing ? "Save Changes" : "Add User"}</button>
          {editing && (
            <button type="button" className="cancel-btn"
              onClick={() => {
                setEditing(null);
                setName("");
                setEmail("");
                setPassword("");
                setRole("Coach");
              }}>
              Cancel
            </button>
          )}
        </form>
        {message && <p>{message}</p>}
      </div>

      <div className="panel">
        <h3>Registered Users ({users.length})</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="small-btn" onClick={() => editUser(u)}>Edit</button>
                    <button className="delete-btn"
                      onClick={() => setUsers(users.filter(x => x.id !== u.id))}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <p>No users added yet.</p>}
      </div>
    </>
  );
}

function Courses({ courses, setCourses, coaches }) {
  const [name, setName] = useState("");
  const [coach, setCoach] = useState("");
  const [duration, setDuration] = useState(60);
  const [capacity, setCapacity] = useState(20);
  const [message, setMessage] = useState("");

  const addCourse = (e) => {
    e.preventDefault();
    setCourses([...courses, {
      id: Date.now(), name, coach, duration: Number(duration),
      capacity: Number(capacity)
    }]);
    setName("");
    setCoach("");
    setDuration(60);
    setCapacity(20);
    setMessage("Course created successfully.");
  };

  return (
    <>
      <h1>Courses</h1>
      <p>Create and manage sports courses.</p>
      <div className="panel">
        <h3>Create New Course</h3>
        <form className="user-form" onSubmit={addCourse}>
          <input placeholder="Course Name" value={name}
            onChange={e => setName(e.target.value)} required />
          <select value={coach} onChange={e => setCoach(e.target.value)}>
            <option value="">Select Coach</option>
            {coaches.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <input type="number" min="1" placeholder="Duration (minutes)"
            value={duration} onChange={e => setDuration(e.target.value)} required />
          <input type="number" min="1" placeholder="Maximum Customers"
            value={capacity} onChange={e => setCapacity(e.target.value)} required />
          <button type="submit">Create Course</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <div className="cards">
        <Card title="Total Courses" value={courses.length} />
      </div>
      {courses.map(c => (
        <div className="panel" key={c.id}>
          <h3>{c.name}</h3>
          <p>Coach: {c.coach || "Not assigned"}</p>
          <p>Duration: {c.duration} minutes</p>
          <p>Capacity: {c.capacity} customers</p>
          <button className="delete-btn"
            onClick={() => setCourses(courses.filter(x => x.id !== c.id))}>
            Delete Course
          </button>
        </div>
      ))}
    </>
  );
}

function Schedule({ courses, schedule, setSchedule }) {
  const [course, setCourse] = useState("");
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const addSchedule = (e) => {
    e.preventDefault();
    setSchedule([...schedule, { id: Date.now(), course, day, time }]);
    setCourse("");
    setTime("");
    setMessage("Class added to schedule.");
  };

  return (
    <>
      <h1>Schedule</h1>
      <p>Manage training days and times.</p>
      <div className="panel">
        <h3>Add Training Schedule</h3>
        <form className="user-form" onSubmit={addSchedule}>
          <select value={course} onChange={e => setCourse(e.target.value)} required>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={day} onChange={e => setDay(e.target.value)}>
            {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d =>
              <option key={d}>{d}</option>
            )}
          </select>
          <input type="time" value={time}
            onChange={e => setTime(e.target.value)} required />
          <button type="submit">Add to Schedule</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <div className="panel">
        <h3>Weekly Schedule</h3>
        {schedule.length === 0 ? <p>No classes scheduled yet.</p> :
          schedule.map(s => (
            <div className="person" key={s.id}>
              <span>{s.day} · {s.time} · {s.course}</span>
              <button className="delete-btn"
                onClick={() => setSchedule(schedule.filter(x => x.id !== s.id))}>
                Remove
              </button>
            </div>
          ))
        }
      </div>
    </>
  );
}

function Attendance({ customers, courses, attendance, setAttendance }) {
  const [customer, setCustomer] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState("");

  const addAttendance = (e) => {
    e.preventDefault();

    setAttendance([
      ...attendance,
      { id: Date.now(), customer, course, status, date: new Date().toLocaleDateString() }
    ]);

    setCustomer("");
    setCourse("");
    setStatus("Present");
    setMessage("Attendance saved.");
  };

  return (
    <>
      <h1>Attendance</h1>
      <p>Record and manage customer attendance.</p>
      <div className="panel">
        <h3>Record Attendance</h3>
        <form className="user-form" onSubmit={addAttendance}>
          <select value={customer} onChange={e => setCustomer(e.target.value)} required>
            <option value="">Select Customer</option>
            {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={course} onChange={e => setCourse(e.target.value)} required>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button type="submit">Save Attendance</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <div className="panel">
        <h3>Attendance Records</h3>
        {attendance.map(a => (
          <div className="person" key={a.id}>
            <span>{a.customer} · {a.course} · {a.date}</span>
            <span className={a.status === "Present" ? "status" : "absent"}>
              {a.status}
            </span>
          </div>
        ))}
        {attendance.length === 0 && <p>No attendance records yet.</p>}
      </div>
    </>
  );
}

function Statistics({ customers, coaches, courses, attendance }) {
  const present = attendance.filter(a => a.status === "Present").length;
  const rate = attendance.length
    ? Math.round(present / attendance.length * 100)
    : 0;

  return (
    <>
      <h1>Statistics</h1>
      <p>Sports complex performance overview.</p>
      <div className="cards">
        <Card title="Total Customers" value={customers.length} />
        <Card title="Total Coaches" value={coaches.length} />
        <Card title="Total Courses" value={courses.length} />
        <Card title="Attendance Rate" value={rate + "%"} />
      </div>
      <div className="panel">
        <h3>Attendance Overview</h3>
        <p>Present: {present}</p>
        <p>Absent: {attendance.length - present}</p>
        <div className="progress">
          <div style={{ width: rate + "%" }}></div>
        </div>
        <p>{rate}% attendance rate</p>
      </div>
    </>
  );
}

function Settings() {
  const [name, setName] = useState(initialAdmin.name);
  const [email, setEmail] = useState(initialAdmin.email);
  const [message, setMessage] = useState("");

  const saveSettings = (e) => {
    e.preventDefault();
    initialAdmin.name = name;
    initialAdmin.email = email;
    setMessage("Profile updated. Please log in again if your email changed.");
  };

  return (
    <>
      <h1>Settings</h1>
      <p>Manage administrator profile.</p>
      <div className="panel">
        <h3>Admin Profile</h3>
        <form className="user-form" onSubmit={saveSettings}>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Admin Name" required />
          <input type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Admin Email" required />
          <button type="submit">Save Changes</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}


