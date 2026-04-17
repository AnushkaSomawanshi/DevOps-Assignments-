# GyneCare HMS — Architecture, Technology & Concepts
## Detailed Explanation Document (Viva + Report Ready)

---

> This document explains every box, every arrow, and every technology in the
> GyneCare architecture diagram — written in plain English with technical depth.

---

## HOW TO READ THE ARCHITECTURE DIAGRAM

The diagram shows the system in **layers stacked top-to-bottom**.  
Each layer only talks to the layer directly below or above it.  
Arrows show the **direction of data flow**.

```
USER (Browser)
     ↓  makes HTTP request
FRONTEND (React — runs in browser)
     ↓  sends /api/* request to backend
BACKEND (Node.js + Express — runs on server)
     ↓           ↓
DATABASE     EXTERNAL AI
(MongoDB)   (Gemini API)
```

This is called a **3-Tier + External Services Architecture**.

---

# PART 1 — THE USER LAYER

```
+==============================================================+
|                    USER (Browser Client)                     |
|          Patient  /  Doctor  /  Admin                        |
+==============================================================+
```

## Who Is the User?

The system has **three types of users**, each with completely different
permissions and views:

| User Type | What They Can Do |
|-----------|-----------------|
| **Patient** | Book appointments, use chatbot, view health packages, see their dashboard |
| **Doctor** | View their schedule, update appointment notes, add prescriptions |
| **Admin** | See all data, manage users, view analytics, download reports |

## What Does "Browser Client" Mean?

When a user opens the website in their browser (Chrome, Firefox, etc.), the
browser downloads the React application files (HTML, CSS, JavaScript). From
that point on, the **React app runs entirely inside the browser** — it renders
UI, handles user interactions, and makes API calls to the backend server.

The browser is the container. The React app is the content inside it.

---

# PART 2 — THE FRONTEND LAYER

```
+==============================================================+
|           FRONTEND LAYER  (Vite + React 19 + TypeScript)    |
+==============================================================+
```

## What Is the Frontend?

The frontend is everything the **user sees and interacts with** — buttons,
forms, dashboards, charts, the chatbot popup. It is built using three
foundational technologies working together.

---

## 2.1 The Three Core Frontend Technologies

### ① React 19

**What it is:** A JavaScript library made by Meta (Facebook) for building
user interfaces.

**How it works — in simple terms:**

React breaks the entire UI into small, independent pieces called
**components**. Think of each component as a LEGO brick. You build big
pages by combining smaller bricks.

```
App (the whole page)
 ├── Navbar (component)
 ├── HeroSection (component)
 ├── DoctorCard (component) ← reused for every doctor
 └── Footer (component)
```

**Why React?**
- When data changes (e.g., a new appointment is booked), only the affected
  component re-renders — not the whole page. This is fast.
- Components are reusable — write `DoctorCard` once, use it everywhere.
- In React 19, **lazy loading** (`React.lazy()`) is built-in, which means
  pages are only downloaded when the user navigates to them.

**Key React concept used here — Virtual DOM:**
React keeps an in-memory copy of the page structure (Virtual DOM). When
something changes, it compares old vs. new, finds the difference, and updates
only that part of the real browser DOM. This makes the UI extremely fast.

---

### ② TypeScript

**What it is:** TypeScript is JavaScript with a **type system** added on top.
It was created by Microsoft and is now the industry standard for serious
web applications.

**What does "typed" mean?**

In plain JavaScript:
```javascript
function getUser(id) {         // id could be anything — string, number, null
  return fetchUser(id);
}
```

In TypeScript:
```typescript
function getUser(id: string): Promise<User> {  // id MUST be a string
  return fetchUser(id);                         // return MUST be a User
}
```

TypeScript catches **mistakes before the code even runs**. For example, if
you accidentally write:
```typescript
getUser(123);   // ❌ Error: Argument of type 'number' is not
                //    assignable to parameter of type 'string'
```

The editor shows a red underline immediately — you fix it before it becomes
a real bug in production.

**Why it matters in a hospital app:**
In healthcare software, wrong data types = wrong patient data = serious
problems. TypeScript ensures data integrity at the code level.

---

### ③ Vite

**What it is:** Vite (French for "fast") is the **build tool and development
server** for the frontend.

**What does a build tool do?**

