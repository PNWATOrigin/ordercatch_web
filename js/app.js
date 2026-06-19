/* ===========================================================
   오더캐치 · app.js
   GNB · scroll-reveal · 3 interactions
   =========================================================== */
(function(){
  'use strict';
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  /* ---------- GNB 모바일 토글 ---------- */
  const gnb = $('.gnb'), toggle = $('.gnb__toggle');
  if(toggle) toggle.addEventListener('click', () => gnb.classList.toggle('open'));

  /* ---------- 스크롤 등장 (.reveal) ---------- */
  const revealIO = new IntersectionObserver((es) => {
    es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { threshold:.15, rootMargin:'0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealIO.observe(el));

  /* 섹션 1회 발동 헬퍼 */
  function onceInView(el, fn, threshold=.35){
    if(!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if(e.isIntersecting){ fn(); io.disconnect(); } });
    }, { threshold });
    io.observe(el);
  }

  /* ===========================================================
     ① HERO live panel — 실시간 문자 → 발주 변환
     =========================================================== */
  (function heroPanel(){
    const lp = $('.livepanel'); if(!lp) return;
    const steps = $$('[data-stp]', lp);
    const toast = $('.lp__toast', lp), toastText = $('.lp__toast span', lp), sum = $('.lp__sum', lp);
    let timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    function countUp(el, target, dur){
      let start = null;
      function f(now){ if(start===null) start=now; const p=Math.min((now-start)/dur,1);
        el.textContent = Math.round(target*(1-Math.pow(1-p,3))).toLocaleString('ko-KR')+'원';
        if(p<1) requestAnimationFrame(f); }
      requestAnimationFrame(f);
    }
    function run(){
      timers.forEach(clearTimeout); timers=[];
      steps.forEach(s => s.classList.remove('show'));
      toast.classList.add('analyzing'); toast.classList.remove('done'); if(toastText) toastText.textContent='AI 분석 중...';
      if(sum) sum.textContent='0원';
      at(300, ()=> steps[0]&&steps[0].classList.add('show'));
      at(1000,()=> steps[1]&&steps[1].classList.add('show'));
      at(2200,()=>{ toast.classList.remove('analyzing'); toast.classList.add('done'); if(toastText) toastText.textContent='AI 분석 완료 · 발주 자동 생성'; });
      at(2800,()=> steps[2]&&steps[2].classList.add('show'));
      at(3300,()=> steps[3]&&steps[3].classList.add('show'));
      at(3800,()=> steps[4]&&steps[4].classList.add('show'));
      at(4350,()=>{ steps[5]&&steps[5].classList.add('show'); if(sum) countUp(sum, 27000, 700); });
    }
    onceInView(lp, run, .3);
  })();

  /* ===========================================================
     ② TRANSFORM — 문자 → AI 구조화 → 스켈레톤 → 발주 리스트
     (760 중앙 단일 스테이지 교체)
     =========================================================== */
  (function sxform(){
    const root = $('.sx'); if(!root) return;
    const stMsg = $('.sx__stage--msg', root), stCore = $('.sx__stage--core', root), stTable = $('.sx__stage--table', root);
    const card = $('.sx__card', root), sub = $('.sx__sub', root);
    const bubbles = $$('.sx__bubble', root), rrows = $$('.sx__trow.tbody, .sx__lfoot', card);
    let timers = []; const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    function run(){
      timers.forEach(clearTimeout); timers = [];
      [stMsg, stCore, stTable].forEach(s => s.classList.remove('on'));
      bubbles.forEach(b => b.classList.remove('show'));
      card.classList.remove('real'); rrows.forEach(r => r.classList.remove('show'));
      if(sub) sub.textContent = '분석 중...';

      at(300,  ()=> stMsg.classList.add('on'));                 // ① 문자 2개 등장
      at(450,  ()=> bubbles[0] && bubbles[0].classList.add('show'));
      at(950,  ()=> bubbles[1] && bubbles[1].classList.add('show'));
      at(2600, ()=> stMsg.classList.remove('on'));              // 문자 사라짐
      at(3050, ()=> stCore.classList.add('on'));                // ② AI 코어만 (회전)
      at(4900, ()=> stCore.classList.remove('on'));             // 코어 사라짐
      at(5350, ()=> stTable.classList.add('on'));               // ③ 스켈레톤
      at(6700, ()=> card.classList.add('real'));                // ④ 발주 리스트로 전환
      at(7000, ()=> rrows[0] && rrows[0].classList.add('show'));
      at(7250, ()=> rrows[1] && rrows[1].classList.add('show'));
      at(7500, ()=> rrows[2] && rrows[2].classList.add('show'));
      at(10200, run);                                           // 루프
    }
    onceInView(root, run, .35);
  })();

  /* ===========================================================
     ③ STATS — 수치 랜덤 스크램블 → 고정
     =========================================================== */
  (function stats(){
    const nums = $$('.stat__num'); if(!nums.length) return;
    const DUR = 1200;
    function scramble(el, delay){
      const final = el.dataset.final, digitsMode = el.dataset.mode==='digits';
      const m = final.match(/^(\d+)(.*)$/), suffix = m?m[2]:'', digits = m?m[1].length:0;
      let raf=null, start=null, locked=false;
      const randVal = () => {
        if(digitsMode) return final.replace(/\d/g, ()=> Math.floor(Math.random()*10));
        const max=Math.pow(10,digits)-1, min=digits>1?Math.pow(10,digits-1):1;
        return (min+Math.floor(Math.random()*(max-min+1)))+suffix;
      };
      const lock = () => { if(locked) return; locked=true; if(raf) cancelAnimationFrame(raf);
        el.textContent=final; el.classList.add('pop'); setTimeout(()=>el.classList.remove('pop'),320); };
      const frame = (now) => { if(start===null) start=now;
        if(now-start>=DUR){ lock(); return; } el.textContent=randVal(); raf=requestAnimationFrame(frame); };
      el.textContent = randVal();
      setTimeout(()=>{ if(!locked){ start=null; raf=requestAnimationFrame(frame); } }, delay);
      setTimeout(lock, delay+DUR+60);
    }
    onceInView($('.stats'), () => nums.forEach((el,i)=> scramble(el, i*150)), .4);
  })();

  /* ===========================================================
     ④ FEATURES 카드 순차 등장 — 한 장씩 차례로 슬라이드업
     =========================================================== */
  (function seqReveal(){
    const lists = [
      ['.fgrid','.fcard'], ['.pcards','.pcard'], ['.pain-grid','.paincard'],
      ['.ind-grid','.indcard'], ['.plans','.plan'], ['.flow-grid','.fstep']
    ];
    lists.forEach(([cs, is]) => {
      const cont = $(cs); if(!cont) return;
      const items = $$(is, cont); if(!items.length) return;
      onceInView(cont, () => items.forEach((it, i) => setTimeout(() => it.classList.add('in'), i*90)), .2);
    });
  })();
})();
