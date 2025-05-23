import { useEffect, useState } from "react"
import "./App.css"
import { format } from "date-fns"
import { availableSlotsForSelectedDate, generateTimeSlotsForDate, type TimeSlot } from "./utils"

export default function TimeSlotSelector() {
  const [viewAsAdmin, setAdminView] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [availability, setAvailability] = useState<TimeSlot[]>([])
  const [booked, setBooked] = useState<TimeSlot>()

  const timeSlots = selectedDate ? generateTimeSlotsForDate(selectedDate, "08:00", "19:00") : []
  const today = new Date();

  useEffect(() => {
    const availabilityStored = localStorage.getItem("availability")
    if (availabilityStored) {
      setAvailability(JSON.parse(availabilityStored))
    }
    const bookedStored = localStorage.getItem("booked")
    if (bookedStored) {
      setBooked(JSON.parse(bookedStored))
    }
  }, [])


  const isSlotAvailable = (slot: TimeSlot) =>
    availability.some(available => available.date === slot.date && available.startAt === slot.startAt)

  const isSlotBooked = (slot: TimeSlot) =>
    booked?.date === slot.date && booked?.startAt === slot.startAt

  const toggleAvailability = (selectedSlot: TimeSlot) => {
    if (isSlotAvailable(selectedSlot)) {
      setAvailability(prev =>
        prev.filter(timeslot =>
          !(timeslot.date === selectedSlot.date && timeslot.startAt === selectedSlot.startAt)
        )
      )
    } else {
      setAvailability(prev => [...prev, selectedSlot])
    }
  }

  const bookSlot = (selectedSlot: TimeSlot) => {
    if (isSlotBooked(selectedSlot)) {
      setBooked(undefined)
    } else {
      setBooked(selectedSlot)
    }
  }

  const handleClick = (slot: TimeSlot) => {
    if (viewAsAdmin) {
      toggleAvailability(slot)
    } else {
      bookSlot(slot) 
    }
  }

  const save = () => {
    localStorage.setItem("availability", JSON.stringify(availability))
    localStorage.setItem("booked", JSON.stringify(booked))
  }

  const timeslotOptions = viewAsAdmin
    ? timeSlots
    : availableSlotsForSelectedDate(availability, selectedDate)

  const timeslotResults = viewAsAdmin
    ? availableSlotsForSelectedDate(availability, selectedDate)
    : booked ? [booked] : []

    
  const backgroundColor = (slot: TimeSlot) => {
    let color = ''
    if (viewAsAdmin) {
      color = isSlotAvailable(slot) ? "#535bf2" : "#575757"
    } else {
      color = isSlotBooked(slot) ? "#535bf2" : "#575757"
    }
    return color
  }

  console.log("timeslotResults", timeslotResults, booked)

  return (
    <div className="app">
      <h1>Viewing Bookings</h1>
      <div className="app__subheader">
        <p aria-live="polite">({viewAsAdmin ? "Manager" : "Tenant"} view)</p>
        <button
          className="button-spacer"
          onClick={() => setAdminView(!viewAsAdmin)}>
          Switch to {viewAsAdmin ? "Tenant" : "Manager"} View
        </button>
      </div>

      <form>
        <section aria-labelledby="date-picker-heading">
          <h2 id="date-picker-heading">Choose your booking date</h2>
          <label htmlFor="select-date">Select a date: </label>
          <input
            type="date"
            id="select-date"
            name="select-date"
            value={selectedDate}
            min={format(today, "yyyy-MM-dd")}
            onChange={e => setSelectedDate(e.target.value)}
            aria-labelledby="date-picker-heading select-date"
          />
        </section>

        {selectedDate && 
          <>
          <section className="timeslot-grid" aria-labelledby="timeslot-heading">
            <h2 id="timeslot-heading" className="timeslot-grid__heading">
              Choose available time slots for {format(new Date(selectedDate), "EEEE do MMMM yyyy")}
            </h2>
            <fieldset>
            <legend>Select a time slot</legend>
            <div className="timeslot-grid__slots" >
              {timeslotOptions.map(slot => {
                return (
                  <button
                    aria-label={`Select time slot at ${slot.startAt}`}
                    title={isSlotAvailable(slot) ? "Marked as Available" : "Unavailable"}
                    key={`${slot.date}-${slot.startAt}`}
                    type="button"
                    className="timeslot-grid__slot"
                    onClick={() => handleClick(slot)}
                    style={{
                      backgroundColor: `${backgroundColor(slot)}`,
                    }}
                  >
                    {slot.startAt}
                  </button>
                )}
              )}
            </div>
            </fieldset>
            <button 
              className="button-spacer"
              type="button"
              onClick={save}>
              Save
            </button>
          </section>
          <section>
            {viewAsAdmin
              ? <h3>Chosen available booking slots for viewings on {format(new Date(selectedDate), "EEEE do MMMM yyyy")}:</h3>
              : <h3>Booked slot:</h3>
            }
            <ul className="timeslot-grid__slots-selected">
              {timeslotResults.map(slot => (
                  <li 
                    key={`${slot.date}-${slot.startAt}`} 
                    className="timeslot-grid__slot-selected">
                      <p>{!viewAsAdmin && format(new Date(slot.date), "EEEE do MMMM")}</p>
                      <p>{slot.startAt} to {slot.endAt}</p>
                  </li>
              ))}
            </ul>
          </section>
          </>
        }
      </form>
    </div>
  )
}