Modern React code is written in TypeScript, JSX, imports, etc. Browsers
cannot understand this directly — they only understand plain HTML, CSS, and
JavaScript. Vite transforms (compiles) the developer code into browser-ready
files.

**Development Mode:**
```
Developer saves a file → Vite hot-reloads ONLY that module in the browser
(takes ~50ms instead of rebuilding everything like old tools did)
```

**Production Mode:**
```
vite build → produces optimized, minified files in /dist folder
             (tree-shaking removes unused code, bundles everything efficiently)
```

**Proxy Feature (important!):**
In the diagram you see:
```
/api/* Proxy (Vite → Port 5000)
```
During development, the Vite dev server runs on **port 5173** and the
backend runs on **port 5000**. When the React app calls `/api/doctors`,
Vite's proxy automatically forwards the request to
`http://localhost:5000/api/doctors`. This avoids CORS issues in development.

---

## 2.2 Inside the Frontend — Breaking Down Each Box

### Box 1: TanStack Router (RBAC Guards)

```
+---------------+
| TanStack      |
| Router        |
| (RBAC guards) |
+---------------+
```

**What is Routing?**

In a traditional website, each URL loads a completely new HTML page from the
server. In a React SPA (Single-Page Application), routing is **handled
inside the browser** — navigating from `/home` to `/dashboard` does NOT
reload the page. The router intercepts the navigation and swaps the displayed
component.

**What is TanStack Router?**

TanStack Router is the routing library used in GyneCare. It is special
because it is **100% TypeScript-typed** — every route, every URL parameter,
every search query is fully type-safe. If you try to navigate to a route
that doesn't exist, TypeScript will tell you at compile time.

**What are RBAC Guards?**

RBAC = **Role-Based Access Control**. It means different users can access
different pages based on their role.

In GyneCare, TanStack Router uses a `beforeLoad` hook as a guard:

```typescript
const adminDashboardRoute = createRoute({
  path: "/dashboard/admin",

  // This runs BEFORE the page loads
  beforeLoad: () => {
    const role = getStoredUserRole();        // Read role from sessionStorage

    if (!role) throw redirect({ to: "/login" });      // Not logged in → Login
    if (role !== "admin") throw redirect({ to: "/" }); // Wrong role → Home
  },

  component: () => <AdminDashboardPage />,
});
```

**What this means in plain English:**
When a doctor tries to go to `/dashboard/admin`, the `beforeLoad` runs first.
It sees `role = "doctor"`, and immediately redirects them to the home page.
The admin dashboard component **never even renders**. This protects sensitive
pages at the routing level.

**Route Tree in GyneCare:**
```
/ (Home)
/find-doctor
/hospitals
/specialities
/health-packages
/blogs/:id
/book-appointment
/teleconsultation
/login
/register
/analytics
/dashboard/patient  ← protected: only "patient" role
/dashboard/doctor   ← protected: only "doctor" role
/dashboard/admin    ← protected: only "admin" role
```

---

### Box 2: AuthContext (sessionStorage)

```
+---------------+
| AuthContext   |
| (sessionStor) |
+---------------+
```

**What is React Context?**

Imagine you have user data (name, role, email) needed by the Navbar,
the Dashboard, the DoctorCard, and the Chatbot — all at the same time.
You could pass this data from parent to child to grandchild through
`props` — but this becomes messy fast (called "prop drilling").

React's **Context API** solves this. You put data in a "context container"
and any component in the tree can read directly from it — no prop drilling.

**AuthContext in GyneCare:**

`AuthContext.tsx` creates a global container for authentication state:

```typescript
const AuthContext = createContext({
  user: null,           // The logged-in user object
  login: () => {},      // Function to log in
  logout: () => {},     // Function to log out
});
```

`AuthProvider` wraps the entire app in `App.tsx`:
```tsx
<AuthProvider>         // ← wraps everything
  <RouterProvider router={router} />
  <ChatbotWidget />
</AuthProvider>
```

Now any component — no matter how deeply nested — can access user data:
```typescript
const { user } = useContext(AuthContext);  // Works anywhere in the app
```

**What is sessionStorage?**

`sessionStorage` is a browser storage mechanism. Data stored in
`sessionStorage` persists while the browser **tab** is open, and is cleared
when the tab is closed.

GyneCare stores the logged-in user data here with the key
`gynecare_user_data`. When the user refreshes the page, `AuthContext`
reads this key to restore the logged-in session automatically.

---

