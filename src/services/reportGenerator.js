const LAYER_NAMES = ['GPIO', 'ADC', 'PWM', 'UART', 'SPI', 'I2C', 'WiFi', 'BLE', 'Power']

export function generateReportHTML({ componentType, modelName, serial, category, result, testDataFile }) {
  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const reportId = `EGR-${Date.now().toString(36).toUpperCase()}`

  const gradeColor = result.grade === 'A' ? '#16a34a' : result.grade === 'B' ? '#111827' : result.grade === 'C' ? '#6b7280' : '#d1d5db'
  const gradeBg = result.grade === 'A' ? '#f0fdf4' : result.grade === 'B' ? '#f9fafb' : result.grade === 'C' ? '#f9fafb' : '#fef2f2'

  const layerRows = LAYER_NAMES.map((name) => {
    const working = result.layers[name]
    const cap = result.capabilityMatrix?.find((c) => c.feature === name)
    const status = cap?.status || (working ? 'Working' : 'N/A')
    const notes = cap?.notes || '—'
    const dot = status === 'Working' ? '#16a34a' : status === 'Degraded' ? '#f59e0b' : status === 'Failed' ? '#ef4444' : '#d1d5db'
    return `<tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;font-weight:500;color:#111827">${name}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dot};margin-right:8px;vertical-align:middle"></span>${status}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;color:#6b7280">${notes}</td>
    </tr>`
  }).join('')

  const useCaseTags = (result.useCases || []).map((u) =>
    `<span style="display:inline-block;background:#111827;color:#fff;padding:4px 12px;border-radius:8px;font-size:12px;font-weight:500;margin:3px 4px 3px 0">${u}</span>`
  ).join('')

  const riskItems = (result.risks || []).map((r) =>
    `<li style="padding:4px 0;color:#4b5563">${r}</li>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>E-Grade Report — ${componentType}</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Bricolage Grotesque',system-ui,sans-serif; color:#111827; background:#fff; font-size:14px; line-height:1.6; }
  .page { max-width:800px; margin:0 auto; padding:48px 40px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:32px; border-bottom:2px solid #111827; margin-bottom:32px; }
  .logo { font-size:24px; font-weight:700; letter-spacing:-0.5px; }
  .logo span { color:#16a34a; }
  .meta { text-align:right; font-size:12px; color:#6b7280; }
  .meta strong { color:#111827; display:block; font-size:14px; }
  .title { font-size:28px; font-weight:700; margin-bottom:4px; }
  .subtitle { color:#6b7280; font-size:15px; margin-bottom:32px; }
  .grade-bar { display:flex; gap:16px; margin-bottom:32px; }
  .grade-card { flex:1; border-radius:12px; padding:20px; text-align:center; border:1px solid #e5e7eb; }
  .grade-card.primary { background:${gradeBg}; border-color:${gradeColor}30; }
  .grade-card .value { font-size:32px; font-weight:700; }
  .grade-card .label { font-size:11px; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-top:2px; }
  .section { margin-bottom:28px; }
  .section-title { font-size:16px; font-weight:700; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #f3f4f6; }
  .summary-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:16px 20px; margin-bottom:28px; color:#374151; line-height:1.7; }
  table { width:100%; border-collapse:collapse; }
  thead th { text-align:left; padding:10px 16px; background:#f9fafb; font-size:12px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.3px; }
  .rec-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:20px; line-height:1.8; color:#374151; }
  .rec-box .disclaimer { margin-top:12px; padding-top:12px; border-top:1px solid #e5e7eb; font-size:12px; color:#9ca3af; font-style:italic; }
  .footer { margin-top:40px; padding-top:24px; border-top:2px solid #111827; display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#9ca3af; }
  .footer .brand { font-weight:700; color:#111827; font-size:13px; }
  .eco-badge { display:inline-flex; align-items:center; gap:6px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:6px 12px; font-size:12px; color:#16a34a; font-weight:600; }
  @media print { .page { padding:24px; } }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div>
      <div class="logo">E<span>-</span>Grade</div>
      <div style="font-size:12px;color:#6b7280;margin-top:2px">Electronic Asset Recovery & Circular Exchange</div>
    </div>
    <div class="meta">
      <strong>Diagnostic Report</strong>
      ${reportId}<br>${date} · ${time}
    </div>
  </div>

  <div class="title">${componentType}${modelName ? ` — ${modelName}` : ''}</div>
  <div class="subtitle">
    Category: ${category || '—'} · Serial: ${serial || '—'}${testDataFile ? ` · Data: ${testDataFile}` : ''}
    ${result.geminiPowered ? ' · <span style="background:#111827;color:#fff;padding:2px 8px;border-radius:6px;font-size:11px">Gemini AI</span>' : ''}
  </div>

  <div class="grade-bar">
    <div class="grade-card primary">
      <div class="value" style="color:${gradeColor}">${result.grade}</div>
      <div class="label">Grade</div>
    </div>
    <div class="grade-card">
      <div class="value">${result.reusability}%</div>
      <div class="label">Reusability</div>
    </div>
    <div class="grade-card">
      <div class="value" style="color:#16a34a">${result.co2Saved || '—'}</div>
      <div class="label">CO₂ Saved</div>
    </div>
    <div class="grade-card">
      <div class="value">${result.estimatedValue || '—'}</div>
      <div class="label">Est. Value</div>
    </div>
  </div>

  ${result.summary ? `<div class="summary-box">${result.summary}</div>` : ''}

  <div class="section">
    <div class="section-title">Layer-by-Layer Analysis</div>
    <table>
      <thead><tr><th>Layer</th><th>Status</th><th>Notes</th></tr></thead>
      <tbody>${layerRows}</tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Approved Use Cases</div>
    <div style="padding:4px 0">${useCaseTags || '<span style="color:#9ca3af">None identified</span>'}</div>
  </div>

  ${riskItems ? `<div class="section">
    <div class="section-title">Risk Factors</div>
    <ul style="padding-left:20px;font-size:13px">${riskItems}</ul>
  </div>` : ''}

  <div class="section">
    <div class="section-title">Recommendation</div>
    <div class="rec-box">
      ${(result.recommendation || '').replace(
        /Disclaimer:.*/s,
        (match) => `<div class="disclaimer">${match}</div>`
      ) || 'No recommendation available.'}
    </div>
  </div>

  <div style="margin-top:24px;text-align:center">
    <div class="eco-badge">
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#16a34a" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      By reusing this component, ~${result.co2Saved || '0.3 kg'} CO₂ emissions were prevented
    </div>
  </div>

  <div class="footer">
    <div class="brand">E-Grade</div>
    <div>Report ${reportId} · Generated ${date} · This is an automated assessment</div>
  </div>

</div>
</body>
</html>`
}

export function downloadReport(params) {
  const html = generateReportHTML(params)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `E-Grade-Report-${(params.componentType || 'component').replace(/\s+/g, '-')}-${Date.now()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
