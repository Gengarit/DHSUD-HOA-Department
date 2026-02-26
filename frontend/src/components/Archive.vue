<template>
  <div>
    <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px">
      <h1 style="font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px 0">📦 Archive</h1>
      <p style="color: #e2e8f0; margin: 0; font-size: 14px">Manage archived and deleted records</p>
    </div>

    <div style="background: #0f172a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); border: 1px solid #1e293b">
      <table v-if="archived.length > 0" style="width: 100%; border-collapse: collapse">
        <thead>
          <tr style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); border-bottom: 2px solid #1e293b">
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #cbd5e1; text-transform: uppercase">Type</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #cbd5e1; text-transform: uppercase">Item</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #cbd5e1; text-transform: uppercase">Archived Date</th>
            <th style="padding: 16px 20px; text-align: left; font-size: 13px; font-weight: 700; color: #cbd5e1; text-transform: uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in archived" :key="item.id" style="border-bottom: 1px solid #1e293b; transition: background 0.2s" @mouseenter="$event.currentTarget.style.background = '#1e293b'" @mouseleave="$event.currentTarget.style.background = 'transparent'">
            <td style="padding: 16px 20px">
              <span style="padding: 4px 8px; background: rgba(65, 105, 225, 0.2); color: #a5b4fc; border-radius: 4px; font-size: 11px; font-weight: 700">{{ item.item_type }}</span>
            </td>
            <td style="padding: 16px 20px; color: #cbd5e1">{{ item.item_name }}</td>
            <td style="padding: 16px 20px; color: #cbd5e1">{{ item.archived_date }}</td>
            <td style="padding: 16px 20px; display: flex; gap: 8px">
              <button @click="restoreItem(item.id)" style="color: #60a5fa; background: rgba(59, 130, 246, 0.1); border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s" @mouseenter="$event.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'" @mouseleave="$event.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'">
                ↩️ Restore
              </button>
              <button @click="permanentDelete(item.id)" style="color: #f87171; background: rgba(239, 68, 68, 0.1); border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s" @mouseenter="$event.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'" @mouseleave="$event.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'">
                🗑️ Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else style="padding: 64px 32px; text-align: center; color: #475569">
        <p style="font-size: 18px; margin: 0">📦 Archive is empty</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      archived: [
        { id: 1, item_type: 'HOA', item_name: 'Old Community Group', archived_date: '2026-01-15' },
        { id: 2, item_type: 'NOV', item_name: 'NOV-2025-001', archived_date: '2026-01-20' }
      ]
    }
  },
  methods: {
    restoreItem(id) {
      this.archived = this.archived.filter(item => item.id !== id)
      alert('Item restored successfully')
    },
    permanentDelete(id) {
      if (!confirm('Permanently delete? This cannot be undone.')) return
      this.archived = this.archived.filter(item => item.id !== id)
      alert('Item permanently deleted')
    }
  }
}
</script>

