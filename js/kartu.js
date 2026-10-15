/* kartu.js : tema, penggambar kartu QR, metadata PNG */
const FONT={
  sans:"system-ui,Arial,sans-serif",
  serif:"Georgia,'Times New Roman',serif",
  mono:"'Courier New',monospace",
  bold:"Impact,'Arial Black',system-ui,sans-serif"
};

const TEMA_DEFAULT={pn:"#ffffff",q:["#4c1d95","#1d4ed8"],bd:["#6d28d9","#2563eb"],tx:"#ffffff",ac:"#ffffff",pat:"circ",em:[],m:"round",e:"round",fr:0,fn:"sans",flag:false,lock:false};
const T=(id,n,g,o)=>Object.assign({id,n,g},TEMA_DEFAULT,o);

/* g = grup | bg = warna latar | pn = panel QR (harus terang) | q = warna QR (harus gelap)
   bd = lencana | tx/tx2 = warna teks atas/bawah | ac = aksen | pat = pola | em = emoji sudut
   m = bentuk titik (round/square/dot) | e = bentuk mata (round/square/circle) | fr = bingkai 0-3 | lock = tidak tampil di editor */
const THEMES=[
 // ===== DASAR =====
 T("biasa","Biasa","Dasar",{bg:["#5b21b6","#2563eb","#0ea5e9"],t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi"}),
 T("elegan","Elegan","Dasar",{bg:["#1f1147","#3b1a6b","#111827"],pn:"#fbf7ff",q:["#2e1065","#4c1d95"],bd:["#4c1d95","#7e22ce"],tx:"#f5e9ff",ac:"#d8b4fe",t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"diam",em:["✦","✦","✦","✦"],fr:2,fn:"serif"}),
 T("klasik","Klasik","Dasar",{bg:["#78350f","#92400e","#451a03"],pn:"#fff7e6",q:["#451a03","#78350f"],bd:["#78350f","#b45309"],tx:"#fde68a",ac:"#fcd34d",t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"lines",em:["❦","❦","❦","❦"],m:"square",e:"square",fr:2,fn:"serif"}),
 T("minimalis","Minimalis","Dasar",{bg:["#f8fafc","#f1f5f9"],q:["#0f172a","#0f172a"],bd:["#0f172a","#334155"],tx:"#0f172a",ac:"#0f172a",t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"none",m:"square",e:"square",fr:1}),
 T("modern","Modern","Dasar",{bg:["#0f172a","#1e293b","#0ea5e9"],pn:"#f8fafc",q:["#0f172a","#0369a1"],bd:["#0ea5e9","#6366f1"],ac:"#22d3ee",t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"grid",m:"dot",fr:1}),
 T("cewe","Cewe","Dasar",{bg:["#f9a8d4","#f472b6","#c084fc"],pn:"#fff7fb",q:["#9d174d","#7e22ce"],bd:["#ec4899","#a855f7"],t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"dots",em:["🌸","🎀","🦋","💖"],m:"dot",e:"circle",fr:2}),
 T("cowo","Cowo","Dasar",{bg:["#0f172a","#1d4ed8","#0c4a6e"],pn:"#f1f5f9",q:["#0f172a","#1e3a8a"],bd:["#1d4ed8","#0ea5e9"],ac:"#93c5fd",t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"lines",em:["⚡","🎮","🏀","⚡"],m:"square",e:"square",fr:1,fn:"bold"}),
  T("couplecewe", "Couple Cewek", "Dasar", { bg: ["#f472b6", "#c084fc"], half: "L", q: ["#9d174d", "#6b21a8"], bd: ["#ec4899", "#a855f7"], t: "ACE • ABSENSI • SMANDA", s: "Kartu QR Pribadi", pat: "dots", em: ["🌸", "", "🎀", ""], m: "dot", e: "circle", fr: 0 }),
   T("couplecowo", "Couple Cowok", "Dasar", { bg: ["#c084fc", "#60a5fa"], half: "R", q: ["#1e3a8a", "#4338ca"], bd: ["#3b82f6", "#6366f1"], t: "ACE • ABSENSI • SMANDA", s: "Kartu QR Pribadi", pat: "dots", em: ["", "🎮", "", "⚡"], m: "dot", e: "circle", fr: 0 }),
 T("gold","Gold","Dasar",{bg:["#3b2a05","#b8860b","#f5d36b","#8a6a12"],pn:"#fffaf0",q:["#3b2a05","#6b4a0a"],bd:["#b8860b","#f5d36b"],tx:"#fff6d6",ac:"#f5d36b",t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"diam",em:["👑","✦","✦","👑"],fr:3,fn:"serif",lock:true}),
 T("diamond","Diamond","Dasar",{bg:["#0c4a6e","#0891b2","#a5f3fc"],pn:"#f0fdff",q:["#083344","#155e75"],bd:["#0891b2","#67e8f9"],ac:"#cffafe",tx2:"#083344",t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"diam",em:["💎","💎","💎","💎"],e:"square",fr:2,lock:true}),
 T("silver","Silver","Dasar",{bg:["#475569","#94a3b8","#e2e8f0"],q:["#1e293b","#475569"],bd:["#64748b","#cbd5e1"],tx2:"#1e293b",ac:"#f1f5f9",t:"ACE • ABSENSI • SMANDA",s:"Kartu QR Pribadi",pat:"diam",em:["✦","","","✦"],fr:2}),

 // ===== PERAN KELAS =====
 T("guru","Guru","Peran Kelas",{bg:["#14532d","#15803d","#facc15"],q:["#14532d","#166534"],bd:["#15803d","#ca8a04"],tx2:"#14532d",ac:"#fde047",t:"KARTU GURU",s:"Terima kasih, Bapak/Ibu 🙏",pat:"dots",em:["📚","🍎","✏️","🎓"],fr:2,lock:true}),
 T("osis","OSIS","Peran Kelas",{bg:["#b91c1c","#dc2626","#f8fafc"],q:["#7f1d1d","#991b1b"],bd:["#dc2626","#7f1d1d"],tx2:"#7f1d1d",ac:"#fecaca",t:"OSIS",s:"Organisasi Siswa Intra Sekolah",pat:"lines",em:["🎖️","⭐","🏅","🎖️"],fr:1,lock:true}),
 T("sekretaris","Sekretaris","Peran Kelas",{bg:["#1e3a8a","#2563eb","#bfdbfe"],q:["#1e3a8a","#1d4ed8"],bd:["#2563eb","#1e3a8a"],tx2:"#1e3a8a",t:"SEKRETARIS",s:"Pencatat Handal",pat:"lines",em:["📝","📒","🖊️","📝"],m:"square",fr:1}),
 T("bendahara","Bendahara","Peran Kelas",{bg:["#14532d","#16a34a","#bbf7d0"],q:["#14532d","#166534"],bd:["#16a34a","#14532d"],tx2:"#14532d",t:"BENDAHARA",s:"Penjaga Kas Kelas",pat:"dots",em:["💰","🪙","💵","💰"],fr:1}),
 T("keamanan","Keamanan","Peran Kelas",{bg:["#111827","#374151","#f59e0b"],q:["#111827","#1f2937"],bd:["#374151","#111827"],tx2:"#111827",ac:"#fbbf24",t:"KEAMANAN",s:"Siaga & Tertib",pat:"lines",em:["🛡️","🚨","👮","🛡️"],m:"square",e:"square",fr:1,fn:"bold"}),
 T("kebersihan","Kebersihan","Peran Kelas",{bg:["#0e7490","#06b6d4","#a7f3d0"],q:["#134e4a","#0f766e"],bd:["#0891b2","#0f766e"],tx2:"#064e3b",t:"KEBERSIHAN",s:"Kelas Bersih, Hati Senang",pat:"dots",em:["🧹","🌿","🧼","🧹"],m:"dot",e:"circle",fr:1}),

 // ===== HARI BESAR =====
 T("kemerdekaan","Kemerdekaan RI","Hari Besar",{bg:["#dc2626","#ffffff"],flag:true,q:["#7f1d1d","#991b1b"],bd:["#dc2626","#991b1b"],tx2:"#7f1d1d",ac:"#b91c1c",t:"DIRGAHAYU RI",s:"Merdeka! 17 Agustus",pat:"stars",em:["🇮🇩","🎆","🎆","🇮🇩"],fr:1,fn:"bold"}),
 T("tahunbaru","Tahun Baru","Hari Besar",{bg:["#0f0a2a","#312e81","#7c3aed"],q:["#1e1b4b","#4c1d95"],bd:["#7c3aed","#f59e0b"],tx:"#fde68a",ac:"#fbbf24",t:"HAPPY NEW YEAR",s:"Semangat Baru!",pat:"stars",em:["🎆","🎇","🥳","🎊"],m:"dot",e:"circle",fr:2}),
 T("natal","Natal","Hari Besar",{bg:["#14532d","#166534","#b91c1c"],pn:"#fffafa",q:["#14532d","#7f1d1d"],bd:["#b91c1c","#15803d"],ac:"#fde68a",t:"MERRY CHRISTMAS",s:"Damai Natal",pat:"snow",em:["🎄","⛄","🎁","🔔"],fr:2}),
 T("idulfitri","Raya Islam (Idul Fitri)","Hari Besar",{bg:["#064e3b","#047857","#fbbf24"],pn:"#fffdf5",q:["#064e3b","#065f46"],bd:["#047857","#ca8a04"],tx2:"#064e3b",ac:"#fde68a",t:"SELAMAT IDUL FITRI",s:"Mohon Maaf Lahir & Batin",pat:"diam",em:["🌙","🕌","⭐","🕌"],fr:2}),
 T("iduladha","Idul Adha","Hari Besar",{bg:["#78350f","#a16207","#166534"],pn:"#fffdf5",q:["#451a03","#14532d"],bd:["#a16207","#166534"],ac:"#fde68a",t:"IDUL ADHA",s:"Berbagi & Berkurban",pat:"diam",em:["🐑","🕌","🐄","🌙"],fr:2}),
 T("puasa","Puasa (Ramadan)","Hari Besar",{bg:["#0f172a","#312e81","#6d28d9"],q:["#1e1b4b","#312e81"],bd:["#6d28d9","#ca8a04"],tx:"#fde68a",ac:"#fcd34d",t:"MARHABAN YA RAMADAN",s:"Selamat Berpuasa",pat:"stars",em:["🌙","⭐","🏮","🌙"],m:"dot",e:"circle",fr:2}),
 T("imlek","Imlek","Hari Besar",{bg:["#7f1d1d","#dc2626","#f59e0b"],pn:"#fffbeb",q:["#7f1d1d","#991b1b"],bd:["#b91c1c","#f59e0b"],tx:"#fef08a",tx2:"#7f1d1d",ac:"#fde047",t:"GONG XI FA CAI",s:"Selamat Tahun Baru Imlek",pat:"diam",em:["🏮","🧧","🐉","🏮"],e:"square",fr:2}),
 T("hindu","Hari Raya Hindu","Hari Besar",{bg:["#c2410c","#ea580c","#fde68a"],pn:"#fffaf0",q:["#7c2d12","#9a3412"],bd:["#ea580c","#9a3412"],tx:"#fff7ed",tx2:"#7c2d12",ac:"#fff7ed",t:"OM SWASTYASTU",s:"Hari Raya Hindu",pat:"dots",em:["🪔","🌺","🙏","🌺"],e:"circle",fr:2}),
 T("nyepi","Nyepi","Hari Besar",{bg:["#020617","#1e1b4b","#0f172a"],q:["#1e1b4b","#312e81"],bd:["#4338ca","#1e1b4b"],tx:"#e0e7ff",ac:"#a5b4fc",t:"HARI RAYA NYEPI",s:"Hening • Tenang • Damai",pat:"stars",em:["🌑","🕉️","🤫","🌌"],m:"dot",e:"circle",fr:1}),

 // ===== HARI NASIONAL / POPULER =====
 T("kartini","Hari Kartini","Hari Nasional",{bg:["#9d174d","#db2777","#f9a8d4"],q:["#831843","#9d174d"],bd:["#db2777","#831843"],tx2:"#831843",t:"HARI KARTINI",s:"Habis Gelap Terbitlah Terang",pat:"dots",em:["🌺","👘","📖","🌺"],fr:2,fn:"serif"}),
 T("hardiknas","Hari Pendidikan Nasional","Hari Nasional",{bg:["#1d4ed8","#2563eb","#fbbf24"],q:["#1e3a8a","#1d4ed8"],bd:["#2563eb","#f59e0b"],tx2:"#1e3a8a",t:"HARDIKNAS",s:"Hari Pendidikan Nasional",pat:"lines",em:["🎓","📚","✏️","🏫"],fr:1}),
 T("hariguru","Hari Guru Nasional","Hari Nasional",{bg:["#065f46","#10b981","#fde68a"],q:["#064e3b","#065f46"],bd:["#059669","#ca8a04"],tx2:"#064e3b",t:"HARI GURU NASIONAL",s:"Terima Kasih Guruku",pat:"dots",em:["🍎","🙏","📚","🍎"],fr:2}),
 T("sumpahpemuda","Sumpah Pemuda","Hari Nasional",{bg:["#991b1b","#dc2626","#fecaca"],q:["#7f1d1d","#991b1b"],bd:["#dc2626","#7f1d1d"],tx2:"#7f1d1d",t:"SUMPAH PEMUDA",s:"Satu Nusa • Satu Bangsa • Satu Bahasa",pat:"stars",em:["✊","🇮🇩","📜","✊"],fr:1,fn:"bold"}),
 T("pahlawan","Hari Pahlawan","Hari Nasional",{bg:["#1c1917","#44403c","#a16207"],pn:"#fffbeb",q:["#1c1917","#44403c"],bd:["#a16207","#44403c"],tx:"#fde68a",ac:"#fcd34d",t:"HARI PAHLAWAN",s:"Jasamu Dikenang • 10 November",pat:"lines",em:["🎖️","🇮🇩","🔥","🎖️"],m:"square",e:"square",fr:2,fn:"serif"}),
 T("batik","Hari Batik Nasional","Hari Nasional",{bg:["#3e2723","#6d4c41","#d7a86e"],pn:"#fff8ee",q:["#3e2723","#5d4037"],bd:["#6d4c41","#3e2723"],tx:"#fff3e0",tx2:"#3e2723",ac:"#d7a86e",t:"HARI BATIK NASIONAL",s:"2 Oktober • Bangga Berbatik",pat:"diam",em:["🧵","👘","🧵","👘"],fr:2,fn:"serif"}),
 T("pancasila","Hari Pancasila","Hari Nasional",{bg:["#991b1b","#1f2937","#ca8a04"],q:["#1f2937","#7f1d1d"],bd:["#b91c1c","#ca8a04"],tx2:"#1f2937",ac:"#fde68a",t:"HARI PANCASILA",s:"1 Juni • Garuda di Dadaku",pat:"stars",em:["🦅","⭐","🇮🇩","🦅"],fr:2}),
 T("pramuka","Pramuka","Hari Nasional",{bg:["#78350f","#a16207","#fde68a"],q:["#451a03","#78350f"],bd:["#a16207","#451a03"],tx2:"#451a03",t:"PRAMUKA",s:"Siap Setiap Saat • 14 Agustus",pat:"lines",em:["⚜️","⛺","🧭","⚜️"],m:"square",fr:1}),
 T("ibu","Hari Ibu","Hari Nasional",{bg:["#be185d","#ec4899","#fbcfe8"],pn:"#fff7fb",q:["#831843","#9d174d"],bd:["#ec4899","#9d174d"],tx2:"#831843",t:"HARI IBU",s:"Terima Kasih, Ibu",pat:"dots",em:["💐","💗","👩","💐"],m:"dot",e:"circle",fr:2}),
 T("anak","Hari Anak Nasional","Hari Nasional",{bg:["#f59e0b","#22c55e","#38bdf8"],q:["#065f46","#0369a1"],bd:["#22c55e","#0ea5e9"],tx2:"#0c4a6e",t:"HARI ANAK NASIONAL",s:"Anak Hebat, Indonesia Kuat",pat:"circ",em:["🎈","🧸","🌈","🎈"],m:"dot",e:"circle",fr:1}),
 T("kebangkitan","Kebangkitan Nasional","Hari Nasional",{bg:["#1e3a8a","#b91c1c","#fde68a"],q:["#1e3a8a","#7f1d1d"],bd:["#b91c1c","#1e3a8a"],tx2:"#7f1d1d",t:"KEBANGKITAN NASIONAL",s:"20 Mei • Bangkit Bersama",pat:"stars",em:["🔥","🇮🇩","✊","🔥"],fr:1}),
 T("waisak","Waisak","Hari Nasional",{bg:["#b45309","#f59e0b","#fef3c7"],q:["#78350f","#92400e"],bd:["#d97706","#78350f"],tx2:"#78350f",t:"HARI RAYA WAISAK",s:"Semoga Semua Makhluk Berbahagia",pat:"circ",em:["🪷","☸️","🕯️","🪷"],e:"circle",fr:2}),
 T("paskah","Paskah","Hari Nasional",{bg:["#6d28d9","#a78bfa","#fef9c3"],q:["#4c1d95","#5b21b6"],bd:["#7c3aed","#ca8a04"],tx2:"#4c1d95",t:"SELAMAT PASKAH",s:"Kristus Bangkit!",pat:"dots",em:["✝️","🐣","🥚","🌷"],m:"dot",e:"circle",fr:2}),
 T("maulid","Maulid Nabi","Hari Nasional",{bg:["#064e3b","#0f766e","#f0fdfa"],q:["#064e3b","#115e59"],bd:["#0f766e","#064e3b"],tx2:"#064e3b",t:"MAULID NABI",s:"Memperingati Kelahiran Nabi Muhammad SAW",pat:"diam",em:["🌙","🕌","📿","🌙"],fr:2}),

 // ===== KHUSUS =====
 T("developer","Developer","Khusus",{bg:["#0a0a0a","#052e16","#14532d"],pn:"#f0fdf4",q:["#052e16","#166534"],bd:["#16a34a","#22c55e"],tx:"#4ade80",ac:"#4ade80",t:"</> DEVELOPER",s:"ACE",pat:"grid",em:["💻","⌨️","🐞","🚀"],m:"square",e:"square",fr:1,fn:"mono",lock:true}),
 T("wewenang","Wewenang (Akses Khusus)","Khusus",{bg:["#450a0a","#991b1b","#d97706"],pn:"#fffaf0",q:["#450a0a","#7f1d1d"],bd:["#991b1b","#d97706"],tx:"#fde68a",ac:"#fbbf24",t:"★ AKSES KHUSUS ★",s:"QR Wewenang • Absen Orang Lain",fo:"Kartu berwenang • Jaga baik-baik",pat:"diam",em:["🛡️","🔑","🔑","🛡️"],m:"square",e:"square",fr:3,fn:"serif",lock:true})
];

function ambilTema(id){
  const t=THEMES.find(x=>x.id===id)||THEMES[0];
  return Object.assign({},t,{tx2:t.tx2||t.tx});
}

/* ---------- util gambar ---------- */
function rr(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}
function bungkus(ctx,teks,maxW){
  const kata=teks.split(" ");const baris=[];let cur="";
  kata.forEach(k=>{
    const t=cur?cur+" "+k:k;
    if(ctx.measureText(t).width>maxW&&cur){baris.push(cur);cur=k;}else cur=t;
  });
  if(cur)baris.push(cur);
  return baris;
}
function maskId(k){
  k=String(k||"");
  if(k.length<=4)return k;
  return k.slice(0,3)+"*".repeat(k.length-4)+k.slice(-1);
}

function pola(ctx,W,H,th){
  const p=th.pat;
  ctx.save();rr(ctx,0,0,W,H,44);ctx.clip();
  ctx.fillStyle=th.ac;ctx.strokeStyle=th.ac;
  if(p==="circ"){
    ctx.globalAlpha=.12;
    [[560,60,150],[20,860,190]].forEach(a=>{ctx.beginPath();ctx.arc(a[0],a[1],a[2],0,7);ctx.fill();});
    ctx.globalAlpha=.08;ctx.beginPath();ctx.arc(70,320,90,0,7);ctx.fill();
  }else if(p==="dots"){
    ctx.globalAlpha=.16;
    for(let y=20;y<H;y+=36)for(let x=((y/36)%2)*18+10;x<W;x+=36){ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();}
  }else if(p==="lines"){
    ctx.globalAlpha=.1;ctx.lineWidth=14;
    for(let i=-H;i<W+H;i+=48){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+H,H);ctx.stroke();}
  }else if(p==="grid"){
    ctx.globalAlpha=.1;ctx.lineWidth=1.5;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }else if(p==="diam"){
    ctx.globalAlpha=.12;ctx.lineWidth=2;
    for(let y=0;y<H+60;y+=60)for(let x=((y/60)%2)*30;x<W+60;x+=60){
      ctx.beginPath();ctx.moveTo(x,y-26);ctx.lineTo(x+26,y);ctx.lineTo(x,y+26);ctx.lineTo(x-26,y);ctx.closePath();ctx.stroke();
    }
  }else if(p==="stars"||p==="snow"){
    ctx.globalAlpha=.5;ctx.textAlign="center";
    const sym=p==="stars"?"✦":"❄";
    let sd=7;const rnd=()=>(sd=(sd*9301+49297)%233280)/233280;
    for(let i=0;i<46;i++){
      const x=rnd()*W,y=rnd()*H;
      ctx.font=(10+rnd()*20)+"px "+FONT.sans;
      ctx.fillText(sym,x,y);
    }
  }
  ctx.restore();
}

function bingkai(ctx,W,H,th){
  ctx.save();ctx.strokeStyle=th.ac;
  if(th.fr===1){ctx.globalAlpha=.8;ctx.lineWidth=3;rr(ctx,14,14,W-28,H-28,34);ctx.stroke();}
  else if(th.fr===2){
    ctx.globalAlpha=.85;ctx.lineWidth=3;rr(ctx,12,12,W-24,H-24,36);ctx.stroke();
    ctx.lineWidth=1.5;rr(ctx,22,22,W-44,H-44,28);ctx.stroke();
  }else if(th.fr===3){
    const gg=ctx.createLinearGradient(0,0,W,H);
    ["#8a6a12","#f5d36b","#b8860b","#fff1a8","#8a6a12"].forEach((c,i)=>gg.addColorStop(i/4,c));
    ctx.strokeStyle=gg;ctx.lineWidth=12;rr(ctx,10,10,W-20,H-20,38);ctx.stroke();
    ctx.lineWidth=2;rr(ctx,26,26,W-52,H-52,26);ctx.stroke();
  }
  ctx.restore();
}

function modul(ctx,x,y,cell,tipe){
  if(tipe==="square"){ctx.fillRect(x-.3,y-.3,cell+.6,cell+.6);}
  else if(tipe==="dot"){ctx.beginPath();ctx.arc(x+cell/2,y+cell/2,cell*.47,0,7);ctx.fill();}
  else{rr(ctx,x+cell*.04,y+cell*.04,cell*.92,cell*.92,cell*.3);ctx.fill();}
}
function mata(ctx,x,y,cell,fill,bg,tipe){
  const R1=tipe==="square"?0:tipe==="circle"?3.5*cell:cell*2.2;
  const R2=tipe==="square"?0:tipe==="circle"?2.5*cell:cell*1.5;
  const R3=tipe==="square"?0:tipe==="circle"?1.5*cell:cell;
  ctx.fillStyle=fill;rr(ctx,x,y,7*cell,7*cell,R1);ctx.fill();
  ctx.fillStyle=bg;rr(ctx,x+cell,y+cell,5*cell,5*cell,R2);ctx.fill();
  ctx.fillStyle=fill;rr(ctx,x+2*cell,y+2*cell,3*cell,3*cell,R3);ctx.fill();
}

/* ---------- couple: hati terbelah ---------- */
function jantung(ctx,cx,cy,r){
  ctx.beginPath();
  ctx.moveTo(cx,cy+r*0.9);
  ctx.bezierCurveTo(cx-r*1.3,cy+r*0.2,cx-r*0.9,cy-r*0.9,cx,cy-r*0.35);
  ctx.bezierCurveTo(cx+r*0.9,cy-r*0.9,cx+r*1.3,cy+r*0.2,cx,cy+r*0.9);
  ctx.closePath();
}
function gambarBelahan(ctx,W,H,th){
  // pusat hati tepat di garis belahan: sisi kanan kartu (kiri) atau sisi kiri kartu (kanan)
  const cx=th.half==="L"?W:0;
  ctx.save();
  rr(ctx,0,0,W,H,44);ctx.clip();
  [[790,90],[62,38]].forEach(([cy,r])=>{
    jantung(ctx,cx,cy,r);
    ctx.fillStyle="rgba(255,255,255,.28)";ctx.fill();
    ctx.lineWidth=4;ctx.strokeStyle="rgba(255,255,255,.95)";ctx.stroke();
  });
  ctx.restore();
}

/* ---------- kartu utama ---------- */
function gambarKartu(s,id){
  const th=ambilTema(id);
  const W=600,H=900;
  const cv=document.createElement("canvas");cv.width=W;cv.height=H;
  const ctx=cv.getContext("2d");
  const fnt=FONT[th.fn]||FONT.sans;

  // latar
  let g;
  if(th.flag){
    g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,th.bg[0]);g.addColorStop(.5,th.bg[0]);g.addColorStop(.5,th.bg[1]);g.addColorStop(1,th.bg[1]);
  }else{
    g=th.half?ctx.createLinearGradient(0,0,W,0):ctx.createLinearGradient(0,0,W,H);
    th.bg.forEach((c,i)=>g.addColorStop(th.bg.length===1?0:i/(th.bg.length-1),c));
  }
  rr(ctx,0,0,W,H,44);ctx.fillStyle=g;ctx.fill();
  pola(ctx,W,H,th);
  bingkai(ctx,W,H,th);
  if(th.half)gambarBelahan(ctx,W,H,th);

  // judul
  ctx.textAlign="center";ctx.textBaseline="alphabetic";ctx.fillStyle=th.tx;
  let tf=22;
  if("letterSpacing" in ctx)ctx.letterSpacing="4px";
  ctx.font=`800 ${tf}px ${fnt}`;
  while(ctx.measureText(th.t).width>400&&tf>11){tf--;ctx.font=`800 ${tf}px ${fnt}`;}
  ctx.fillText(th.t,W/2,62);
  if("letterSpacing" in ctx)ctx.letterSpacing="0px";
  let sf=17;ctx.font=`600 ${sf}px ${fnt}`;
  while(ctx.measureText(th.s).width>440&&sf>10){sf--;ctx.font=`600 ${sf}px ${fnt}`;}
  ctx.globalAlpha=.85;ctx.fillText(th.s,W/2,92);ctx.globalAlpha=1;

  // panel QR
  const px=40,py=120,ps=520;
  ctx.save();ctx.shadowColor="rgba(0,0,0,.28)";ctx.shadowBlur=30;ctx.shadowOffsetY=12;
  rr(ctx,px,py,ps,ps,36);ctx.fillStyle=th.pn;ctx.fill();ctx.restore();

  // QR (koreksi error tertinggi H)
  const qr=new QRCode(document.createElement("div"),{text:s.kode,width:256,height:256,correctLevel:QRCode.CorrectLevel.H});
  const m=qr._oQRCode, N=m.getModuleCount();
  const cell=Math.floor(420/N), size=cell*N;
  const ox=px+(ps-size)/2, oy=py+(ps-size)/2;
  const qg=ctx.createLinearGradient(ox,oy,ox+size,oy+size);
  qg.addColorStop(0,th.q[0]);qg.addColorStop(1,th.q[1]);

  const bw=Math.round(size*.27), bh=Math.round(size*.17);
  const bx=ox+(size-bw)/2, by=oy+(size-bh)/2, mg=cell*.6;
  const isEye=(r,c)=>(r<7&&c<7)||(r<7&&c>=N-7)||(r>=N-7&&c<7);

  ctx.fillStyle=qg;
  for(let r=0;r<N;r++){
    for(let c=0;c<N;c++){
      if(isEye(r,c)||!m.isDark(r,c))continue;
      const x=ox+c*cell,y=oy+r*cell;
      if(x+cell>bx-mg&&x<bx+bw+mg&&y+cell>by-mg&&y<by+bh+mg)continue;
      modul(ctx,x,y,cell,th.m);
    }
  }
  mata(ctx,ox,oy,cell,qg,th.pn,th.e);
  mata(ctx,ox+(N-7)*cell,oy,cell,qg,th.pn,th.e);
  mata(ctx,ox,oy+(N-7)*cell,cell,qg,th.pn,th.e);

  // lencana nama panggilan
  rr(ctx,bx-7,by-7,bw+14,bh+14,24);ctx.fillStyle=th.pn;ctx.fill();
  const bg=ctx.createLinearGradient(bx,by,bx+bw,by+bh);
  bg.addColorStop(0,th.bd[0]);bg.addColorStop(1,th.bd[1]);
  rr(ctx,bx,by,bw,bh,18);ctx.fillStyle=bg;ctx.fill();
  let nick=(s.panggilan||String(s.nama||"").split(" ")[0]||"").trim();
  let fs=28;ctx.font=`800 ${fs}px ${fnt}`;
  while(fs>14&&ctx.measureText(nick).width>bw-14){fs--;ctx.font=`800 ${fs}px ${fnt}`;}
  while(nick.length>3&&ctx.measureText(nick).width>bw-14){nick=nick.slice(0,-1);}
  ctx.fillStyle="#fff";ctx.textBaseline="middle";
  ctx.fillText(nick,bx+bw/2,by+bh/2+1);
  ctx.textBaseline="alphabetic";

  // nama lengkap
  ctx.fillStyle=th.tx2;
  let nf=40;ctx.font=`800 ${nf}px ${fnt}`;
  let baris=bungkus(ctx,String(s.nama||""),520);
  if(baris.length>2){nf=30;ctx.font=`800 ${nf}px ${fnt}`;baris=bungkus(ctx,String(s.nama||""),520);}
  const y0=baris.length===1?725:705;
  baris.slice(0,2).forEach((t,i)=>ctx.fillText(t,W/2,y0+i*(nf+8)));

  // pil kelas
  const tk=s.label||("KELAS "+s.kelas);
  ctx.font=`800 22px ${fnt}`;
  const tw=ctx.measureText(tk).width+56;
  ctx.globalAlpha=.15;ctx.fillStyle=th.tx2;rr(ctx,(W-tw)/2,795,tw,46,23);ctx.fill();
  ctx.globalAlpha=.55;ctx.strokeStyle=th.tx2;ctx.lineWidth=2;ctx.stroke();
  ctx.globalAlpha=1;ctx.fillStyle=th.tx2;ctx.fillText(tk,W/2,826);

  // footer
  ctx.globalAlpha=.75;ctx.font=`600 15px ${fnt}`;
    ctx.fillText(th.fo||"Jangan dibagikan atau hilang",W/2,874);ctx.globalAlpha=1;

  // emoji sudut
  ctx.font=`34px ${FONT.sans}`;ctx.fillStyle=th.tx;
  const pos=[[52,72],[548,72],[52,882],[548,882]];
  th.em.forEach((e,i)=>{if(e)ctx.fillText(e,pos[i][0],pos[i][1]);});

  return cv;
}

