(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Seamless marquee: double the track until it is at least 2x its container.
  var track=document.querySelector('.marquee__track');
  if(track){var g=0; while(track.scrollWidth < track.parentElement.offsetWidth*2 && g++<8){track.innerHTML+=track.innerHTML;}}

  if(reduce) return;

  // Scroll reveals with per-group stagger.
  var sel='.sec-head, .card, .step, .faq details, .shot';
  document.querySelectorAll(sel).forEach(function(el){el.classList.add('reveal');});
  document.querySelectorAll('.grid,.steps,.faq,.shots').forEach(function(parent){
    Array.prototype.forEach.call(parent.children,function(child,i){
      if(child.classList&&child.classList.contains('reveal')){child.style.transitionDelay=(Math.min(i,5)*0.07).toFixed(2)+'s';}
    });
  });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -7% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else { document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');}); }

  // Smooth scrolling (graceful if the library did not load).
  if(window.Lenis){
    var lenis=new Lenis({duration:1.05,smoothWheel:true});
    function raf(t){lenis.raf(t);requestAnimationFrame(raf);}
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click',function(e){
        var id=a.getAttribute('href');
        if(id.length>1){var t=document.querySelector(id); if(t){e.preventDefault(); lenis.scrollTo(t,{offset:-68});}}
      });
    });
  }
})();
