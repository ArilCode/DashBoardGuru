const SUPABASE_URL="https://wwiovsfkmymwkvxaehkh.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3aW92c2ZrbXltd2t2eGFlaGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNTE0MjEsImV4cCI6MjEwNjkyNzQyMX0.gEo2azUF1x3gwVG7h8NCDop_ZdjUl41viisIWcK8eI4";
const TABLE_NAME="absensi_v2";
const supa=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);
const T0=Date.now();

let toastTimer;
const toast=(m,ms=2500)=>{const t=$("toast");clearTimeout(toastTimer);t.textContent=m;t.classList.add("show");toastTimer=setTimeout(()=>t.classList.remove("show"),ms);};
const openL=()=>{document.body.classList.add("login-open");$("loginModal").classList.add("show");};
const closeL=()=>{document.body.classList.remove("login-open");$("loginModal").classList.remove("show");if(typeof setLihatPass==="function")setLihatPass(false);};
const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

/* role: developer = penuh | guru = status, hapus, excel, pengaturan, libur, reset QR | visit = hanya lihat */
let all=[],role="visit",isDev=false,canEdit=false,currentEmail="",isSyncing=false,hasShown=false,selectMode=false;
const selected=new Set();

function maskEmail(e){
  const [u,d]=String(e||"").split("@");
  if(!d)return "***";
  return u.charAt(0)+"*".repeat(Math.max(3,u.length-1))+"@"+d;
}

let bootDone=false;
function tutupSkeleton(){
  if(bootDone)return;
  bootDone=true;
  const h=document.documentElement;
  const adaSesi=h.classList.contains("boot-sess");
  h.classList.remove("boot-sess","boot-login");
  const s=$("pageSk");
  if(s){
    if(adaSesi){s.classList.add("out");setTimeout(()=>s.remove(),400);}   // memudar
    else s.remove();
  }
}

// masuk: true = sudah login | false = belum login | undefined = belum diketahui (pengaman waktu)
function selesaiBoot(masuk){
  const sisa=Math.max(0,900-(Date.now()-T0));
  setTimeout(()=>{
    const sedangLogin=document.documentElement.classList.contains("boot-login");
    tutupSkeleton();
    if(masuk===false&&!currentEmail)openL();
    else if(masuk===undefined&&sedangLogin&&!currentEmail)openL();
  },sisa);
}
setTimeout(()=>selesaiBoot(),8000);   // pengaman: skeleton tidak boleh tersangkut

function skTabel(){
  return Array.from({length:6},()=>`<tr><td colspan="9" style="padding:6px;border:0;background:none"><div class="sk sk-row"></div></td></tr>`).join("");
}
function skeletonData(on){
  document.documentElement.classList.toggle("skl",on);   // kunci scroll selama skeleton data
  document.querySelectorAll(".stat div").forEach(el=>el.classList.toggle("sk",on));
  $("infoFilter").classList.toggle("sk",on);
  if(on){$("tbody").innerHTML=skTabel();$("rekapArea").classList.add("hidden");}
}
function skList(el,n=2){el.innerHTML=Array.from({length:n},()=>'<div class="sk sk-item"></div>').join("");}

/* ================= KONFIG MAPEL ================= */
const PAK="PENDIDIKAN AGAMA KRISTEN (PAK)";
const KONFIG_KELAS = {
  "X E": {
    mapel: { "KIMIA": "PUJI SUSANTI, S.Pd", "BAHASA INGGRIS": "YUNI PUSPITASARI, S.Pd", "SENI BUDAYA": "ACI WINARTI, S.Pd.I", "SOSIOLOGI": "DESWA YODI EKA PUTRA, S.Pd", "BAHASA INDONESIA": "SUNARNI, S.Pd", "GEOGRAFI": "DESWA YODI EKA PUTRA, S.Pd", "BUDAYA MELAYU RIAU (BMR)": "IRZA LIANA PITRI, S.Sos", "MATEMATIKA": "MERI ANDAYANI, S.Pd", "BIOLOGI": "FAUZUL AZMI, S.Sos", "SEJARAH": "ROSELA, S.H", "PENDIDIKAN JASMANI, OLAHRAGA dan KESEHATAN (PJOK)": "BONIKA, S.Pd", "FISIKA": "PUJI SUSANTI, S.Pd", "PENDIDIKAN PANCASILA dan KEWARGANEGARAAN (PPKn)": "ROSELA, S.H", "TEKNIK INFORMASI dan KOMUNIKASI (TIK)": "FAUZUL AZMI, S.Sos", "PENDIDIKAN AGAMA ISLAM (PAI)": "ACI WINARTI, S.Pd.I", "EKONOMI": "ANITA SAPUTRI, S.E" },
    jadwal: { "Senin": ["KIMIA", "BAHASA INGGRIS", "SENI BUDAYA", "SOSIOLOGI"], "Selasa": ["BAHASA INDONESIA", "GEOGRAFI", "BUDAYA MELAYU RIAU (BMR)", "MATEMATIKA", "BIOLOGI"], "Rabu": ["BAHASA INDONESIA", "BUDAYA MELAYU RIAU (BMR)", "SEJARAH", "PENDIDIKAN JASMANI, OLAHRAGA dan KESEHATAN (PJOK)"], "Kamis": ["FISIKA", "PENDIDIKAN PANCASILA dan KEWARGANEGARAAN (PPKn)", "SENI BUDAYA", "MATEMATIKA", "TEKNIK INFORMASI dan KOMUNIKASI (TIK)"], "Jumat": ["PENDIDIKAN AGAMA ISLAM (PAI)", "EKONOMI"], "Sabtu": [], "Minggu": [] }
  },
  "XI F": {
    mapel: { "SEJARAH": "ROSELA, S.H", "EKONOMI": "ANITA SAPUTRI, S.E", "SENI BUDAYA": "SUNARNI, S.Pd", "MATEMATIKA TINGKAT LANJUT (MTL)": "MERI ANDAYANI, S.Pd", "PENDIDIKAN JASMANI, OLAHRAGA dan KESEHATAN (PJOK)": "BONIKA, S.Pd", "PENDIDIKAN AGAMA ISLAM (PAI)": "ACI WINARTI, S.Pd.I", "MATEMATIKA WAJIB": "MERI ANDAYANI, S.Pd", "PRAKARYA": "SUNARNI, S.Pd", "BAHASA INDONESIA": "ANITA SAPUTRI, S.E", "PENDIDIKAN PANCASILA dan KEWARGANEGARAAN (PPKn)": "ROSELA, S.H", "BAHASA INGGRIS": "YUNI PUSPITASARI, S.Pd", "BIOLOGI": "FAUZUL AZMI, S.Sos", "SOSIOLOGI": "DESWA YODI EKA PUTRA, S.Pd", "BUDAYA MELAYU RIAU (BMR)": "IRZA LIANA PITRI, S.Sos" },
    jadwal: { "Senin": ["SEJARAH", "EKONOMI", "SENI BUDAYA", "MATEMATIKA TINGKAT LANJUT (MTL)", "PENDIDIKAN JASMANI, OLAHRAGA dan KESEHATAN (PJOK)"], "Selasa": ["PENDIDIKAN AGAMA ISLAM (PAI)", "MATEMATIKA WAJIB", "PRAKARYA", "BAHASA INDONESIA", "PENDIDIKAN PANCASILA dan KEWARGANEGARAAN (PPKn)"], "Rabu": ["MATEMATIKA TINGKAT LANJUT (MTL)", "BAHASA INGGRIS", "SENI BUDAYA", "BAHASA INDONESIA"], "Kamis": ["EKONOMI", "BIOLOGI", "SOSIOLOGI", "BUDAYA MELAYU RIAU (BMR)"], "Jumat": ["SOSIOLOGI", "MATEMATIKA WAJIB", "BIOLOGI"], "Sabtu": [], "Minggu": [] }
  },
  "XII MIPA": {
    mapel: { "SEJARAH INDONESIA": "FAUZUL AZMI, S.Sos", "MATEMATIKA PEMINATAN (MTK PM)": "MERI ANDAYANI, S.Pd", "PENDIDIKAN PANCASILA dan KEWARGANEGARAAN (PPKn)": "ROSELA, S.H", "BAHASA INDONESIA": "ANITA SAPUTRI, S.E", "BIOLOGI": "IRZA LIANA PITRI, S.Sos", "FISIKA": "PUJI SUSANTI, S.Pd", "SENI BUDAYA": "SUNARNI, S.Pd", "KIMIA": "PUJI SUSANTI, S.Pd", "SOSIOLOGI": "DESWA YODI EKA PUTRA, S.Pd", "PENDIDIKAN JASMANI, OLAHRAGA dan KESEHATAN (PJOK)": "BONIKA, S.Pd", "PENDIDIKAN AGAMA ISLAM (PAI)": "ACI WINARTI, S.Pd.I", "BAHASA INGGRIS": "YUNI PUSPITASARI, S.Pd", "MATEMATIKA WAJIB": "MERI ANDAYANI, S.Pd", "PRAKARYA": "SUNARNI, S.Pd", "BUDAYA MELAYU RIAU (BMR)": "IRZA LIANA PITRI, S.Sos" },
    jadwal: { "Senin": ["SEJARAH INDONESIA", "MATEMATIKA PEMINATAN (MTK PM)", "PENDIDIKAN PANCASILA dan KEWARGANEGARAAN (PPKn)", "BAHASA INDONESIA", "BIOLOGI"], "Selasa": ["FISIKA", "SENI BUDAYA", "KIMIA", "SOSIOLOGI", "PENDIDIKAN JASMANI, OLAHRAGA dan KESEHATAN (PJOK)"], "Rabu": ["PENDIDIKAN AGAMA ISLAM (PAI)", "MATEMATIKA PEMINATAN (MTK PM)", "FISIKA", "SOSIOLOGI"], "Kamis": ["MATEMATIKA WAJIB", "BIOLOGI", "BAHASA INGGRIS", "KIMIA", "BAHASA INDONESIA"], "Jumat": ["MATEMATIKA WAJIB", "PRAKARYA", "BUDAYA MELAYU RIAU (BMR)"], "Sabtu": [], "Minggu": [] }
  }
};

