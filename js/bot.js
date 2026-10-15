(function(){
  const CFG=window.BOT_CONFIG||{};
  const NAMA=CFG.nama||"Bot",AVA=CFG.avatar||"🤖",SAPA=CFG.sapa||"Hai!",FAQ=CFG.faq||[];
  const KEY_POS="botpos_"+(CFG.id||"bot");
  const wrap=document.createElement("div");wrap.id="botWrap";
  wrap.innerHTML=`<div id="botBubble" class="botBubble" title="${NAMA}">${AVA}</div>
  <div id="botPanel" class="botPanel" style="display:none">
    <div class="botHead">${AVA} <b>${NAMA}</b><button id="botClose" class="botX">✕</button></div>
    <div id="botMsgs" class="botMsgs"></div>
    <div class="botInputRow"><input id="botInput" placeholder="Tanya sesuatu..."><button id="botSend">➤</button></div>
  </div>`;
  document.body.appendChild(wrap);
  const $=s=>wrap.querySelector(s);
  const bubble=$("#botBubble"),panel=$("#botPanel"),msgs=$("#botMsgs");

  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function tambahPesan(teks,dari){const d=document.createElement("div");d.className="botMsg "+(dari==="bot"?"botDari":"userDari");d.innerHTML=teks;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
  function tambahMikir(){const d=document.createElement("div");d.className="botMsg botDari";d.id="botMikirSedang";d.innerHTML='<span class="botMikir"><span></span><span></span><span></span></span>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
  function hapusMikir(){const m=$("#botMikirSedang");if(m)m.remove();}

  function cariJawaban(q){
    q=q.toLowerCase();let terbaik=null,skorT=0;
    FAQ.forEach(item=>{let s=0;item.kw.forEach(k=>{if(q.includes(k))s+=k.length;});if(s>skorT){skorT=s;terbaik=item;}});
    if(terbaik&&skorT>0)return typeof terbaik.jawab==="function"?terbaik.jawab():terbaik.jawab;
    return CFG.gakTau||"Hmm, aku belum paham pertanyaan itu 😵‍💫";
  }
  function kirim(){
    const v=$("#botInput").value.trim();if(!v)return;
    tambahPesan(esc(v),"user");$("#botInput").value="";tambahMikir();
    setTimeout(()=>{hapusMikir();tambahPesan(cariJawaban(v),"bot");},600+Math.random()*900);
  }
  $("#botSend").addEventListener("click",kirim);
  $("#botInput").addEventListener("keydown",e=>{if(e.key==="Enter")kirim();});

  let dibukaDulu=false;
  bubble.addEventListener("click",()=>{
    if(bubble.dataset.drag==="1"){bubble.dataset.drag="0";return;}
    panel.style.display=panel.style.display==="none"?"flex":"none";
    if(!dibukaDulu&&panel.style.display==="flex"){dibukaDulu=true;tambahPesan(SAPA,"bot");}
  });
  $("#botClose").addEventListener("click",()=>panel.style.display="none");

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
})();