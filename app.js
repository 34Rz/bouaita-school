// ===================== محرك التطبيق =====================
const content = document.getElementById('content');
const modalOverlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const toastEl = document.getElementById('toast');

let state = {
  page: 'dashboard',
  currentStudentId: STUDENTS[0].id,
  profileTab: 'info',
  paymentsMonth: 'شتنبر',
  chosenMapStudent: null
};
let charts = {};
let idSeq = 1000;

function todayStr(){ return "10/09/2026"; }

function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(()=>toastEl.classList.remove('show'), 2200);
}

function openModal(html){
  modalBox.innerHTML = html;
  modalOverlay.classList.add('open');
}
function closeModal(){
  modalOverlay.classList.remove('open');
  modalBox.innerHTML = '';
}
modalOverlay.addEventListener('click', (e)=>{ if(e.target === modalOverlay) closeModal(); });

function destroyChart(id){
  if(charts[id]){ charts[id].destroy(); delete charts[id]; }
}

function stars(rating, size){
  const full = Math.round(rating);
  let html = '';
  for(let i=1;i<=5;i++){
    html += `<span class="star ${i<=full?'on':''}">★</span>`;
  }
  return html;
}

function studentById(id){ return STUDENTS.find(s=>s.id === Number(id)); }

// ===================== التنقل =====================
document.getElementById('nav').addEventListener('click', (e)=>{
  const a = e.target.closest('a[data-page]');
  if(!a) return;
  goTo(a.dataset.page);
});
document.getElementById('burger').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('open');
});

function goTo(page, extra){
  state.page = page;
  if(extra) Object.assign(state, extra);
  document.querySelectorAll('#nav a').forEach(a=> a.classList.toggle('active', a.dataset.page === page));
  document.getElementById('sidebar').classList.remove('open');
  render();
  window.scrollTo(0,0);
}

function render(){
  const renderers = {
    dashboard: renderDashboard,
    students: renderStudents,
    studentProfile: renderStudentProfile,
    halaqat: renderHalaqat,
    memorization: renderMemorization,
    quranmap: renderQuranMap,
    attendance: renderAttendance,
    payments: renderPayments,
    notes: renderNotes,
    users: renderUsers,
    announcements: renderAnnouncements,
    reports: renderReports,
    settings: renderSettings
  };
  const fn = renderers[state.page] || renderDashboard;
  content.innerHTML = fn();
  bindPageEvents(state.page);
}

// ===================== لوحة التحكم =====================
function renderDashboard(){
  const unpaid = STUDENTS.length ? 11 : 0;
  return `
  <div class="page-head">
    <div class="page-date">📅 ${todayStr()}</div>
    <h1>لوحة التحكم 🧭</h1>
  </div>

  <div class="stat-grid">
    <div class="stat-card bg-red"><div class="deco"></div><div class="icon">⚠️</div><div class="num">11</div><div class="lbl">غير مدفوع</div></div>
    <div class="stat-card bg-orange"><div class="deco"></div><div class="icon">💰</div><div class="num">9</div><div class="lbl">أداء الشهر</div></div>
    <div class="stat-card bg-teal"><div class="deco"></div><div class="icon">✅</div><div class="num">0%</div><div class="lbl">الحضور اليوم</div></div>
    <div class="stat-card bg-purple"><div class="deco"></div><div class="icon">🧠</div><div class="num">69%</div><div class="lbl">تقدم الحفظ</div></div>
    <div class="stat-card bg-blue"><div class="deco"></div><div class="icon">👥</div><div class="num">${HALAQAT.length}</div><div class="lbl">الحلقات</div></div>
    <div class="stat-card bg-green"><div class="deco"></div><div class="icon">🎓</div><div class="num">${STUDENTS.length}</div><div class="lbl">الطلاب</div></div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-head"><span>الأداءات المالية 📈</span></div>
      <div class="chart-box"><canvas id="chFin"></canvas></div>
    </div>
    <div class="card">
      <div class="card-head"><span>الحضور الشهري 📑</span></div>
      <div class="chart-box"><canvas id="chAtt"></canvas></div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-head"><span>آخر جلسات الحفظ 📗</span></div>
      ${MEMORIZATION_LOG.slice(0,4).map(m=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-weight:700;">${m.student}</div>
            <div style="font-size:12.5px;color:var(--text-muted);">${m.surah} (${m.from}-${m.to}) – ${m.type}</div>
          </div>
          <div>${stars(m.rating)}</div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="card-head"><span>تنبيهات ⚠️</span></div>
      <div style="background:#fdf3df;border-radius:10px;padding:16px;display:flex;align-items:center;gap:10px;font-weight:700;color:#7a5308;">
        📷 <b>11</b> طالب لم يدفعوا اشتراك هذا الشهر
      </div>
    </div>
  </div>
  `;
}

function dashboardCharts(){
  destroyChart('chFin'); destroyChart('chAtt');
  const finCtx = document.getElementById('chFin');
  if(finCtx){
    charts.chFin = new Chart(finCtx, {
      type:'line',
      data:{
        labels:['يناير','فبراير','مارس','أبريل','ماي','يونيو','يوليوز','غشت','شتنبر','أكتوبر','نونبر','دجنبر'],
        datasets:[{label:'المداخيل (د.م)', data:[0,0,0,0,0,0,2650,2900,1350,0,0,0], borderColor:'#f0ad2f', backgroundColor:'rgba(240,173,47,.18)', fill:true, tension:.35}]
      },
      options:{plugins:{legend:{position:'top', rtl:true}}, maintainAspectRatio:false}
    });
  }
  const attCtx = document.getElementById('chAtt');
  if(attCtx){
    charts.chAtt = new Chart(attCtx, {
      type:'bar',
      data:{
        labels:['يناير','فبراير','مارس','أبريل','ماي','يونيو','يوليوز','غشت','شتنبر','أكتوبر','نونبر','دجنبر'],
        datasets:[
          {label:'حاضر', data:[0,0,0,0,0,0,305,0,137,0,0,0], backgroundColor:'#3cb873'},
          {label:'غائب', data:[0,0,0,0,0,0,58,0,23,0,0,0], backgroundColor:'#e5757a'}
        ]
      },
      options:{plugins:{legend:{position:'top', rtl:true}}, maintainAspectRatio:false}
    });
  }
}

