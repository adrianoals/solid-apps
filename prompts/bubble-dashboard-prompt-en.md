# Prompt for Bubble AI - Dashboard Page

Create a responsive dashboard for client and note management:

## LAYOUT
- Fixed header: "Desafio Solid Apps" + "Dashboard" + logout button
- Sidebar: "Clients" (active) + "Notes" (inactive)
- Main area with padding

## CLIENTS SECTION
- Header: "Clients" + "New Client" button (green)
- Search: "Search clients..." field
- **REPEATING GROUP:**
  - Grid: 1 column mobile, 2-3 desktop
  - Card template: white, shadow, rounded
  - Content: Name (bold), Email (gray), Phone (gray)
  - Buttons: "Edit" (blue) + "Delete" (red) + "View Notes" (orange)
- **PAGINATION:**
  - "Previous" + "Next" buttons
  - "Page X of Y" text
  - Config: limit=20, skip=0

## NOTES SECTION
- Header: "Notes" + "Select Client" dropdown + "New Note" button
- Search: "Search notes..." field
- **REPEATING GROUP:**
  - Grid: 1 column mobile, 2-3 desktop
  - Card template: white, shadow, rounded
  - Content: Title (bold), Content (truncated), Date (gray)
  - Buttons: "Edit" (blue) + "Delete" (red)
- **PAGINATION:** Same as clients

## MODALS
- **New/Edit Client:**
  - Overlay + centered card
  - Fields: Name*, Email*, Phone*
  - Buttons: "Save" (blue) + "Cancel" (gray)
- **New/Edit Note:**
  - Overlay + centered card
  - Fields: Client (dropdown), Title*, Content* (textarea)
  - Buttons: "Save" (blue) + "Cancel" (gray)

## RESPONSIVENESS
- Desktop: fixed sidebar
- Mobile: hamburger menu
- Repeating groups: 1 column mobile, 2-3 desktop

## STATES
- Loading: spinner
- Error: red message
- Success: green message
- Empty: "No clients found" (when repeating group empty)
- Hover: stronger shadow

## COMPONENTS
- Buttons: primary, secondary, danger styles
- Inputs: rounded, blue focus
- Cards: shadow, hover effect
- Modals: overlay + card

**IMPORTANT**: Visual interface only. No APIs - just elements and navigation workflows.
