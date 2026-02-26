<template>
  <div>
    <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px">
      <h1 style="font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px 0">⚖️ Sanctions by Severity</h1>
      <p style="color: #e2e8f0; margin: 0; font-size: 14px">6-Level Severity Classification System</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px">
      <div v-for="sanction in sanctions" :key="sanction.id" style="border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); border-bottom: 4px solid rgba(0, 0, 0, 0.2)" :style="getSanctionStyle(sanction.severity_level)">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px">
          <h3 style="font-size: 18px; font-weight: 700; margin: 0; color: currentColor">{{ sanction.violation_type }}</h3>
          <span style="padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase" :style="getSeverityBadgeStyle(sanction.severity_level)">
            Level {{ sanction.severity_level }}
          </span>
        </div>
        <p style="color: currentColor; margin: 0 0 12px 0; opacity: 0.9">HOA: {{ sanction.hoa_profile }}</p>
        <p style="color: currentColor; margin: 0; font-size: 13px; opacity: 0.8">{{ sanction.description }}</p>
      </div>
    </div>

    <div v-if="sanctions.length === 0" style="padding: 64px 32px; text-align: center; color: #475569; background: #0f172a; border-radius: 12px">
      <p style="font-size: 18px; margin: 0">⚖️ No sanctions found</p>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return { sanctions: [] }
  },
  mounted() {
    this.loadSanctions()
  },
  methods: {
    async loadSanctions() {
      try {
        const res = await api.get('/sanctions/')
        this.sanctions = res.data.results || res.data || []
      } catch (error) {
        console.error('Error:', error)
      }
    },
    getSanctionStyle(severity) {
      const styles = {
        1: { background: 'rgba(250, 204, 21, 0.1)', color: '#ffffff' },
        2: { background: 'rgba(251, 146, 60, 0.1)', color: '#ffffff' },
        3: { background: 'rgba(248, 113, 113, 0.1)', color: '#ffffff' },
        4: { background: 'rgba(239, 68, 68, 0.1)', color: '#ffffff' },
        5: { background: 'rgba(220, 38, 38, 0.1)', color: '#ffffff' },
        6: { background: 'rgba(153, 27, 27, 0.1)', color: '#ffffff' }
      }
      return styles[severity] || styles[1]
    },
    getSeverityBadgeStyle(severity) {
      const badges = {
        1: { background: '#facc15', color: '#000000' },
        2: { background: '#fb923c', color: '#ffffff' },
        3: { background: '#f87171', color: '#ffffff' },
        4: { background: '#ef4444', color: '#ffffff' },
        5: { background: '#dc2626', color: '#ffffff' },
        6: { background: '#991b1b', color: '#ffffff' }
      }
      return badges[severity] || badges[1]
    }
  }
}
</script>