/* pasangan mapel-guru untuk kelas terpilih (atau semua kelas). Mapel dengan nama sama
   tapi guru berbeda antar kelas dihitung terpisah, bukan saling menimpa. */
let MAPEL_GURU={},GURU_MAPEL={};   // mapel -> [guru]  |  guru -> [mapel]
function buildMaps(){
  const k=$("fKelas").value;
  const ks=k&&KONFIG_KELAS[k]?[k]:Object.keys(KONFIG_KELAS);
  MAPEL_GURU={};GURU_MAPEL={};
  ks.forEach(kk=>Object.entries(KONFIG_KELAS[kk].mapel).forEach(([m,g])=>{
    if(m===PAK)return;
    const a=(MAPEL_GURU[m]=MAPEL_GURU[m]||[]);if(!a.includes(g))a.push(g);
    const b=(GURU_MAPEL[g]=GURU_MAPEL[g]||[]);if(!b.includes(m))b.push(m);
  }));
}
function tambahOpsi(sel,v,dis){const o=document.createElement("option");o.value=v;o.textContent=v;if(dis)o.disabled=true;sel.appendChild(o);}
function isiAwal(){
  buildMaps();
  const selM=$("fMapel"),selG=$("fGuru");
  selM.innerHTML='<option value="">Semua Mapel</option>';
  selG.innerHTML='<option value="">Semua Guru</option>';
  Object.keys(MAPEL_GURU).sort().forEach(m=>tambahOpsi(selM,m));
  tambahOpsi(selM,PAK,true);                      // PAK hanya tampil (abu-abu) saat tidak ada guru terpilih
  Object.keys(GURU_MAPEL).sort().forEach(g=>tambahOpsi(selG,g));
}
function onKelasChange(){isiAwal();hasShown=false;renderStats([]);render();$("infoFilter").textContent="Pilih filter lalu klik Tampilkan";}
function onFilterTyping(){if(hasShown){$("infoFilter").textContent="Filter berubah, klik Tampilkan lagi";}}