// ===================== إدارة الطلاب =====================
function renderStudents(){
  const rows = STUDENTS.map((s,i)=>`
    <tr>
      <td>${i+1}</td>
      <td><span class="avatar-circle">🧑</span></td>
      <td style="text-align:right;font-weight:700;">${s.name}</td>
      <td><span class="badge badge-level">${s.level}</span></td>
      <td>${s.halaqa}</td>
      <td>${s.phone}</td>
      <td><span class="badge ${s.status==='نشيط'?'badge-active':'badge-inactive'}">${s.status}</span></td>
      <td>
        <button class="icon-btn icon-view" data-action="view-student" data-id="${s.id}" title="عرض">👁</button>
        <button class="icon-btn icon-edit" data-action="edit-student" data-id="${s.id}" title="تعديل">✏️</button>
        <button class="icon-btn icon-del" data-action="del-student" data-id="${s.id}" title="حذف">🗑</button>
      </td>
    </tr>
  `).join('');

  return `
  <div class="page-head">
    <h1>إدارة الطلاب 🎓</h1>
    <div class="head-actions">
      <button class="btn btn-primary" data-action="add-student">+ إضافة طالب</button>
      <button class="btn btn-teal" data-action="import-excel">📥 استيراد Excel</button>
    </div>
  </div>

  <div class="filter-bar">
    <div class="filter-field">
      <label>الحالة 🔘</label>
      <select id="fStatus"><option value="">الكل</option><option>نشيط</option><option>غير نشيط</option></select>
    </div>
    <div class="filter-field">
      <label>الحلقة 👥</label>
      <select id="fHalaqa"><option value="">الكل</option>${HALAQAT.map(h=>`<option>${h.name}</option>`).join('')}</select>
    </div>
    <div class="filter-field">
      <label>بحث 🔍</label>
      <input id="fSearch" placeholder="اسم أو هاتف...">
    </div>
    <button class="btn btn-primary" id="btnFilterStudents">تصفية 🔻</button>
  </div>

  <div class="table-wrap">
    <div class="table-title"><span>قائمة الطلاب (${STUDENTS.length}) 📋</span></div>
    <div style="overflow-x:auto;">
    <table>
      <thead><tr><th>#</th><th>الصورة</th><th>الاسم الكامل</th><th>المستوى</th><th>الحلقة</th><th>هاتف الولي</th><th>الحالة</th><th>إجراءات</th></tr></thead>
      <tbody id="studentsBody">${rows}</tbody>
    </table>
    </div>
  </div>
  `;
}

