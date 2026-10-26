(()=>{"use strict";
const body=document.body,root=document.documentElement;
function setLanguage(lang){
 if(!["ar","en"].includes(lang))lang="ar";
 body.dataset.language=lang;root.lang=lang;root.dir=lang==="ar"?"rtl":"ltr";
 document.querySelectorAll("[data-lang-toggle]").forEach(button=>{button.textContent=lang==="ar"?"EN":"عربي";button.setAttribute("aria-label",lang==="ar"?"Switch to English":"التبديل إلى العربية")});
 try{localStorage.setItem("sudi-language",lang)}catch(error){}
}
let savedLanguage="ar";try{savedLanguage=localStorage.getItem("sudi-language")||"ar"}catch(error){}setLanguage(savedLanguage);
document.querySelectorAll("[data-lang-toggle]").forEach(button=>button.addEventListener("click",()=>setLanguage(body.dataset.language==="ar"?"en":"ar")));
const header=document.querySelector("[data-header]");
function updateHeader(){if(!header)return;if(window.scrollY>10||header.dataset.solidDefault==="true")header.classList.add("is-solid");else header.classList.remove("is-solid")}
window.addEventListener("scroll",updateHeader,{passive:true});updateHeader();
const menu=document.querySelector("[data-mobile-menu]"),menuOpen=document.querySelector("[data-menu-open]"),menuClose=document.querySelector("[data-menu-close]");
function closeMenu(){if(!menu)return;menu.classList.remove("open");menu.setAttribute("aria-hidden","true");menuOpen?.setAttribute("aria-expanded","false");body.classList.remove("menu-open")}
function openMenu(){if(!menu)return;closeSearch();menu.classList.add("open");menu.setAttribute("aria-hidden","false");body.classList.add("menu-open");menuOpen?.setAttribute("aria-expanded","true");menu.querySelector("nav a")?.focus()}
menuOpen?.addEventListener("click",()=>menu?.classList.contains("open")?closeMenu():openMenu());
menuClose?.addEventListener("click",closeMenu);menu?.querySelectorAll("nav a").forEach(link=>link.addEventListener("click",closeMenu));
const overlay=document.querySelector("[data-search-overlay]"),searchOpeners=document.querySelectorAll("[data-search-open]"),searchClosers=document.querySelectorAll("[data-search-close]"),searchInput=document.querySelector("[data-search-input]"),searchResults=document.querySelector("[data-search-results]");
const catalog=[
["من نحن","About SUDI","/about/","تاريخ سودي والرسالة والقيادة والحوكمة","SUDI history, mission, leadership and governance"],
["القيادة","Leadership","/about/leadership/","القيادة والمسؤوليات","Leadership and accountability"],
["الحوكمة","Governance","/about/governance/","المساءلة والامتثال والإفصاح","Accountability, compliance and disclosure"],
["تاريخ سودي","SUDI history","/about/history/","تأسيس سودي في الخرطوم ومسيرتها","SUDI foundation and history"],
["محفظتنا","Portfolio","/portfolio/","مجالات التركيز والقطاعات","Focus areas and sectors"],
["الزراعة والطاقة والمياه","Agriculture, energy & water","/portfolio/agriculture-energy/","الري والطاقة الشمسية وضخ المياه","Irrigation, solar and water pumping"],
["التجارة واللوجستيات","Trade & logistics","/portfolio/trade-logistics/","الموردون والأسواق والوثائق","Suppliers, markets and documentation"],
["التحول الرقمي","Digital transformation","/portfolio/digital-transformation/","البرمجيات والتصميم وأدوات العمل الرقمية","Software, design and digital tools"],
["الاستشارات","Advisory","/portfolio/advisory/","التحليل المالي وهندسة الأعمال","Financial analysis and business engineering"],
["مشاريعنا","Projects","/projects/","مكتبة المشاريع والصور الميدانية","Project library and field imagery"],
["الري بالطاقة الشمسية — دنقلا","Solar irrigation — Dongola","/projects/solar-irrigation-dongola/","مشروع دنقلا والطاقة والمياه","Dongola project, energy and water"],
["أرض الخير","Ardh Al-Khair","/projects/ard-al-khair/","الإنتاج الزراعي والغذائي","Agricultural and food production"],
["المياه والثروة الحيوانية","Water and livestock","/projects/livestock-water/","المياه والأعلاف والإمداد","Water, fodder and supply"],
["الاستراتيجية","Strategy","/strategy/","أطروحة الاستثمار ومنهجية العمل","Investment thesis and approach"],
["الرؤى","Insights","/insights/","الأمن الغذائي والطاقة والتجارة","Food security, energy and trade"],
["الأمن الغذائي وسلاسل القيمة","Food security and value chains","/insights/food-security-value-chains/","الإنتاج والتخزين والنقل والجودة","Production, storage, transport and quality"],
["الطاقة الشمسية واقتصاد الري","Solar energy and irrigation","/insights/solar-agriculture/","الطاقة والمياه والتشغيل","Energy, water and operations"],
["التجارة بين أفريقيا والخليج","Africa–Gulf trade","/insights/gulf-africa-trade/","الامتثال والوثائق واللوجستيات","Compliance, documents and logistics"],
["العلاقات المؤسسية","Investor relations","/investor-relations/","التقارير والإفصاحات والتواصل","Reports, disclosures and contact"],
["التقارير والإفصاحات","Reports and disclosures","/investor-relations/reports/","التقارير والوثائق المعتمدة","Approved reports and documents"],
["الوظائف","Careers","/careers/","الثقافة والوظائف","Careers and culture"],
["اتصل بنا","Contact","/contact/","تواصل مع سودي","Contact SUDI"]
];
function renderResults(query=""){
 if(!searchResults)return;const q=query.trim().toLowerCase();
 const matches=catalog.filter(item=>!q||item.join(" ").toLowerCase().includes(q)).slice(0,12);
 searchResults.innerHTML=matches.length?matches.map(item=>'<a class="search-result" href="'+item[2]+'"><small>'+(body.dataset.language==="ar"?item[0]:item[1])+'</small><strong>'+(body.dataset.language==="ar"?item[1]:item[0])+'</strong><p>'+(body.dataset.language==="ar"?item[3]:item[4])+'</p></a>').join(""):'<p class="no-results">'+(body.dataset.language==="ar"?"لا توجد نتائج مطابقة.":"No matching results.")+'</p>';
}
function openSearch(){closeMenu();if(!overlay)return;overlay.hidden=false;body.classList.add("search-open");renderResults(searchInput?.value||"");setTimeout(()=>searchInput?.focus(),20)}
function closeSearch(){if(!overlay)return;overlay.hidden=true;body.classList.remove("search-open")}
searchOpeners.forEach(button=>button.addEventListener("click",openSearch));searchClosers.forEach(button=>button.addEventListener("click",closeSearch));
searchInput?.addEventListener("input",()=>renderResults(searchInput.value));
overlay?.addEventListener("click",event=>{if(event.target===overlay)closeSearch()});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeMenu();closeSearch()}});
const form=document.querySelector("[data-contact-form]");
form?.addEventListener("submit",event=>{event.preventDefault();const data=new FormData(form);const message=["SUDI Global — Corporate Enquiry","Name: "+data.get("name"),"Email: "+data.get("email"),"Organisation: "+(data.get("company")||""),"Interest: "+data.get("interest"),"Message: "+data.get("message")].join("\n");const status=form.querySelector(".form-status");if(status)status.textContent=body.dataset.language==="ar"?"تم تجهيز الرسالة. راجعها في واتساب قبل الإرسال.":"Message prepared. Review it in WhatsApp before sending.";window.open("https://wa.me/249125769999?text="+encodeURIComponent(message),"_blank","noopener,noreferrer")});
const vectorLogo="/assets/sudi-logo.svg";
document.querySelectorAll("img.brand-logo").forEach(img=>{img.src=vectorLogo;img.removeAttribute("data-logo-fallback");img.alt="SUDI Global Investment logo";});
const darkSample=document.querySelector(".logo-showcase > div:not(.logo-showcase-dark) img");
if(darkSample){darkSample.src="https://res.cloudinary.com/dsstn0i8a/image/upload/v1793010729/LOGOSUDI_rgdkkl.jpg";}
const lightSample=document.querySelector(".logo-showcase-dark img");
if(lightSample){lightSample.src=vectorLogo;lightSample.removeAttribute("data-logo-fallback");}
const favicon=document.querySelector('link[rel="icon"]');
if(favicon){favicon.href=vectorLogo;favicon.type="image/svg+xml";}
document.querySelectorAll("[data-logo-fallback]").forEach(img=>img.addEventListener("error",()=>{if(img.dataset.fallbackUsed)return;img.dataset.fallbackUsed="1";img.src=img.dataset.logoFallback;img.classList.add("logo-fallback")},{once:true}));
document.querySelectorAll("img").forEach(img=>{if(!img.hasAttribute("alt"))img.setAttribute("alt","")});
})();