<template>
  <div style="display: grid; grid-template-columns: 1fr; gap: 32px">
    <!-- Calendar Section -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 12px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3)">
        <h2 style="font-size: 20px; font-weight: 700; color: white; margin: 0 0 24px 0">📅 {{ monthYear }}</h2>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 24px">
          <div v-for="dayName in dayNames" :key="dayName" style="text-align: center; color: #64748b; font-size: 12px; font-weight: 700; padding: 8px 0; text-transform: uppercase">
            {{ dayName }}
          </div>
          <div v-for="day in calendarDays" :key="day" :style="getDayStyle(day)" style="display: flex; align-items: center; justify-content: center; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s" @mouseenter="$event.currentTarget.style.transform = 'scale(1.1)'" @mouseleave="$event.currentTarget.style.transform = 'scale(1)'" @click="selectDate(day)">
            {{ day === 0 ? '' : day }}
          </div>
        </div>
        <div style="background: rgba(60, 130, 246, 0.1); border: 1px solid rgba(60, 130, 246, 0.3); border-radius: 8px; padding: 16px; text-align: center">
          <p style="font-size: 13px; font-weight: 600; color: #cbd5e1; margin: 0 0 4px 0">Today</p>
          <p style="font-size: 20px; font-weight: 900; color: #60a5fa; margin: 0">{{ currentDay }}</p>
        </div>
      </div>

      <!-- Alerts for Today -->
      <div>
        <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1)); border-left: 4px solid #ef4444; border-radius: 12px; padding: 20px; margin-bottom: 20px" v-if="todayAlerts.length > 0">
          <h3 style="font-size: 16px; font-weight: 700; color: #fca5a5; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px">
            <span style="font-size: 18px">🚨</span> Today's Alerts
          </h3>
          <div v-for="alert in todayAlerts" :key="alert.id" style="background: rgba(0, 0, 0, 0.2); padding: 12px; border-radius: 6px; margin-bottom: 8px; font-size: 13px; color: #fecaca;">
            <p style="font-weight: 600; margin: 0 0 4px 0">{{ alert.title }}</p>
            <p style="margin: 0; opacity: 0.9">⏰ {{ alert.time }}</p>
          </div>
        </div>

        <div v-else style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1)); border-left: 4px solid #22c55e; border-radius: 12px; padding: 20px">
          <h3 style="font-size: 16px; font-weight: 700; color: #86efac; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px">
            <span style="font-size: 18px">✨</span> No Alerts
          </h3>
          <p style="color: #a7f3d0; margin: 0; font-size: 13px">All scheduled items are on track</p>
        </div>

        <!-- Upcoming Events -->
        <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1)); border-left: 4px solid #3b82f6; border-radius: 12px; padding: 20px; margin-top: 20px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
            <h3 style="font-size: 16px; font-weight: 700; color: #93c5fd; margin: 0; display: flex; align-items: center; gap: 8px">
              <span style="font-size: 18px">📌</span> Upcoming (7 days)
            </h3>
            <button @click="showAddEventModal = true" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s" @mouseenter="$event.currentTarget.style.transform = 'scale(1.05)'; $event.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'" @mouseleave="$event.currentTarget.style.transform = 'scale(1)'; $event.currentTarget.style.boxShadow = 'none'">
              ➕ Add Event
            </button>
          </div>
          <div v-for="event in upcomingEvents" :key="event.id" style="background: rgba(0, 0, 0, 0.2); padding: 12px; border-radius: 6px; margin-bottom: 8px; font-size: 13px; color: #bfdbfe;">
            <div style="display: flex; justify-content: space-between; align-items: start">
              <div style="flex: 1">
                <p style="font-weight: 600; margin: 0 0 4px 0">{{ event.title }}</p>
                <p style="margin: 0; opacity: 0.9">📅 {{ event.date }}</p>
              </div>
              <div style="display: flex; gap: 6px; margin-left: 8px">
                <button @click="editEvent(event)" style="background: rgba(59, 130, 246, 0.3); color: #93c5fd; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s" @mouseenter="$event.currentTarget.style.background = 'rgba(59, 130, 246, 0.5)'" @mouseleave="$event.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)'">
                  ✏️ Edit
                </button>
                <button @click="deleteEvent(event.id)" style="background: rgba(239, 68, 68, 0.3); color: #fca5a5; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s" @mouseenter="$event.currentTarget.style.background = 'rgba(239, 68, 68, 0.5)'" @mouseleave="$event.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Add/Edit Event Modal -->
        <div v-if="showAddEventModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; border-radius: 0">
          <div style="background: #0f172a; border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 12px; padding: 24px; width: 90%; max-width: 400px; box-shadow: 0 20px 25px rgba(0, 0, 0, 0.5)">
            <h3 style="font-size: 20px; font-weight: 700; color: white; margin: 0 0 20px 0">{{ editingEvent ? '✏️ Edit Event' : '➕ Add New Event' }}</h3>
            <div style="margin-bottom: 16px">
              <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px">Event Title</label>
              <input v-model="newEvent.title" type="text" placeholder="Enter event title" style="width: 100%; padding: 10px; border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'">
            </div>
            <div style="margin-bottom: 20px">
              <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px">Event Date</label>
              <input v-model="newEvent.date" type="date" style="width: 100%; padding: 10px; border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'">
            </div>
            <div style="display: flex; gap: 12px">
              <button @click="saveEvent()" style="flex: 1; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 700; cursor: pointer; transition: all 0.3s" @mouseenter="$event.currentTarget.style.transform = 'translateY(-2px)'; $event.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'" @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'; $event.currentTarget.style.boxShadow = 'none'">
                💾 Save
              </button>
              <button @click="showAddEventModal = false; editingEvent = null" style="flex: 1; background: rgba(71, 85, 105, 0.3); color: #cbd5e1; border: none; padding: 10px; border-radius: 6px; font-weight: 700; cursor: pointer; transition: all 0.3s" @mouseenter="$event.currentTarget.style.background = 'rgba(71, 85, 105, 0.5)'" @mouseleave="$event.currentTarget.style.background = 'rgba(71, 85, 105, 0.3)'">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px">
      <div style="background: linear-gradient(to bottom-right, #1e293b, #0f172a); border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 12px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); transition: all 0.3s ease; cursor: pointer" @mouseenter="$event.target.style.transform = 'scale(1.05)'" @mouseleave="$event.target.style.transform = 'scale(1)'">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px">
          <div style="width: 48px; height: 48px; background: rgba(37, 99, 235, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px">📊</div>
          <div style="background: rgba(37, 99, 235, 0.2); padding: 6px 12px; border-radius: 999px">
            <span style="font-size: 11px; font-weight: 700; color: #93c5fd">TOTAL</span>
          </div>
        </div>
        <p style="color: #94a3b8; font-size: 14px; font-weight: 500; margin: 0 0 8px 0">Total HOAs</p>
        <p style="font-size: 48px; font-weight: 900; background: linear-gradient(to right, #60a5fa, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0">{{ totalHOAs }}</p>
        <p style="font-size: 12px; color: #64748b; margin: 12px 0 0 0">All registered organizations</p>
      </div>

      <div style="background: linear-gradient(to bottom-right, #1e293b, #0f172a); border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 12px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); transition: all 0.3s ease; cursor: pointer" @mouseenter="$event.target.style.transform = 'scale(1.05)'" @mouseleave="$event.target.style.transform = 'scale(1)'">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px">
          <div style="width: 48px; height: 48px; background: rgba(34, 197, 94, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px">✅</div>
          <div style="background: rgba(34, 197, 94, 0.2); padding: 6px 12px; border-radius: 999px">
            <span style="font-size: 11px; font-weight: 700; color: #86efac">ACTIVE</span>
          </div>
        </div>
        <p style="color: #94a3b8; font-size: 14px; font-weight: 500; margin: 0 0 8px 0">Active HOAs</p>
        <p style="font-size: 48px; font-weight: 900; background: linear-gradient(to right, #4ade80, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0">{{ activeHOAs }}</p>
        <p style="font-size: 12px; color: #64748b; margin: 12px 0 0 0">Currently operational</p>
      </div>

      <div style="background: linear-gradient(to bottom-right, #1e293b, #0f172a); border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 12px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); transition: all 0.3s ease; cursor: pointer" @mouseenter="$event.target.style.transform = 'scale(1.05)'" @mouseleave="$event.target.style.transform = 'scale(1)'">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px">
          <div style="width: 48px; height: 48px; background: rgba(217, 119, 6, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px">⏳</div>
          <div style="background: rgba(217, 119, 6, 0.2); padding: 6px 12px; border-radius: 999px">
            <span style="font-size: 11px; font-weight: 700; color: #facc15">PENDING</span>
          </div>
        </div>
        <p style="color: #94a3b8; font-size: 14px; font-weight: 500; margin: 0 0 8px 0">Pending Actions</p>
        <p style="font-size: 48px; font-weight: 900; background: linear-gradient(to right, #facc15, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0">{{ pendingActions }}</p>
        <p style="font-size: 12px; color: #64748b; margin: 12px 0 0 0">Awaiting review</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px">
      <router-link to="/hoa/add" style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(79, 70, 229, 0.1)); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 32px 24px; text-align: center; text-decoration: none; transition: all 0.3s; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center" @mouseenter="$event.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)'" @mouseleave="$event.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'">
        <div style="font-size: 40px; margin-bottom: 16px">➕</div>
        <h3 style="font-size: 18px; font-weight: 700; color: white; margin: 0 0 8px 0">Add New HOA</h3>
        <p style="font-size: 14px; color: #94a3b8; margin: 0">Register a new HOA applicant</p>
      </router-link>

      <router-link to="/hoa-registry" style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 32px 24px; text-align: center; text-decoration: none; transition: all 0.3s; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center" @mouseenter="$event.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)'" @mouseleave="$event.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)'">
        <div style="font-size: 40px; margin-bottom: 16px">📋</div>
        <h3 style="font-size: 18px; font-weight: 700; color: white; margin: 0 0 8px 0">View Registry</h3>
        <p style="font-size: 14px; color: #94a3b8; margin: 0">Browse all HOA profiles</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      totalHOAs: 0,
      activeHOAs: 0,
      pendingActions: 0,
      events: [],
      recentActivities: [],
      dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      currentDate: new Date(),
      selectedDate: null,
      todayAlerts: [],
      upcomingEvents: [],
      showAddEventModal: false,
      editingEvent: null,
      newEvent: { title: '', date: '' }
    }
  },
  computed: {
    monthYear() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`
    },
    currentDay() {
      return this.currentDate.getDate()
    },
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1).getDay()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      const days = []
      for (let i = 0; i < firstDay; i++) days.push(0)
      for (let i = 1; i <= daysInMonth; i++) days.push(i)
      return days
    }
  },
  mounted() {
    this.loadDashboardData()
    this.loadTodayAlerts()
    this.loadUpcomingEvents()
  },
  methods: {
    async loadDashboardData() {
      try {
        const hoasRes = await api.get('/hoa-profiles/')
        const hoas = hoasRes.data.results || hoasRes.data || []
        this.totalHOAs = hoasRes.data.count || hoas.length
        this.activeHOAs = hoas.filter(h => h.status === 'active').length
        this.pendingActions = hoas.filter(h => h.status === 'pending').length
      } catch (error) {
        console.error('Error loading dashboard:', error)
      }
    },
    loadTodayAlerts() {
      const today = new Date().toISOString().split('T')[0]
      this.todayAlerts = [
        { id: 1, title: 'Board Meeting', time: '10:00 AM', date: today },
        { id: 2, title: 'Compliance Review Due', time: '3:00 PM', date: today }
      ]
    },
    loadUpcomingEvents() {
      this.upcomingEvents = [
        { id: 1, title: 'Monthly Board Meeting', date: '2026-03-01' },
        { id: 2, title: 'Compliance Audit', date: '2026-03-05' },
        { id: 3, title: 'Annual General Assembly', date: '2026-03-15' }
      ]
    },
    getDayStyle(day) {
      if (day === 0) return { visibility: 'hidden' }
      if (day === this.currentDay) {
        return { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', fontWeight: '700' }
      }
      return { background: 'rgba(71, 85, 105, 0.3)', color: '#cbd5e1' }
    },
    selectDate(day) {
      if (day === 0) return
      const newDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)
      this.selectedDate = newDate.toISOString().split('T')[0]
    },
    editEvent(event) {
      this.editingEvent = event
      this.newEvent = { title: event.title, date: event.date }
      this.showAddEventModal = true
    },
    deleteEvent(id) {
      if (confirm('Delete this event?')) {
        this.upcomingEvents = this.upcomingEvents.filter(e => e.id !== id)
      }
    },
    saveEvent() {
      if (!this.newEvent.title || !this.newEvent.date) {
        alert('Please fill in all fields')
        return
      }
      if (this.editingEvent) {
        const index = this.upcomingEvents.findIndex(e => e.id === this.editingEvent.id)
        if (index !== -1) {
          this.upcomingEvents[index] = { ...this.editingEvent, title: this.newEvent.title, date: this.newEvent.date }
        }
      } else {
        const newId = Math.max(...this.upcomingEvents.map(e => e.id), 0) + 1
        this.upcomingEvents.push({ id: newId, title: this.newEvent.title, date: this.newEvent.date })
      }
      this.showAddEventModal = false
      this.editingEvent = null
      this.newEvent = { title: '', date: '' }
    }
  }
}
</script>