/* ================= TANGGAL & STATUS ================= */
const HARI=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function labelTanggal(iso){const d=new Date(iso+"T00:00:00");return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;}
function normalStatus(s){if(!s)return "-";s=s.toString().trim().toLowerCase();if(["alpha","alfa","alpa","a"].includes(s))return "Alfa";if(["hadir","h"].includes(s))return "Hadir";if(["izin","ijin","i"].includes(s))return "Izin";if(["sakit","s"].includes(s))return "Sakit";return s.charAt(0).toUpperCase()+s.slice(1);}
function parseTanggalToISO(tgl){if(!tgl)return "";tgl=tgl.toString().trim();if(/^\d{4}-\d{2}-\d{2}$/.test(tgl))return tgl;const bm={januari:'01',februari:'02',maret:'03',april:'04',mei:'05',juni:'06',juli:'07',agustus:'08',september:'09',oktober:'10',november:'11',desember:'12'};const m=tgl.toLowerCase().match(/(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})/);if(m)return `${m[3]}-${bm[m[2]]}-${String(m[1]).padStart(2,'0')}`;const d=new Date(tgl);if(!isNaN(d))return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;return "";}
function isoOf(x){return x.tgl||parseTanggalToISO(x.tanggal);}
function formatTanggalCantik(tgl){const iso=parseTanggalToISO(tgl);if(!iso)return tgl||"-";const d=new Date(iso+"T00:00:00");if(isNaN(d))return tgl;const hari=["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"][d.getDay()];return `${hari}, ${String(d.getDate()).padStart(2,'0')} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;}
function formatJamCantik(jam){if(!jam)return "-";return jam.toString().replace(/ WIB/gi,"").trim().replaceAll(".",":")+" WIB";}
function onDateChange(){const el=$("fTanggal"),w=$("dateWrap");w.classList.toggle("has-value",!!el.value);onFilterTyping();}

/* ================= AUTH ================= */
function setAuthUI(isLogin,r="visit"){
  role=r;isDev=isLogin&&r==="developer";canEdit=isLogin&&(r==="guru"||r==="developer");
  $("dashData").classList.toggle("hidden",!isLogin);
  $("adminArea").classList.toggle("hidden",!canEdit);
  $("btnLogin").classList.toggle("hidden",isLogin);
  $("btnLogout").classList.toggle("hidden",!isLogin);
  document.querySelectorAll(".onlyEditor").forEach(el=>el.classList.toggle("hidden",!canEdit));
    document.querySelectorAll(".onlyDev").forEach(el=>el.classList.toggle("hidden",!isDev));
  if(selectMode&&!canEdit)setSelectMode(false);
  if(isLogin){
    const b=r==="developer"?`<span class="roleBadge role-dev">🧑🏻‍💻 DEV</span>`:r==="guru"?`<span class="roleBadge role-guru">👨‍🏫 GURU</span>`:`<span class="roleBadge role-visit">👀 VISIT</span>`;
    $("headerDesc").innerHTML=`mode ${b} - ${escapeHtml(maskEmail(currentEmail))}`;
  }else{$("headerDesc").textContent="Login untuk akses data";}
}
function bersihUI(){
  currentEmail="";setAuthUI(false);all=[];hasShown=false;selected.clear();
    renderStats([]);render();
    setAuto("db",null);
}
function roleDari(user){const r=user?.app_metadata?.role;return ["developer","guru","visit"].includes(r)?r:"visit";}
async function mulaiSesi(user){
  currentEmail=user.email;
  setAuthUI(true,roleDari(user));
  const tugas=[load(),muatStatusDb()];
  if(canEdit)tugas.push(muatPengaturan());
  await Promise.all(tugas);
}
async function login(){
  const e=$("email").value.trim(),p=$("pass").value.trim(),errBox=$("eLogin");
  const warn=m=>{errBox.textContent=m;errBox.style.display="block";setTimeout(()=>errBox.style.display="none",3000)};
  if(!e||!p)return warn("Email & password wajib");
  errBox.textContent="⏳ Memeriksa...";errBox.style.display="block";
  const {data,error}=await supa.auth.signInWithPassword({email:e,password:p});
  if(error){
    warn("❌ Salah! "+error.message);
    catatPercobaanLogin(e,"gagal",error.message);
    return;
  }
  errBox.style.display="none";closeL();$("email").value="";$("pass").value="";
  catatPercobaanLogin(e,"sukses",null);
  mulaiSesi(data.user);
  const r=roleDari(data.user);
  toast(r==="developer"?"🧑🏻‍💻 Developer":r==="guru"?"👨‍🏫 Guru":"👀 Visit (hanya lihat)");
}
async function logout(){await supa.auth.signOut();bersihUI();}
$("pass").addEventListener("keydown",e=>{if(e.key==="Enter")login();});
/* ===== ikon mata: tampilkan / sembunyikan password ===== */
const MATA_BUKA='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const MATA_TUTUP='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
function setLihatPass(lihat){
  $("pass").type=lihat?"text":"password";
  $("btnEye").innerHTML=lihat?MATA_BUKA:MATA_TUTUP;
  $("btnEye").setAttribute("aria-label",lihat?"Sembunyikan password":"Tampilkan password");
}
$("btnEye").addEventListener("pointerdown",e=>e.preventDefault());   // fokus tetap di kolom password
$("btnEye").addEventListener("click",()=>{setLihatPass($("pass").type==="password");$("pass").focus();});

/* ===== pengaman scroll (untuk browser lama yang mengabaikan overflow:hidden) ===== */
function terkunci(){const c=document.documentElement.classList;return c.contains("skl")||c.contains("boot-sess")||c.contains("boot-login");}
document.addEventListener("touchmove",e=>{if(terkunci())e.preventDefault();},{passive:false});
document.addEventListener("wheel",e=>{if(terkunci())e.preventDefault();},{passive:false});
supa.auth.onAuthStateChange(ev=>{if(ev==="SIGNED_OUT"&&currentEmail)bersihUI();});

/* ================= LOAD DATA (semua halaman, bukan hanya 1000) ================= */
async function ambilSemua(){
  let rows=[],from=0;const step=1000;
  while(true){
    const {data,error}=await supa.from(TABLE_NAME).select("*")
      .order("created_at",{ascending:false}).order("id",{ascending:false}).range(from,from+step-1);
    if(error){
      if(/jwt|expired/i.test(error.message)){toast("Sesi habis, silakan login ulang");logout();}
      else{toast("Gagal load: "+error.message);catatError(error.message);}
      return {ok:false};
    }
    rows=rows.concat(data||[]);
    if(!data||data.length<step)break;
    from+=step;
  }
  return {ok:true,rows};
}
async function load(keep=false,sk=!keep){
  if(sk)skeletonData(true);
  const h=await ambilSemua();
  if(sk)skeletonData(false);
  if(!h.ok){render();return false;}
  all=h.rows;
  const ada=new Set(all.map(x=>String(x.id)));
  [...selected].forEach(i=>{if(!ada.has(i))selected.delete(i);});
  if(keep&&hasShown){renderStats(getFiltered());render();}
  else{hasShown=false;renderStats([]);render();toast(`📥 ${all.length} data siap, klik Tampilkan`);}
  return true;
}

function renderStats(filtered){
  const d=filtered||[];
  ["Hadir","Izin","Sakit","Alfa"].forEach(s=>{$("c"+s).textContent=d.filter(x=>normalStatus(x.status)===s).length;});
}

function getFiltered(){
  let d=[...all];
  if($("fKelas").value)d=d.filter(x=>(x.kelas||"")===$("fKelas").value);
  if($("fNama").value)d=d.filter(x=>x.nama?.toLowerCase().includes($("fNama").value.toLowerCase()));
  if($("fStatus").value)d=d.filter(x=>normalStatus(x.status)===normalStatus($("fStatus").value));
  if($("fMapel").value&&!$("fMapel").value.includes("PAK"))d=d.filter(x=>(x.mapel||"")===$("fMapel").value);
  if($("fGuru").value)d=d.filter(x=>(x.guru||"")===$("fGuru").value);
  if($("fTanggal").value){const p=$("fTanggal").value;d=d.filter(x=>isoOf(x)===p);}
  d.sort((a,b)=>(a.nama||"").toLowerCase().localeCompare((b.nama||"").toLowerCase()));
  return d;
}

function tampilkanData(){
  const f=getFiltered();hasShown=true;
  renderStats(f);render();
  toast(`✅ Menampilkan ${f.length} data`);
}

/* ================= RENDER TABEL ================= */
const opsi=(list,cur)=>{
  const l=[...list];if(cur&&cur!=="-"&&!l.includes(cur))l.unshift(cur);
  return `<option value="">-</option>`+l.map(v=>`<option ${v===cur?"selected":""}>${escapeHtml(v)}</option>`).join("");
};

function barisHtml(x){
  const id=String(x.id),st=normalStatus(x.status),iso=isoOf(x);
  const tglC=formatTanggalCantik(iso||x.tanggal),jamC=formatJamCantik(x.jam);
  const jamIn=x.jam?x.jam.toString().substring(0,5).replace(".",":"):"";
  const mapel=x.mapel||"-",guru=x.guru||"-",ket=x.keterangan||"";
  const eid=escapeHtml(id);
  const ck=`<td class="ckCol"><input type="checkbox" class="rowCk" data-id="${eid}" ${selected.has(id)?"checked":""}></td>`;
  const delBtn=`<button class="btnDel" data-del="${eid}">🗑️</button>`;
  const statusSel=`<div style="display:flex;flex-direction:column;gap:4px"><select class="editInput" style="width:75px" data-f="status" data-id="${eid}">${["Hadir","Izin","Sakit","Alfa"].map(s=>`<option ${st===s?"selected":""}>${s}</option>`).join("")}</select><span class="badge ${escapeHtml(st)}" style="font-size:9px;width:fit-content">${escapeHtml(st)}</span></div>`;

  if(isDev){
    const mk=KONFIG_KELAS[x.kelas]?.mapel||{};
    const mapelList=Object.keys(mk),guruList=[...new Set(Object.values(mk))];
    const ketCell=st==="Izin"
      ?`<input class="editInput" style="width:170px" maxlength="200" placeholder="keterangan izin" value="${escapeHtml(ket)}" data-f="keterangan" data-id="${eid}">`
      :"-";
    return `<tr data-id="${eid}">${ck}
    <td class="namaCell"><input class="editInput" style="width:110px" value="${escapeHtml(x.nama)}" data-f="nama" data-id="${eid}"><br><small style="font-size:9px">${escapeHtml(x.kelas||"")}</small></td>
    <td>${statusSel}</td>
    <td><div style="display:flex;flex-direction:column;gap:4px"><select class="editInput" style="width:115px" data-f="guru" data-id="${eid}">${opsi(guruList,guru)}</select><span class="badge badge-guru" style="font-size:9px;width:fit-content">${escapeHtml(guru)}</span></div></td>
    <td><div style="display:flex;flex-direction:column;gap:4px"><select class="editInput" style="width:115px" data-f="mapel" data-id="${eid}">${opsi(mapelList,mapel)}</select><span class="badge badge-mapel" style="font-size:9px;width:fit-content">${escapeHtml(mapel)}</span></div></td>
    <td><div style="display:flex;flex-direction:column;gap:4px"><input type="date" class="editInput" style="width:110px" value="${escapeHtml(iso)}" data-f="tgl" data-id="${eid}"><span style="font-size:10px;font-weight:700">${tglC}</span></div></td>
    <td><div style="display:flex;flex-direction:column;gap:4px"><input type="time" class="editInput" style="width:80px" value="${jamIn}" data-f="jam" data-id="${eid}"><span style="font-size:10px;font-weight:700">${jamC}</span></div></td>
    <td class="ketCell">${ketCell}</td>
    <td>${delBtn}</td></tr>`;
  }

  // guru & visit: data hanya dibaca. Guru bisa ubah status dan hapus. Visit tidak bisa apa-apa.
  const ketTxt=st==="Izin"?(ket?escapeHtml(ket):'<i style="color:#9a8fb0">(tanpa keterangan)</i>'):"-";
  return `<tr data-id="${eid}">${ck}
  <td class="namaCell"><b>${escapeHtml(x.nama)}</b><br><small>${escapeHtml(x.kelas||"")}</small></td>
  <td>${canEdit?statusSel:`<span class="badge ${escapeHtml(st)}">${escapeHtml(st)}</span>`}</td>
  <td><span class="badge badge-guru">${escapeHtml(guru)}</span></td>
  <td><span class="badge badge-mapel">${escapeHtml(mapel)}</span></td>
  <td>${tglC}</td><td>${jamC}</td>
  <td class="ketCell">${ketTxt}</td>
  <td>${canEdit?delBtn:"-"}</td></tr>`;
}

function renderRekap(d){
  const area=$("rekapArea"),guruVal=$("fGuru").value,mapelVal=$("fMapel").value,kelasVal=$("fKelas").value;
  if(!((guruVal||mapelVal)&&d.length>0)){area.classList.add("hidden");area.innerHTML="";return;}
  area.classList.remove("hidden");
  const hitung=a=>({Hadir:a.filter(x=>normalStatus(x.status)==="Hadir").length,Izin:a.filter(x=>normalStatus(x.status)==="Izin").length,Sakit:a.filter(x=>normalStatus(x.status)==="Sakit").length,Alfa:a.filter(x=>normalStatus(x.status)==="Alfa").length,total:a.length});
  const box=(ic,t,v)=>`<div class="rekapBox"><h4>${ic} ${escapeHtml(t)}</h4><div style="font-size:12px;line-height:1.8">Hadir: ${v.Hadir} | Izin: ${v.Izin} | Sakit: ${v.Sakit} | Alfa: ${v.Alfa}<br><b>Total: ${v.total} siswa</b></div></div>`;

  if(guruVal&&mapelVal&&kelasVal){area.innerHTML=box("📚",`${mapelVal} (${kelasVal})`,hitung(d));return;}

  const groups={};let ic;
  if(guruVal&&!mapelVal){            // 1 guru, semua mapelnya (per kelas bila "Semua Kelas")
    ic="📚";
    d.forEach(x=>{const k=kelasVal?(x.mapel||"Tanpa mapel"):`${x.mapel||"Tanpa mapel"} (${x.kelas||"-"})`;(groups[k]=groups[k]||[]).push(x);});
  }else if(guruVal&&mapelVal){       // 1 guru, 1 mapel, banyak kelas
    ic="🏫";
    d.forEach(x=>{const k=`${mapelVal} (${x.kelas||"-"})`;(groups[k]=groups[k]||[]).push(x);});
  }else{                             // hanya mapel: pecah per guru
    ic="👨‍🏫";
    d.forEach(x=>{const k=x.guru||"Tanpa guru";(groups[k]=groups[k]||[]).push(x);});
  }
  area.innerHTML=Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,a])=>box(ic,k,hitung(a))).join("");
}

function render(){
  const tbody=$("tbody");
  if(!hasShown){
    $("infoFilter").textContent=`${all.length} data siap - Pilih filter lalu klik Tampilkan`;
    $("rekapArea").classList.add("hidden");
    tbody.innerHTML=`<tr><td colspan=9 style="text-align:center;border:0;color:#6b5b8a;padding:20px">🔍 Klik <b>Tampilkan</b> untuk melihat data<br><small style="font-size:10px">${all.length} data tersimpan</small></td></tr>`;
    syncSelectUI();return;
  }
  const d=getFiltered();
  $("infoFilter").textContent=`Menampilkan ${d.length}/${all.length} | ${$("fKelas").value||"Semua Kelas"} - ${$("fGuru").value||"Semua Guru"} - ${$("fMapel").value||"Semua Mapel"}`;
  renderRekap(d);
  tbody.innerHTML=d.map(barisHtml).join("")||`<tr><td colspan=9 style="text-align:center;border:0;color:#6b5b8a">Tidak ada data sesuai filter</td></tr>`;
  syncSelectUI();
}

/* ================= MODE PILIH (CEKBOX) ================= */
function setSelectMode(on,firstId){
  if(on&&!canEdit)return;
  selectMode=on;
  $("tblWrap").classList.toggle("selecting",on);
  $("selBar").classList.toggle("hidden",!on);
  $("btnPilih").textContent=on?"✖️ Selesai Pilih":"☑️ Pilih Data";
  if(!on)selected.clear();
  if(on&&firstId)selected.add(String(firstId));
  if(on&&!hasShown)toast("Klik Tampilkan dulu untuk melihat data");
  syncSelectUI();
}
function syncSelectUI(){
  $("selCount").textContent=selected.size+" dipilih";
  const cks=[...document.querySelectorAll(".rowCk")];
  cks.forEach(c=>{const on=selected.has(c.dataset.id);c.checked=on;c.closest("tr").classList.toggle("rowSel",on);});
  $("ckAll").checked=cks.length>0&&cks.every(c=>c.checked);
}
$("ckAll").addEventListener("change",e=>{
  document.querySelectorAll(".rowCk").forEach(c=>{if(e.target.checked)selected.add(c.dataset.id);else selected.delete(c.dataset.id);});
  syncSelectUI();
});

// tahan baris selama 0,6 detik = masuk mode pilih
let lpTimer=null;
const batalLP=()=>{clearTimeout(lpTimer);lpTimer=null;};
$("tbody").addEventListener("pointerdown",e=>{
  if(!canEdit||selectMode||!hasShown)return;
  if(e.target.closest("input,select,button,textarea"))return;
  const tr=e.target.closest("tr[data-id]");if(!tr)return;
  lpTimer=setTimeout(()=>{setSelectMode(true,tr.dataset.id);if(navigator.vibrate)navigator.vibrate(30);},600);
});
["pointerup","pointerleave","pointercancel"].forEach(ev=>$("tbody").addEventListener(ev,batalLP));

$("tbody").addEventListener("click",e=>{
  const del=e.target.closest("[data-del]");
  if(del){hapusSatu(del.dataset.del);return;}
  if(!selectMode)return;
  if(e.target.closest("input,select,textarea,button"))return;
  const tr=e.target.closest("tr[data-id]");if(!tr)return;
  const i=tr.dataset.id;
  if(selected.has(i))selected.delete(i);else selected.add(i);
  syncSelectUI();
});

$("tbody").addEventListener("change",e=>{
  const el=e.target;
  if(el.classList.contains("rowCk")){
    if(el.checked)selected.add(el.dataset.id);else selected.delete(el.dataset.id);
    syncSelectUI();return;
  }
  const f=el.dataset.f;if(!f)return;
  const id=el.dataset.id;
  if(f==="status")return ubah(id,{status:el.value},"✅ Status diubah");
  if(!isDev)return toast("🔒 Hanya developer yang bisa mengubah ini");
  if(f==="mapel")return editMapel(id,el.value);
  if(f==="guru")return editGuru(id,el.value);
  if(f==="tgl")return editTanggal(id,el.value);
  if(f==="jam")return editJam(id,el.value);
  if(f==="nama"&&!el.value.trim())return toast("❌ Nama tidak boleh kosong");
  if(f==="keterangan")return ubah(id,{keterangan:el.value.trim().slice(0,200)||null},"✅ Keterangan disimpan");
  return ubah(id,{[f]:el.value.trim()},"✅ "+f+" diubah");
});

/* ================= EDIT & HAPUS ================= */
async function ubah(id,obj,pesan){
  if(!canEdit)return toast("🔒 Tidak punya izin");
  const {data,error}=await supa.from(TABLE_NAME).update(obj).eq("id",id).select("id");
  if (error) { catatError(error.message); return toast("❌ " + error.message); }
  if (!data || !data.length) return toast("❌ Ditolak oleh database (cek izin / policy)");
  toast(pesan||"✅ Tersimpan");load(true);
}
function barisById(id){return all.find(x=>String(x.id)===String(id));}
function editMapel(id,m){
  const row=barisById(id);
  if(!m)return toast("❌ Mapel kosong");
  if(m.includes("PAK"))return toast("❌ PAK tidak ada guru");
  const g=KONFIG_KELAS[row?.kelas]?.mapel[m];
  if(!g)return toast("❌ Mapel itu tidak ada di kelas "+(row?.kelas||"ini"));
  ubah(id,{mapel:m,guru:g},`📚 ${m} → ${g}`);
}
function editGuru(id,g){
  const row=barisById(id);
  if(!g)return toast("❌ Guru kosong");
  const mk=KONFIG_KELAS[row?.kelas]?.mapel||{};
  const list=Object.entries(mk).filter(([m,gg])=>gg===g).map(([m])=>m);
  if(!list.length)return toast("❌ Guru itu tidak mengajar di kelas "+(row?.kelas||"ini"));
  const m=list.includes(row?.mapel)?row.mapel:list[0];
  ubah(id,{guru:g,mapel:m},`👨‍🏫 ${g} → ${m}`);
}
function editTanggal(id,iso){
  if(!iso)return toast("❌ Tanggal kosong");
  ubah(id,{tgl:iso,tanggal:labelTanggal(iso)},"✅ Tanggal diubah");
}
function editJam(id,v){
  if(!v)return toast("❌ Jam kosong");
  ubah(id,{jam:v.length===5?v+":00":v},"✅ Jam diubah");
}

async function hapusIds(ids){
  let terhapus=0;
  for(let i=0;i<ids.length;i+=100){
    const {data,error}=await supa.from(TABLE_NAME).delete().in("id",ids.slice(i,i+100)).select("id");
    if(error)return {error,terhapus};
    terhapus+=(data||[]).length;
  }
  return {terhapus};
}
async function hapusSatu(id){
  if(!canEdit)return toast("🔒 Tidak punya izin");
  if(!confirm("Hapus data ini?"))return;
  const r=await hapusIds([id]);
  if(r.error)return toast("❌ "+r.error.message);
  if(!r.terhapus)return toast("❌ Ditolak oleh database (cek izin / policy)");
  toast("Terhapus");load(true);
}
async function hapusTerpilih(){
  if(!canEdit)return;
  const ids=[...selected];
  if(!ids.length)return toast("Belum ada data yang dipilih");
  if(!confirm(`Hapus ${ids.length} data terpilih? Tidak bisa dibatalkan.`))return;
  const r=await hapusIds(ids);
  if(r.error)toast("❌ "+r.error.message);
  else toast(r.terhapus===ids.length?`🗑️ ${r.terhapus} data terhapus`:`⚠️ ${r.terhapus} dari ${ids.length} terhapus (sisanya ditolak izin)`,3500);
  selected.clear();load(true);
}
async function hapusSemua(){
  if(!canEdit)return toast("🔒 Tidak punya izin");
  if(!hasShown)return toast("Klik Tampilkan dulu");
  const d=getFiltered();
  if(!d.length)return toast("Tidak ada data");
  if(!confirm(`Hapus ${d.length} data yang terfilter?`))return;
  const r=await hapusIds(d.map(x=>x.id));
  if(r.error)toast("❌ "+r.error.message);else toast(`🗑️ ${r.terhapus} data terhapus`);
  load(true);
}

function resetFilter(){
  $("fTanggal").value="";$("dateWrap").classList.remove("has-value");
  $("fKelas").value="";$("fNama").value="";$("fStatus").value="";
  isiAwal();hasShown=false;renderStats([]);render();
  $("infoFilter").textContent="Filter direset, klik Tampilkan";
}

/* ================= EXCEL ================= */
async function downloadExcel(){
  if(!hasShown)return toast("Klik Tampilkan dulu baru download");
  const d=getFiltered();if(!d.length)return toast("Tidak ada data");
  const wb=new ExcelJS.Workbook(),ws=wb.addWorksheet("Absensi");
  const HEADER=["NAMA","KELAS","STATUS","GURU","MAPEL","TANGGAL","JAM","KETERANGAN"];
  const FILLS=["FFFFE26A","FFB4F8C8","FFFF8A65","FFD8B4FE","FFFFDA77","FFA0E7E5","FFB4F8C8","FFFFE26A"];
  const WIDTHS=[22,12,14,30,42,34,18,40];
  const bd={style:'medium',color:{argb:'FF2D1B4E'}},border={top:bd,left:bd,bottom:bd,right:bd};
  const hRow=ws.addRow(HEADER);hRow.height=28;
  WIDTHS.forEach((w,i)=>ws.getColumn(i+1).width=w);
  hRow.eachCell((c,col)=>{c.fill={type:'pattern',pattern:'solid',fgColor:{argb:FILLS[col-1]}};c.font={bold:true,size:12,color:{argb:"FF2D1B4E"}};c.alignment={horizontal:'center',vertical:'middle',wrapText:true};c.border=border;});
  d.forEach(r=>{
    const row=ws.addRow([r.nama||"",r.kelas||"",normalStatus(r.status),r.guru||"",r.mapel||"",formatTanggalCantik(isoOf(r)||r.tanggal),formatJamCantik(r.jam),r.keterangan||""]);
    row.eachCell(c=>{c.alignment={horizontal:'center',vertical:'middle',wrapText:true};c.font={size:11,color:{argb:"FF2D1B4E"}};c.border=border;});
  });
  const buf=await wb.xlsx.writeBuffer();
  const blob=new Blob([buf],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=`absensi-${$("fKelas").value||"semua"}-${$("fTanggal").value||new Date().toISOString().slice(0,10)}.xlsx`;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1000);
  toast("✅ Excel OK!");
}

/* ================= FILTER GURU <-> MAPEL ================= */
$("fGuru").addEventListener("change",()=>{
  if(isSyncing)return;isSyncing=true;
  const guru=$("fGuru").value,selM=$("fMapel");
  if(!guru){isiAwal();}
  else{
    selM.innerHTML='<option value="">Semua Mapel</option>';
    (GURU_MAPEL[guru]||[]).slice().sort().forEach(m=>tambahOpsi(selM,m));
    selM.value="";
  }
  isSyncing=false;onFilterTyping();
});
$("fMapel").addEventListener("change",()=>{
  if(isSyncing)return;isSyncing=true;
  const mapel=$("fMapel").value,selG=$("fGuru"),guruLama=selG.value;
  if(!mapel){
    if(!guruLama)isiAwal();
    isSyncing=false;onFilterTyping();return;
  }
  if(mapel.includes("PAK")){toast("❌ PAK tidak ada guru");$("fMapel").value="";isSyncing=false;return;}
  const gurus=(MAPEL_GURU[mapel]||[]).slice().sort();
  selG.innerHTML='<option value="">Semua Guru</option>';
  gurus.forEach(g=>tambahOpsi(selG,g));
  if(gurus.length===1)selG.value=gurus[0];
  else if(gurus.includes(guruLama))selG.value=guruLama;
  isSyncing=false;onFilterTyping();
});

/* ================= PENGATURAN: ABSEN SEKALI ================= */
function updateSwLabel(){$("swLabel").textContent=$("swSekali").checked?"ON":"OFF";}
async function muatPengaturan(){
  $("swLabel").classList.add("sk");
  const {data}=await supa.rpc("info_absen");
  const r=Array.isArray(data)?data[0]:data;
  $("swSekali").checked=!!(r&&r.sekali);updateSwLabel();
  $("swLabel").classList.remove("sk");

  const {data:a}=await supa.rpc("get_alfa_otomatis");
  const ra=Array.isArray(a)?a[0]:a;
  $("swAlfa").checked=!!(ra&&ra.on_);$("swAlfaLabel").textContent=$("swAlfa").checked?"ON":"OFF";
  $("jamAlfa").value=(ra&&ra.jam)||"17:00";
  $("jamBuka").value=(r&&r.jam_buka)||"06:00";
}
$("swAlfa").addEventListener("change",()=>{$("swAlfaLabel").textContent=$("swAlfa").checked?"ON":"OFF";});
$("btnSimpanAlfa").addEventListener("click",async()=>{
  $("btnSimpanAlfa").disabled=true;
  const r1=await supa.rpc("set_alfa_otomatis",{p_on:$("swAlfa").checked,p_jam:$("jamAlfa").value});
  const r2=await supa.rpc("set_jam_buka",{p_jam:$("jamBuka").value});
  $("btnSimpanAlfa").disabled=false;
  if(r1.error)return toast("❌ "+r1.error.message,4000);
  if(r2.error)return toast("❌ "+r2.error.message,4000);
  toast("✅ Jadwal absensi diperbarui");
});
$("swSekali").addEventListener("change",async e=>{
  const on=e.target.checked;
  const {error}=await supa.rpc("set_mode_sekali",{p_on:on});
  if(error){e.target.checked=!on;updateSwLabel();toast("❌ "+error.message);return;}
  updateSwLabel();
  toast(on?"✅ ON: sekali absen = semua mapel hari itu":"✅ OFF: absen per mapel");
});

/* ================= LIBUR MANUAL ================= */
async function muatLibur(){
  const box=$("listLibur");
  skList(box,2);
  const {data,error}=await supa.rpc("daftar_libur");
  if(error){box.textContent="❌ "+error.message;return;}
  if(!data||!data.length){box.textContent="Belum ada libur manual.";return;}
  box.innerHTML=data.map(l=>{
    const tgl=l.tgl_mulai===l.tgl_akhir?formatTanggalCantik(l.tgl_mulai):`${formatTanggalCantik(l.tgl_mulai)}<br>s/d ${formatTanggalCantik(l.tgl_akhir)}`;
    return `<div class="item"><div><b>${tgl}</b><br>${escapeHtml(l.alasan)}<br><small>oleh ${escapeHtml(maskEmail(l.dibuat_oleh||""))}</small></div><div class="btns"><button class="btn btn-red" data-hl="${l.id}">🗑️ Hapus</button></div></div>`;
  }).join("");
}

async function muatLiburNasional(){
  const box=$("listLiburNas");
  skList(box,2);
  const {data,error}=await supa.rpc("daftar_libur_nasional");
  if(error){box.textContent="❌ "+error.message;return;}
  if(!data||!data.length){box.textContent="Belum ada data (coba 'Perbarui dari internet').";return;}
  box.innerHTML=data.map(l=>`<div class="item"><div>${formatTanggalCantik(l.tgl)}<br><b>${escapeHtml(l.nama)}</b></div></div>`).join("");
}
$("btnRefreshLiburNas").addEventListener("click", async () => {
  $("btnRefreshLiburNas").disabled = true;
  try {
    const tahun = new Date().getFullYear();
    const hasil = await Promise.all([tahun, tahun + 1].map(async th => {
      const r = await fetch(`https://api-harilibur.vercel.app/api?year=${th}`);
      if (!r.ok) throw new Error("Gagal mengambil data tahun " + th);
      const j = await r.json();
      const { data, error } = await supa.rpc("simpan_libur_nasional", { p_tahun: th, p_data: j });
      if (error) throw new Error(error.message);
      return data;
    }));
    toast(`✅ ${hasil.reduce((a,b)=>a+b,0)} hari libur diperbarui`);
  } catch (e) {
    toast("❌ " + e.message, 4000);
  } finally {
    $("btnRefreshLiburNas").disabled = false;
    muatLiburNasional();
  }
});