### Box 3: fetch() / Data Fetching

```
+-----------------+
| fetch() /       |
| Data Fetching   |
+-----------------+
```

**How does the frontend get data from the backend?**

The browser's built-in `fetch()` API is used to make HTTP requests to the
backend. In GyneCare, these fetch calls are wrapped and managed by
**TanStack Query** (React Query).

**Without TanStack Query (the old way):**
```typescript
// Every developer had to write this boilerplate manually:
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch("/api/doctors")
    .then(r => r.json())
    .then(d => setData(d))
    .catch(e => setError(e))
    .finally(() => setLoading(false));
}, []);
```

**With TanStack Query (the modern way used in GyneCare):**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["doctors"],           // unique cache key
  queryFn: () => fetch("/api/doctors").then(r => r.json()),
});
// That's it. Loading, error, and caching are all handled automatically.
```

**What TanStack Query does automatically:**
- ✅ Caches the response (same data isn't fetched twice unnecessarily)
- ✅ Shows loading state while fetching
- ✅ Handles errors gracefully
- ✅ Re-fetches when the browser tab regains focus
- ✅ Invalidates stale cache after mutations (e.g. after booking an appointment)
- ✅ Background re-fetching without showing a loading spinner

---

### Box 4: Pages (20+)

```
+----------+
| Pages    |
| (20+)    |
+----------+
```

GyneCare has over 20 fully built pages:

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section |
| Hospitals | `/hospitals` | All hospital branches |
| Find Doctor | `/find-doctor` | Doctor search & filter |
| Health Packages | `/health-packages` | Checkup packages |
| Blogs | `/blogs` | Health education articles |
| Book Appointment | `/book-appointment` | Appointment booking form |
| Teleconsultation | `/teleconsultation` | Online consultation info |
| Login | `/login` | Login form |
| Register | `/register` | Registration form |
| Analytics | `/analytics` | Analytics dashboard |
| + more | ... | Labs, Blood Availability, etc. |

**Every page is lazy-loaded:**
```typescript
// Instead of importing directly:
import FindDoctorPage from "@/pages/FindDoctor";  // ❌ loads at startup

// GyneCare uses lazy imports:
const FindDoctorPage = lazy(() => import("@/pages/FindDoctor"));  // ✅ loads on demand
```
This means the initial download is tiny — pages are fetched from the
server only when the user actually navigates to them.

---

### Box 5: Dashboards (Patient / Doctor / Admin)

```
+----------+
|Dashboards|
| Patient  |
| Doctor   |
| Admin    |
+----------+
```

Each dashboard is a protected page rendered only for the correct role.

**Patient Dashboard** — Shows:
- Upcoming appointments (with status badges)
- Past appointment history
- Active health packages
- Quick actions (Book New Appointment, Chat with AI)

**Doctor Dashboard** — Shows:
- Today's schedule
- Pending appointments needing confirmation
- Patient notes and prescription editor
- Their professional profile stats

**Admin Dashboard** — Shows:
- Total patients, total doctors, total appointments (KPI cards)
- System-wide appointment list (all statuses)
- User management (activate/deactivate accounts)
- Links to Analytics and Report generation

---

### Box 6: Chatbot Widget (Floating)

```
+-----------+
| Chatbot   |
| Widget    |
| (Floating)|
+-----------+
```

The `ChatbotWidget` is a React component that is mounted **outside the
router** in `App.tsx`:

```tsx
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ChatbotWidget />    {/* ← lives outside routes — shows on every page */}
    </AuthProvider>
  );
}
```

**Why outside the router?**
Because the chatbot should be accessible from ANY page — home, doctor
listing, appointment booking, etc. If it were inside a specific route, it
would disappear when the user navigates away.

**How the floating widget works:**
- A small button (stethoscope/chat icon) is fixed to the bottom-right corner
- Clicking it opens a chat panel
- The user types a message
- The message is sent to `/api/chatbot` via `fetch()`
- The AI response is received and rendered with markdown formatting

---

### Box 7: Analytics Dashboard (Recharts)

```
+--------------+
| Analytics    |
| Dashboard    |
| (Recharts)   |
+--------------+
```

**What is Recharts?**

Recharts is a React charting library built on top of **D3.js** (Data-Driven
Documents). It allows you to create interactive, responsive charts using
React components.

**Charts in GyneCare's Analytics Dashboard:**

```
/api/analytics/patients → Bar Chart: Daily patient count (Mon–Sun)
/api/analytics/revenue  → Line Chart: Monthly revenue (Jan–Jul)
/api/analytics/doctors  → Bar Chart: Appointments per doctor
```

Example Recharts usage:
```tsx
<BarChart data={patientsData} width={600} height={300}>
  <XAxis dataKey="name" />
  <YAxis />
  <Bar dataKey="patients" fill="#8884d8" />
  <Tooltip />
