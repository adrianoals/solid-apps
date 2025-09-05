Candidate Challenge — CRUD App with Bubble (Front) + Back4App (Back)
Goal
Build a small web app where an authenticated user can create, read, update, and delete Clients and related Notes.

Frontend: Bubble (treat Bubble purely as a UI; do not store Clients/Notes in Bubble DB).

Backend: Back4App (use its REST API).

Scope note for candidates: Back4App provides a managed backend with user accounts, data classes, and a REST API you can call from Bubble.

Functional Requirements
Authentication

Sign Up and Login using Back4App’s user system.

Users must only see their own data.

Clients

Fields: name, email, phone.

Full CRUD, searchable list, and ordering.

Notes

Fields: title, content.

Each Note belongs to a Client and to its owner.

Full CRUD, shown within the selected Client.

UX

Responsive layouts (desktop/mobile).

Clear loading and error/success feedback.

Technical Constraints
No Bubble database for Clients/Notes — all operations must go through Back4App.

Integrate via Bubble’s API Connector (no paid plugins).

Handle credentials/tokens securely (no hard-coding in visible elements).

Keep workflows/components organized and reusable.

Deliverables
Short video (3–5 min) demonstrating the flows.

Short README covering:

Assumptions made.

Known limitations and possible improvements.

Timebox
Suggested effort: ~4–6 hours.

Deadline: 48 hours after receiving the challenge.

Evaluation (100 pts)
Integration & Architecture (25): clean API integration, ownership isolation.

Functionality (25): CRUD completeness, Client ↔ Note relation.

UX/UI (15): responsiveness, clarity, states.

Quality (20): naming, reuse, maintainability, basic security.

Docs & Communication (15): clarity of README and video.

Bonus (optional)
Pagination for lists.

Form validation.

Reusable components.

Graceful session-expiry handling.