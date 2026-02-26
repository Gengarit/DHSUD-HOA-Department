<template>
  <div style="max-width: 1200px; margin: 0 auto; background: #f3f4f6; min-height: 100vh; padding-bottom: 40px; padding-top: 40px">
    <!-- Header -->
    <div style="background: #fff; box-shadow: 0 8px 32px rgba(59,130,246,0.10); border-radius: 22px; padding: 48px 40px 36px 40px; margin-bottom: 40px; border: 1px solid #e5e7eb">
      <h2 style="font-size: 32px; font-weight: 800; color: #1e3a8a; margin: 0 0 8px 0; letter-spacing: -1px">➕ Add New HOA Profile</h2>
      <p style="color: #64748b; margin: 0; font-size: 15px">Complete all required fields (*) to register a new HOA</p>
    </div>
    <form @submit.prevent="submitForm" style="display: grid; grid-template-columns: 1fr; gap: 24px">
      <!-- Basic Information -->
      <div style="background: #fff; border-radius: 18px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(59,130,246,0.06); margin-bottom: 24px">
        <h3 style="font-size: 18px; font-weight: 700; color: #60a5fa; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">📋</span> Basic Information
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px">HOA Name *</label>
            <input v-model="form.hoa_name" type="text" required placeholder="Enter HOA name" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f8fafc; color: #1e293b; font-size: 15px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#d1d5db'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px">Cert of Incorporation No *</label>
            <input v-model="form.cert_of_incorp_no" type="text" required placeholder="Cert number" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f8fafc; color: #1e293b; font-size: 15px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#d1d5db'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px">Registration Type *</label>
            <select v-model="form.registration_type" required style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f8fafc; color: #1e293b; font-size: 15px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#d1d5db'">
              <option value="">Select Type</option>
              <option value="SEC">SEC</option>
              <option value="HIGC">HIGC</option>
              <option value="HLURB">HLURB</option>
              <option value="DHSUD">DHSUD</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px">Issuance Date *</label>
            <input v-model="form.date_of_issuance" type="date" required style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f8fafc; color: #1e293b; font-size: 15px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#d1d5db'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px">Classification *</label>
            <select v-model="form.classification" required style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f8fafc; color: #1e293b; font-size: 15px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#d1d5db'">
              <option value="">Select Classification</option>
              <option value="REGULAR">Regular</option>
              <option value="NON-REGULAR">Non-Regular</option>
              <option value="GOVT ASSISTED">Govt Assisted</option>
              <option value="NEIGHBORHOOD">Neighborhood</option>
              <option value="FEDERATION">Federation</option>
              <option value="CONFEDERATION">Confederation</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div style="background: #fff; border-radius: 18px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(59,130,246,0.06); margin-bottom: 24px">
        <h3 style="font-size: 18px; font-weight: 700; color: #60a5fa; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">📍</span> Location
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px">Barangay *</label>
            <input v-model="form.barangay" type="text" required placeholder="Barangay name" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f8fafc; color: #1e293b; font-size: 15px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#d1d5db'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px">City/Municipality *</label>
            <select v-model="form.city_municipality" required style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f8fafc; color: #1e293b; font-size: 15px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#d1d5db'">
              <option value="">Select City/Municipality</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px">Province *</label>
            <select v-model="form.province" required style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #f8fafc; color: #1e293b; font-size: 15px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#d1d5db'">
              <option value="">Select Province</option>
              <option value="Negros Occidental">Negros Occidental</option>
              <option value="Negros Oriental">Negros Oriental</option>
              <option value="Siquijor">Siquijor</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background: #fff; border-radius: 18px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(59,130,246,0.06); margin-bottom: 24px">
        <h3 style="font-size: 18px; font-weight: 700; color: #60a5fa; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">📞</span> Contact Information
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Contact Person *</label>
            <input v-model="form.contact_person" type="text" required placeholder="Full name" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Contact Details *</label>
            <input v-model="form.contact_details" type="text" required placeholder="Phone/Email" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
        </div>
      </div>

      <!-- Governance -->
      <div style="background: #fff; border-radius: 18px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(59,130,246,0.06); margin-bottom: 24px">
        <h3 style="font-size: 18px; font-weight: 700; color: #60a5fa; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">👥</span> Governance
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Total Members *</label>
            <input v-model.number="form.total_members" type="number" required placeholder="Number of members" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Date of Election *</label>
            <input v-model="form.date_of_election" type="date" required style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Term of Office (years) *</label>
            <input v-model.number="form.term_of_office" type="number" required placeholder="e.g., 3" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
        </div>
      </div>

      <!-- Legal/Monitoring -->
      <div style="background: #fff; border-radius: 18px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 16px rgba(59,130,246,0.06); margin-bottom: 24px">
        <h3 style="font-size: 18px; font-weight: 700; color: #60a5fa; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">⚖️</span> Legal/Monitoring
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Latest Legal Order</label>
            <input v-model="form.latest_legal_order" type="text" placeholder="Order number/reference" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Order Date Issued</label>
            <input v-model="form.order_date_issued" type="date" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Status/Findings</label>
            <input v-model="form.status_findings" type="text" placeholder="Current status" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Compliance Reports</label>
            <input v-model="form.compliance_reports" type="text" placeholder="Latest report" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
          <div style="grid-column: 1 / -1">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Evaluator Name</label>
            <input v-model="form.evaluator_name" type="text" placeholder="Evaluator's name" style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
          </div>
        </div>
      </div>

      <!-- Status & Violations -->
      <div style="background: #0f172a; border-radius: 12px; padding: 24px; border: 1px solid #1e293b">
        <h3 style="font-size: 18px; font-weight: 700; color: #60a5fa; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px">
          <span style="font-size: 20px">📊</span> Status & Violations
        </h3>
        <div style="margin-bottom: 24px">
          <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px">Status *</label>
          <select v-model="form.status" required style="width: 100%; padding: 10px 12px; border: 1px solid #334155; border-radius: 6px; background: #1e293b; color: #e2e8f0; font-size: 14px; outline: none" @focus="$event.target.style.borderColor = '#3b82f6'" @blur="$event.target.style.borderColor = '#334155'">
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="no_legal_standing">No Legal Standing</option>
            <option value="dissolved">Dissolved</option>
            <option value="revoked">Revoked</option>
            <option value="term_expired">Term Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <p style="font-size: 13px; font-weight: 600; color: #cbd5e1; margin: 0 0 12px 0">Mark Violations:</p>
          <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; margin-bottom: 8px">
            <input v-model="form.violation_section_64" type="checkbox" style="width: 16px; height: 16px; cursor: pointer">
            <span style="margin-left: 12px; color: #cbd5e1; font-size: 14px">Section 64 Violation</span>
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; margin-bottom: 8px">
            <input v-model="form.violation_section_101" type="checkbox" style="width: 16px; height: 16px; cursor: pointer">
            <span style="margin-left: 12px; color: #cbd5e1; font-size: 14px">Section 101 Violation</span>
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; padding: 8px">
            <input v-model="form.violation_section_62" type="checkbox" style="width: 16px; height: 16px; cursor: pointer">
            <span style="margin-left: 12px; color: #cbd5e1; font-size: 14px">Section 62 Violation</span>
          </label>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div style="display: flex; gap: 22px; padding-top: 24px; justify-content: flex-end;">
        <button type="submit" style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 15px 44px; border-radius: 10px; border: none; font-weight: 900; font-size: 17px; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(59,130,246,0.10)" @mouseenter="$event.currentTarget.style.transform = 'translateY(-2px)'" @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'">
          ✅ Submit & Register
        </button>
        <router-link to="/hoa-registry" style="background: #f1f5f9; color: #2563eb; padding: 15px 44px; border-radius: 10px; text-decoration: none; font-weight: 900; font-size: 17px; border: 1.5px solid #e0e7ff; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(59,130,246,0.06)" @mouseenter="$event.currentTarget.style.background = '#e0e7ff'" @mouseleave="$event.currentTarget.style.background = '#f1f5f9'">
          ❌ Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      form: {
        hoa_name: '',
        cert_of_incorp_no: '',
        registration_type: '',
        date_of_issuance: '',
        classification: '',
        barangay: '',
        city_municipality: '',
        province: '',
        contact_person: '',
        contact_details: '',
        total_members: null,
        date_of_election: '',
        term_of_office: '',
        latest_legal_order: '',
        order_date_issued: '',
        status_findings: '',
        compliance_reports: '',
        evaluator_name: '',
        status: 'Pending',
        violation_section_64: false,
        violation_section_101: false,
        violation_section_62: false,
        is_archived: false
      },
      cities: [
        // Negros Occidental
        'Bacolod City', 'Bago City', 'Cadiz City', 'Escalante City', 'Himamaylan City', 'Kabankalan City', 'La Carlota City', 'Sagay City', 'San Carlos City', 'Silay City', 'Sipalay City', 'Talisay City', 'Victorias City', 'Binalbagan', 'Calatrava', 'Candoni', 'Cauayan', 'Enrique B. Magalona', 'Hinigaran', 'Hinoba-an', 'Ilog', 'Isabela', 'La Castellana', 'Manapla', 'Moises Padilla', 'Murcia', 'Pontevedra', 'Pulupandan', 'Salvador Benedicto', 'San Enrique', 'Toboso', 'Valladolid', 'EB Magalona',
        // Negros Oriental
        'Bais City', 'Bayawan City', 'Canlaon City', 'Dumaguete City', 'Guihulngan City', 'Tanjay City', 'Bacong', 'Amlan', 'Ayungon', 'Bindoy', 'Dauin', 'Jimalalud', 'La Libertad', 'Mabinay', 'Manjuyod', 'Pamplona', 'San Jose', 'Santa Catalina', 'Siaton', 'Sibulan', 'Tayasan', 'Valencia', 'Vallehermoso', 'Zamboanguita',
        // Siquijor
        'Enrique Villanueva', 'Larena', 'Lazi', 'Maria', 'San Juan', 'Siquijor'
      ]
    }
  },
  methods: {
    async submitForm() {
      try {
        await api.post('/hoa-profiles/', this.form)
        alert('HOA added successfully!')
        this.$router.push('/hoa-registry')
      } catch (error) {
        console.error('Error:', error)
        alert('Error adding HOA: ' + (error.response?.data?.detail || error.message))
      }
    }
  }
}
</script>
