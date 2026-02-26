<template>
  <div style="max-width: 1400px; margin: 0 auto">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px; border-radius: 12px; margin-bottom: 32px">
      <h1 style="font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px 0">📋 Notices of Violation</h1>
      <p style="color: #fee2e2; margin: 0; font-size: 14px">Track all issued violation notices with complete details</p>
    </div>

    <!-- Search & Filter -->
    <div style="margin-bottom: 24px; display: flex; gap: 12px">
      <input v-model="searchQuery" type="text" placeholder="🔍 Search by control number or HOA name..." style="flex: 1; padding: 12px 16px; border: 1px solid #334155; border-radius: 8px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none; transition: all 0.3s" @focus="$event.target.style.borderColor = '#dc2626'; $event.target.style.boxShadow = 'inset 0 0 0 2px rgba(220, 38, 38, 0.2)'" @blur="$event.target.style.borderColor = '#334155'; $event.target.style.boxShadow = 'none'">
      <button @click="exportCSV" style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s" @mouseenter="$event.currentTarget.style.transform = 'translateY(-2px)'" @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'">
        📥 Export
      </button>
    </div>

    <!-- NOV List -->
    <div v-if="filteredNOVs.length > 0" style="display: grid; grid-template-columns: 1fr; gap: 16px">
      <div v-for="nov in filteredNOVs" :key="nov.id" style="background: #0f172a; border-radius: 12px; padding: 24px; border-left: 4px solid #dc2626; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); transition: all 0.3s" @mouseenter="$event.currentTarget.style.transform = 'translateY(-4px)'; $event.currentTarget.style.boxShadow = '0 15px 40px rgba(220, 38, 38, 0.2)'" @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'; $event.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)'">
        <!-- Header Row -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px">
          <div>
            <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; margin: 0 0 6px 0">Control Number</p>
            <p style="color: #fca5a5; font-size: 20px; font-weight: 700; margin: 0">{{ nov.control_no }}</p>
          </div>
          <div style="display: flex; gap: 8px">
            <button @click="viewDetails(nov)" style="background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s" @mouseenter="$event.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)'" @mouseleave="$event.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'">
              👁️ View
            </button>
            <button @click="deleteNOV(nov.id)" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s" @mouseenter="$event.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'" @mouseleave="$event.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'">
              🗑️ Delete
            </button>
          </div>
        </div>

        <!-- Details Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px">
          <div style="background: rgba(15, 23, 42, 0.5); padding: 12px; border-radius: 8px">
            <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; margin: 0 0 6px 0">HOA Name</p>
            <p style="color: #cbd5e1; font-weight: 600; margin: 0">{{ nov.hoa_profile || 'N/A' }}</p>
          </div>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 12px; border-radius: 8px">
            <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; margin: 0 0 6px 0">Date Issued</p>
            <p style="color: #cbd5e1; font-weight: 600; margin: 0">{{ formatDate(nov.date_issued) }}</p>
          </div>
          <div style="background: rgba(15, 23, 42, 0.5); padding: 12px; border-radius: 8px">
            <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; margin: 0 0 6px 0">Evaluator</p>
            <p style="color: #cbd5e1; font-weight: 600; margin: 0">{{ nov.evaluator_name || 'N/A' }}</p>
          </div>
        </div>

        <!-- Violations Section -->
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(71, 85, 105, 0.3)">
          <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; margin: 0 0 12px 0">Violations</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <span v-if="nov.violation_section_64" style="padding: 6px 12px; background: rgba(239, 68, 68, 0.2); color: #fca5a5; border-radius: 6px; font-size: 12px; font-weight: 700">🚩 Section 64</span>
            <span v-if="nov.violation_section_101" style="padding: 6px 12px; background: rgba(239, 68, 68, 0.2); color: #fca5a5; border-radius: 6px; font-size: 12px; font-weight: 700">🚩 Section 101</span>
            <span v-if="nov.violation_section_62" style="padding: 6px 12px; background: rgba(239, 68, 68, 0.2); color: #fca5a5; border-radius: 6px; font-size: 12px; font-weight: 700">🚩 Section 62</span>
            <span v-if="!nov.violation_section_64 && !nov.violation_section_101 && !nov.violation_section_62" style="padding: 6px 12px; background: rgba(107, 114, 128, 0.2); color: #9ca3af; border-radius: 6px; font-size: 12px; font-weight: 700">No violations recorded</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else style="padding: 80px 40px; text-align: center; background: #0f172a; border-radius: 12px; border: 2px dashed #1e293b">
      <p style="font-size: 48px; margin: 0 0 16px 0">📋</p>
      <p style="font-size: 20px; font-weight: 700; color: #cbd5e1; margin: 0 0 8px 0">No Violations Found</p>
      <p style="color: #94a3b8; margin: 0; font-size: 14px">There are no notice of violations matching your search criteria</p>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return { novs: [], searchQuery: '' }
  },
  computed: {
    filteredNOVs() {
      return this.novs.filter(nov =>
        nov.control_no.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (nov.hoa_profile && nov.hoa_profile.toLowerCase().includes(this.searchQuery.toLowerCase()))
      )
    }
  },
  mounted() {
    this.loadNOVs()
  },
  methods: {
    async loadNOVs() {
      try {
        const res = await api.get('/nov/')
        this.novs = res.data.results || res.data || []
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async deleteNOV(id) {
      if (!confirm('Are you sure you want to delete this violation notice?')) return
      try {
        await api.delete(`/nov/${id}/`)
        this.loadNOVs()
      } catch (error) {
        console.error('Error:', error)
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    viewDetails(nov) {
      this.$router.push({ name: 'NOVDetails', params: { id: nov.id } })
    },
    exportCSV() {
      if (this.filteredNOVs.length === 0) {
        alert('No NOVs to export')
        return
      }

      const headers = ['Control No', 'HOA Name', 'Date Issued', 'Evaluator', 'Section 64', 'Section 101', 'Section 62']
      const rows = this.filteredNOVs.map(nov => [
        nov.control_no,
        nov.hoa_profile || 'N/A',
        this.formatDate(nov.date_issued),
        nov.evaluator_name || 'N/A',
        nov.violation_section_64 ? 'Yes' : 'No',
        nov.violation_section_101 ? 'Yes' : 'No',
        nov.violation_section_62 ? 'Yes' : 'No'
      ])

      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += headers.join(',') + '\n'
      csvContent += rows.map(row => row.join(',')).join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'notices_of_violation.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

