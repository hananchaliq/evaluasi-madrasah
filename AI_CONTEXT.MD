# AI_CONTEXT.md

# IMPORTANT INSTRUCTIONS FOR AI

You are not the software architect.

You are not allowed to redesign this project.

You are not allowed to change technology decisions.

You are not allowed to introduce alternative architectures.

You are not allowed to create new requirements.

You are not allowed to remove existing requirements.

Your responsibility is ONLY to implement the project according to this specification.

Before generating any code:

1. Read AI_CONTEXT.md completely.
2. Inspect the current project.
3. Continue from the existing state.
4. Follow the development order exactly.

Never:

- Switch from Laravel to another framework.
- Switch from React to another frontend framework.
- Switch from Inertia.js.
- Introduce TypeScript.
- Introduce Next.js.
- Introduce Vue.
- Introduce Livewire.
- Introduce Filament.
- Introduce Firebase.
- Introduce Supabase.
- Introduce Prisma.
- Introduce MongoDB.
- Create a new architecture.

The project architecture has already been decided.

The goal is implementation, not redesign.

Always prioritize consistency with existing code.

Generate production-ready code.

Do not generate pseudo-code.

Do not generate placeholders.

Do not skip files.

Generate complete implementations.

---

# PROJECT

Project Name:
Madrasah Learning Evaluation System

Institution:
Madrasah Aliyah Kejuruan Negeri Ende (MAKN Ende)

Target Users:

- Admin
- Teacher
- Student

Application Language:

- Indonesian (ALL UI, labels, menus, buttons, validation messages, tables, reports, and pages MUST use Bahasa Indonesia)

---

# REQUIRED TECH STACK

Backend:

- Laravel 13

Frontend:

- React
- Inertia.js

Styling:

- Tailwind CSS v4

Icons:

- React Icons

Database:

- MySQL

Authentication:

- Laravel Breeze React

---

# FORBIDDEN TECHNOLOGIES

Do NOT use:

- Next.js
- Vue
- Livewire
- Filament
- TypeScript
- Express
- NestJS
- Firebase
- Supabase
- Prisma
- MongoDB

Do not replace the selected stack.

---

# DEVELOPMENT RULES

- Follow Laravel conventions.
- Use Eloquent Relationships.
- Use Form Request Validation.
- Use Inertia Pages.
- Use Resource Controllers when appropriate.
- Reuse existing code whenever possible.
- Do not create duplicate files.
- Do not overwrite working code without reason.
- Always inspect existing files before generating new code.
- Keep code clean and maintainable.

---

# PROJECT STATUS POLICY

Before writing code:

Always inspect:

- Routes
- Controllers
- Middleware
- Models
- Requests
- Migrations
- React Pages
- Components
- Layouts

Never assume a file does not exist.

Never recreate existing functionality.

Always extend the current implementation.

---

# DATABASE IS SOURCE OF TRUTH

The database schema is the source of truth.

Never rename tables.

Never rename columns.

Never redesign relationships.

Never create alternative database structures.

Use the existing migrations and models.

If a feature requires data, first inspect the database structure before generating code.

---

# USER ROLES

## Admin

Full access to all modules.

## Teacher

Can view personal evaluation results and statistics.

## Student

Can submit evaluations for assigned teachers.

---

# DATABASE TABLES

users

teachers

students

kelas

tingkatans

subject_categories

subjects

subject_levels

academic_years

semesters

questions

teaching_assignments

evaluation_periods

evaluations

evaluation_answers

Use existing migrations as the source of truth.

Never redesign the database unless explicitly requested.

---

# AUTHENTICATION

Login using:

Admin:

- username
- password

Teacher:

- username
- password

Student:

- username/NIS
- password

Use Laravel Authentication with Role Middleware.

---

# MASTER DATA MODULES

Admin can manage:

- Tingkatan
- Kelas
- Kategori Mata Pelajaran
- Mata Pelajaran
- Tahun Akademik
- Semester
- Guru
- Siswa
- Pertanyaan Evaluasi
- Penugasan Mengajar

Each module must include:

- Create
- Read
- Update
- Delete
- Search
- Pagination
- Validation

---

# EXCEL IMPORT EXPORT SYSTEM

Admin must be able to:

Import data using Excel templates.

Supported imports:

- Guru
- Siswa
- Kelas
- Mata Pelajaran
- Tingkatan
- Penugasan Mengajar

Features:

- Download Template Excel
- Import Excel
- Validate Data
- Show Failed Rows
- Show Success Count
- Show Error Count
- Prevent Duplicate Data

Supported exports:

- Excel
- PDF

Use Laravel Excel package.

---

# TEACHING ASSIGNMENT SYSTEM

Admin assigns:

Teacher +
Subject +
Class +
Academic Year +
Semester

Rules:

- One teacher can teach multiple classes.
- One class can have multiple teachers.
- Assignment must be unique per semester and academic year.

---

# EVALUATION QUESTION SYSTEM

Admin manages evaluation questions.

Features:

- Active / Inactive Question
- Question Ordering
- Bulk Question Management

Evaluation Scale:

1 = STS

2 = TS

3 = N

4 = S

5 = SS

---

# EVALUATION PERIOD SYSTEM

Admin can create:

Evaluation Period

Fields:

- Name
- Academic Year
- Semester
- Start Date
- End Date

Options:

- Active
- Locked
- Anonymous

Rules:

- Only one active evaluation period at a time.
- Locked period cannot receive new submissions.

---

# STUDENT EVALUATION SYSTEM

Students can:

- View assigned teachers
- Save draft
- Submit evaluation

Rules:

- One evaluation per teacher per semester.
- One evaluation per teacher per active period.
- Cannot edit after final submission.
- Must respect locked periods.

---

# ACADEMIC RULES

All evaluation data, analytics, rankings, reports, and monitoring must be based on:

- Academic Year
- Semester

The system must never rely on monthly evaluation periods.

Semester is the primary evaluation cycle.

All statistics, rankings, reports, and dashboards must support filtering by:

- Academic Year
- Semester

---

# ANALYTICS MODULE

Generate statistics:

- Per Teacher
- Per Class
- Per Subject
- Per Subject Category
- Per Academic Year
- Per Semester

Metrics:

- Average Score
- Highest Score
- Lowest Score
- Total Responses

Analytics Filters:

- Academic Year
- Semester
- Teacher
- Class
- Subject
- Subject Category

---

# TEACHER PERFORMANCE ANALYTICS

Generate:

- Best Teacher Ranking
- Lowest Teacher Ranking
- Average Score Ranking
- Ranking Per Subject
- Ranking Per Class
- Ranking Per Academic Year
- Ranking Per Semester

---

# EVALUATION INSIGHT MODULE

Dashboard must display:

- Total Responses
- Response Rate
- Average Institution Score
- Highest Rated Teacher
- Lowest Rated Teacher
- Most Evaluated Teacher
- Evaluation Completion Percentage

---

# STUDENT MONITORING

Admin can monitor:

- Submitted Evaluations
- Pending Evaluations
- Completion Percentage

Filters:

- Academic Year
- Semester
- Class

---

# REPORTING

Generate reports:

- Teacher Report
- Class Report
- Subject Report
- Category Report
- Evaluation Period Report

Export:

- PDF
- Excel

Print-friendly pages required.

---

# NOTIFICATION SYSTEM

Provide notifications for:

- New Evaluation Period
- Evaluation Deadline
- Evaluation Completed

Dashboard alerts required.

---

# AUDIT LOG SYSTEM

Track:

- Login
- Logout
- Create
- Update
- Delete
- Import
- Export

Store:

- User
- Activity
- Timestamp

---

# SYSTEM SETTINGS

Admin can configure:

- Active Academic Year
- Active Semester
- Active Evaluation Period
- Evaluation Mode (Anonymous / Non-Anonymous)
- Evaluation Lock Status

Rules:

- Only one Academic Year can be active.
- Only one Semester can be active.
- Only one Evaluation Period can be active.

---

# FUTURE READY ARCHITECTURE

Prepare architecture for future expansion:

- Mobile Application API
- Multi-Madrasah Support
- Email Notifications
- WhatsApp Notifications
- Advanced Analytics
- AI Recommendation System

Do NOT implement these yet.

Only prepare architecture for future scalability.

---

# DEVELOPMENT ORDER

1. Authentication
2. Role Middleware
3. Admin Layout
4. Sidebar
5. Dashboard
6. Tingkatan CRUD
7. Kelas CRUD
8. Subject Category CRUD
9. Subject CRUD
10. Academic Year CRUD
11. Semester CRUD
12. Teacher CRUD
13. Student CRUD
14. Teaching Assignment CRUD
15. Question CRUD
16. Evaluation Period CRUD
17. Student Evaluation Module
18. Analytics Module
19. Teacher Ranking
20. Student Monitoring
21. Notification System
22. Audit Log System
23. PDF Export
24. Excel Export
25. System Settings

---

# UI REQUIREMENTS

- Responsive Design
- Modern Admin Dashboard
- Clean Layout
- Consistent Spacing
- Mobile Friendly
- Tailwind CSS v4 Only
- Professional Educational Institution Style

---

# DEVELOPMENT COMPLETION RULE

A module is complete only if it includes:

- Route
- Controller
- Request Validation
- Model Relationship
- React Pages
- Form
- Table
- Search
- Pagination
- Create
- Edit
- Delete
- Flash Message

Do not stop at migration, model, or controller only.

Generate complete implementations.

---

# BEFORE WRITING CODE

Always:

1. Read AI_CONTEXT.md
2. Inspect current routes
3. Inspect current models
4. Inspect current migrations
5. Inspect current controllers
6. Inspect current React pages
7. Inspect current layouts

Then continue development from the current project state.

Never assume files do not exist.

Never regenerate existing functionality.

Never propose alternative architectures.

Never propose alternative technology stacks.

Always follow AI_CONTEXT.md as the source of truth.