$("btnKirimLibur").addEventListener("click",async()=>{
  const m=$("lMulai").value,a=$("lAkhir").value||m,al=$("lAlasan").value.trim();
  if(!m)return toast("Pilih tanggal libur");
  if(a<m)return toast("Tanggal selesai sebelum tanggal mulai");
  if(al.length<3)return toast("Tulis alasan libur (min. 3 huruf)");
  $("btnKirimLibur").disabled=true;
  const {error}=await supa.rpc("tambah_libur",{p_mulai:m,p_akhir:a,p_alasan:al});
  $("btnKirimLibur").disabled=false;
  if(error)return toast("❌ "+error.message,4000);
  $("lMulai").value="";$("lAkhir").value="";$("lAlasan").value="";
  toast("✅ Libur terkirim");muatLibur();
});
$("listLibur").addEventListener("click",async e=>{
  const b=e.target.closest("[data-hl]");if(!b)return;
  if(!confirm("Hapus libur ini?"))return;
  const {error}=await supa.rpc("hapus_libur",{p_id:Number(b.dataset.hl)});
  if(error)return toast("❌ "+error.message);
  toast("Libur dihapus");muatLibur();
});
$("pnlLibur").addEventListener("toggle",()=>{if($("pnlLibur").open){muatLibur();muatLiburNasional();}});

