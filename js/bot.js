(function(){
  const CFG=window.BOT_CONFIG||{};
  const NAMA=CFG.nama||"Bot",AVA=CFG.avatar||"🤖",SAPA=CFG.sapa||"Hai!",FAQ=CFG.faq||[];
  const KEY_POS="botpos_"+(CFG.id||"bot");
  const wrap=document.createElement("div");wrap.id="botWrap";wrap.style.display="none";
  wrap.innerHTML=`<div id="botBubble" class="botBubble" title="${NAMA}"><span class="botAva">${AVA}</span></div>
  <div id="botPanel" class="botPanel" style="display:none">
    <div class="botHead"><span class="botAvaSm">${AVA}</span><b>${NAMA}</b><button id="botClose" class="botX">✕</button></div>
    <div id="botMsgs" class="botMsgs"></div>
    <div id="botChips" class="botChips"></div>
  </div>`;
  document.body.appendChild(wrap);
  const $=s=>wrap.querySelector(s);
  const bubble=$("#botBubble"),panel=$("#botPanel"),msgs=$("#botMsgs"),chips=$("#botChips");

  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function tambahPesan(teks,dari){const d=document.createElement("div");d.className="botMsg "+(dari==="bot"?"botDari":"userDari");d.innerHTML=teks;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
  function tambahMikir(){const d=document.createElement("div");d.className="botMsg botDari";d.id="botMikirSedang";d.innerHTML='<span class="botMikir"><span></span><span></span><span></span></span>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
  function hapusMikir(){const m=$("#botMikirSedang");if(m)m.remove();}

  chips.innerHTML=FAQ.map((f,i)=>`<button class="botChip" data-i="${i}">${esc(f.q||("Pertanyaan "+(i+1)))}</button>`).join("");
  chips.addEventListener("click",e=>{
    const b=e.target.closest(".botChip");if(!b)return;
    const item=FAQ[Number(b.dataset.i)];if(!item)return;
    tambahPesan(esc(item.q||"..."),"user");
    tambahMikir();
    setTimeout(()=>{
      hapusMikir();
      tambahPesan(typeof item.jawab==="function"?item.jawab():item.jawab,"bot");
    },600+Math.random()*900);
  });

  let dibukaDulu=false;
  function setOpen(open){
    panel.style.display=open?"flex":"none";
    document.documentElement.classList.toggle("botOpen",open);
    if(open&&!dibukaDulu){dibukaDulu=true;tambahPesan(SAPA,"bot");}
  }
  bubble.addEventListener("click",()=>{
    if(bubble.dataset.drag==="1"){bubble.dataset.drag="0";return;}
    setOpen(panel.style.display==="none");
  });
  $("#botClose").addEventListener("click",()=>setOpen(false));

  // kunci scroll halaman selagi panel bot terbuka, kecuali isi bot sendiri
  document.addEventListener("touchmove",e=>{
    if(!document.documentElement.classList.contains("botOpen"))return;
    if(e.target.closest("#botMsgs,#botChips"))return;
    e.preventDefault();
  },{passive:false});
  document.addEventListener("wheel",e=>{
    if(!document.documentElement.classList.contains("botOpen"))return;
    if(e.target.closest("#botMsgs,#botChips"))return;
    e.preventDefault();
  },{passive:false});

  // geser bubble
  (function(){
    let sx,sy,ox,oy,moved=false;
    try{const p=JSON.parse(localStorage.getItem(KEY_POS));if(p){wrap.style.left=p.l+"px";wrap.style.top=p.t+"px";wrap.style.right="auto";wrap.style.bottom="auto";}}catch(e){}
    function mulai(e){const t=e.touches?e.touches[0]:e;sx=t.clientX;sy=t.clientY;const r=wrap.getBoundingClientRect();ox=r.left;oy=r.top;moved=false;
      document.addEventListener("mousemove",gerak);document.addEventListener("mouseup",selesai);
      document.addEventListener("touchmove",gerak,{passive:false});document.addEventListener("touchend",selesai);}
    function gerak(e){const t=e.touches?e.touches[0]:e;const dx=t.clientX-sx,dy=t.clientY-sy;
      if(Math.abs(dx)>4||Math.abs(dy)>4)moved=true; if(!moved)return; e.preventDefault();
      let nl=ox+dx,nt=oy+dy; nl=Math.max(4,Math.min(window.innerWidth-60,nl)); nt=Math.max(4,Math.min(window.innerHeight-60,nt));
      wrap.style.left=nl+"px";wrap.style.top=nt+"px";wrap.style.right="auto";wrap.style.bottom="auto";}
    function selesai(){document.removeEventListener("mousemove",gerak);document.removeEventListener("mouseup",selesai);
      document.removeEventListener("touchmove",gerak);document.removeEventListener("touchend",selesai);
      if(moved){bubble.dataset.drag="1";const r=wrap.getBoundingClientRect();try{localStorage.setItem(KEY_POS,JSON.stringify({l:r.left,t:r.top}));}catch(e){}}}
    bubble.addEventListener("mousedown",mulai);bubble.addEventListener("touchstart",mulai,{passive:true});
  })();

  // tampil hanya setelah skeleton halaman selesai, dan (jika diminta) setelah login
  function skeletonSelesai(){
    const h=document.documentElement;
    return !h.classList.contains("boot-sess")&&!h.classList.contains("boot-login")&&!h.classList.contains("skl");
  }
  function loginOk(){
    if(!CFG.perluLogin)return true;
    try{return typeof currentEmail!=="undefined"&&!!currentEmail;}catch(e){return false;}
  }
  let tampil=false;
  function cekTampil(){
    const siap=skeletonSelesai()&&loginOk();
    if(siap&&!tampil){tampil=true;wrap.style.display="";}
    else if(!siap&&tampil){tampil=false;wrap.style.display="none";setOpen(false);}
  }
  cekTampil();
  setInterval(cekTampil,400);
})();