</BarChart>
```

**All data comes from the backend** via fetch calls to `/api/analytics/*`
routes, which return JSON arrays consumed by the chart components.

---

### Box 8: UI Libraries (Radix UI + shadcn/ui + Tailwind CSS v3)

```
UI: Radix UI + shadcn/ui + Tailwind CSS v3
```

**Tailwind CSS v3:**
Instead of writing custom CSS:
```css
/* Old way */
.button {
  display: flex;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #7c3aed;
}
```
Tailwind lets you write styles directly in JSX:
```tsx
{/* Tailwind way */}
<button className="flex px-6 py-3 rounded-lg bg-violet-600 text-white hover:bg-violet-700">
  Book Appointment
</button>
```
Every class is a single CSS property. The **JIT compiler** scans the code and
only includes classes actually used — keeping the final CSS tiny.

**Radix UI:**
A library of **unstyled, accessible UI primitives** — Dialog, Dropdown,
Select, Tooltip, Accordion, etc. "Unstyled" means they have no visual
appearance by default but all the accessibility logic (keyboard navigation,
focus trapping, ARIA attributes) is built in.

**shadcn/ui:**
shadcn/ui takes Radix UI primitives and applies Tailwind CSS styles to them.
The components are **copied directly into the project source code** (not
installed as an npm package), giving full control to customize them. Components
like `Button`, `Card`, `Input`, `Badge`, `Tabs`, `Dialog`, `Skeleton` are all
from shadcn/ui.

---

# PART 3 — THE BACKEND LAYER

```
+==============================================================+
|            BACKEND LAYER  (Node.js + Express.js)             |
+==============================================================+
```

## What Is the Backend?

The backend is the **server-side application** that:
1. Receives HTTP requests from the frontend
2. Applies business logic (validation, calculations)
3. Reads from / writes to the database
4. Calls external APIs (Gemini)
5. Sends HTTP responses back to the frontend

The backend does NOT have a user interface — it only speaks in **JSON** (data).

---

## 3.1 server.js — The Entry Point

```
+------------------------------------------------------+
|              server.js  (Entry Point)                |
|    CORS  |  express.json()  |  Error Middleware       |
+------------------------------------------------------+
```

`server.js` is where the entire backend application starts. Here is what
happens when the server boots up:

```javascript
// 1. Load environment variables from .env file
dotenv.config();

// 2. Create the Express application
const app = express();

// 3. Apply global middleware (runs on EVERY request)
app.use(cors());          // Allow requests from frontend (different port)
app.use(express.json());  // Parse JSON body of incoming requests

// 4. Register all API route modules
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/chatbot", chatbotRoutes);
// ... etc.

// 5. Global error handler (catches unhandled errors)
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Internal server error" });
});

// 6. Connect to MongoDB, seed data, start listening
connectDatabase(MONGO_URI);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**Middleware Explained:**

| Middleware | What It Does |
|------------|-------------|
| `cors()` | Adds HTTP headers allowing the frontend (port 5173) to call the backend (port 5000) without browser blocking |
| `express.json()` | Reads the raw JSON string from the request body and parses it into `req.body` object |
| Error Handler | Catches any error thrown inside controllers and returns a clean error response instead of crashing |

---

## 3.2 API Routes

```
+--------------+
|  API ROUTES  |
| /api/auth    |
| /api/users   |
| /api/doctors |
| /api/hosp.   |
| /api/packages|
| /api/blogs   |
| /api/appts   |
+--------------+
```

**What is a Route?**

A route maps a URL + HTTP method to a handler function.

```
GET  /api/doctors       → "Give me all doctors"
POST /api/appointments  → "Create a new appointment"
PUT  /api/appointments/123 → "Update appointment #123"
```

In Express, each resource has its own **route file** for organization:

```javascript
// doctorRoutes.js
import express from "express";
import { getAllDoctors, getDoctorById } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getAllDoctors);       // GET /api/doctors
router.get("/:id", getDoctorById);    // GET /api/doctors/d-001
```

