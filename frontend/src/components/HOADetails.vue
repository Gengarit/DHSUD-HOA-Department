<template>
  <div v-if="hoa" style="max-width: 1400px; margin: 0 auto; background: #f3f4f6; min-height: 100vh; padding-bottom: 40px">
    <!-- Header -->
    <div style="background: #fff; box-shadow: 0 4px 24px rgba(59,130,246,0.08); border-radius: 18px; padding: 40px 32px 32px 32px; margin-bottom: 36px; display: flex; justify-content: space-between; align-items: start; border: 1px solid #e5e7eb">
      <div>
        <h1 style="font-size: 34px; font-weight: 900; color: #1e3a8a; margin: 0 0 8px 0; letter-spacing: -1px">{{ hoa.hoa_name }}</h1>
        <p style="color: #64748b; margin: 0; font-size: 15px">Certificate: {{ hoa.cert_of_inc_no }}</p>
      </div>
      <span style="padding: 12px 28px; border-radius: 999px; font-size: 14px; font-weight: 800; text-transform: uppercase; background: #f1f5f9; color: #2563eb; border: 1px solid #e0e7ff; letter-spacing: 1px">
        {{ formatStatus(hoa.status) }}
      </span>
    </div>

    <!-- Detailed Sections -->
    <div style="display: grid; grid-template-columns: 1fr; gap: 28px; margin-bottom: 28px">
      <!-- Basic Information -->
      <div style="background: #fff; border-radius: 14px; padding: 28px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(59,130,246,0.04)">
        <h2 style="font-size: 19px; font-weight: 800; color: #2563eb; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">📋</span> Basic Information
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px">
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">HOA Name</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.hoa_name }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Cert of Inc No</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.cert_of_inc_no }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Registration Type</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.reg_type || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Issuance Date</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.issuance_date || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Classification</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.classification || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div style="background: #fff; border-radius: 14px; padding: 28px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(59,130,246,0.04)">
        <h2 style="font-size: 19px; font-weight: 800; color: #2563eb; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">📍</span> Location
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px">
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Barangay</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.barangay || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">City/Municipality</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.city_municipality }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Province</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.province }}</p>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background: #fff; border-radius: 14px; padding: 28px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(59,130,246,0.04)">
        <h2 style="font-size: 19px; font-weight: 800; color: #2563eb; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">📞</span> Contact Information
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px">
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Contact Person</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.contact_person }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Contact Details</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.contact_details }}</p>
          </div>
        </div>
      </div>

      <!-- Governance -->
      <div style="background: #fff; border-radius: 14px; padding: 28px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(59,130,246,0.04)">
        <h2 style="font-size: 19px; font-weight: 800; color: #2563eb; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">👥</span> Governance
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px">
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Total Members</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.total_members || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Date of Election</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.date_of_election || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Term of Office</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.term_of_office ? hoa.term_of_office + ' years' : 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Legal/Monitoring -->
      <div style="background: #fff; border-radius: 14px; padding: 28px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(59,130,246,0.04)">
        <h2 style="font-size: 19px; font-weight: 800; color: #2563eb; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">⚖️</span> Legal/Monitoring
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px">
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Latest Legal Order</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.latest_legal_order || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Order Date Issued</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.order_date_issued || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Status/Findings</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.status_findings || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Compliance Reports</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.compliance_reports || 'N/A' }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Evaluator Name</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ hoa.evaluator_name || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- Violations -->
      <div v-if="hasViolations" style="background: #fff; border-radius: 14px; padding: 28px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(239,68,68,0.04)">
        <h2 style="font-size: 19px; font-weight: 800; color: #dc2626; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">⚠️</span> Violations
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 12px">
          <span v-if="hoa.violation_section_64" style="padding: 8px 16px; background: #fee2e2; color: #dc2626; border-radius: 6px; font-size: 13px; font-weight: 700">🚩 Section 64</span>
          <span v-if="hoa.violation_section_101" style="padding: 8px 16px; background: #fee2e2; color: #dc2626; border-radius: 6px; font-size: 13px; font-weight: 700">🚩 Section 101</span>
          <span v-if="hoa.violation_section_62" style="padding: 8px 16px; background: #fee2e2; color: #dc2626; border-radius: 6px; font-size: 13px; font-weight: 700">🚩 Section 62</span>
        </div>
      </div>

      <!-- Quick Stats -->
      <div style="background: #fff; border-radius: 14px; padding: 28px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(59,130,246,0.04)">
        <h2 style="font-size: 19px; font-weight: 800; color: #2563eb; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">📊</span> System Information
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px">
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">ID</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">#{{ hoa.id }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Current Status</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ formatStatus(hoa.status) }}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase">Date Created</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0">{{ formatDate(hoa.date_created) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div style="display: flex; gap: 14px; padding: 32px 0 0 0">
      <router-link to="/hoa-registry" style="background: #f1f5f9; color: #2563eb; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 15px; border: 1px solid #e0e7ff; cursor: pointer; transition: all 0.3s; box-shadow: 0 1px 4px rgba(59,130,246,0.04)" @mouseenter="$event.currentTarget.style.background = '#e0e7ff'; $event.currentTarget.style.transform = 'translateY(-2px)'" @mouseleave="$event.currentTarget.style.background = '#f1f5f9'; $event.currentTarget.style.transform = 'translateY(0)'">
        ← Back to Registry
      </router-link>
      <button style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 13px 28px; border-radius: 8px; border: none; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.3s; box-shadow: 0 1px 4px rgba(59,130,246,0.04)" @click="editHOA" @mouseenter="$event.currentTarget.style.transform = 'translateY(-2px)'" @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'">
        ✏️ Edit Profile
      </button>
    </div>
  </div>
  <div v-else style="padding: 64px 32px; text-align: center; color: #64748b">
    <p style="font-size: 18px; margin: 0">⏳ Loading...</p>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return { hoa: null }
  },
  computed: {
    hasViolations() {
      return this.hoa && (this.hoa.violation_section_64 || this.hoa.violation_section_101 || this.hoa.violation_section_62)
    }
  },
  mounted() {
    this.loadHOA()
  },
  methods: {
    async loadHOA() {
      try {
        const id = this.$route.params.id
        const res = await api.get(`/hoa-profiles/${id}/`)
        this.hoa = res.data
      } catch (error) {
        console.error('Error loading HOA:', error)
      }
    },
    getStatusStyle(status) {
      const styles = {
        active: { background: 'rgba(34, 197, 94, 0.2)', color: '#86efac' },
        pending: { background: 'rgba(217, 119, 6, 0.2)', color: '#facc15' },
        default: { background: 'rgba(71, 85, 105, 0.2)', color: '#cbd5e1' }
      }
      return styles[status] || styles.default
    },
    getStatusColor(status) {
      const colors = {
        active: '#10b981',
        suspended: '#f59e0b',
        pending: '#f59e0b',
        'no_legal_standing': '#ef4444',
        dissolved: '#6b7280',
        revoked: '#dc2626',
        'term_expired': '#8b5cf6',
        default: '#64748b'
      }
      return colors[status] || colors.default
    },
    formatStatus(status) {
      return status.replace(/_/g, ' ').toUpperCase()
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    editHOA() {
      this.$router.push(`/hoa/edit/${this.hoa.id}`)
    }
  }
}
</script>