function studentFormHtml(s){
  s = s || {name:'', phone:'', halaqa:HALAQAT[0].name, level:HALAQAT[0].level, status:'نشيط'};
  return `
    <div class="form-field"><label>الاسم الكامل</label><input type="text" id="mfName" value="${s.name}"></div>
    <div class="form-field"><label>هاتف الولي</label><input type="tel" id="mfPhone" value="${s.phone}"></div>
    <div class="form-field"><label>الحلقة</label>
      <select id="mfHalaqa" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
        ${HALAQAT.map(h=>`<option ${h.name===s.halaqa?'selected':''}>${h.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-field"><label>الحالة</label>
      <select id="mfStatus" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
        <option ${s.status==='نشيط'?'selected':''}>نشيط</option>
        <option ${s.status==='غير نشيط'?'selected':''}>غير نشيط</option>
      </select>
    </div>
  `;
}

function bindStudentsEvents(){
  document.getElementById('btnFilterStudents')?.addEventListener('click', ()=>{
    const st = document.getElementById('fStatus').value;
    const hq = document.getElementById('fHalaqa').value;
    const se = document.getElementById('fSearch').value.trim().toLowerCase();
    const rows = STUDENTS.filter(s=>
      (!st || s.status===st) && (!hq || s.halaqa===hq) &&
      (!se || s.name.toLowerCase().includes(se) || s.phone.includes(se))
    ).map((s,i)=>`
      <tr>
        <td>${i+1}</td>
        <td><span class="avatar-circle">🧑</span></td>
        <td style="text-align:right;font-weight:700;">${s.name}</td>
        <td><span class="badge badge-level">${s.level}</span></td>
        <td>${s.halaqa}</td>
        <td>${s.phone}</td>
        <td><span class="badge ${s.status==='نشيط'?'badge-active':'badge-inactive'}">${s.status}</span></td>
        <td>
          <button class="icon-btn icon-view" data-action="view-student" data-id="${s.id}">👁</button>
          <button class="icon-btn icon-edit" data-action="edit-student" data-id="${s.id}">✏️</button>
          <button class="icon-btn icon-del" data-action="del-student" data-id="${s.id}">🗑</button>
        </td>
      </tr>`).join('') || `<tr><td colspan="8" style="padding:30px;color:#999;">لا توجد نتائج مطابقة</td></tr>`;
    document.getElementById('studentsBody').innerHTML = rows;
  });

  document.getElementById('import-excel-btn');
}

// ===================== الملف الشخصي للطالب =====================
function renderStudentProfile(){
  const s = studentById(state.currentStudentId);
  if(!s) return `<div class="empty-state"><div class="ic">🎓</div><h3>لم يتم العثور على الطالب</h3></div>`;

  const tabs = [
    {id:'info', label:'المعلومات', ic:'📇'},
    {id:'memo', label:'الحفظ', ic:'📗'},
    {id:'att', label:'الحضور', ic:'✔️'},
    {id:'pay', label:'الأداءات', ic:'📷'},
    {id:'notes', label:'التقييمات', ic:'📋'}
  ];

  return `
  <div class="page-head" style="margin-bottom:0;">
    <button class="btn btn-outline" data-action="back-students">رجوع ⬅</button>
    <button class="btn btn-gold" data-action="edit-student" data-id="${s.id}">تعديل ✏️</button>
  </div>

  <div class="profile-card">
    <div class="avatar-lg">🎓</div>
    <h2>${s.name}</h2>
    <div class="profile-tags">
      <span class="badge badge-level">${s.halaqa}</span>
      <span class="badge badge-gold">${s.level}</span>
      <span class="badge ${s.status==='نشيط'?'badge-active':'badge-inactive'}">${s.status}</span>
    </div>
    <div class="profile-stats">
      <div><span class="v">${s.rating.toFixed(1)}</span><span class="l">التقييم</span></div>
      <div><span class="v">${s.attendance}%</span><span class="l">الحضور</span></div>
      <div><span class="v">${(s.progress*0.8).toFixed(1)}%</span><span class="l">حفظ القرآن</span></div>
    </div>
  </div>

  <div class="tabs" id="profileTabs">
    ${tabs.map(t=>`<button data-tab="${t.id}" class="${state.profileTab===t.id?'active':''}">${t.label} ${t.ic}</button>`).join('')}
  </div>
  <div class="tab-panel" id="tabPanel">${profileTabContent(s, state.profileTab)}</div>
  `;
}

function profileTabContent(s, tab){
  if(tab === 'info'){
    return `
      <div class="grid-2">
        <div><div class="form-field"><label>الاسم الكامل</label><input type="text" value="${s.name}" disabled></div></div>
        <div><div class="form-field"><label>هاتف الولي</label><input type="text" value="${s.phone}" disabled></div></div>
        <div><div class="form-field"><label>الحلقة</label><input type="text" value="${s.halaqa}" disabled></div></div>
        <div><div class="form-field"><label>المستوى</label><input type="text" value="${s.level}" disabled></div></div>
      </div>
    `;
  }
  if(tab === 'memo'){
    const logs = MEMORIZATION_LOG.filter(m=>m.student===s.name);
    if(!logs.length) return `<div class="empty-state"><div class="ic">📗</div><h3>لا يوجد سجل حفظ بعد</h3></div>`;
    return `<table><thead><tr><th>التاريخ</th><th>السورة</th><th>الآيات</th><th>النوع</th><th>التقييم</th></tr></thead><tbody>
      ${logs.map(m=>`<tr><td>2026-09-0${m.id}</td><td>${m.surah}</td><td>${m.from}-${m.to}</td><td><span class="badge badge-level2">${m.type}</span></td><td>${stars(m.rating)}</td></tr>`).join('')}
    </tbody></table>`;
  }
  if(tab === 'att'){
    return `<div class="stat-grid cols-3">
      <div class="stat-card bg-blue"><div class="icon">%</div><div class="num">${s.attendance}%</div><div class="lbl">نسبة الحضور</div></div>
      <div class="stat-card bg-red"><div class="icon">✕</div><div class="num">${Math.round((100-s.attendance)/10)}</div><div class="lbl">غائب</div></div>
      <div class="stat-card bg-green"><div class="icon">✓</div><div class="num">${Math.round(s.attendance/10)}</div><div class="lbl">حاضر</div></div>
    </div>`;
  }
  if(tab === 'pay'){
    return `<table><thead><tr><th>الشهر</th><th>المبلغ</th><th>الحالة</th></tr></thead><tbody>
      <tr><td>شتنبر 2026</td><td>150 د.م</td><td><span class="badge ${s.status==='نشيط'?'badge-unpaid':'badge-paid'}">${s.status==='نشيط'?'غير مدفوع':'مدفوع'}</span></td></tr>
      <tr><td>غشت 2026</td><td>150 د.م</td><td><span class="badge badge-paid">مدفوع</span></td></tr>
      <tr><td>يوليوز 2026</td><td>150 د.م</td><td><span class="badge badge-paid">مدفوع</span></td></tr>
    </tbody></table>`;
  }
  if(tab === 'notes'){
    const list = NOTES.filter(n=>n.student===s.name);
    if(!list.length) return `<div class="empty-state"><div class="ic">📋</div><h3>لا توجد ملاحظات بعد</h3></div>`;
    return list.map(n=>`
      <div style="padding:12px 0;border-bottom:1px solid var(--border);">
        <div style="display:flex;gap:8px;margin-bottom:6px;">
          <span class="badge badge-gold">${n.rating}</span><span class="badge badge-level">${n.type}</span>
        </div>
        <div>${n.text}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px;">${n.date} — ${n.by}</div>
      </div>
    `).join('');
  }
  return '';
}

function bindProfileEvents(){
  document.getElementById('profileTabs')?.addEventListener('click', (e)=>{
    const b = e.target.closest('button[data-tab]');
    if(!b) return;
    state.profileTab = b.dataset.tab;
    document.querySelectorAll('#profileTabs button').forEach(x=>x.classList.toggle('active', x===b));
    document.getElementById('tabPanel').innerHTML = profileTabContent(studentById(state.currentStudentId), state.profileTab);
  });
}

// ===================== الحلقات والمستويات =====================
function renderHalaqat(){
  return `
  <div class="page-head">
    <h1>الحلقات والمستويات 👥</h1>
    <button class="btn btn-primary" data-action="add-halaqa">+ إضافة حلقة</button>
  </div>
  <div class="halaqa-grid">
    ${HALAQAT.map(h=>`
      <div class="halaqa-card">
        <div class="top">
          <h3>${h.name}</h3>
          <span class="badge badge-level">${h.level}</span>
        </div>
        <div class="row"><span>المحفظ المشرف</span><span style="font-weight:700;">${h.teacher}</span></div>
        <div class="row"><span>عدد الطلاب</span><span style="font-weight:700;">${h.students}</span></div>
        <div class="row"><span>التوقيت</span><span style="font-weight:700;">${h.time}</span></div>
        <div style="margin-top:14px;display:flex;gap:8px;">
          <button class="btn btn-outline btn-sm" data-action="edit-halaqa" data-id="${h.id}">تعديل ✏️</button>
          <button class="btn btn-outline btn-sm" data-action="view-halaqa" data-id="${h.id}">عرض الطلاب 👁</button>
        </div>
      </div>
    `).join('')}
  </div>
  `;
}

// ===================== تتبع الحفظ =====================
function renderMemorization(){
  const rows = MEMORIZATION_LOG.map((m,i)=>`
    <tr>
      <td>${i+1}</td>
      <td style="text-align:right;font-weight:700;">${m.student}</td>
      <td>${m.surah} 📖</td>
      <td>${m.from} - ${m.to}</td>
      <td><span class="badge ${m.type==='جديد'?'badge-active':'badge-level'}">${m.type}</span></td>
      <td>${stars(m.rating)}</td>
      <td>${m.note || ''}</td>
      <td>2026-09-0${(i%9)+1}</td>
      <td>
        <button class="icon-btn icon-edit" data-action="edit-memo" data-id="${m.id}">✏️</button>
        <button class="icon-btn icon-del" data-action="del-memo" data-id="${m.id}">🗑</button>
      </td>
    </tr>
  `).join('');
  return `
  <div class="page-head">
    <h1>تتبع الحفظ 📗</h1>
    <button class="btn btn-primary" data-action="add-memo">+ تسجيل حفظ جديد</button>
  </div>

  <div class="filter-bar">
    <div class="filter-field"><label>التاريخ 🗓</label><input type="date"></div>
    <div class="filter-field"><label>النوع 🏷</label><select><option>الكل</option><option>جديد</option><option>مراجعة</option></select></div>
    <div class="filter-field"><label>الطالب 🎓</label><select><option>الكل</option>${STUDENTS.map(s=>`<option>${s.name}</option>`).join('')}</select></div>
    <button class="btn btn-primary">تصفية 🔻</button>
  </div>

  <div class="table-wrap">
    <div class="table-title"><span>سجل الحفظ (${MEMORIZATION_LOG.length}) 📋</span></div>
    <div style="overflow-x:auto;">
    <table>
      <thead><tr><th>#</th><th>الطالب</th><th>السورة</th><th>الآيات</th><th>النوع</th><th>التقييم</th><th>ملاحظات</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
  </div>
  `;
}

function memoFormHtml(m){
  m = m || {student:STUDENTS[0].name, surah:'الفاتحة', from:1, to:1, type:'جديد', rating:5, note:''};
  return `
    <div class="form-field"><label>الطالب</label>
      <select id="mfStudent" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
        ${STUDENTS.map(s=>`<option ${s.name===m.student?'selected':''}>${s.name}</option>`).join('')}
      </select>
    </div>
    <div class="grid-2">
      <div class="form-field"><label>السورة</label>
        <select id="mfSurah" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
          ${SURAHS.map(s=>`<option ${s.name===m.surah?'selected':''}>${s.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-field"><label>النوع</label>
        <select id="mfType" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
          <option ${m.type==='جديد'?'selected':''}>جديد</option>
          <option ${m.type==='مراجعة'?'selected':''}>مراجعة</option>
        </select>
      </div>
    </div>
    <div class="grid-2">
      <div class="form-field"><label>من آية</label><input type="number" id="mfFrom" value="${m.from}"></div>
      <div class="form-field"><label>إلى آية</label><input type="number" id="mfTo" value="${m.to}"></div>
    </div>
    <div class="form-field"><label>التقييم</label>
      <select id="mfRating" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
        <option value="5">ممتاز (5)</option><option value="4">جيد جدا (4)</option><option value="3">جيد (3)</option><option value="2">متوسط (2)</option><option value="1">ضعيف (1)</option>
      </select>
    </div>
    <div class="form-field"><label>ملاحظات</label><input type="text" id="mfNote" value="${m.note||''}"></div>
  `;
}

// ===================== خريطة القرآن =====================
function surahPct(studentId, surahIdx){
  const s = studentById(studentId);
  if(!s) return 0;
  // توزيع تحديدي بسيط يعتمد على نسبة تقدم الطالب
  const threshold = s.progress * 114;
  if(surahIdx <= threshold) return 100;
  if(surahIdx <= threshold + 2) return 50;
  return 0;
}

function renderQuranMap(){
  const chosen = state.chosenMapStudent;
  const s = chosen ? studentById(chosen) : null;
  let body = `<div class="empty-state"><div class="ic">🕌</div><h3>اختر طالبًا لعرض تقدمه في حفظ القرآن الكريم</h3><p>ستظهر هنا خريطة تفصيلية لجميع السور مع نسبة الحفظ</p></div>`;

  if(s){
    const totalAyat = SURAHS.reduce((a,x)=>a+x.ayat,0);
    const memorized = Math.round(totalAyat * s.progress);
    const completed = SURAHS.filter((_,i)=>surahPct(s.id, i+1)===100).length;
    body = `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
        <span class="avatar-circle" style="width:50px;height:50px;font-size:22px;">🎓</span>
        <div>
          <div style="font-weight:800;font-size:16px;">${s.name}</div>
          <div style="color:var(--text-muted);font-size:12.5px;">${s.halaqa} · ${s.level}</div>
        </div>
      </div>
      <div class="stat-grid cols-4">
        <div class="stat-card bg-gold" style="background:linear-gradient(135deg,#f5c05f,#dd9b1f);"><div class="icon">📗</div><div class="num">${memorized.toLocaleString()}</div><div class="lbl">إجمالي الآيات</div></div>
        <div class="stat-card bg-blue"><div class="icon">📘</div><div class="num">${completed}</div><div class="lbl">سورة مكتملة</div></div>
        <div class="stat-card bg-green"><div class="icon">✔️</div><div class="num">${completed}</div><div class="lbl">سورة مكتملة</div></div>
        <div class="stat-card bg-purple"><div class="icon">%</div><div class="num">${(s.progress*100).toFixed(1)}%</div><div class="lbl">نسبة الحفظ الكلية</div></div>
      </div>
      <div style="background:#eee;border-radius:10px;height:10px;overflow:hidden;margin-bottom:6px;">
        <div style="background:var(--green);height:100%;width:${(s.progress*100)}%;"></div>
      </div>
      <div style="text-align:left;font-size:12.5px;color:var(--text-muted);margin-bottom:16px;">${memorized.toLocaleString()}/${totalAyat.toLocaleString()} الإجمالي</div>
      <div class="surah-grid">
        ${SURAHS.map(su=>{
          const pct = surahPct(s.id, su.n);
          const cls = pct===100?'done':(pct>0?'partial':'');
          return `<div class="surah-cell ${cls}">
            <div class="idx">${su.n}</div>
            <div class="nm">${su.name}</div>
            <div class="ay">${su.ayat} آية</div>
            <div class="pct">${pct}%</div>
          </div>`;
        }).join('')}
      </div>
    `;
  }

  return `
  <div class="page-head"><h1>تتبع تقدم الحفظ 📗</h1></div>
  <div class="filter-bar">
    <div class="filter-field" style="flex:3;">
      <label>الطالب 🎓</label>
      <select id="mapStudentSel">
        <option value="">-- اختر طالبًا لعرض تقدمه --</option>
        ${STUDENTS.map(s=>`<option value="${s.id}" ${chosen==s.id?'selected':''}>${s.name} (${s.halaqa})</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary" id="btnShowMap">عرض 🔍</button>
  </div>
  <div class="card">${body}</div>
  `;
}

// ===================== الحضور والغياب =====================
let attendanceState = {}; // studentId -> 'حاضر' | 'غائب'
STUDENTS.forEach(s=> attendanceState[s.id] = 'حاضر');

function renderAttendance(){
  const present = Object.values(attendanceState).filter(v=>v==='حاضر').length;
  const absent = Object.values(attendanceState).filter(v=>v==='غائب').length;
  const pct = Math.round((present/STUDENTS.length)*100);

  return `
  <div class="page-head"><h1>الحضور والغياب 📋</h1></div>

  <div class="stat-grid cols-3">
    <div class="stat-card bg-blue"><div class="icon">%</div><div class="num" id="pctAtt">${pct}%</div><div class="lbl">نسبة الحضور</div></div>
    <div class="stat-card bg-red"><div class="icon">✕</div><div class="num" id="numAbsent">${absent}</div><div class="lbl">غائب</div></div>
    <div class="stat-card bg-green"><div class="icon">✓</div><div class="num" id="numPresent">${present}</div><div class="lbl">حاضر</div></div>
  </div>

  <div class="filter-bar">
    <div class="filter-field"><label>الحلقة 👥</label><select id="attHalaqa"><option>الكل</option>${HALAQAT.map(h=>`<option>${h.name}</option>`).join('')}</select></div>
    <div class="filter-field"><label>التاريخ 🗓</label><input type="date" value="2026-09-10"></div>
    <button class="btn btn-primary">عرض 🔻</button>
  </div>

  <div class="table-wrap">
    <div class="table-title"><span><span class="count-pill">${STUDENTS.length} طالب</span></span><span>تسجيل الحضور ليوم 10-09-2026 📋</span></div>
    <div id="attList">
      ${STUDENTS.map(s=>attRowHtml(s)).join('')}
    </div>
  </div>
  `;
}

function attRowHtml(s){
  const v = attendanceState[s.id];
  return `
  <div class="att-row" data-row="${s.id}">
    <div class="att-person">
      <span class="avatar-circle">🧑</span>
      <div>
        <div class="nm">${s.name}</div>
        <div class="grp">${s.halaqa}</div>
      </div>
    </div>
    <div class="att-toggle">
      <button class="pill-btn pill-present ${v==='حاضر'?'sel':''}" data-action="mark-present" data-id="${s.id}">✓ حاضر</button>
      <button class="pill-btn pill-absent ${v==='غائب'?'sel':''}" data-action="mark-absent" data-id="${s.id}">✕ غائب</button>
    </div>
  </div>`;
}

function refreshAttendanceStats(){
  const present = Object.values(attendanceState).filter(v=>v==='حاضر').length;
  const absent = Object.values(attendanceState).filter(v=>v==='غائب').length;
  const pct = Math.round((present/STUDENTS.length)*100);
  const pctEl = document.getElementById('pctAtt');
  if(pctEl){
    pctEl.textContent = pct+'%';
    document.getElementById('numAbsent').textContent = absent;
    document.getElementById('numPresent').textContent = present;
  }
}

// ===================== الأداءات والاشتراكات =====================
let paymentsState = {}; // studentId -> paid boolean
STUDENTS.forEach((s,i)=> paymentsState[s.id] = i%9===0 || i%9===2 || i%4===3 ? true : (i<9) );
// اضبط بحيث يكون هناك 9 مدفوعين و11 غير مدفوعين تقريبا كما بالفيديو
STUDENTS.forEach((s,i)=> paymentsState[s.id] = i < 9);

function renderPayments(){
  const paidCount = Object.values(paymentsState).filter(Boolean).length;
  const unpaidCount = STUDENTS.length - paidCount;
  const rows = STUDENTS.map(s=>{
    const paid = paymentsState[s.id];
    return `
    <div class="att-row" data-prow="${s.id}">
      <div class="att-person">
        <span class="avatar-circle">🧑</span>
        <div><div class="nm">${s.name}</div><div class="grp">${s.halaqa}</div></div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn btn-outline btn-sm" data-action="view-receipt" data-id="${s.id}">🧾 إيصال</button>
        <button class="pill-btn pill-present ${paid?'sel':''}" data-action="mark-paid" data-id="${s.id}">✓ مدفوع</button>
        <button class="pill-btn pill-absent ${!paid?'sel':''}" data-action="mark-unpaid" data-id="${s.id}">✕ غير مدفوع</button>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="page-head"><h1>الأداءات والاشتراكات 📷</h1></div>

  <div class="stat-grid cols-3">
    <div class="stat-card bg-orange"><div class="icon">💰</div><div class="num">${(paidCount*150).toLocaleString()}</div><div class="lbl">المجموع (د.م)</div></div>
    <div class="stat-card bg-red"><div class="icon">⚠️</div><div class="num" id="unpaidNum">${unpaidCount}</div><div class="lbl">غير مدفوع</div></div>
    <div class="stat-card bg-green"><div class="icon">✔️</div><div class="num" id="paidNum">${paidCount}</div><div class="lbl">مدفوع</div></div>
  </div>

  <div class="filter-bar">
    <div class="filter-field"><label>بحث 🔍</label><input placeholder="اسم الطالب أو رقم هاتف الولي..."></div>
    <div class="filter-field"><label>الحالة 🔻</label><select><option>الكل</option><option>مدفوع</option><option>غير مدفوع</option></select></div>
    <div class="filter-field"><label>الحلقة 👥</label><select><option>الكل</option>${HALAQAT.map(h=>`<option>${h.name}</option>`).join('')}</select></div>
    <div class="filter-field"><label>السنة 🗓</label><select><option>2026</option><option>2025</option></select></div>
    <div class="filter-field"><label>الشهر 🗓</label><select><option selected>شتنبر</option><option>غشت</option><option>يوليوز</option></select></div>
    <button class="btn btn-primary">عرض 🔻</button>
  </div>

  <div class="table-wrap">
    <div class="table-title"><span>تسجيل أداءات شتنبر 2026 📋</span><span class="count-pill">${STUDENTS.length} طالب</span></div>
    <div id="paymentsList">${rows}</div>
  </div>
  `;
}

function receiptHtml(s){
  const paid = paymentsState[s.id];
  return `
  <div class="modal-head"><span>إيصال الأداء 📃</span><button class="x" data-action="close-modal">✕</button></div>
  <div class="modal-body">
    <div class="receipt" id="receiptPrintArea">
      <h3>📗 مدرسة النور القرآنية</h3>
      <div class="sub">إيصال أداء</div>
      <div class="receipt-row"><span>الطالب:</span><b>${s.name}</b></div>
      <div class="receipt-row"><span>المبلغ:</span><b>150 د.م</b></div>
      <div class="receipt-row"><span>الشهر:</span><b>شتنبر 2026</b></div>
      <div class="receipt-row"><span>تاريخ الأداء:</span><b>${paid?'2026-09-05':'-'}</b></div>
      <div class="receipt-row"><span>الحالة:</span><b style="color:${paid?'#1c9350':'#e5484d'};">${paid?'مدفوع':'غير مدفوع'}</b></div>
    </div>
  </div>
  <div class="modal-foot">
    <button class="btn btn-blue" onclick="window.print()">🖨 طباعة</button>
    <button class="btn btn-outline" data-action="close-modal">إغلاق</button>
  </div>
  `;
}

// ===================== الملاحظات والتقييم =====================
function renderNotes(){
  return `
  <div class="page-head">
    <h1>الملاحظات والتقييم 📝</h1>
    <button class="btn btn-primary" data-action="add-note">+ إضافة ملاحظة</button>
  </div>

  <div class="filter-bar">
    <div class="filter-field"><label>بحث 🔍</label><input placeholder="اسم الطالب أو رقم هاتف الولي..."></div>
    <div class="filter-field"><label>النوع 🏷</label><select><option>الكل</option><option>سلوك</option><option>أداء</option><option>تفاعل</option></select></div>
    <button class="btn btn-primary" style="align-self:flex-end;">تصفية 🔻</button>
  </div>

  <div class="notes-grid" id="notesGrid">
    ${NOTES.map(n=>noteCardHtml(n)).join('')}
  </div>
  `;
}

function noteCardHtml(n){
  return `
  <div class="note-card">
    <div class="top">
      <span class="nm">${n.student}</span>
      <span style="cursor:pointer;color:#999;" data-action="del-note" data-id="${n.id}">⋮</span>
    </div>
    <div class="tags">
      <span class="badge badge-gold">${n.rating}</span>
      <span class="badge badge-level">${n.type}</span>
    </div>
    <div class="txt">${n.text}</div>
    <div class="foot"><span>${n.date}</span><span>${n.by} 🖊</span></div>
  </div>`;
}

function noteFormHtml(){
  return `
    <div class="form-field"><label>الطالب *</label>
      <select id="nfStudent" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
        ${STUDENTS.map(s=>`<option>${s.name}</option>`).join('')}
      </select>
    </div>
    <div class="grid-2">
      <div class="form-field"><label>التقييم *</label>
        <select id="nfRating" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
          <option>ممتاز</option><option>جيد</option><option>متوسط</option><option>ضعيف</option>
        </select>
      </div>
      <div class="form-field"><label>النوع *</label>
        <select id="nfType" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
          <option>سلوك</option><option>أداء</option><option>تفاعل</option>
        </select>
      </div>
    </div>
    <div class="form-field"><label>الملاحظات *</label><input type="text" id="nfText" placeholder="اكتب الملاحظة هنا..."></div>
  `;
}

// ===================== إدارة المستخدمين =====================
function renderUsers(){
  const rows = USERS.map((u,i)=>`
    <tr>
      <td>${i+1}</td>
      <td style="text-align:right;font-weight:700;">${u.name} ${u.role==='مدير'?'👑':'👤'}</td>
      <td>${u.username}</td>
      <td><span class="badge ${u.role==='مدير'?'badge-role-admin':'badge-role-teacher'}">${u.role} ${u.role==='مدير'?'👑':'🔗'}</span></td>
      <td>${u.phone}</td>
      <td><span class="badge badge-active">${u.status}</span></td>
      <td>
        <button class="icon-btn icon-edit" data-action="edit-user" data-id="${u.id}">✏️</button>
        ${u.role!=='مدير'?`<button class="icon-btn icon-del" data-action="del-user" data-id="${u.id}">🗑</button>`:''}
      </td>
    </tr>
  `).join('');
  return `
  <div class="page-head">
    <h1>إدارة المستخدمين والصلاحيات 👤</h1>
    <button class="btn btn-primary" data-action="add-user">+ إضافة مستخدم</button>
  </div>
  <div class="table-wrap">
    <div class="table-title"><span>قائمة المستخدمين (${USERS.length}) 📋</span></div>
    <div style="overflow-x:auto;">
    <table>
      <thead><tr><th>#</th><th>الاسم الكامل</th><th>اسم المستخدم</th><th>الدور</th><th>الهاتف</th><th>الحالة</th><th>إجراءات</th></tr></thead>
      <tbody id="usersBody">${rows}</tbody>
    </table>
    </div>
  </div>
  `;
}

function userFormHtml(u){
  u = u || {name:'', username:'', phone:'', role:'محفظ'};
  return `
    <div class="form-field"><label>الاسم الكامل</label><input type="text" id="ufName" value="${u.name}"></div>
    <div class="form-field"><label>اسم المستخدم</label><input type="text" id="ufUsername" value="${u.username}"></div>
    <div class="form-field"><label>الهاتف</label><input type="tel" id="ufPhone" value="${u.phone==='-'?'':u.phone}"></div>
    <div class="form-field"><label>كلمة المرور</label><input type="password" id="ufPass" placeholder="••••••"></div>
    <div class="form-field"><label>الدور</label>
      <select id="ufRole" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
        <option ${u.role==='محفظ'?'selected':''}>محفظ</option>
        <option ${u.role==='مدير'?'selected':''}>مدير</option>
      </select>
    </div>
  `;
}

// ===================== الإعلانات والتواصل =====================
function renderAnnouncements(){
  return `
  <div class="page-head"><h1>الإعلانات والتواصل 📢</h1></div>

  <div class="card">
    <div class="card-head"><span>إعلان جديد ✏️</span></div>
    <div class="form-field"><label>العنوان</label><input type="text" id="anTitle" placeholder="عنوان الإعلان"></div>
    <div class="grid-2">
      <div class="form-field"><label>الفئة المستهدفة</label>
        <select id="anAudience" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
          <option>جميع الطلاب</option><option>أولياء الأمور</option><option>المحفظين</option>
        </select>
      </div>
      <div class="form-field"><label>التاريخ</label><input type="date" id="anDate" value="2026-09-10"></div>
    </div>
    <div class="form-field"><label>نص الإعلان</label><input type="text" id="anText" placeholder="اكتب نص الإعلان هنا..."></div>
    <button class="btn btn-primary" id="btnAddAnnouncement">📤 نشر الإعلان</button>
  </div>

  <div id="annList">
    ${ANNOUNCEMENTS.map(a=>announcementHtml(a)).join('')}
  </div>
  `;
}

function announcementHtml(a){
  return `
  <div class="ann-item">
    <div class="top">
      <span class="title">📌 ${a.title}</span>
      <span class="meta"><span>🗓 ${a.date}</span><span>👥 ${a.audience}</span></span>
    </div>
    <p>${a.text}</p>
  </div>`;
}

// ===================== التقارير والإحصائيات =====================
function renderReports(){
  return `
  <div class="page-head"><h1>التقارير والإحصائيات 📊</h1></div>

  <div class="filter-bar">
    <div class="filter-field"><label>نوع التقرير 📄</label>
      <select id="repType">
        <option>تقرير شهري عام</option><option>تقرير طالب</option><option>تقرير حلقة</option>
      </select>
    </div>
    <div class="filter-field"><label>الشهر</label><select><option selected>شتنبر</option><option>غشت</option><option>يوليوز</option></select></div>
    <div class="filter-field"><label>السنة</label><select><option>2026</option></select></div>
    <button class="btn btn-primary">عرض التقرير 📋</button>
    <button class="btn btn-outline">🖨 طباعة</button>
  </div>

  <div class="stat-grid cols-4">
    <div class="stat-card bg-purple"><div class="icon">📗</div><div class="num">17</div><div class="lbl">جلسات الحفظ</div></div>
    <div class="stat-card bg-orange"><div class="icon">💰</div><div class="num">1,350</div><div class="lbl">مداخيل (د.م)</div></div>
    <div class="stat-card bg-red"><div class="icon">✕</div><div class="num">23</div><div class="lbl">غياب الشهر</div></div>
    <div class="stat-card bg-green"><div class="icon">✓</div><div class="num">137</div><div class="lbl">حضور الشهر</div></div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-head"><span>متوسط تقييم الحفظ 📊</span></div>
      <div style="text-align:center;padding:30px 0;">
        <div style="font-size:44px;font-weight:800;color:var(--green);">3.9</div>
        <div style="margin:10px 0;">${stars(3.9)}</div>
        <div style="color:var(--text-muted);font-size:13px;">من أصل 5</div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><span>نسبة الحضور/الغياب 🥧</span></div>
      <div class="chart-box"><canvas id="chReportPie"></canvas></div>
    </div>
  </div>
  `;
}

function reportsCharts(){
  destroyChart('chReportPie');
  const el = document.getElementById('chReportPie');
  if(el){
    charts.chReportPie = new Chart(el, {
      type:'doughnut',
      data:{labels:['حاضر','غائب'], datasets:[{data:[137,23], backgroundColor:['#3cb873','#e5484d']}]},
      options:{plugins:{legend:{position:'bottom', rtl:true}}, maintainAspectRatio:false}
    });
  }
}

// ===================== الإعدادات =====================
function renderSettings(){
  return `
  <div class="page-head"><h1>الإعدادات ⚙️</h1></div>

  <div class="grid-2">
    <div class="card" id="settingsSchoolInfoCard">
      <div class="card-head"><span>معلومات المدرسة 🏫</span></div>
      <div class="form-field"><label>اسم المدرسة 🏷</label><input type="text" id="stName" value="مدرسة النور القرآنية"></div>
      <div class="form-field"><label>شعار المدرسة 🖼</label>
        <div class="file-input-row">
          <input type="file" id="stLogo">
        </div>
        <div style="margin-top:10px;"><span class="logo" style="display:inline-flex;width:56px;height:56px;">📖</span></div>
      </div>
      <div class="form-field"><label>الهاتف 📞</label><input type="tel" value="0600112233"></div>
      <div class="form-field"><label>العنوان 📍</label><input type="text" value="حي السلام، شارع المسجد الأعظم، المدينة"></div>
      <div class="form-field"><label>واجب الاشتراك الشهري (د.م) 💳</label><input type="number" value="150.0"></div>
    </div>
    <div class="card">
      <div class="card-head"><span>التصميم وأيام الدراسة 🎨</span></div>
      <div class="color-row">
        <div class="color-item"><label>اللون الرئيسي 🟢</label><div class="color-swatch" style="background:#146c3a;"></div></div>
        <div class="color-item"><label>اللون الثانوي 🔵</label><div class="color-swatch" style="background:#2b7fd1;"></div></div>
        <div class="color-item"><label>لون التمييز 🟡</label><div class="color-swatch" style="background:#f0ad2f;"></div></div>
      </div>
      <div class="form-field"><label>أيام الدراسة 🗓</label></div>
      <div class="day-grid">
        <label class="day-check">السبت <input type="checkbox" checked></label>
        <label class="day-check">الأحد <input type="checkbox" checked></label>
        <label class="day-check">الإثنين <input type="checkbox" checked></label>
        <label class="day-check">الثلاثاء <input type="checkbox" checked></label>
        <label class="day-check">الأربعاء <input type="checkbox" checked></label>
        <label class="day-check">الخميس <input type="checkbox" checked></label>
        <label class="day-check">الجمعة <input type="checkbox" checked></label>
      </div>
      <div class="info-banner">ℹ️ لغة التطبيق: <b>العربية</b> (اتجاه من اليمين إلى اليسار)</div>
    </div>
  </div>

  <button class="btn btn-primary" id="btnSaveSettings" style="display:block;margin:0 auto 24px;padding:12px 40px;">💾 حفظ الإعدادات</button>

  <div class="card" style="max-width:600px;">
    <div class="card-head"><span>تغيير كلمة المرور 🔒</span></div>
    <div class="form-field"><label>كلمة المرور الحالية</label><input type="password"></div>
    <div class="form-field"><label>كلمة المرور الجديدة</label><input type="password"></div>
    <div class="form-field"><label>تأكيد كلمة المرور</label><input type="password"></div>
    <button class="btn btn-primary" id="btnChangePass">تحديث كلمة المرور</button>
  </div>
  `;
}

// ===================== ربط الأحداث الخاصة بكل صفحة =====================
function bindPageEvents(page){
  if(page === 'dashboard') dashboardCharts();
  if(page === 'students') bindStudentsEvents();
  if(page === 'studentProfile') bindProfileEvents();
  if(page === 'reports') reportsCharts();
  if(page === 'quranmap'){
    document.getElementById('btnShowMap')?.addEventListener('click', ()=>{
      const val = document.getElementById('mapStudentSel').value;
      state.chosenMapStudent = val ? Number(val) : null;
      render();
    });
  }
  if(page === 'announcements'){
    document.getElementById('btnAddAnnouncement')?.addEventListener('click', ()=>{
      const title = document.getElementById('anTitle').value.trim();
      const text = document.getElementById('anText').value.trim();
      const audience = document.getElementById('anAudience').value;
      const date = document.getElementById('anDate').value || '2026-09-10';
      if(!title || !text){ toast('الرجاء تعبئة العنوان والنص'); return; }
      ANNOUNCEMENTS.unshift({id:++idSeq, title, date, audience, text});
      document.getElementById('annList').innerHTML = ANNOUNCEMENTS.map(a=>announcementHtml(a)).join('');
      document.getElementById('anTitle').value='';
      document.getElementById('anText').value='';
      toast('تم نشر الإعلان بنجاح ✅');
    });
  }
  if(page === 'settings'){
    document.getElementById('btnSaveSettings')?.addEventListener('click', ()=> toast('تم حفظ الإعدادات بنجاح ✅'));
    document.getElementById('btnChangePass')?.addEventListener('click', ()=> toast('تم تحديث كلمة المرور ✅'));
  }
}

// ===================== تفويض الأحداث العام (نقرات data-action) =====================
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-action]');
  if(!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id ? Number(btn.dataset.id) : null;

  switch(action){
    // ---------- طلاب ----------
    case 'add-student':
      openModal(`
        <div class="modal-head"><span>إضافة طالب جديد 🎓</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">${studentFormHtml()}</div>
        <div class="modal-foot">
          <button class="btn btn-primary" data-action="save-student">💾 حفظ</button>
          <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        </div>`);
      break;
    case 'edit-student': {
      const s = studentById(id);
      openModal(`
        <div class="modal-head"><span>تعديل بيانات الطالب ✏️</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">${studentFormHtml(s)}</div>
        <div class="modal-foot">
          <button class="btn btn-primary" data-action="save-student" data-id="${id}">💾 حفظ التعديلات</button>
          <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        </div>`);
      break;
    }
    case 'save-student': {
      const name = document.getElementById('mfName').value.trim();
      const phone = document.getElementById('mfPhone').value.trim();
      const halaqa = document.getElementById('mfHalaqa').value;
      const status = document.getElementById('mfStatus').value;
      const lvl = HALAQAT.find(h=>h.name===halaqa)?.level || '';
      if(!name){ toast('الرجاء إدخال اسم الطالب'); return; }
      if(id){
        const s = studentById(id);
        Object.assign(s, {name, phone, halaqa, level:lvl, status});
        toast('تم تحديث بيانات الطالب ✅');
      } else {
        STUDENTS.push({id:++idSeq, name, phone, halaqa, level:lvl, status, attendance:0, progress:0, rating:0});
        toast('تمت إضافة الطالب بنجاح ✅');
      }
      closeModal();
      render();
      break;
    }
    case 'del-student':
      if(confirm('هل أنت متأكد من حذف هذا الطالب؟')){
        const idx = STUDENTS.findIndex(s=>s.id===id);
        if(idx>-1) STUDENTS.splice(idx,1);
        toast('تم حذف الطالب 🗑');
        render();
      }
      break;
    case 'view-student':
      goTo('studentProfile', {currentStudentId:id, profileTab:'info'});
      break;
    case 'back-students':
      goTo('students');
      break;
    case 'import-excel':
      toast('يرجى اختيار ملف Excel لاستيراد بيانات الطلاب 📥');
      break;

    // ---------- حلقات ----------
    case 'add-halaqa':
      openModal(`
        <div class="modal-head"><span>إضافة حلقة جديدة 👥</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">
          <div class="form-field"><label>اسم الحلقة</label><input type="text" id="hfName"></div>
          <div class="form-field"><label>المستوى</label><input type="text" id="hfLevel"></div>
          <div class="form-field"><label>المحفظ المشرف</label>
            <select id="hfTeacher" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;">
              ${USERS.filter(u=>u.role==='محفظ').map(u=>`<option>${u.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-field"><label>التوقيت</label><input type="text" id="hfTime" placeholder="مثال: بعد صلاة العصر"></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-primary" data-action="save-halaqa">💾 حفظ</button>
          <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        </div>`);
      break;
    case 'save-halaqa': {
      const name = document.getElementById('hfName').value.trim();
      const level = document.getElementById('hfLevel').value.trim() || 'غير محدد';
      const teacher = document.getElementById('hfTeacher').value;
      const time = document.getElementById('hfTime').value.trim() || '-';
      if(!name){ toast('الرجاء إدخال اسم الحلقة'); return; }
      HALAQAT.push({id:++idSeq, name, level, teacher, students:0, time});
      toast('تمت إضافة الحلقة بنجاح ✅');
      closeModal();
      render();
      break;
    }
    case 'edit-halaqa':
      toast('فتح تعديل الحلقة ✏️');
      break;
    case 'view-halaqa': {
      const h = HALAQAT.find(x=>x.id===id);
      const list = STUDENTS.filter(s=>s.halaqa===h.name);
      openModal(`
        <div class="modal-head"><span>طلاب ${h.name} 👥</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">
          ${list.map(s=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);"><span>${s.name}</span><span class="badge badge-level">${s.level}</span></div>`).join('') || '<p>لا يوجد طلاب في هذه الحلقة بعد</p>'}
        </div>
        <div class="modal-foot"><button class="btn btn-outline" data-action="close-modal">إغلاق</button></div>
      `);
      break;
    }

    // ---------- تتبع الحفظ ----------
    case 'add-memo':
      openModal(`
        <div class="modal-head"><span>تسجيل حفظ جديد 📗</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">${memoFormHtml()}</div>
        <div class="modal-foot">
          <button class="btn btn-primary" data-action="save-memo">💾 حفظ</button>
          <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        </div>`);
      break;
    case 'edit-memo': {
      const m = MEMORIZATION_LOG.find(x=>x.id===id);
      openModal(`
        <div class="modal-head"><span>تعديل سجل الحفظ ✏️</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">${memoFormHtml(m)}</div>
        <div class="modal-foot">
          <button class="btn btn-primary" data-action="save-memo" data-id="${id}">💾 حفظ التعديلات</button>
          <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        </div>`);
      break;
    }
    case 'save-memo': {
      const student = document.getElementById('mfStudent').value;
      const surah = document.getElementById('mfSurah').value;
      const type = document.getElementById('mfType').value;
      const from = Number(document.getElementById('mfFrom').value)||1;
      const to = Number(document.getElementById('mfTo').value)||1;
      const rating = Number(document.getElementById('mfRating').value)||5;
      const note = document.getElementById('mfNote').value.trim();
      if(id){
        const m = MEMORIZATION_LOG.find(x=>x.id===id);
        Object.assign(m, {student, surah, type, from, to, rating, note});
        toast('تم تحديث سجل الحفظ ✅');
      } else {
        MEMORIZATION_LOG.unshift({id:++idSeq, student, surah, type, from, to, rating, note});
        toast('تم تسجيل الحفظ بنجاح ✅');
      }
      closeModal();
      render();
      break;
    }
    case 'del-memo':
      if(confirm('هل تريد حذف هذا السجل؟')){
        const idx = MEMORIZATION_LOG.findIndex(m=>m.id===id);
        if(idx>-1) MEMORIZATION_LOG.splice(idx,1);
        toast('تم الحذف 🗑');
        render();
      }
      break;

    // ---------- حضور ----------
    case 'mark-present':
    case 'mark-absent': {
      attendanceState[id] = action==='mark-present' ? 'حاضر' : 'غائب';
      const row = document.querySelector(`.att-row[data-row="${id}"]`);
      if(row) row.outerHTML = attRowHtml(studentById(id));
      refreshAttendanceStats();
      break;
    }

    // ---------- أداءات ----------
    case 'mark-paid':
    case 'mark-unpaid': {
      paymentsState[id] = action==='mark-paid';
      render();
      break;
    }
    case 'view-receipt': {
      const s = studentById(id);
      openModal(receiptHtml(s));
      break;
    }

    // ---------- ملاحظات ----------
    case 'add-note':
      openModal(`
        <div class="modal-head"><span>إضافة ملاحظة 📝</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">${noteFormHtml()}</div>
        <div class="modal-foot">
          <button class="btn btn-primary" data-action="save-note">💾 حفظ</button>
          <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        </div>`);
      break;
    case 'save-note': {
      const student = document.getElementById('nfStudent').value;
      const rating = document.getElementById('nfRating').value;
      const type = document.getElementById('nfType').value;
      const text = document.getElementById('nfText').value.trim();
      if(!text){ toast('الرجاء كتابة الملاحظة'); return; }
      NOTES.unshift({id:++idSeq, student, type, rating, text, date:'2026-09-10', by:'المدير'});
      document.getElementById('notesGrid').innerHTML = NOTES.map(n=>noteCardHtml(n)).join('');
      closeModal();
      toast('تمت إضافة الملاحظة بنجاح ✅');
      break;
    }
    case 'del-note':
      if(confirm('حذف هذه الملاحظة؟')){
        const idx = NOTES.findIndex(n=>n.id===id);
        if(idx>-1) NOTES.splice(idx,1);
        document.getElementById('notesGrid').innerHTML = NOTES.map(n=>noteCardHtml(n)).join('');
        toast('تم الحذف 🗑');
      }
      break;

    // ---------- مستخدمون ----------
    case 'add-user':
      openModal(`
        <div class="modal-head"><span>إضافة مستخدم 👤</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">${userFormHtml()}</div>
        <div class="modal-foot">
          <button class="btn btn-primary" data-action="save-user">💾 حفظ</button>
          <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        </div>`);
      break;
    case 'edit-user': {
      const u = USERS.find(x=>x.id===id);
      openModal(`
        <div class="modal-head"><span>تعديل المستخدم ✏️</span><button class="x" data-action="close-modal">✕</button></div>
        <div class="modal-body">${userFormHtml(u)}</div>
        <div class="modal-foot">
          <button class="btn btn-primary" data-action="save-user" data-id="${id}">💾 حفظ التعديلات</button>
          <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        </div>`);
      break;
    }
    case 'save-user': {
      const name = document.getElementById('ufName').value.trim();
      const username = document.getElementById('ufUsername').value.trim();
      const phone = document.getElementById('ufPhone').value.trim() || '-';
      const role = document.getElementById('ufRole').value;
      if(!name || !username){ toast('الرجاء تعبئة الاسم واسم المستخدم'); return; }
      if(id){
        const u = USERS.find(x=>x.id===id);
        Object.assign(u, {name, username, phone, role});
        toast('تم تحديث المستخدم ✅');
      } else {
        USERS.push({id:++idSeq, name, username, phone, role, status:'نشيط'});
        toast('تمت إضافة المستخدم بنجاح ✅');
      }
      closeModal();
      render();
      break;
    }
    case 'del-user':
      if(confirm('هل تريد حذف هذا المستخدم؟')){
        const idx = USERS.findIndex(u=>u.id===id);
        if(idx>-1) USERS.splice(idx,1);
        toast('تم حذف المستخدم 🗑');
        render();
      }
      break;

    // ---------- عام ----------
    case 'close-modal':
      closeModal();
      break;
  }
});

// ===================== الإقلاع =====================
render();
