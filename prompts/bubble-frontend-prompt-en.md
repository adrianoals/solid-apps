# Prompt for Bubble AI - Frontend CRUD App

Create a responsive web app with 3 main pages using Bubble:

## PAGE 1: LOGIN
- Header: "Desafio Solid Apps"
- Centered form:
  - "Email" field (email type)
  - "Password" field (password type)
  - "Login" button (blue, highlight)
  - "Create account" link (small text)
- Visual states: loading, error (red), success (green)
- Responsive layout (mobile/desktop)

## PAGE 2: MAIN DASHBOARD
- Fixed header: logo + "Dashboard" + logout button (top right)
- Left sidebar (desktop) / hamburger menu (mobile):
  - "Clients" (active by default)
  - "Notes"
- Main area:
  - **Clients Section**:
    - "New Client" button (green, top right)
    - Client list in cards:
      - Name (highlight)
      - Email (gray)
      - Phone (gray)
      - Buttons: "Edit" (blue) + "Delete" (red) + "View Notes" (orange)
    - Search field "Search clients..."
    - Pagination: "Previous" / "Next" + "Page X of Y"
  - **Notes Section**:
    - "Select Client" dropdown (required)
    - "New Note" button (green)
    - Notes list in cards:
      - Title (highlight)
      - Content (truncated)
      - Creation date (gray)
      - Buttons: "Edit" (blue) + "Delete" (red)
    - Search field "Search notes..."
- "New/Edit Client" modal:
  - Fields: Name*, Email*, Phone*
  - Buttons: "Save" (blue) + "Cancel" (gray)
  - Real-time visual validation
- "New/Edit Note" modal:
  - "Client" field (dropdown, disabled if coming from specific client)
  - Fields: Title*, Content* (textarea)
  - Buttons: "Save" (blue) + "Cancel" (gray)

## PAGE 3: ERROR
- Large error icon (red)
- Title "Oops! Something went wrong"
- Customizable message
- "Try again" button (blue)
- "Back to login" link (text)

## TECHNICAL REQUIREMENTS
- Modern design: neutral colors, subtle shadows, rounded borders
- Responsive: sidebar becomes hamburger menu on mobile
- Clear visual states: loading, error, success, empty
- Reusable components: buttons, inputs, modals, cards
- Smooth navigation between sections
- Visual feedback on all actions

## DATA STRUCTURE (visual reference only)
- Client: {name, email, phone}
- Note: {title, content, client}

**IMPORTANT**: Create only the interface. Do not implement APIs - just prepare visual elements and basic navigation workflows.
