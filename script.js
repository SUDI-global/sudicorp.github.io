
const header=document.querySelector('.site-header');
const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();

window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',window.scrollY>30),{passive:true});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')});
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const menuBtn=document.getElementById('menuBtn');
const nav=document.querySelector('.main-nav');
menuBtn?.addEventListener('click',()=>{
  const open=menuBtn.getAttribute('aria-expanded')==='true';
  menuBtn.setAttribute('aria-expanded',String(!open));
  nav.classList.toggle('mobile-open',!open);
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('mobile-open');
  menuBtn?.setAttribute('aria-expanded','false');
}));

const translations={
  ar:{
    navAbout:'عن SUDI',navSectors:'القطاعات',navProjects:'المشاريع',navApproach:'المنهجية',navInsights:'رؤى',navContact:'تواصل',
    heroEyebrow:'SUDI GLOBAL · تأسست 2013',heroLead:'مجموعة أعمال سودانية تربط الإمكانات المحلية ورأس المال والقدرات بالأسواق والفرص العالمية.',
    heroPrimary:'اكتشف SUDI <span>↗</span>',heroSecondary:'استكشف المشاريع',heroSide1:'الخرطوم / السودان',heroSide2:'متعددة القطاعات / رؤية عالمية',scrollLabel:'مرر لاكتشاف المزيد',
    aboutLabel:'01 / لمحة عن SUDI',aboutTitle:'بُنيت في السودان.<br><em>ومصممة للتوسع.</em>',
    aboutText:'تعمل SUDI عبر قطاعات استراتيجية يمكن فيها تحويل الموارد والقدرات المحلية إلى قيمة إنتاجية قابلة للنمو. يجمع نموذجها بين الاستثمار والزراعة والطاقة والتجارة والتقنية والاستشارات ضمن منظومة مترابطة.',
    stat1:'التأسيس',stat2:'قطاعات<br>استراتيجية',stat3:'جذور<br>في التشغيل الحقيقي',stat4:'رؤية<br>من السودان إلى العالم',
    sectorLabel:'02 / القطاعات الاستراتيجية',sectorIntro:'نعمل حيث يلتقي رأس المال والبنية التحتية والإنتاج والأسواق.',
    sec1Title:'الزراعة',sec1Text:'إنتاج زراعي وتطوير للمشاريع والري، مبني على واقع التشغيل في الميدان.',
    sec2Title:'الطاقة المتجددة',sec2Text:'حلول تعمل بالطاقة الشمسية لتعزيز الإنتاجية والمرونة والنمو المستدام.',
    sec3Title:'التجارة الدولية',sec3Text:'ربط المنتجات والقدرات السودانية بالأسواق الإقليمية والعالمية.',
    sec4Title:'التحول الرقمي',sec4Text:'تقنية ومنصات وبنية رقمية مصممة حول نتائج أعمال قابلة للقياس.',
    sec5Title:'الاستشارات المالية والأعمال',sec5Text:'قدرات مالية وتشغيلية واستراتيجية تساعد المؤسسات على التكيف والنمو والتوسع.',
    projectLabel:'03 / مشاريع مختارة',projectIntro:'أقوى قصة هي العمل نفسه — في الميدان، وفي الأسواق، وفي الأنظمة التشغيلية.',
    featTag:'الزراعة × الطاقة الشمسية',featCaption:'الولاية الشمالية / دنقلا',featIndex:'مميز / المشروع 01',
    featTitle:'مشروع أرض الخير<br><em>للتنمية الزراعية</em>',
    featText:'إنتاج زراعي مدعوم ببنية ري تعمل بالطاقة الشمسية. نموذج عملي يربط الطاقة والمياه والزراعة والأرض المنتجة ضمن منظومة واحدة.',
    featLink:'مرجع المشروع <span>↗</span>',
    tile1Title:'بنية المياه بالطاقة الشمسية',tile1Text:'ضخ مياه ومنظومات مائية تعمل بالطاقة الشمسية لدعم الإنتاج الزراعي.',
    tile2Title:'الإنتاج الحقلي',tile2Text:'عمليات إنتاج زراعي في بيئات تشغيل سودانية متنوعة.',
    tile3Title:'الإنتاج الحيواني',tile3Text:'تربية وإدارة الثروة الحيوانية ودعم عمليات الإنتاج.',
    tile4Title:'من الإنتاج إلى الإمداد',tile4Text:'ربط الإنتاج الزراعي بالنقل وسلاسل الإمداد والبنية التشغيلية.',
    tile5Title:'الوصول إلى المياه',tile5Text:'آبار وبنية مائية تدعم التنمية الزراعية والإنتاج في الميدان.',
    tile6Title:'الغذاء والقيمة المضافة',tile6Text:'قدرات تمتد بالقيمة الزراعية إلى ما بعد الإنتاج الأولي.',
    card1Title:'السودان ← الخليج',card1Text:'نشاط تصديري يربط المنتجات السودانية بالأسواق الخليجية، مع أول صفقة خليجية موثقة لدينا في 2023.',
    card2Title:'بورتسودان',card2Text:'خطوة في توسيع نطاق الحضور التشغيلي وبناء امتداد وطني أوسع.',
    card3Title:'منظومات الري',card3Text:'تشغيل واختبار وحدة إنتاج زراعي بنظام ري يعمل بالطاقة الشمسية في الولاية الشمالية.',
    modelLabel:'04 / نموذج SUDI',modelTitle:'نحن لا نرى القطاعات بمعزل عن بعضها.<br><em>نحن نبني الروابط بينها.</em>',
    approachLabel:'05 / منهجيتنا',approachIntro:'مسار منضبط من الفرصة إلى خلق قيمة مستدامة.',
    app1Title:'تحديد',app1Text:'تحديد الفرص ذات الصلة الاستراتيجية والإمكانات التجارية.',
    app2Title:'تقييم',app2Text:'اختبار الأساسيات والاقتصاديات والمخاطر ومتطلبات التنفيذ.',
    app3Title:'ربط',app3Text:'جمع الأسواق والشركاء والخبرات والقدرات التشغيلية.',
    app4Title:'بناء',app4Text:'تحويل الفرصة القابلة للتنفيذ إلى نشاط تشغيلي قابل للتوسع.',
    app5Title:'توسّع',app5Text:'توسيع القيمة عبر الأسواق والقطاعات والعلاقات طويلة الأمد.',
    reachLabel:'06 / الرؤية العالمية',reachTitle:'من السودان<br><em>إلى العالم.</em>',reachText:'نبدأ من الواقع المحلي. وطموحنا لا تحده الحدود.',
    insightLabel:'07 / رؤى',insightIntro:'أفكار وأسواق وحقائق تشغيلية تشكل رؤيتنا.',
    ins1Title:'الزراعة كمنظومة بنية تحتية',ins1Text:'الإنتاج الزراعي يعتمد على الطاقة والمياه واللوجستيات والوصول إلى السوق — وليس الأرض وحدها.',
    ins2Title:'من الإنتاج إلى السوق',ins2Text:'السلسلة التشغيلية التي تقف خلف نقل المنتجات السودانية إلى الأسواق الإقليمية.',
    ins3Title:'البناء من أجل الاستمرارية',ins3Text:'يمكن للبنية التحتية والتقنية أن تحول القيود إلى مزايا تشغيلية طويلة الأجل.',
    contactLabel:'08 / الشراكات',contactTitle:'ابنِ شيئًا<br><em>يستحق التوسع.</em>',contactText:'لفرص الاستثمار والشراكات الاستراتيجية والاستفسارات التجارية.',
    contactButton:'ابدأ محادثة عبر واتساب <span>↗</span>'
  }
};