The router is just a "mini Express app" for a specific resource. `server.js`
mounts it with `app.use("/api/doctors", doctorRoutes)`.

---

## 3.3 Controllers

```
+--------------+
| CONTROLLERS  |
| authCtrl     |
| appointCtrl  |
| doctorCtrl   |
| hospitalCtrl |
| packageCtrl  |
| blogCtrl     |
| userCtrl     |
+--------------+
```

**What is a Controller?**

A controller is a function that contains the **business logic** for handling
a specific API request. The route says "when this URL is called, run this
controller." The controller does the actual work.

**Example — Appointment Booking Controller:**

```javascript
// appointmentController.js
export async function createAppointment(req, res) {

  // Step 1: Extract data from request body
  const { patientId, doctorId, date, timeSlot, type } = req.body;

  // Step 2: Validate required fields
  if (!patientId || !doctorId || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Step 3: Check if slot is already booked
  const conflict = await Appointment.findOne({ doctorId, date, timeSlot });
  if (conflict) {
    return res.status(409).json({ message: "Time slot already booked" });
  }

  // Step 4: Save new appointment to database
  const appointment = await Appointment.create({ ...req.body });

  // Step 5: Return success response
  return res.status(201).json(appointment);
}
```

**Separation of Concerns:**
- Route → "Which URL triggers which function?"
- Controller → "What does the function actually do?"
- Model → "How is data structured in the database?"

This separation makes the code clean, testable, and maintainable.

---

## 3.4 Chatbot Route

```
+----------+
| CHATBOT  |
| /api/    |
| chatbot  |
+----------+
```

The chatbot route is where the most advanced logic lives. It handles the
complete AI conversation pipeline:

```
Browser → POST /api/chatbot { message: "I have pelvic pain" }
                ↓
        Check GEMINI_API_KEY exists
                ↓
        Detect key type:
        - Starts with "sk-or-" → use OpenRouter API
        - Otherwise            → use Google Gemini SDK directly
                ↓
        Construct AI request:
        - System prompt (medical assistant instructions)
        - User message
                ↓
        Send to AI → Receive response text
                ↓
        Return { reply: "..." } to browser
```

**The System Prompt (Prompt Engineering):**

The system prompt is a set of instructions given to the AI *before* the user's
message. It shapes the AI's entire behavior and output format:

```javascript
const SYSTEM_PROMPT = `You are a medical assistant chatbot specialized
in gynecology and general healthcare.

Response requirements (must follow):
- Use markdown-style formatting with bold section titles.
- Use numbered lists for steps.
- Do NOT provide medical diagnosis.

Use this exact response structure:
**Summary**
**Next Steps:**
**When to Seek Medical Advice:**
**Which Department to Consult:**
*Disclaimer...*`;
```

This is **Prompt Engineering** — the craft of writing instructions that
reliably produce consistent, structured AI output.

---

## 3.5 Reports and Analytics Routes

```
+---------------------+
| REPORTS / ANALYTICS |
| /api/reports/       |
|   generate          |
| /api/analytics/     |
|   patients          |
|   revenue           |
|   doctors           |
+----------+----------+
           |
           v
+----------+----------+
|  PDFKit  |  xlsx    |
+---------------------+
```

**Analytics Endpoints:**

```
GET /api/analytics/patients → [ {name:"Mon", patients:45}, ... ]
GET /api/analytics/revenue  → [ {name:"Jan", revenue:4000}, ... ]
GET /api/analytics/doctors  → [ {name:"Dr. Smith", appointments:120}, ... ]
```

These return JSON arrays consumed by Recharts on the frontend.

**Report Generation Endpoint:**

```
GET /api/reports/generate?format=pdf&type=patient
GET /api/reports/generate?format=excel&type=revenue
```

**PDFKit** — Node.js library that generates PDF files programmatically:
```javascript
const doc = new PDFDocument();
res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
doc.pipe(res);   // Stream PDF directly to HTTP response
doc.fontSize(25).text("GyneCare Hospital Report", { align: "center" });
doc.end();
```

**xlsx (SheetJS)** — Converts JavaScript arrays into Excel spreadsheets:
```javascript
const data = [{ Patient: "Jane Doe", Doctor: "Dr. Emily Chen" }];
const ws = xlsx.utils.json_to_sheet(data);  // Array → Worksheet
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "Report");
const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
res.send(buffer);  // Send Excel file as binary response
```

