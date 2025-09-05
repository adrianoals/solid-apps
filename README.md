# Solid Apps Challenge - CRUD App with Bubble + Back4App

## Delivery Summary

This project is part of the technical test to implement a CRUD application for **Clients** and **Notes**, using **Bubble** as frontend and **Back4App** as backend.

During development, respecting the **~6 hours** timebox, I completed the **backend** part (modeling, authentication, security, and complete CRUD via REST) and started the integration with Bubble.

Beyond the implementation, I documented in the repository the entire line of reasoning: the **prompts used**, the **responses from my Cursor agent**, and how I validated each step of configuration and implementations. This way, the delivery contains not only the code but also the process I followed.

---

## What Was Done

### ✅ Backend (Back4App) — **Completed**

* **User Authentication**

  * Registration, login, logout, and session management with tokens.
* **Data Modeling**

  * `Client` class: `name`, `email`, `phone`, `owner`.
  * `Note` class: `title`, `content`, `client`, `owner`.
  * `Pointer` relationships between User → Client → Note.
* **Security**

  * Configuration of **CLP (Class Level Permissions)** and **ACL (Access Control Lists)**.
  * User data isolation implemented.
* **REST API**

  * CRUD endpoints validated with cURL/Postman.
  * Error handling and authentication configured.
* **Documentation**

  * All prompts and interactions used in Cursor are recorded in the repository, in `docs/implementation/` and in the `prompts/` folder.

### 🔄 Frontend (Bubble) — **Partial**

* **Authentication**

  * Registration/login page integrated with Back4App.
  * Functional logout.
  * User session managed via token.
* **API Integration**

  * API Connector configured with dynamic headers (Application ID, Session Token).
  * Some basic calls tested successfully.
* **Interface**

  * Initial dashboard structure created.
  * Beginning of Repeating Groups configuration to list Clients.
  * CRUD flows not yet finalized.

---

## Project Status

* **Backend**: 100% ready and validated.
* **Frontend**: ~30% completed (login/registration and part of dashboard).
* **Integration**: ~50% configured.

**Time invested:** ~6 hours (excluding initial environment setup).

---

## Challenges Encountered

* My biggest difficulty was with the **Bubble API Connector**, mainly because it was my first experience with this feature.
* My background comes more from **high-code** (JavaScript, Python, Supabase, etc.), where I've worked with direct integrations via code. In Bubble, I was more accustomed to using JavaScript on the frontend rather than configuring APIs directly in the editor.
* Despite this, I managed to advance in the initial configuration and clearly document the points where I stopped.

---

## Next Steps (if there was more time)

1. Finalize complete CRUD in Bubble (Clients and Notes).
2. Complete responsive interface (desktop/mobile).
3. Add visual feedbacks (loading, error, success).
4. Improve security in session flow (automatic token renewal).
5. Implement extra features (pagination, form validations, reusable components).

---

## Deliverables

* **Demonstration Video (3–5 min)** showing authentication and configured backend.
* **Technical Documentation (README and docs/implementation/)** detailing:

  * Data modeling.
  * Security configuration.
  * API examples used.
  * Cursor prompts and responses validated during implementation.
  * Technical decisions, challenges, and next steps.

---

**Conclusion:** The backend was delivered complete and functional. The frontend was partially implemented, with integrated authentication and beginning of the dashboard. I recorded in detail the entire process on GitHub (including prompts and reasoning) to make clear the evolution, choices made, and points to continue.

---