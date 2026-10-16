(() => {
 const cards = [...document.querySelectorAll('.vision-card')];
 cards.forEach(card => card.style.setProperty('--ratio', card.dataset.ratio));
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 document.body.classList.add('visions-enhanced');
 const main = document.querySelector('.visions-main');
 const intro = document.querySelector('.visions-intro');
 const progress = document.querySelector('.visions-progress span');
 const count = document.querySelector('#vision-count');
 const video = document.querySelector('.vision-card video');
 const ratios = cards.map(card => Number(card.dataset.ratio));
 const clamp = n => Math.max(0, Math.min(1, n));
 const lerp = (a,b,t) => a+(b-a)*t;
 const ease = t => t*t*(3-2*t);
 let target = 0, current = 0, frame = 0, previous = 0;
 let vw = innerWidth, vh = innerHeight;
 function measure() {
  vw = innerWidth; vh = innerHeight;
  target = clamp((scrollY-main.offsetTop)/Math.max(1,main.offsetHeight-vh));
  request();
 }
 function request() { if (!frame) frame=requestAnimationFrame(draw); }
 function draw(time) {
  const dt = previous ? Math.min(50,time-previous) : 16.7; previous=time;
  current=lerp(current,target,1-Math.exp(-dt/150));
  if (Math.abs(current-target)<.00005) current=target;
  const mobile=vw<=650;
  const morph=ease(clamp(current/.16));
  const travel=clamp((current-.16)/.84);
  const rowH=vh*(mobile?.47:.61);
  const gap=vw*.025;
  const widths=ratios.map(r=>rowH*r);
  const centers=[];let cursor=0;
  widths.forEach(w=>{centers.push(cursor+w/2);cursor+=w+gap;});
  const shift=lerp(centers[0],centers.at(-1),travel)-vw/2;
  const cellW=Math.min(vw*.235,285);
  const cellH=vh*.30;
  const gridGap=vw*.018;
  const gridX=(vw-(3*cellW+2*gridGap))/2;
  const gridTop=vh*(mobile?.62:.47);
  let nearest=0,dist=Infinity;
  cards.forEach((card,i)=>{
   const initialH=Math.min(cellH-14,cellW/ratios[i]);
   const initialW=initialH*ratios[i];
   const x0=gridX+(i%3)*(cellW+gridGap)+(cellW-initialW)/2;
   const y0=gridTop+Math.floor(i/3)*cellH;
   const x1=centers[i]-widths[i]/2-shift;
   const y1=vh*(mobile?.43:.29);
   const x=lerp(x0,x1,morph), y=lerp(y0,y1,morph);
   card.style.width=lerp(initialW,widths[i],morph)+'px';
   card.style.height=lerp(initialH,rowH,morph)+'px';
   card.style.transform=`translate3d(${x}px,${y}px,0)`;
   const d=Math.abs(centers[i]-shift-vw/2);
   if(d<dist){dist=d;nearest=i;}
  });
  intro.style.opacity=String(1-clamp(current/.12));
  intro.style.visibility=current>=.12?'hidden':'visible';
  progress.style.transform=`scaleX(${current})`;
  count.textContent=String(nearest+1).padStart(2,'0')+' / '+cards.length;
  if(nearest!==0&&!video.paused) video.pause();
  frame=0;
  if(current!==target) request();else previous=0;
 }
 addEventListener('scroll',measure,{passive:true});
 addEventListener('resize',measure);
 document.addEventListener('focusin',event=>{
  const card=event.target.closest('.vision-card');
  if(card&&event.target===video&&current>.16) {
   scrollTo({top:main.offsetTop+ .16*(main.offsetHeight-vh),behavior:'smooth'});
  }
 });
 measure();
})();
