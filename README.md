# Keyhook Viewing Booker 

This is built to enable a Manager to chose a date and set 30 minutes slots of availability for viewings, and enables a potential tenant to choose and book from those available time slots.

- Manager/Admin View: Define available booking times for a particular date.

- Tenant View: Book from available times for a particular date set by the manager.

## Run Locally
Clone the repo:
```
git clone [repo-url]
cd keyhook-viewing-booker
```
Install dependencies:
```
yarn
```

Run locally:
```
yarn dev
```
Open http://localhost:5173 in your browser.

----- 

### Tech Stack
- React
- TypeScript
- date-fns for date formatting
- LocalStorage for persistence (for now)
- CSS for simple layout
- Vite template


### How It Works
**State**  
`viewAsAdmin` - Toggle between 'Manager' and 'Tenant' views (for now)
`selectedDate` - Date picker to choose a specific day  
`availability` - Slots available for booking (set by manager)  
`booked` - Slot booked by tenant

**Booking Logic**  
Manager defines available slots per day  
Tenant only sees slots available on the selected date  
Each slot can be selected and unselected.  
Changes are saved in localStorage.  

### Decisions

**Component Simplicity**  
- Kept the booking functionality for both users within one component for simplicity and to keep to time constraint  
- Moved helper functions like `generateTimeSlotsForDate` and `availableSlotsForSelectedDate` into a separate utils file to keep the component clean, make the code easier to reuse, and simplify testing (in future)  
- Local component state is used for simplicity. Logic is split for availability and booking, but could be in shared hooks or context.

**Role-Based Views**  
- Used boolean to toggle 'Manager' and 'Tenant' roles (`viewAsAdmin`). This avoided more complex auth/role management within the timeframe while demonstrating both use cases  

**LocalStorage for Persistence**
- For demo purposes, the data is stored in localStorage to persist availability and booking state between page refreshes. This allowed the persistence of time slots without adding more dependencies or a backend setup  

**Date-Specific Filtering**  
- Designed to only show availability and bookings for the currently selected date. This ensures that in the example prospective tenants only see slots relevant to the date they want to see availability for  

**UI**  
- Chose basic color indicators for buttons to show selected and unselected and labels add additional clarity (via aria-label and title)   
- Minimal layout with a date picker, toggle buttons, and a visual grid of time slots  
- Buttons are keyboard-accessible  
- Semantic HTML elements like `<fieldset>`, `<legend>`, and `aria-*` attributes are used to enhance screen reader support  

**Data Modeling**  
- Defined a `TimeSlot` type with `date`, `startAt`, and `endAt`, making it easy to reuse and filter  
- Separated "available" and "booked" time slots for clearer role behavior.

**Flexibility**  
- `generateTimeSlotsForDate()` allows changing start/end work hours in future  

----- 

### Future Improvements
To make this production ready, it could be expanded by (this and more):

**Backend Integration**
- Replace localStorage with API calls to persist availability and booking data  
- Add authentication/authorization to restrict admin/tenant access  
- Add property identification to allow unique bookings by address  

**Form Validation and UX Enhancements**
- Prevent users from selecting past dates, conflicting time slots or invalid dates  
- Display helpful inline validation and feedback messages  

**Testing**
- Add unit tests logic and interaction behavior    
- Include integration tests for booking flows    
- Use accessibility testing tools    

**Accessibility Audits**  
- Review screen reader behavior end-to-end  

**Design System & Styling**  
- Use a design system or framework    
- Improve responsiveness for mobile and tablet views  
- Have a calendar view with text that suggests how many slots are available so users don't need to search each day for availability    

**Performance Optimization**  
- Use useMemo to avoid recalculating time slots every time the component renders  