/* ================= RESET QR ================= */
let siswaCache=null;
async function muatSiswaCache(){
  if(siswaCache){isiRNama();return;}
  $("rNama").classList.add("sk");
  const {data,error}=await supa.rpc("siswa_dash");
  $("rNama").classList.remove("sk");
  if(error){toast("❌ "+error.message);return;}
  siswaCache=data||[];isiRNama();
}
function isiRNama(){
  const k=$("rKelas").value;
  $("rNama").innerHTML='<option value="">-- Pilih nama --</option>';
  (siswaCache||[]).filter(s=>k==="SEMUA"||s.kelas===k).forEach(s=>{
    const o=document.createElement("option");
    o.value=s.kelas+"|"+s.nama;
    o.textContent=`${s.nama} (${s.kelas})${s.terikat?" 🔒":""}`;
    $("rNama").appendChild(o);
  });
}
function aturResetUI(){
  const w=$("rJenis").value==="wewenang";
  $("rSiswa").classList.toggle("hidden",w);
  $("rWewenang").classList.toggle("hidden",!w);
  $("rNamaWrap").classList.toggle("hidden",$("rBy").value!=="nama");
  if(w)muatPetugas();else muatSiswaCache();
}
$("rJenis").addEventListener("change",aturResetUI);
$("rBy").addEventListener("change",aturResetUI);
$("rKelas").addEventListener("change",isiRNama);
$("pnlReset").addEventListener("toggle",()=>{if($("pnlReset").open)aturResetUI();});