---

# PART 4 — THE DATA ACCESS LAYER (Mongoose ODM)

```
+===================+
|  DATA ACCESS      |
|  LAYER            |
|  (Mongoose ODM)   |
|                   |
|  Models:          |
|  - User           |
|  - Doctor         |
|  - Hospital       |
|  - Appointment    |
|  - HealthPackage  |
|  - Blog           |
|         |         |
|         v         |
|  +-------------+  |
|  |  MongoDB    |  |
|  | (hospitalDB)|  |
|  +-------------+  |
+===================+
```

## What Is Mongoose?

MongoDB stores data as raw documents. Mongoose sits between Node.js
and MongoDB and provides:

1. **Schemas** — Define the shape and rules for data
2. **Models** — JavaScript classes that represent database collections
3. **Validation** — Automatically rejects invalid data before saving
4. **Query API** — Clean JavaScript methods for CRUD operations

**Without Mongoose (raw MongoDB driver):**
```javascript
db.collection("appointments").insertOne({ patientId: "123", ... });
// No validation, no type checking, no structure enforcement
```

**With Mongoose:**
```javascript
const appointment = new Appointment({ patientId: "123", ... });
await appointment.save();  // Validates against schema BEFORE writing to DB
```

---

## The Six Data Models

### Model 1: User

```javascript
const userSchema = new mongoose.Schema({
  id:             String,    // Unique application-level ID
  name:           String,
  email:          String,    // unique: true, lowercase: true
  phone:          String,
  role:           { type: String, enum: ["patient", "doctor", "admin"] },
  password:       String,    // stored (should be hashed in production)
  abhaId:         String,    // India's health ID system
  avatar:         String,
  speciality:     String,    // only for doctors
  qualifications: String,    // only for doctors
  doctorId:       String,    // links to Doctor model
  active:         Boolean,
  createdAt:      String,
});
```

One `User` document serves all three roles. The `role` field determines
what the user can do. If the user is a doctor, `speciality` and `doctorId`
fields are populated; for patients, they remain empty.

---

### Model 2: Doctor

A separate `Doctor` model stores **clinical and professional** profile data
that is distinct from basic user account data:

```javascript
const doctorSchema = new mongoose.Schema({
  id:              String,
  name:            String,
  speciality:      String,       // e.g., "Obstetrics & Gynecology"
  qualification:   String,       // e.g., "MBBS, MD"
  experience:      Number,       // years
  rating:          Number,       // 0.0 to 5.0
  reviewCount:     Number,
  consultationFee: Number,       // in INR
  hospitalId:      String,       // which hospital they work at
  hospitalName:    String,
  location:        String,
  availableDays:   [String],     // e.g., ["Monday", "Wednesday", "Friday"]
  languages:       [String],
  expertise:       [String],
  bio:             String,
  imageUrl:        String,
});
```

---

### Model 3: Appointment

The most important transactional model. Every appointment booking creates
one Appointment document:

```javascript
const appointmentSchema = new mongoose.Schema({
  id:            String,
  patientId:     String,
  patientName:   String,         // denormalized for fast access
  doctorId:      String,
  doctorName:    String,         // denormalized for fast access
  hospitalId:    String,
  hospitalName:  String,
  department:    String,
  date:          String,
  timeSlot:      String,         // e.g., "10:00 AM - 10:30 AM"
  type:          { enum: ["in-person", "teleconsultation"] },
  status:        { enum: ["pending","confirmed","completed","cancelled"] },
  paymentStatus: { enum: ["pending", "paid"] },
  amount:        Number,
  reason:        String,
  notes:         String,         // doctor fills this during consultation
  prescription:  String,        // doctor fills this after consultation
  createdAt:     String,
});
```

**Why are `patientName` and `doctorName` stored directly?** (Denormalization)
In a relational database you would store only the IDs and JOIN to get names.
MongoDB is optimized for **denormalized** data — storing the name directly
in the appointment document means you can get the full appointment record in
ONE database query instead of multiple.

---

### Models 4–6: Hospital, Blog, HealthPackage

**Hospital** — Stores branch info: name, city, address, specialities,
facilities, contact details.

**Blog** — Health education posts: title, body content, author, category
(Pregnancy / Maternity / Gynecology), tags, publication date.

