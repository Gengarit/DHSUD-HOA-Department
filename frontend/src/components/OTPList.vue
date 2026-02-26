<template>
  <div>
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px">
      <h1 style="font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px 0">📋 Order to Post</h1>
      <p style="color: #fef3c7; margin: 0; font-size: 14px">Maintenance Reports (MR) Tracking</p>
    </div>

    <div style="background: #0f172a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); border: 1px solid #1e293b">
      <table v-if="otps.length > 0" style="width: 100%; border-collapse: collapse">
        <thead>
          <tr style="background: linear-gradient(135deg, #92400e 0%, #78350f 100%); border-bottom: 2px solid #1e293b">
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #fcd34d; text-transform: uppercase">OTP No</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #fcd34d; text-transform: uppercase">Status</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #fcd34d; text-transform: uppercase">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="otp in otps" :key="otp.id" style="border-bottom: 1px solid #1e293b">
            <td style="padding: 16px 20px; color: #cbd5e1">{{ otp.otp_number }}</td>
            <td style="padding: 16px 20px">
              <span style="padding: 4px 8px; background: rgba(34, 197, 94, 0.2); color: #86efac; border-radius: 4px; font-size: 11px; font-weight: 700">{{ otp.mr_status }}</span>
            </td>
            <td style="padding: 16px 20px; color: #cbd5e1">{{ otp.date_issued }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else style="padding: 64px 32px; text-align: center; color: #475569">
        <p style="font-size: 18px">📋 No OTP records found</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return { otps: [] }
  },
  mounted() {
    this.loadOTPs()
  },
  methods: {
    async loadOTPs() {
      try {
        const res = await api.get('/otp/')
        this.otps = res.data.results || res.data || []
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}
</script>