$("btnResetSiswa").addEventListener("click",async()=>{
  const by=$("rBy").value,aksi=$("rAksi").value;
  let kelas=$("rKelas").value,nama=null,target;
  if(by==="nama"){
    const v=$("rNama").value;if(!v)return toast("Pilih nama siswa dulu");
    [kelas,nama]=v.split("|");target=`${nama} (${kelas})`;
  }else target=kelas==="SEMUA"?"SEMUA siswa di SEMUA kelas":`semua siswa kelas ${kelas}`;
  const txt=aksi==="hp"?"reset ikatan HP (QR bisa di-scan dari HP baru)":"GANTI KODE QR (kartu lama langsung tidak berlaku, harus cetak ulang)";
  if(!confirm(`${txt}\n\nUntuk: ${target}\n\nLanjutkan?`))return;
  $("btnResetSiswa").disabled=true;
  const {data,error}=await supa.rpc("reset_qr_siswa",{p_mode:aksi,p_kelas:kelas,p_nama:nama});
  $("btnResetSiswa").disabled=false;
  if(error)return toast("❌ "+error.message,4000);
  toast(`✅ ${data} siswa direset`+(aksi==="kode"?" • cetak ulang kartu di cetak.html":""),4500);
  siswaCache=null;muatSiswaCache();
});

async function muatPetugas(){
  const box=$("listPetugas");
  skList(box,2);
  const {data,error}=await supa.rpc("petugas_dash");
  if(error){box.textContent="❌ "+error.message;return;}
  if(!data||!data.length){box.textContent="Belum ada QR wewenang.";return;}
  box.innerHTML=data.map(p=>{
    const terakhir=p.terakhir_pakai?new Date(p.terakhir_pakai).toLocaleString("id-ID",{timeZone:"Asia/Jakarta"}):"belum pernah";
    return `<div class="item"><div><b>${escapeHtml(p.label)}</b> ${p.aktif?"✅":"⛔ nonaktif"}<br><small>dipakai ${p.jumlah_pakai}x • terakhir ${terakhir}</small></div><div class="btns"><button class="btn btn-red" data-pt="${p.id}" data-m="hapus">🗑️ Hapus QR</button><button class="btn" data-pt="${p.id}" data-m="${p.aktif?"nonaktif":"aktif"}">${p.aktif?"⛔ Nonaktifkan":"✅ Aktifkan"}</button></div></div>`;
  }).join("");
}
$("listPetugas").addEventListener("click",async e=>{
  const b=e.target.closest("[data-pt]");if(!b)return;
  const m=b.dataset.m;
  if(m==="hapus"){
    if(!confirm("Hapus QR wewenang ini dari database? Tidak bisa dikembalikan."))return;
    const {error}=await supa.rpc("hapus_petugas",{p_id:Number(b.dataset.pt)});
    if(error)return toast("❌ "+error.message);
    toast("🗑️ QR wewenang dihapus");muatPetugas();return;
  }
  const t={nonaktif:"Nonaktifkan QR wewenang ini?",aktif:"Aktifkan lagi QR wewenang ini?"}[m];
  if(!confirm(t))return;
  const {error}=await supa.rpc("reset_qr_petugas",{p_id:Number(b.dataset.pt),p_mode:m});
  if(error)return toast("❌ "+error.message);
  toast("✅ Berhasil",4000);muatPetugas();
});

/* ================= INFO SERVER ================= */
const JENIS_INFO={
  info:{ic:"ℹ️",t:"Informasi"},
  maintenance:{ic:"🛠️",t:"Maintenance"},
  masalah:{ic:"⚠️",t:"Server bermasalah"},
  penuh:{ic:"💾",t:"Data server penuh"},
  lainnya:{ic:"📢",t:"Pengumuman"},
  offline:{ic:"📡",t:"Offline"}
};
const srvManual=[];      // dari database (dibuat developer)
const srvAuto={};        // terdeteksi otomatis
let srvDismiss=new Set();
try{srvDismiss=new Set(JSON.parse(sessionStorage.getItem("srv_dismiss")||"[]"));}catch(e){}
let srvDown=false,cekBusy=false;

function itemHtml(jenis,pesan,sub,id){
  const k=JENIS_INFO[jenis]?jenis:"lainnya",j=JENIS_INFO[k];
  return `<div class="srvItem srv-${k}" role="status"><span class="ic">${j.ic}</span><div class="tx">${escapeHtml(pesan)}${sub?`<small>${escapeHtml(sub)}</small>`:""}</div>${id!=null?`<button class="x" data-srvx="${escapeHtml(String(id))}" aria-label="Tutup">✕</button>`:""}</div>`;
}

function renderServerInfo(){
  Object.keys(srvAuto).forEach(k=>{const a=srvAuto[k];if(a.exp&&a.exp<=Date.now())delete srvAuto[k];});
  const auto=Object.values(srvAuto);
  const h=[];
  auto.forEach(a=>h.push(itemHtml(a.jenis,a.pesan,a.sub,null)));
  srvManual.filter(m=>!srvDismiss.has(String(m.id))).forEach(m=>h.push(itemHtml(m.jenis,m.pesan,null,m.id)));
  $("serverBanner").innerHTML=h.join("");
  // layar login: teks ringkas
  $("loginInfo").innerHTML=[...auto,...srvManual].map(m=>`<div class="loginInfoItem">${(JENIS_INFO[m.jenis]||JENIS_INFO.lainnya).ic} ${escapeHtml(m.pesan)}</div>`).join("");
}