**HealthPackage** — Pre-packaged health checkup deals: name, included tests,
departments covered, price, duration (e.g., "Complete Maternity Package – ₹8,000").

---

# PART 5 — THE EXTERNAL SERVICES LAYER

```
+================================+
|   EXTERNAL SERVICES LAYER      |
|                                |
|  +-------------------------+  |
|  | Google Gemini 2.5 Pro   |  |
|  | (@google/genai SDK)     |  |
|  | env: GEMINI_API_KEY     |  |
|  +-------------------------+  |
+================================+
```

## What Is Google Gemini?

Google Gemini is Google's family of **Large Language Models (LLMs)** — AI
models trained on massive amounts of text that can understand and generate
human language.

GyneCare uses `gemini-2.5-pro` — Google's most powerful reasoning model.
It is accessed through the `@google/genai` Node.js SDK.

## Why Is the API Call Made from the Backend (Not Frontend)?

This is a critical security decision. The Gemini API key is a **secret
credential** — if it were included in the frontend JavaScript, anyone could
open browser DevTools, find the key, and use it at your expense.

The correct architecture:
```
❌ WRONG:  Browser → Gemini API (key exposed in JavaScript)
✅ CORRECT: Browser → Backend Server → Gemini API (key stored in .env)
```

The backend acts as a **secure proxy** — the frontend never sees the API key.

## How the SDK Works

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.5-pro",
  contents: userMessage,          // the patient's question
  config: {
    systemInstruction: SYSTEM_PROMPT,  // the doctor-role instructions
  },
});

const reply = response.text;     // the AI's text response
```

## OpenRouter Fallback

If the API key starts with `sk-or-`, the system uses **OpenRouter** instead.
OpenRouter is a marketplace for AI models — it provides a unified API
endpoint that can access Google, OpenAI, Anthropic, and other AI providers.

```javascript
const reply = apiKey.startsWith("sk-or-")
  ? await queryOpenRouter(message, apiKey)   // OpenRouter → gemini-flash
  : await queryGemini(message, apiKey);      // Google → gemini-2.5-pro
```

This is the **Strategy Design Pattern** — same interface, swappable
implementation. You can switch AI providers without changing any other code.

---

# PART 6 — NEW AND ADVANCED CONCEPTS SUMMARY

Here are the most important modern concepts used in GyneCare that are new
to most developers:

---

## Concept 1: Single-Page Application (SPA)

**Old web:** Every click loads a new HTML page from the server.
**SPA:** One HTML page is loaded once. React handles all navigation in the
browser. Only **data** (JSON) travels between frontend and backend — not HTML.

**Benefits:** Instant navigation, no full-page reloads, app-like experience.

---

## Concept 2: Role-Based Access Control (RBAC)

Access is granted based on **role**, not individual identity.

```
Patient role → can see: Home, FindDoctor, BookAppointment, PatientDashboard
Doctor role  → can see: Home, DoctorDashboard
Admin role   → can see: Everything, including AdminDashboard, Analytics, Reports
```

Enforced on the frontend (route guards) AND would be enforced on the backend
(controller checks) in a production system.

---

## Concept 3: Server-State vs. Client-State

| Type | What It Is | Tool Used |
|------|-----------|-----------|
| **Server State** | Data that lives in the database (appointments, doctors) | TanStack Query |
| **Client State** | Data that lives only in the browser (is sidebar open? which tab?) | useState / Context |

TanStack Query is specifically for **server state** — it knows data can
become stale (the database changed) and automatically keeps it fresh.

---

## Concept 4: Code Splitting + Lazy Loading

Instead of sending ALL code to the browser at once (one giant bundle), React
splits the code into **chunks** — one per route/page. Each chunk is only
downloaded when the user navigates to that page.

```
Initial load:  downloads ~100KB (core app only)
User → /find-doctor:  downloads ~30KB (FindDoctor chunk only)
User → /dashboard/admin:  downloads ~60KB (Admin Dashboard chunk only)
```

This reduces Time to First Paint (TTFP) dramatically.

---

## Concept 5: Prompt Engineering

The practice of crafting AI instructions (system prompts) to produce
consistent, reliable outputs. In GyneCare, the system prompt:
- Defines the AI's **persona** (medical assistant for gynecology)
- Defines the **output format** (bold headers, numbered lists)
- Sets **constraints** (no diagnosis, always recommend a department)
- Includes a **disclaimer** template

Quality of the prompt directly determines quality of the AI's responses.

---

## Concept 6: Denormalization in NoSQL

In SQL (relational) databases, you follow strict normalization rules — store
each piece of data in exactly one place and use JOINs to combine.

In MongoDB (NoSQL), **denormalization** — storing redundant data in multiple
places — is often the right choice for read-heavy queries.

GyneCare's Appointment model stores `doctorName` directly instead of just
`doctorId`. Reading an appointment gives you everything in ONE database call,
no JOIN needed.

---

## Concept 7: Environment Variables

Sensitive configuration (database passwords, API keys) is NEVER hardcoded
in the source code. Instead, it goes in a `.env` file:

```
GEMINI_API_KEY=AIzaSy...
MONGO_URI=mongodb+srv://...
PORT=5000
```

The `.env` file is listed in `.gitignore` — it is never committed to Git.
`dotenv` loads these values into `process.env` at runtime.

---

## Concept 8: REST API Design

REST (Representational State Transfer) is a set of rules for designing web APIs:

| Rule | Example |
|------|---------|
| Use HTTP verbs correctly | GET=read, POST=create, PUT=update, DELETE=remove |
| Resources are nouns, not verbs | `/api/appointments` ✅ not `/api/getAppointments` ❌ |
| Status codes are meaningful | 200=OK, 201=Created, 400=Bad Request, 404=Not Found |
| Stateless | Server stores NO session — client sends all context with every request |

---

# PART 7 — COMPLETE DATA FLOW (ONE SCENARIO)

Let's trace a **complete appointment booking** from click to database to dashboard:

```
[1] Patient clicks "Book Appointment" → fills form → clicks Submit

