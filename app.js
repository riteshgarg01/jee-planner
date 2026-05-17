// ===== STATE =====
const state = { name:"", startDate:new Date(), ratings:{}, calendar:[], activeSubject:"mathematics", notes:{}, backlog:new Set() };
const HOURS_PER_WEEK = AVG_HOURS_PER_DAY * DAYS_PER_WEEK;

// ===== HELPERS =====
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function show(id){$$(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active")}
function fmt(d){return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
function fmtShort(d){return d.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
function addDays(d,n){const r=new Date(d);r.setDate(r.getDate()+n);return r}
function getNextMonday(d){const r=new Date(d);const day=r.getDay();const diff=day===0?1:day===1?0:8-day;r.setDate(r.getDate()+diff);return r}
function getMondayWeeks(start,end){const weeks=[];let mon=getNextMonday(start);if(mon>start){weeks.push({start:new Date(start),end:addDays(mon,-1)});}while(mon<end){const sun=addDays(mon,6);weeks.push({start:new Date(mon),end:sun>end?new Date(end):sun});mon=addDays(mon,7);}return weeks;}
function getAllUnits(){const u=[];for(const[s,d]of Object.entries(SYLLABUS))d.units.forEach(x=>u.push({...x,subject:s,color:d.color}));return u}

function countRated(){
  let t=0,b={mathematics:0,physics:0,chemistry:0};
  for(const[id,r]of Object.entries(state.ratings)){if(r!==undefined){t++;if(id[0]==="M")b.mathematics++;else if(id[0]==="P")b.physics++;else b.chemistry++}}
  return{total:t,bySubj:b};
}

// ===== PERSISTENCE =====
function genCode(){return Math.random().toString(36).substr(2,8).toUpperCase()}
function saveState(){
  const code=state.planCode||genCode();
  state.planCode=code;
  const data={name:state.name,startDate:state.startDate.toISOString(),ratings:state.ratings,calendar:state.calendar,notes:state.notes,backlog:[...state.backlog],planCode:code,savedAt:new Date().toISOString()};
  localStorage.setItem("jee_plan_"+code,JSON.stringify(data));
  localStorage.setItem("jee_plan_latest",code);
  return code;
}
function loadState(code){
  const raw=localStorage.getItem("jee_plan_"+code);
  if(!raw)return false;
  const d=JSON.parse(raw);
  state.name=d.name;state.startDate=new Date(d.startDate);state.ratings=d.ratings||{};
  state.calendar=d.calendar||[];state.notes=d.notes||{};state.backlog=new Set(d.backlog||[]);state.planCode=d.planCode;
  // Restore dates
  state.calendar.forEach(w=>{w.start=new Date(w.start);w.end=new Date(w.end)});
  return true;
}

// ===== SCREEN 1: WELCOME =====
function initWelcome(){
  state.startDate=new Date();
  $("#display-start-date").textContent=fmt(state.startDate);
  $("#display-weeks").textContent=getMondayWeeks(state.startDate,END_DATE).length;
  const inp=$("#student-name"),btn=$("#btn-start");
  inp.addEventListener("input",()=>{state.name=inp.value.trim();btn.disabled=!state.name});
  btn.addEventListener("click",()=>{if(!state.name)return;$("#assess-student-name").textContent=state.name;renderUnits("mathematics");show("#screen-assess")});
  // Resume button
  const latest=localStorage.getItem("jee_plan_latest");
  if(latest&&localStorage.getItem("jee_plan_"+latest)){
    const d=JSON.parse(localStorage.getItem("jee_plan_"+latest));
    const resumeBtn=document.createElement("button");
    resumeBtn.className="btn-secondary";resumeBtn.id="btn-resume";
    resumeBtn.innerHTML=`Resume ${d.name}'s Plan <span style="font-size:.75rem;opacity:.6">(${latest})</span>`;
    resumeBtn.addEventListener("click",()=>{
      if(loadState(latest)){renderDashboard();renderCalendar();renderPool();show("#screen-calendar")}
    });
    btn.parentNode.insertBefore(resumeBtn,btn.nextSibling);
  }
  // Load by code
  const codeInp=$("#plan-code-input"),codeBtn=$("#btn-load-code");
  if(codeBtn){codeBtn.addEventListener("click",()=>{
    const c=codeInp.value.trim().toUpperCase();
    if(c&&loadState(c)){renderDashboard();renderCalendar();renderPool();show("#screen-calendar")}
    else{codeInp.style.borderColor="var(--r0)";setTimeout(()=>codeInp.style.borderColor="",1500)}
  })}
}

// ===== SCREEN 2: ASSESSMENT =====
function renderUnits(subject){
  state.activeSubject=subject;
  $$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.subject===subject));
  const c=$("#units-container");c.innerHTML="";
  SYLLABUS[subject].units.forEach((u,i)=>{
    const card=document.createElement("div");
    card.className="unit-card"+(state.ratings[u.id]!==undefined?" rated":"");
    card.innerHTML=`<div class="unit-num">${i+1}</div>
      <div class="unit-info"><div class="unit-title">${u.title}</div><div class="unit-topics">${u.topics}</div></div>
      <div class="rating-pills">${[0,1,2,3,4].map(r=>`<button class="rating-pill r${r}${state.ratings[u.id]===r?" selected":""}" data-uid="${u.id}" data-rating="${r}" title="${RATING_LABELS[r]}">${r}</button>`).join("")}</div>`;
    c.appendChild(card);
  });
  updateProgress();
}
function handleRating(e){
  const p=e.target.closest(".rating-pill");if(!p)return;
  state.ratings[p.dataset.uid]=parseInt(p.dataset.rating);
  p.closest(".unit-card").classList.add("rated");
  p.closest(".rating-pills").querySelectorAll(".rating-pill").forEach(x=>x.classList.remove("selected"));
  p.classList.add("selected");p.style.transform="scale(1.2)";setTimeout(()=>p.style.transform="",150);
  updateProgress();
}
function updateProgress(){
  const{total,bySubj}=countRated();
  $("#progress-count").textContent=total;
  $("#progress-fill").style.width=(total/54*100)+"%";
  $("#count-math").textContent=bySubj.mathematics+"/14";
  $("#count-physics").textContent=bySubj.physics+"/20";
  $("#count-chemistry").textContent=bySubj.chemistry+"/20";
  $("#btn-generate").disabled=total<54;
}
function initAssessment(){
  $("#units-container").addEventListener("click",handleRating);
  $$(".tab").forEach(t=>t.addEventListener("click",()=>renderUnits(t.dataset.subject)));
  $("#btn-back-welcome").addEventListener("click",()=>show("#screen-welcome"));
  $("#btn-generate").addEventListener("click",()=>{try{generateCalendar();show("#screen-calendar")}catch(e){console.error(e);alert("Error generating plan: "+e.message)}});
  // Secret quick fill: Ctrl+Shift+T
  document.addEventListener("keydown",e=>{
    if(e.ctrlKey&&e.shiftKey&&e.key==="T"&&document.getElementById("screen-assess")?.classList.contains("active")){
      e.preventDefault();
      for(const[s,d]of Object.entries(SYLLABUS))d.units.forEach(u=>{if(state.ratings[u.id]===undefined)state.ratings[u.id]=Math.floor(Math.random()*5)});
      renderUnits(state.activeSubject);updateProgress();showToast("⚡ All units rated randomly");
    }
  });
}

// ===== SCHEDULING ALGORITHM =====
function generateCalendar(){
  const weekSlots=getMondayWeeks(state.startDate,END_DATE);
  const numWeeks=weekSlots.length;
  const totalHours=HOURS_PER_WEEK*numWeeks;
  const allUnits=getAllUnits();

  // Calculate weighted hours per unit
  let totalWeight=0;
  const unitData=allUnits.map(u=>{
    const rating=state.ratings[u.id]??0;
    const w=IMPORTANCE[u.id]*RATING_MULTIPLIER[rating];
    totalWeight+=w;
    return{...u,rating,weight:w};
  });
  unitData.forEach(u=>u.totalHours=Math.max(3,Math.round(totalHours*u.weight/totalWeight)));

  // Build per-subject queues sorted by priority (topo sort)
  const queues={mathematics:[],physics:[],chemistry:[]};
  const sorted=topoSort(unitData);
  sorted.forEach(u=>{queues[u.subject].push({...u,remaining:u.totalHours})});

  // Build calendar: each week gets 1 major + 2 minor from different subjects
  const subjects=["mathematics","physics","chemistry"];
  let majorIdx=0; // rotate which subject gets major focus
  const cal=weekSlots.map((slot,wi)=>{
    const week={week:wi,start:slot.start,end:slot.end,topics:[],totalHours:0};

    // Pick current topic from each subject
    const picks=[];
    for(const subj of subjects){
      const q=queues[subj];
      const topic=q.find(t=>t.remaining>0);
      if(topic)picks.push({topic,subject:subj});
    }
    if(picks.length===0)return week;

    // Designate major: rotate subjects, fallback to highest remaining
    let major=picks.find(p=>p.subject===subjects[majorIdx%3]);
    if(!major)major=picks.reduce((a,b)=>a.topic.remaining>b.topic.remaining?a:b);
    const minors=picks.filter(p=>p!==major);

    // Allocate hours
    const majorShare=minors.length===0?1:0.5;
    const minorShare=minors.length>0?(0.5/minors.length):0;

    // Major topic
    const majorHours=Math.min(Math.round(HOURS_PER_WEEK*majorShare),major.topic.remaining);
    week.topics.push({id:major.topic.id,title:major.topic.title,subject:major.topic.subject,color:major.topic.color,hours:majorHours,rating:major.topic.rating,totalHours:major.topic.totalHours,role:"major"});
    major.topic.remaining-=majorHours;
    week.totalHours+=majorHours;

    // Minor topics
    minors.forEach(m=>{
      const hrs=Math.min(Math.round(HOURS_PER_WEEK*minorShare),m.topic.remaining);
      if(hrs<1)return;
      week.topics.push({id:m.topic.id,title:m.topic.title,subject:m.topic.subject,color:m.topic.color,hours:hrs,rating:m.topic.rating,totalHours:m.topic.totalHours,role:"minor"});
      m.topic.remaining-=hrs;
      week.totalHours+=hrs;
    });

    majorIdx++;
    return week;
  });

  // Second pass: ensure ALL topics get allocated into CONSECUTIVE weeks
  for(const subj of subjects){
    queues[subj].forEach(topic=>{
      if(topic.remaining<=0)return;
      // Find best starting week: the one with most available capacity, then fill forward consecutively
      let bestStart=0,bestAvail=0;
      for(let i=0;i<cal.length;i++){
        const avail=HOURS_PER_WEEK-cal[i].totalHours;
        if(avail>bestAvail){bestAvail=avail;bestStart=i}
      }
      // Fill consecutively from bestStart
      for(let i=bestStart;i<cal.length&&topic.remaining>0;i++){
        const avail=Math.max(0,HOURS_PER_WEEK-cal[i].totalHours);
        const alloc=Math.min(topic.remaining,Math.max(3,avail));
        if(alloc<1)continue;
        cal[i].topics.push({id:topic.id,title:topic.title,subject:topic.subject,color:topic.color,hours:Math.round(alloc),rating:topic.rating,totalHours:topic.totalHours,role:"minor"});
        cal[i].totalHours+=alloc;
        topic.remaining-=alloc;
      }
    });
  }

  state.calendar=cal;
  window._poolTopics=[];
  const code=saveState();
  $("#calendar-student-name").textContent=state.name+` (Code: ${code})`;
  renderDashboard();
  renderCalendar();
  renderPool();
}

function topoSort(units){
  const m={};units.forEach(u=>m[u.id]=u);
  const vis=new Set(),res=[];
  function visit(id){if(vis.has(id))return;vis.add(id);(PREREQS[id]||[]).forEach(p=>visit(p));if(m[id])res.push(m[id])}
  [...units].sort((a,b)=>a.rating-b.rating||b.weight-a.weight).forEach(u=>visit(u.id));
  return res;
}

// ===== DASHBOARD =====
function renderDashboard(){
  $("#calendar-student-name").textContent=state.name+(state.planCode?` (Code: ${state.planCode})`:"");
  const all=getAllUnits();
  let ts=0;all.forEach(u=>ts+=(state.ratings[u.id]||0));
  const pct=Math.round(ts/(54*4)*100);
  $("#readiness-score").textContent=pct+"%";
  setTimeout(()=>$("#readiness-arc").style.strokeDashoffset=326.7*(1-pct/100),100);

  const sb=$("#subject-bars");sb.innerHTML="";
  const barClass={mathematics:"math",physics:"physics",chemistry:"chem"};
  for(const[subj,data]of Object.entries(SYLLABUS)){
    let s=0,t=data.units.length*4;data.units.forEach(u=>s+=(state.ratings[u.id]||0));
    const p=Math.round(s/t*100);
    sb.innerHTML+=`<div class="subject-bar-row"><span class="subject-bar-label" style="color:var(--${data.color})">${data.label}</span><div class="subject-bar-track"><div class="subject-bar-fill ${barClass[subj]}" style="width:${p}%"></div></div><span class="subject-bar-pct">${p}%</span></div>`;
  }

  const fl=$("#focus-list");fl.innerHTML="";
  const focus=all.filter(u=>(state.ratings[u.id]||0)<=2).sort((a,b)=>(state.ratings[a.id]||0)-(state.ratings[b.id]||0));
  const colors=["var(--r0)","var(--r1)","var(--r2)","var(--r3)","var(--r4)"];
  const bgs=["var(--r0-bg)","var(--r1-bg)","var(--r2-bg)","var(--r3-bg)","var(--r4-bg)"];
  const subjLabel={mathematics:"Math",physics:"Phys",chemistry:"Chem"};
  (focus.length?focus.slice(0,10):[]).forEach(u=>{
    const r=state.ratings[u.id]||0;
    const sn=subjLabel[u.subject]||u.subject;
    fl.innerHTML+=`<div class="focus-list-item"><span class="focus-dot" style="background:${colors[r]}"></span><span><strong style="opacity:0.6;font-size:.72rem">[${sn}]</strong> ${u.title}</span><span class="focus-rating" style="background:${bgs[r]};color:${colors[r]}">${r}/4</span></div>`;
  });
  if(!focus.length)fl.innerHTML='<div class="focus-list-item" style="color:var(--r4)">🎉 All units at book-level or above!</div>';
}

// ===== CALENDAR RENDER =====
function getWeekHours(wi){return(state.calendar[wi]?.topics||[]).reduce((s,t)=>s+t.hours,0)}

function renderCalendar(){
  const grid=$("#calendar-grid");grid.innerHTML="";
  state.calendar.forEach((week,wi)=>{
    const hrs=getWeekHours(wi);
    const over=hrs>HOURS_PER_WEEK;
    const row=document.createElement("div");
    row.className="week-row"+(over?" week-over":"");
    row.dataset.week=wi;
    row.innerHTML=`<div class="week-label">
        <div class="week-num">Week ${week.week}</div>
        <div class="week-dates">${fmtShort(week.start)} – ${fmtShort(week.end)}</div>
        <div class="week-hours ${over?"hours-over":""}">${Math.round(hrs)}/${Math.round(HOURS_PER_WEEK)}h</div>
      </div>
      <div class="week-topics" data-week="${wi}">
        ${week.topics.map((t,ti)=>makePill(t,wi,ti)).join("")}
      </div>`;
    grid.appendChild(row);
  });
  initDragDrop();
  saveState();
}

function makePill(t,wi,ti){
  const bl=state.backlog.has(t.id);
  const note=state.notes[t.id]||"";
  const roleTag=t.role==="major"?'<span class="pill-role major">★</span>':'<span class="pill-role minor">·</span>';
  return`<span class="topic-pill ${t.color}${bl?" backlogged":""}" draggable="true" data-week="${wi}" data-topic="${ti}" data-id="${t.id}" title="${note||t.title+' — Total: '+(t.totalHours||t.hours)+'h'}">
    ${roleTag} ${t.id}: ${t.title} <span class="pill-hours">(${t.hours}h this week)</span>
    <span class="pill-note-btn" title="Add/edit note">📝</span>
    <span class="pill-backlog-btn" title="${bl?"Remove from backlog":"Mark as backlog"}">${bl?"🔙":"⏸️"}</span>
    <span class="pill-close" title="Remove to pool">×</span>
  </span>`;
}

// ===== DRAG & DROP =====
let dragData=null;
function initDragDrop(){
  // Remove old listeners by re-rendering (event delegation handles it)
}

function setupGlobalEvents(){
  document.addEventListener("dragstart",e=>{
    const p=e.target.closest(".topic-pill");if(!p)return;
    dragData={fromWeek:parseInt(p.dataset.week),topicIdx:parseInt(p.dataset.topic),id:p.dataset.id,fromPool:!!p.closest("#pool-items")};
    p.style.opacity="0.4";e.dataTransfer.effectAllowed="move";
  });
  document.addEventListener("dragend",e=>{const p=e.target.closest(".topic-pill");if(p)p.style.opacity="1";$$(".drag-over").forEach(el=>el.classList.remove("drag-over"))});
  document.addEventListener("dragover",e=>{const z=e.target.closest(".week-topics,.pool-items");if(z){e.preventDefault();z.classList.add("drag-over")}});
  document.addEventListener("dragleave",e=>{const z=e.target.closest(".week-topics,.pool-items");if(z)z.classList.remove("drag-over")});
  document.addEventListener("drop",e=>{
    e.preventDefault();$$(".drag-over").forEach(el=>el.classList.remove("drag-over"));
    if(!dragData)return;
    const wz=e.target.closest(".week-topics"),pz=e.target.closest(".pool-items");
    if(wz)moveTopic(dragData,parseInt(wz.dataset.week));
    else if(pz)moveToPool(dragData);
    dragData=null;
  });

  // Click handlers for pills
  document.addEventListener("click",e=>{
    const close=e.target.closest(".pill-close");
    if(close){const p=close.closest(".topic-pill");if(p&&!p.closest("#pool-items"))moveToPool({fromWeek:parseInt(p.dataset.week),topicIdx:parseInt(p.dataset.topic),fromPool:false,id:p.dataset.id});return}
    const noteBtn=e.target.closest(".pill-note-btn");
    if(noteBtn){const p=noteBtn.closest(".topic-pill");const id=p.dataset.id;const cur=state.notes[id]||"";const n=prompt(`Note for ${id}:`,cur);if(n!==null){state.notes[id]=n;saveState();renderCalendar();renderPool()}return}
    const blBtn=e.target.closest(".pill-backlog-btn");
    if(blBtn){const p=blBtn.closest(".topic-pill");const id=p.dataset.id;if(state.backlog.has(id))state.backlog.delete(id);else state.backlog.add(id);saveState();renderCalendar();renderPool();return}
  });
}

function moveTopic(from,toWeek){
  let topic;
  if(from.fromPool){
    topic=window._poolTopics?.find(t=>t.id===from.id);
    if(topic)window._poolTopics=window._poolTopics.filter(t=>t.id!==from.id);
  }else{
    topic=state.calendar[from.fromWeek]?.topics[from.topicIdx];
    if(topic)state.calendar[from.fromWeek].topics.splice(from.topicIdx,1);
  }
  if(topic&&state.calendar[toWeek]){
    state.calendar[toWeek].topics.push(topic);
    // Check capacity warning
    const hrs=getWeekHours(toWeek);
    if(hrs>HOURS_PER_WEEK)showToast(`⚠️ Week ${toWeek+1} now has ${Math.round(hrs)}h — exceeds ${Math.round(HOURS_PER_WEEK)}h capacity!`);
  }
  renderCalendar();renderPool();
}

function moveToPool(from){
  if(from.fromPool)return;
  const topic=state.calendar[from.fromWeek]?.topics[from.topicIdx];
  if(topic){state.calendar[from.fromWeek].topics.splice(from.topicIdx,1);if(!window._poolTopics)window._poolTopics=[];window._poolTopics.push(topic)}
  renderCalendar();renderPool();
}

function renderPool(){
  const pool=$("#pool-items");if(!window._poolTopics)window._poolTopics=[];
  pool.innerHTML=window._poolTopics.length===0
    ?'<span style="color:var(--text-muted);font-size:.82rem;padding:8px">No unassigned topics</span>'
    :window._poolTopics.map((t,i)=>`<span class="topic-pill ${t.color}" draggable="true" data-week="-1" data-topic="${i}" data-id="${t.id}">${t.id}: ${t.title} <span class="pill-hours">(${t.hours}h)</span></span>`).join("");
}

// ===== TOAST =====
function showToast(msg){
  let t=document.getElementById("toast");
  if(!t){t=document.createElement("div");t.id="toast";document.body.appendChild(t)}
  t.textContent=msg;t.className="toast show";
  setTimeout(()=>t.className="toast",3500);
}

// ===== PDF EXPORT =====
function exportPDF(){
  const c=$("#pdf-container");c.style.display="block";

  // Pre-calculate hours per unit from calendar
  const unitHoursMap={};
  state.calendar.forEach(w=>w.topics.forEach(t=>{unitHoursMap[t.id]=(unitHoursMap[t.id]||0)+t.hours}));

  let h=`<div class="pdf-content">
    <h1>JEE 2027 Personalized Study Plan</h1>
    <p style="margin-bottom:12px"><strong>Student:</strong> ${state.name} &nbsp;|&nbsp; <strong>Plan Code:</strong> ${state.planCode||"N/A"} &nbsp;|&nbsp; <strong>Generated:</strong> ${fmt(new Date())} &nbsp;|&nbsp; <strong>Period:</strong> ${fmt(state.startDate)} – ${fmt(END_DATE)}</p>
    <h2>Self-Assessment Summary</h2>
    <table><tr><th>Unit</th><th>Subject</th><th>Rating</th><th>Level</th><th>Est. Hours</th></tr>`;
  for(const[s,d]of Object.entries(SYLLABUS)){
    const cls=s==="mathematics"?"subj-math":s==="physics"?"subj-physics":"subj-chem";
    d.units.forEach(u=>{
      const r=state.ratings[u.id]??0;
      const hrs=unitHoursMap[u.id]||0;
      h+=`<tr style="page-break-inside:avoid"><td>${u.id}: ${u.title}</td><td class="${cls}">${d.label}</td><td>${r}/4</td><td>${RATING_LABELS[r]}</td><td>${hrs}h</td></tr>`;
    });
  }
  h+=`</table>
    <div style="page-break-before:always"></div>
    <h2>Weekly Study Calendar</h2>
    <table><tr><th style="width:55px">Week</th><th style="width:100px">Dates</th><th>Topics (★ Major Focus, · Minor Focus)</th><th>Notes</th></tr>`;
  state.calendar.forEach(w=>{
    if(!w.topics.length)return;
    const topics=w.topics.map(t=>{
      const bl=state.backlog.has(t.id)?'[BACKLOG] ':"";
      const role=t.role==="major"?"★":"·";
      return`${role} ${bl}${t.id}: ${t.title} (${t.hours}h)`;
    }).join("<br>");
    const notes=w.topics.map(t=>state.notes[t.id]?`${t.id}: ${state.notes[t.id]}`:"").filter(Boolean).join("<br>");
    h+=`<tr style="page-break-inside:avoid"><td>Week ${w.week}</td><td>${fmtShort(w.start)} –<br>${fmtShort(w.end)}</td><td>${topics}</td><td>${notes||"—"}</td></tr>`;
  });
  h+=`</table></div>`;c.innerHTML=h;
  html2pdf().set({
    margin:[10,10,10,10],
    filename:`JEE_Plan_${state.name.replace(/\s+/g,"_")}.pdf`,
    html2canvas:{scale:2,useCORS:true},
    jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},
    pagebreak:{mode:['avoid-all','css','legacy']}
  }).from(c).save().then(()=>c.style.display="none");
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded",()=>{
  initWelcome();initAssessment();window._poolTopics=[];renderPool();
  $("#btn-back-assess").addEventListener("click",()=>show("#screen-assess"));
  $("#btn-export-pdf").addEventListener("click",exportPDF);
  setupGlobalEvents();
});