const english={};
const translatableIds=Object.keys(translations.ar);
translatableIds.forEach(id=>{
  const el=document.getElementById(id) || document.querySelector(`[data-i18n="${id}"]`);
  if(el) english[id]=el.innerHTML;
});
document.querySelectorAll('[data-i18n]').forEach(el=>english[el.dataset.i18n]=el.innerHTML);

const langBtn=document.getElementById('langBtn');
function setLanguage(lang){
  const isAr=lang==='ar';
  document.documentElement.dir=isAr?'rtl':'ltr';
  document.documentElement.lang=isAr?'ar':'en';
  document.body.classList.toggle('is-ar',isAr);
  Object.entries(isAr?translations.ar:english).forEach(([id,value])=>{
    const el=document.getElementById(id) || document.querySelector(`[data-i18n="${id}"]`);
    if(el) el.innerHTML=value;
  });
  langBtn.textContent=isAr?'English':'العربية';
  document.title=isAr?'سودي العالمية — استثمر. اربط. ابنِ.':'SUDI Global — Invest. Connect. Build.';
  localStorage.setItem('sudi-lang',lang);
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}
const saved=localStorage.getItem('sudi-lang');
if(saved==='ar') setLanguage('ar');
langBtn?.addEventListener('click',()=>setLanguage(document.documentElement.dir==='rtl'?'en':'ar'));

const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');
window.addEventListener('mousemove',e=>{
  if(!dot||!ring)return;
  dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';
  ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';
});
document.querySelectorAll('a,button,.sector,.project-card,.project-tile,.approach-step,.insight').forEach(el=>{
  el.addEventListener('mouseenter',()=>{if(ring){ring.style.width='56px';ring.style.height='56px'}});
  el.addEventListener('mouseleave',()=>{if(ring){ring.style.width='34px';ring.style.height='34px'}});
});