[2] React component calls:
    POST /api/appointments
    Body: { patientId, doctorId, date: "2026-04-20", timeSlot: "10:00 AM", type: "in-person" }

[3] Vite proxy forwards to http://localhost:5000/api/appointments

[4] Express receives request
    → cors() allows it
    → express.json() parses body into req.body
    → appointmentRoutes.js matches POST / → calls createAppointment()

[5] appointmentController.js:
    → Validates fields (400 if missing)
    → Checks for slot conflict (409 if conflict)
    → Appointment.create({ ...req.body }) ← Mongoose validates schema

[6] Mongoose sends write command to MongoDB
    → MongoDB inserts document into "appointments" collection
    → Returns inserted document

[7] Controller sends res.status(201).json(appointment)

[8] React frontend receives 201 response
    → TanStack Query mutation marks "appointments" cache as stale
    → Patient Dashboard re-fetches appointments → shows new booking
    → Doctor Dashboard re-fetches → shows new appointment in schedule
    → Admin Dashboard re-fetches → shows in full appointment list
```

---

# QUICK REFERENCE TABLE

| Technology | Category | Purpose |
|-----------|----------|---------|
| React 19 | Frontend Framework | Component-based UI |
| TypeScript | Language | Type-safe JavaScript |
| Vite | Build Tool | Fast dev server + production bundler |
| TanStack Router | Frontend Routing | Type-safe RBAC routing |
| TanStack Query | Data Fetching | Server-state management with caching |
| Context API | State Management | Global auth state without prop drilling |
| Tailwind CSS v3 | Styling | Utility-first CSS framework |
| Radix UI | UI Primitives | Accessible, unstyled UI components |
| shadcn/ui | UI Components | Styled Radix components |
| Recharts | Data Visualization | Interactive charts in React |
| Node.js | Runtime | Server-side JavaScript execution |
| Express.js | Web Framework | REST API routing + middleware |
| Mongoose | ODM | MongoDB schema + validation layer |
| MongoDB | Database | NoSQL document storage |
| dotenv | Config | Environment variable management |
| Google Gemini 2.5 Pro | AI Model | LLM for chatbot responses |
| @google/genai SDK | AI Client | Google's official AI SDK for Node.js |
| OpenRouter | AI Gateway | Alternative AI model routing |
| PDFKit | Report Generation | Server-side PDF creation |
| xlsx (SheetJS) | Report Generation | Excel spreadsheet creation |
| Nodemon | Dev Tool | Auto-restart server on file changes |
| cors | Middleware | Cross-origin request handling |

---

*This document covers every layer, arrow, and concept shown in the architecture diagram. Use it as a reference for viva questions, written reports, or project presentations.*
