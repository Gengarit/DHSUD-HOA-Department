<template>
  <div style="padding: 0; margin: 0; background: #f3f4f6; min-height: 100vh">
    <!-- Header Section -->
    <div style="background: #fff; box-shadow: 0 4px 24px rgba(59,130,246,0.08); padding: 32px; border-radius: 18px; margin-bottom: 32px; border: 1px solid #e5e7eb">
      <h1 style="font-size: 32px; font-weight: 800; color: #1e3a8a; margin: 0 0 8px 0; letter-spacing: -1px">📋 HOA Registry</h1>
      <p style="color: #64748b; margin: 0; font-size: 15px">Manage and monitor all HOA applicants and their compliance status</p>
    </div>

    <!-- Top Actions Bar -->
    <div style="margin-bottom: 28px; display: grid; grid-template-columns: 1fr 200px; gap: 16px; align-items: stretch">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="🔍 Search HOA by name or location..." 
        style="padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; color: #1e293b; font-size: 15px; outline: none; transition: all 0.3s; box-shadow: 0 1px 2px rgba(0,0,0,0.03)"
        @focus="$event.target.style.background = '#f1f5f9'; $event.target.style.boxShadow = '0 0 0 2px #3b82f6'"
        @blur="$event.target.style.background = '#fff'; $event.target.style.boxShadow = 'none'"
      >
      <router-link to="/hoa/add" style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 12px 20px; border-radius: 8px; text-align: center; text-decoration: none; font-weight: 700; font-size: 15px; transition: all 0.3s; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 2px 8px rgba(59,130,246,0.08)" @mouseenter="$event.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.13)'; $event.currentTarget.style.transform = 'translateY(-2px)'" @mouseleave="$event.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.08)'; $event.currentTarget.style.transform = 'translateY(0)'">
        ➕ Add HOA
      </router-link>
    </div>

    <!-- Export/Import Actions -->
    <div style="margin-bottom: 28px; display: flex; gap: 12px; flex-wrap: wrap">
      <button @click="exportCSV" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 10px 18px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 15px; transition: all 0.3s; box-shadow: 0 2px 8px rgba(16,185,129,0.08)" @mouseenter="$event.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.13)'; $event.currentTarget.style.transform = 'translateY(-2px)'" @mouseleave="$event.currentTarget.style.boxShadow = '0 2px 8px rgba(16,185,129,0.08)'; $event.currentTarget.style.transform = 'translateY(0)'">
        📥 Export CSV
      </button>
      <label style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 700; display: flex; align-items: center; gap: 8px; font-size: 15px; transition: all 0.3s; box-shadow: 0 2px 8px rgba(59,130,246,0.08)" @mouseenter="$event.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.13)'; $event.currentTarget.style.transform = 'translateY(-2px)'" @mouseleave="$event.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.08)'; $event.currentTarget.style.transform = 'translateY(0)'">
        📤 Import CSV
        <input type="file" @change="importCSV" accept=".csv" hidden>
      </label>
    </div>

    <!-- Stats Row -->
    <div style="margin-bottom: 28px; padding: 14px 20px; background: #fff; border-radius: 10px; color: #64748b; font-size: 15px; border: 1px solid #e5e7eb; box-shadow: 0 1px 4px rgba(0,0,0,0.03)">
      Showing <span style="font-weight: 700; color: #e2e8f0">{{ filteredHOAs.length }}</span> of <span style="font-weight: 700; color: #e2e8f0">{{ totalHOAs }}</span> records
    </div>

    <!-- HOA Registry Table -->
    <div style="background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(59,130,246,0.07); border: 1px solid #e5e7eb">
      <div v-if="filteredHOAs.length === 0" style="padding: 64px 32px; text-align: center; color: #64748b">
        <p style="font-size: 18px; margin: 0">📋 No HOA records found. <router-link to="/hoa/add" style="color: #3b82f6; text-decoration: underline; cursor: pointer">Click here to add one</router-link></p>
      </div>
      <table v-else style="width: 100%; border-collapse: collapse; background: #fff">
        <thead>
          <tr style="background: linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%); border-bottom: 2px solid #e5e7eb">
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px">HOA Name</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px">Status</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px">Location</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px">Violations</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hoa in filteredHOAs" :key="hoa.id" style="border-bottom: 1px solid #e5e7eb; transition: background 0.2s" @mouseenter="$event.currentTarget.style.background = '#f1f5f9'" @mouseleave="$event.currentTarget.style.background = 'transparent'">
            <td style="padding: 16px 20px">
              <router-link :to="`/hoa/${hoa.id}`" style="color: #2563eb; text-decoration: none; font-weight: 700; font-size: 15px; cursor: pointer; transition: color 0.2s" @mouseenter="$event.currentTarget.style.color = '#1e3a8a'" @mouseleave="$event.currentTarget.style.color = '#2563eb'">
                {{ hoa.hoa_name }}
              </router-link>
            </td>
            <td style="padding: 16px 20px">
              <span 
                @click="handleStatusClick(hoa)" 
                :style="getStatusStyleClass(hoa.status)"
                style="padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-block; text-transform: uppercase; letter-spacing: 0.3px; transition: all 0.2s; background: #f1f5f9"
                @mouseenter="$event.currentTarget.style.opacity = '0.8'; $event.currentTarget.style.transform = 'scale(1.05)'"
                @mouseleave="$event.currentTarget.style.opacity = '1'; $event.currentTarget.style.transform = 'scale(1)'"
              >
                {{ formatStatus(hoa.status) }}
              </span>
            </td>
            <td style="padding: 16px 20px; color: #334155; font-size: 15px">{{ hoa.city_municipality }}, {{ hoa.province }}</td>
            <td style="padding: 16px 20px">
              <div style="display: flex; gap: 8px; flex-wrap: wrap">
                <span v-if="hoa.violation_section_64" style="padding: 5px 10px; background: #fee2e2; color: #dc2626; border-radius: 5px; font-size: 12px; font-weight: 700">Sec 64</span>
                <span v-if="hoa.violation_section_101" style="padding: 5px 10px; background: #fee2e2; color: #dc2626; border-radius: 5px; font-size: 12px; font-weight: 700">Sec 101</span>
                <span v-if="hoa.violation_section_62" style="padding: 5px 10px; background: #fee2e2; color: #dc2626; border-radius: 5px; font-size: 12px; font-weight: 700">Sec 62</span>
                <span v-if="!hoa.violation_section_64 && !hoa.violation_section_101 && !hoa.violation_section_62" style="color: #94a3b8; font-size: 13px">None</span>
              </div>
            </td>
            <td style="padding: 16px 20px">
              <button @click="deleteHOA(hoa.id)" style="color: #fff; background: linear-gradient(135deg, #ef4444 0%, #f87171 100%); border: none; padding: 7px 16px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(239,68,68,0.08)" @mouseenter="$event.currentTarget.style.background = 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'; $event.currentTarget.style.transform = 'translateY(-2px)'" @mouseleave="$event.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'; $event.currentTarget.style.transform = 'translateY(0)'">
                🗑️ Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      hoas: [],
      searchQuery: '',
      totalHOAs: 0,
    }
  },
  computed: {
    filteredHOAs() {
      return this.hoas.filter(hoa =>
        hoa.hoa_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        hoa.city_municipality.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  mounted() {
    this.loadHOAs()
  },
  methods: {
    async loadHOAs() {
      try {
        const res = await api.get('/hoa-profiles/')
        this.hoas = res.data.results || res.data || []
        this.totalHOAs = res.data.count || this.hoas.length
      } catch (error) {
        console.error('Error loading HOAs:', error)
      }
    },
    getStatusStyleClass(status) {
      const statusColors = {
        'active': 'background: rgba(34, 197, 94, 0.2); color: #86efac',
        'pending': 'background: rgba(217, 119, 6, 0.2); color: #facc15',
        'suspended': 'background: rgba(239, 68, 68, 0.2); color: #fca5a5',
        'no_legal_standing': 'background: rgba(59, 130, 246, 0.2); color: #93c5fd',
        'dissolved': 'background: rgba(107, 114, 128, 0.2); color: #d1d5db',
        'revoked': 'background: rgba(239, 68, 68, 0.2); color: #fca5a5',
        'term_expired': 'background: rgba(217, 119, 6, 0.2); color: #facc15'
      }
      return statusColors[status] || 'background: rgba(71, 85, 105, 0.2); color: #cbd5e1'
    },
    formatStatus(status) {
      return status.replace(/_/g, ' ').toUpperCase()
    },
    handleStatusClick(hoa) {
      console.log('Status clicked for:', hoa.hoa_name)
    },
    async deleteHOA(id) {
      if (confirm('Are you sure you want to delete this HOA?')) {
        try {
          await api.delete(`/hoa-profiles/${id}/`)
          this.loadHOAs()
        } catch (error) {
          console.error('Error deleting HOA:', error)
        }
      }
    },
    exportCSV() {
      const headers = ['HOA Name', 'Status', 'City', 'Province']
      const rows = this.filteredHOAs.map(h => [h.hoa_name, h.status, h.city_municipality, h.province])
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'hoa_registry.csv'
      a.click()
    },
    importCSV(event) {
      const file = event.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        alert('CSV import functionality would be implemented here')
      }
      reader.readAsText(file)
    }
  }
}
</script>


