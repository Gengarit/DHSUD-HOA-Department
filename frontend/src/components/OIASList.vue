<template>
  <div>
    <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px">
      <h1 style="font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px 0">📋 Order to Impose Sanctions</h1>
      <p style="color: #cffafe; margin: 0; font-size: 14px">Administrative Sanctions Tracking</p>
    </div>

    <div style="background: #0f172a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); border: 1px solid #1e293b">
      <table v-if="oias.length > 0" style="width: 100%; border-collapse: collapse">
        <thead>
          <tr style="background: linear-gradient(135deg, #164e63 0%, #0e4a5d 100%); border-bottom: 2px solid #1e293b">
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #67e8f9; text-transform: uppercase">OIAS No</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #67e8f9; text-transform: uppercase">Penalty</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #67e8f9; text-transform: uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in oias" :key="item.id" style="border-bottom: 1px solid #1e293b">
            <td style="padding: 16px 20px; color: #cbd5e1">{{ item.oias_number }}</td>
            <td style="padding: 16px 20px; color: #cbd5e1">{{ item.penalty_amount }}</td>
            <td style="padding: 16px 20px">
              <span style="padding: 4px 8px; background: rgba(34, 197, 94, 0.2); color: #86efac; border-radius: 4px; font-size: 11px; font-weight: 700">{{ item.mr_status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else style="padding: 64px 32px; text-align: center; color: #475569">
        <p style="font-size: 18px">📋 No OIAS records found</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return { oias: [] }
  },
  mounted() {
    this.loadOIAS()
  },
  methods: {
    async loadOIAS() {
      try {
        const res = await api.get('/oias/')
        this.oias = res.data.results || res.data || []
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}
</script>