function setAuto(key,obj,ttl){
  if(obj)srvAuto[key]=Object.assign({},obj,{exp:ttl?Date.now()+ttl:0});
  else delete srvAuto[key];
  renderServerInfo();
}

$("serverBanner").addEventListener("click",e=>{
  const b=e.target.closest("[data-srvx]");if(!b)return;
  srvDismiss.add(b.dataset.srvx);
  try{sessionStorage.setItem("srv_dismiss",JSON.stringify([...srvDismiss]));}catch(_){}
  renderServerInfo();
});

function deteksiStatus(status,teks){
  teks=String(teks||"");
  if(status===402||/quota|exceed|storage|disk|limit|restricted|penuh/i.test(teks))
    return {jenis:"penuh",pesan:"Data / kuota server sudah penuh",sub:"Hubungi developer untuk membersihkan data atau menambah kapasitas."};
  if(status===503||/maintenance|paused|unavailable/i.test(teks))
    return {jenis:"maintenance",pesan:"Server sedang maintenance",sub:"Coba lagi beberapa saat. Mencoba terhubung ulang otomatis."};
  return {jenis:"masalah",pesan:"Server sedang bermasalah (kode "+status+")",sub:"Data mungkin tidak terbaru. Mencoba terhubung ulang otomatis."};
}

async function cekServer(){
  if(cekBusy)return;cekBusy=true;
  try{
    if(!navigator.onLine){
      setAuto("net",{jenis:"offline",pesan:"Tidak ada koneksi internet",sub:"Periksa sinyal atau Wi-Fi kamu."});
      return;
    }
    setAuto("net",null);
    const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),8000);
    try{
      const res=await fetch(`${SUPABASE_URL}/rest/v1/rpc/info_server`,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},body:"{}",signal:ctl.signal});
      clearTimeout(to);
      if(res.ok){
        const j=await res.json().catch(()=>[]);
        srvManual.splice(0,srvManual.length,...(Array.isArray(j)?j:[]));
        setAuto("srv",null);
        if(srvDown){srvDown=false;toast("✅ Server kembali normal");}
      }else{
        srvDown=true;
        setAuto("srv",deteksiStatus(res.status,await res.text().catch(()=>"")));
      }
    }catch(e){
      clearTimeout(to);
      srvDown=true;
      setAuto("srv",{jenis:"masalah",pesan:"Server tidak merespons",sub:"Mungkin sedang maintenance atau bermasalah. Data mungkin tidak terbaru. Mencoba lagi otomatis."});
    }
  }finally{cekBusy=false;renderServerInfo();}
}

// dipanggil dari pesan error operasi data
function catatError(msg){
  msg=String(msg||"");
  if(/read-only|read only|no space|disk|quota|exceed|storage limit|limit reached/i.test(msg))
    setAuto("ro",{jenis:"penuh",pesan:"Data di server sudah penuh atau server dalam mode baca saja",sub:"Perubahan tidak bisa disimpan. Hubungi developer."},600000);
  else if(/failed to fetch|network|timeout|timed out|load failed/i.test(msg))
    cekServer();
}

async function muatStatusDb(){
  const {data,error}=await supa.rpc("status_db");
  const r=Array.isArray(data)?data[0]:data;
  if(error||!r)return;
  const p=Number(r.persen),u=Number(r.ukuran_mb),b=Number(r.batas_mb);
  const el=$("dbUsage");
  if(el)el.innerHTML=`💽 Pemakaian database: <b>${u} MB</b> dari ${b} MB (<b>${p}%</b>)`;
  const sub=`Terpakai ${u} MB dari ${b} MB (${p}%). Hapus data lama atau tambah kapasitas server.`;
  if(p>=95)setAuto("db",{jenis:"penuh",pesan:"Data di server sudah penuh",sub});
  else if(p>=80)setAuto("db",{jenis:"penuh",pesan:"Penyimpanan server hampir penuh",sub});
  else setAuto("db",null);
}

/* ----- developer: kelola pengumuman ----- */
const DEFAULT_PESAN={
  maintenance:"Server sedang maintenance. Beberapa fitur mungkin tidak bisa dipakai sementara.",
  masalah:"Server sedang bermasalah. Sedang dalam perbaikan.",
  penuh:"Data di server sudah penuh. Hubungi developer.",
  info:"",lainnya:""
};
let pesanOtomatis="";
function isiPesanDefault(){
  const v=$("iPesan").value.trim();
  if(v===""||v===pesanOtomatis){
    pesanOtomatis=DEFAULT_PESAN[$("iJenis").value]||"";
    $("iPesan").value=pesanOtomatis;
  }
}
$("iJenis").addEventListener("change",isiPesanDefault);

async function muatInfoList(){
  const box=$("listInfo");
  skList(box,2);
  const {data,error}=await supa.rpc("daftar_info_server");
  if(error){box.textContent="❌ "+error.message;return;}
  if(!data||!data.length){box.textContent="Belum ada pesan.";return;}
  box.innerHTML=data.map(p=>{
    const j=JENIS_INFO[p.jenis]||JENIS_INFO.lainnya;
    const exp=p.berakhir?("sampai "+new Date(p.berakhir).toLocaleString("id-ID",{timeZone:"Asia/Jakarta"})):"tanpa batas waktu";
    const kad=p.berakhir&&new Date(p.berakhir)<new Date();
    const stt=kad?"⌛ kedaluwarsa":p.aktif?"✅ tampil":"⏸️ nonaktif";
    return `<div class="item"><div>${j.ic} <b>${escapeHtml(p.pesan)}</b><br><small>${j.t} • ${exp} • ${stt}</small></div><div class="btns"><button class="btn" data-ia="${p.id}" data-v="${p.aktif?0:1}">${p.aktif?"⏸️ Nonaktifkan":"▶️ Aktifkan"}</button><button class="btn btn-red" data-ih="${p.id}">🗑️</button></div></div>`;
  }).join("");
}

$("btnKirimInfo").addEventListener("click",async()=>{
  if(!isDev)return toast("🔒 Hanya developer");
  const jenis=$("iJenis").value,pesan=$("iPesan").value.trim(),jam=Number($("iDurasi").value);
  if(pesan.length<3)return toast("Tulis pesan (min. 3 huruf)");
  const berakhir=jam>0?new Date(Date.now()+jam*3600000).toISOString():null;
  $("btnKirimInfo").disabled=true;
  const {error}=await supa.rpc("tambah_info_server",{p_jenis:jenis,p_pesan:pesan,p_berakhir:berakhir});
  $("btnKirimInfo").disabled=false;
  if(error)return toast("❌ "+error.message,4000);
  $("iPesan").value="";pesanOtomatis="";
  toast("✅ Info terkirim");
  muatInfoList();cekServer();
});

$("listInfo").addEventListener("click",async e=>{
  const a=e.target.closest("[data-ia]"),h=e.target.closest("[data-ih]");
  if(a){
    const {error}=await supa.rpc("set_info_aktif",{p_id:Number(a.dataset.ia),p_aktif:a.dataset.v==="1"});
    if(error)return toast("❌ "+error.message);
    toast("✅ Diubah");muatInfoList();cekServer();
  }else if(h){
    if(!confirm("Hapus pesan ini?"))return;
    const {error}=await supa.rpc("hapus_info_server",{p_id:Number(h.dataset.ih)});
    if(error)return toast("❌ "+error.message);
    toast("Pesan dihapus");muatInfoList();cekServer();
  }
});
$("pnlInfo").addEventListener("toggle",()=>{if($("pnlInfo").open){muatInfoList();muatStatusDb();isiPesanDefault();}});

/* ----- jalankan pengecekan berkala ----- */
cekServer();
setInterval(cekServer,60000);
setInterval(()=>{if(currentEmail)muatStatusDb();},300000);
window.addEventListener("online",cekServer);
window.addEventListener("offline",cekServer);

