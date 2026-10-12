/* EZUI — tiny modal helper. No dependencies.
   EZUI.show('id') / EZUI.hide('id')  : toggles .show on .ov, resets .pbody scroll
   [data-for="id"] buttons            : proxy-click another button (footer "Close" -> real close handler)
   EZUI.vh()                          : sets --vh (mobile address-bar safe) ; auto on resize */
(function(g){
  const $=s=>document.querySelector(s);
  function show(id,on=true){const e=document.getElementById(id);if(!e)return;e.classList.toggle('show',on);if(on)e.querySelectorAll('.pbody').forEach(b=>b.scrollTop=0);}
  function hide(id){show(id,false);}
  function vh(){document.documentElement.style.setProperty('--vh',innerHeight*0.01+'px');}
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-for]');if(b){const x=document.getElementById(b.dataset.for);if(x)x.click();}});
  addEventListener('resize',vh);vh();
  g.EZUI={show,hide,vh};
})(window);