/* ---------- metadata PNG (supaya editor bisa membaca nama/panggilan) ---------- */
function crc32(buf){
  let crc=0xFFFFFFFF;
  for(let n=0;n<buf.length;n++){
    crc^=buf[n];
    for(let k=0;k<8;k++)crc=(crc>>>1)^(0xEDB88320&-(crc&1));
  }
  return (crc^0xFFFFFFFF)>>>0;
}
function sisipMeta(bytes,obj){
  const b64=btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  const enc=new TextEncoder();
  const data=enc.encode("ACEMeta\0"+b64);
  const td=new Uint8Array(4+data.length);
  td.set(enc.encode("tEXt"),0);td.set(data,4);
  const chunk=new Uint8Array(12+data.length);
  const dv=new DataView(chunk.buffer);
  dv.setUint32(0,data.length);
  chunk.set(td,4);
  dv.setUint32(8+data.length,crc32(td));
  const out=new Uint8Array(bytes.length+chunk.length);
  out.set(bytes.subarray(0,33),0);
  out.set(chunk,33);
  out.set(bytes.subarray(33),33+chunk.length);
  return out;
}
function bacaMeta(buf){
  try{
    const u=new Uint8Array(buf);
    if(u[0]!==0x89||u[1]!==0x50||u[2]!==0x4E||u[3]!==0x47)return null;
    const dv=new DataView(buf);
    let p=8;
    while(p+8<=u.length){
      const len=dv.getUint32(p);
      const type=String.fromCharCode(u[p+4],u[p+5],u[p+6],u[p+7]);
      if(type==="tEXt"){
        const txt=new TextDecoder("latin1").decode(u.subarray(p+8,p+8+len));
        if(txt.startsWith("ACEMeta\0"))return JSON.parse(decodeURIComponent(escape(atob(txt.slice(8)))));
      }
      if(type==="IEND")break;
      p+=12+len;
    }
  }catch(e){}
  return null;
}

function unduhKartu(cv,s,id){
  cv.toBlob(async bl=>{
    const buf=new Uint8Array(await bl.arrayBuffer());
    const out=sisipMeta(buf,{kode:s.kode,nama:s.nama,panggilan:s.panggilan,kelas:s.kelas,tema:id});
    const url=URL.createObjectURL(new Blob([out],{type:"image/png"}));
    const a=document.createElement("a");
    a.href=url;
    a.download=("QR_"+s.kelas+"_"+s.nama+"_"+id).replace(/[^\w\-]+/g,"_")+".png";
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  },"image/png");
}