/* ================= MONITORING LOGIN ================= */
function sesiId(){
  let id=localStorage.getItem("dash_sesi_id");
  if(!id){id=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem("dash_sesi_id",id);}
  return id;
}
function infoPerangkat(ua){
  ua=ua||navigator.userAgent;
  let os="Tidak diketahui";
  if(/windows/i.test(ua))os="Windows";
  else if(/iphone|ipad|ipod/i.test(ua))os="iOS";
  else if(/android/i.test(ua))os="Android";
  else if(/macintosh|mac os/i.test(ua))os="macOS";
  else if(/linux/i.test(ua))os="Linux";
  let br="Tidak diketahui";
  if(/edg\//i.test(ua))br="Edge";
  else if(/chrome\//i.test(ua)&&!/edg|opr/i.test(ua))br="Chrome";
  else if(/firefox\//i.test(ua))br="Firefox";
  else if(/safari\//i.test(ua)&&!/chrome|crios/i.test(ua))br="Safari";
  else if(/opr\//i.test(ua))br="Opera";
  return {perangkat:os,browser:br};
}
async function ambilIp(){
  try{
    const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),4000);
    const r=await fetch("https://api.ipify.org?format=json",{signal:ctl.signal});
    clearTimeout(to);
    const j=await r.json();
    return j.ip||"";
  }catch(e){return "";}
}
async function catatPercobaanLogin(email,status,alasan){
  try{
    const ip=await ambilIp();
    const {perangkat,browser}=infoPerangkat();
    await supa.rpc("catat_login",{
      p_email:email,p_status:status,p_alasan:alasan||null,
      p_ip:ip,p_perangkat:perangkat,p_browser:browser,
      p_sesi:sesiId(),p_ua:navigator.userAgent
    });
  }catch(e){/* pencatatan tidak boleh menggagalkan proses login */}
}

function waktuID(ts){return new Date(ts).toLocaleString("id-ID",{timeZone:"Asia/Jakarta",dateStyle:"full",timeStyle:"medium"});}

async function muatLoginList(){
  const box=$("tblLogin");
  box.innerHTML=`<tr><td colspan="8" style="border:0"><div class="sk sk-row"></div></td></tr>`.repeat(4);
  const {data,error}=await supa.rpc("daftar_login",{p_limit:300});
  if(error){box.innerHTML=`<tr><td colspan="8" style="border:0;color:#b91c1c">❌ ${escapeHtml(error.message)}</td></tr>`;return;}
  if(!data||!data.length){box.innerHTML=`<tr><td colspan="8" style="border:0;color:#6b5b8a">Belum ada riwayat login.</td></tr>`;return;}
  box.innerHTML=data.map(r=>{
    const gagal=r.status==="gagal";
    return `<tr class="${gagal?'loginRowGagal':''}">
      <td>${waktuID(r.waktu)}</td>
      <td><span class="badge ${gagal?'Alfa':'Hadir'}">${gagal?'❌ GAGAL':'✅ SUKSES'}</span>${gagal&&r.alasan?`<br><small>${escapeHtml(r.alasan)}</small>`:""}</td>
      <td><span class="emailClik" data-email="${escapeHtml(r.email||'')}" data-st="0">${r.email?'********':'-'}</span></td>
      <td>${escapeHtml(r.perangkat||'-')}</td>
      <td>${escapeHtml(r.browser||'-')}</td>
      <td>${escapeHtml(r.ip||'-')}<br><button class="uaToggle" data-lokasi="${escapeHtml(r.ip||'')}">lihat lokasi</button><div class="lokasiTxt" data-loc-out></div></td>
      <td><small>${escapeHtml((r.sesi_id||'').slice(0,8))}</small></td>
      <td><button class="btnDel" data-dellogin="${r.id}">🗑️</button></td>
    </tr>`;
  }).join("");
}
$("btnRefreshLogin").addEventListener("click",muatLoginList);
$("btnBersihLogin").addEventListener("click",async()=>{
  if(!confirm("Hapus riwayat login yang lebih lama dari 30 hari?"))return;
  const batas=new Date(Date.now()-30*86400000).toISOString();
  const {data,error}=await supa.rpc("kosongkan_login",{p_sebelum:batas});
  if(error)return toast("❌ "+error.message);
  toast(`🧹 ${data} riwayat lama dihapus`);muatLoginList();
});
$("tblLogin").addEventListener("click",async e=>{
  const em=e.target.closest(".emailClik");
  if(em){
    const email=em.dataset.email;if(!email)return;
    const st=(Number(em.dataset.st)+1)%3;
    em.dataset.st=st;
    em.textContent=st===0?"********":st===1?maskEmail(email):email;
    return;
  }
  const del=e.target.closest("[data-dellogin]");
  if(del){
    if(!confirm("Hapus satu baris riwayat ini?"))return;
    const {error}=await supa.rpc("hapus_login",{p_id:Number(del.dataset.dellogin)});
    if(error)return toast("❌ "+error.message);
    muatLoginList();return;
  }
  const lok=e.target.closest("[data-lokasi]");
  if(lok){
    const ip=lok.dataset.lokasi;const out=lok.nextElementSibling;
    if(!ip){out.textContent="IP tidak tercatat";return;}
    out.textContent="Mencari...";
    try{
      const r=await fetch(`https://ipapi.co/${ip}/json/`);
      const j=await r.json();
      out.textContent=j.city?`${j.city}, ${j.region||''} ${j.country_name||''}`.trim():"Lokasi tidak ditemukan";
    }catch(err){out.textContent="Gagal memuat lokasi (coba lagi nanti)";}
  }
});
$("pnlLogin").addEventListener("toggle",()=>{if($("pnlLogin").open)muatLoginList();});

function hariDariTanggal(iso){const d=new Date(iso+"T00:00:00");return HARI[d.getDay()];}
function hitungRekapKelas(kelas,iso){
  const konfig=KONFIG_KELAS[kelas];if(!konfig)return [];
  const hari=hariDariTanggal(iso);
  let urutan=(konfig.jadwal[hari]||[]).filter(m=>m!==PAK);
  if(!urutan.length)urutan=Object.keys(konfig.mapel).filter(m=>m!==PAK);
  const rows=all.filter(x=>x.kelas===kelas&&isoOf(x)===iso);
  const per={};rows.forEach(r=>{(per[r.nama]=per[r.nama]||[]).push(r);});
  const hasil=[];
  Object.entries(per).forEach(([nama,list])=>{
    list.forEach(r=>r._u=urutan.indexOf(r.mapel));
    const valid=list.filter(r=>r._u>=0).sort((a,b)=>a._u-b._u);
    const pakai=valid.length?valid:list.slice().sort((a,b)=>(a.jam||"").localeCompare(b.jam||""));
    let pilih=pakai[pakai.length-1];
    if(normalStatus(pilih.status)==="Alfa"){
      const nonAlfa=pakai.filter(r=>normalStatus(r.status)!=="Alfa");
      if(nonAlfa.length)pilih=nonAlfa[nonAlfa.length-1];
    }
    hasil.push({nama,kelas,status:normalStatus(pilih.status),keterangan:pilih.keterangan||"",detail:list});
  });
  hasil.sort((a,b)=>a.nama.localeCompare(b.nama));
  return hasil;
}
function renderRekapKelas(){
  const kelas=$("rkKelas").value,iso=$("rkTanggal").value,tbody=$("tblRekapKelas");
  if(!kelas||!iso){tbody.innerHTML=`<tr><td colspan="5" style="border:0;color:#6b5b8a">Pilih kelas & tanggal dulu.</td></tr>`;return;}
  const hasil=hitungRekapKelas(kelas,iso);
  if(!hasil.length){tbody.innerHTML=`<tr><td colspan="5" style="border:0;color:#6b5b8a">Belum ada data absensi di tanggal ini.</td></tr>`;return;}
  tbody.innerHTML=hasil.map((r,i)=>{
    const det=r.detail.map(d=>`${escapeHtml(d.mapel||'-')}: ${normalStatus(d.status)}`).join(" • ");
    return `<tr><td class="namaCell"><b>${escapeHtml(r.nama)}</b></td><td>${escapeHtml(r.kelas)}</td><td><span class="badge ${escapeHtml(r.status)}">${escapeHtml(r.status)}</span></td><td class="ketCell">${escapeHtml(r.keterangan)||'-'}</td><td><button class="btn" data-rkd="${i}" style="padding:6px 8px;font-size:11px">🔍 Detail</button></td></tr>
    <tr class="hidden" id="rkd${i}"><td colspan="5" style="border:0;background:#faf8ff;font-size:11px;color:#6b5b8a">${det}</td></tr>`;
  }).join("");
}
$("btnRekapKelas").addEventListener("click",renderRekapKelas);
$("tblRekapKelas").addEventListener("click",e=>{const b=e.target.closest("[data-rkd]");if(!b)return;$("rkd"+b.dataset.rkd).classList.toggle("hidden");});
$("rkTanggal").value=new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Jakarta"});

/* ================= AWAL ================= */
window.addEventListener("scroll",()=>{$("stickyNavbar").classList.toggle("scrolled",window.scrollY>10);});
isiAwal();
(async()=>{
  let masuk=false;
  try{
    const {data}=await supa.auth.getSession();
    if(data.session){masuk=true;await mulaiSesi(data.session.user);}
    else{setAuthUI(false);renderStats([]);render();}
  }catch(e){
    setAuthUI(false);renderStats([]);render();
  }finally{
    selesaiBoot(masuk);
  }
})();