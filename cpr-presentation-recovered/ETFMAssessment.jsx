import { useEffect, useState } from "react";
import "./site.css";

const Arrow = () => <span aria-hidden="true">↗</span>;
const Check = () => <span className="check" aria-hidden="true">✓</span>;
const Logo = ({className="cpr-logo"}) => <img className={className} src="/images/cpr-logo.png" alt="Canadian Prospects Recruiting"/>;
const ImpactIcon = ({type}) => {
  const paths = {
    "01": <><path d="M6 4h9l3 3v13H6z"/><path d="M15 4v4h4M9 12h6M9 16h6"/></>,
    "02": <><path d="M4 19h16M7 16V9l5-4 5 4v7M10 16v-4h4v4"/><path d="m6 7 6-4 6 4"/></>,
    "03": <><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></>,
    "04": <><path d="M5 3h11l3 3v15H5z"/><path d="M16 3v4h4M8 11h8M8 15h8M8 19h5"/></>,
    grad: <><path d="M12 2 4 6v4c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"/><path d="M9 12h6M12 9v6"/></>,
    clipboard: <><path d="M9 4h6v2H9zM8 6H6v14h12V6h-2"/><path d="M9 11h6M9 15h4"/></>,
    ball: <><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></>,
    checklist: <><path d="M5 3h11l3 3v15H5z"/><path d="M16 3v4h4M8 12l2 2 4-4M8 17h6"/></>
  };
  return <div className="impact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{paths[type]}</svg></div>;
};

const studentItems = [
  ["01", "Academic transcripts", "Official records from every secondary school you attended."],
  ["02", "Graduation requirements", "The courses and credits needed to complete secondary school."],
  ["03", "English proficiency", "A recognized language test may be required by your school."],
  ["04", "Application documents", "Identification, translations, recommendations, and financial records."],
];
const visaSteps = [["01","Choose your school","Receive admission from an approved institution."],["02","Confirm funding","Prepare proof that tuition and living costs are covered."],["03","Apply early","Complete the correct study permit or student visa application."],["04","Prepare to travel","Carry the documents you may need when you arrive."]];
const scholarships = [["Athletic","Based on your ability and a program’s needs.","May be full or partial"],["Academic","Based on your grades and academic record.","Varies by institution"],["Combined","A blend of athletic, academic, and other support.","Often school-specific"]];
const globalFlags = [["/flags/canada.png","Canada"],["/flags/united-states.png","United States"],["/flags/nigeria.png","Nigeria"],["/flags/spain.png","Spain"],["/flags/australia.png","Australia"],["/flags/brazil.png","Brazil"],["/flags/serbia.png","Serbia"],["/flags/france.png","France"]];

function Header(){const[open,setOpen]=useState(false);return <header className="nav"><a className="brand" href="#top" aria-label="Canadian Prospects home"><Logo/><span>CANADIAN PROSPECTS<small>RECRUITING INTERNATIONAL™</small></span></a><button className="menu" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open?"Close":"Menu"}</button><nav className={open?"open":""} onClick={()=>setOpen(false)}><a href="#global">Global athletes</a><a href="#journey">The journey</a><a href="#requirements">Requirements</a><a href="#resources">Recruiting resources</a><a href="#guidance">Why CPR</a><a className="nav-cta" href="#begin">Begin your journey <Arrow/></a></nav></header>}

function App(){useEffect(()=>{const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));return()=>observer.disconnect()},[]);return <main id="top">
<Header/>
<section className="hero"><img src="/images/hero-gym.png" alt="A student-athlete entering an empty gym before sunrise"/><div className="hero-shade"/><Logo className="hero-logo"/><div className="hero-content reveal visible"><p className="eyebrow"><span/> YOUR JOURNEY STARTS HERE</p><h1>Every Dream Begins<br/>Before Anyone Is Watching.</h1><p className="lead">Talent matters. But preparation on the court, in the classroom, and beyond is what makes you ready when opportunity arrives.</p><p className="global-lead">Canadian Prospects Recruiting helps male and female players around the world turn ambition into a clear path toward education and basketball in North America.</p><div className="actions"><a className="button red" href="#begin">Begin your journey <Arrow/></a><a className="text-link" href="#global">See what is possible <span>↓</span></a></div></div><div className="scroll">SCROLL TO EXPLORE <span>↓</span></div></section>
<section className="manifesto section" id="journey"><div className="section-no">01 / THE MINDSET</div><div className="manifesto-copy reveal"><p className="eyebrow dark"><span/> EVERY JOURNEY STARTS WITH A DREAM</p><h2>Dream Big.<br/><em>Prepare Bigger.</em></h2><p className="large-copy">Talent may open a door. Preparation determines how far you walk through it.</p><p>Competing in North America asks for more than athletic ability. It asks for discipline. Academic preparation. Character. Consistency. The work begins long before a coach notices you.</p></div><div className="stat-strip reveal"><div><strong>Student</strong><span>Study with purpose</span></div><div><strong>Athlete</strong><span>Train with intention</span></div><div><strong>Person</strong><span>Grow through change</span></div></div></section>
<section className="global-story" id="global"><img src="/images/global-athletes.png" alt="Male and female international student-athletes arriving together"/><div className="global-shade"/><div className="global-copy reveal"><p className="eyebrow"><span/> ATHLETES WITHOUT BORDERS</p><h2>Your dream can<br/>begin anywhere.</h2><p className="large-copy">The distance between where you are and where you want to be should never make the dream feel impossible.</p><p>CPR works with male and female athletes from communities around the world. We help you understand your potential, prepare for the opportunity, and move forward with someone in your corner.</p><div className="world-tags"><span>Every country</span><span>Every background</span><span>Women and men</span><span>One clear path</span></div></div></section>
<section className="flag-strip" aria-label="Basketball connects athletes around the world"><div><p className="eyebrow dark"><span/> A GLOBAL GAME</p><h3>Different countries. Different journeys.<br/>One belief in what is possible.</h3></div><ul>{globalFlags.map(([flag,country])=><li key={country}><img src={flag} alt={`${country} flag`}/><small>{country}</small></li>)}</ul></section>
<section className="north section dark-section"><div className="section-no">02 / MORE THAN A DESTINATION</div><div className="opportunity-grid reveal"><div><p className="eyebrow"><span/> WHY NORTH AMERICA</p><h2>Basketball opens the conversation.<br/>Opportunity changes the future.</h2></div><div><p>World-class education. Elite competition. Personal growth. New relationships. CPR helps you look beyond the next season and understand what this opportunity can mean for the rest of your life.</p><div className="mini-grid"><span>01 <b>Education</b></span><span>02 <b>Competition</b></span><span>03 <b>Development</b></span><span>04 <b>Belonging</b></span></div></div></div></section>
<section className="requirements section" id="requirements"><div className="section-no">03 / PREPARE FOR THE OPPORTUNITY</div><div className="section-head reveal"><p className="eyebrow dark"><span/> INTERNATIONAL STUDENT REQUIREMENTS</p><h2>Your game gets attention.<br/>Your preparation makes you ready.</h2><p>International athletes manage school records, language requirements, eligibility, and immigration steps alongside training. CPR helps you see the complete picture early so no important detail is left behind.</p></div><div className="card-grid">{studentItems.map(([n,t,d])=><article className="info-card reveal" key={n}><span>{n}</span><ImpactIcon type={n}/><h3>{t}</h3><p>{d}</p><a href="#checklist">Understand this <Arrow/></a></article>)}</div><p className="closing-line reveal">Every document completed today <em>removes a barrier tomorrow.</em></p></section>
<section className="split-story section"><div className="story-image reveal"><img src="/images/student-library.png" alt="A student-athlete studying game film in a library"/><span>Preparation lives in the details.</span></div><div className="story-copy reveal"><p className="eyebrow dark"><span/> ACADEMICS</p><h2>Your education matters.</h2><p className="large-copy">Your classroom performance is as important as your performance on the court.</p><ul><li><Check/><span><b>Plan your courses</b>Choose classes that keep your options open.</span></li><li><Check/><span><b>Protect your grades</b>Your complete academic history will be reviewed.</span></li><li><Check/><span><b>Track your deadlines</b>Testing, applications, and documents all take time.</span></li></ul></div></section>
<section className="visa section dark-section"><div className="section-no">04 / TRAVEL WITH CONFIDENCE</div><div className="section-head reveal"><p className="eyebrow"><span/> STUDENT VISAS</p><h2>Your journey begins<br/>before you travel.</h2><p>Visa requirements depend on where you study and where you are from. Start early, use official sources, and give every step the attention it deserves.</p></div><div className="timeline">{visaSteps.map(([n,t,d],i)=><article className="timeline-card reveal" key={n}><div><span>{n}</span>{i<visaSteps.length-1&&<i/>}</div><h3>{t}</h3><p>{d}</p></article>)}</div><p className="notice reveal"><b>Good to know</b> Costs and processing times change. Always confirm current requirements with the official immigration authority for your destination.</p></section>
<section className="funding section"><div className="section-no">05 / FUNDING YOUR FUTURE</div><div className="section-head reveal"><p className="eyebrow dark"><span/> SCHOLARSHIPS</p><h2>Understand what support can look like.</h2><p>There is no single scholarship path. The strongest decisions begin with a clear view of what is included and what you will still need to cover.</p></div><div className="fund-grid">{scholarships.map(([t,d,m],i)=><article className={`fund-card reveal ${i===1?"featured":""}`} key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p><div>{m}</div><ul><li><Check/>Ask what the award covers</li><li><Check/>Understand renewal terms</li><li><Check/>Compare the full cost</li></ul></article>)}</div></section>
<section className="living section" id="life"><div className="living-title reveal"><p className="eyebrow"><span/> LIVING IN NORTH AMERICA</p><h2>Your new home<br/>away from home.</h2><p>The right living environment supports your studies, your sport, and your ability to settle into a new place.</p></div><div className="living-options reveal"><article><span>OPTION 01</span><h3>Dorm living</h3><p>Live on or near campus with other students.</p><dl><div><dt>Community</dt><dd>Built into daily life</dd></div><div><dt>Independence</dt><dd>More personal responsibility</dd></div><div><dt>Best for</dt><dd>Campus connection</dd></div></dl></article><article><span>OPTION 02</span><h3>Host family</h3><p>Live with a local family in a home setting.</p><dl><div><dt>Community</dt><dd>Family support nearby</dd></div><div><dt>Independence</dt><dd>Shared routines and expectations</dd></div><div><dt>Best for</dt><dd>A guided transition</dd></div></dl></article></div></section>
<section className="travel section" id="checklist"><div className="section-no">06 / KNOW BEFORE YOU GO</div><div className="travel-grid reveal"><div><p className="eyebrow dark"><span/> TRAVEL & ELIGIBILITY</p><h2>Be ready before departure day.</h2><p>Rules vary by country and can change. Build your plan from verified information, never assumptions.</p></div><ol>{[["01","Confirm entry requirements","Check the official rules for your passport and destination."],["02","Organize your documents","Keep originals, copies, and translations accessible."],["03","Review athletic eligibility","Understand the rules of the league or association."],["04","Plan your arrival","Know where you are going and who will meet you."]].map(([n,t,d])=><li key={n}><span>{n}</span><b>{t}</b><p>{d}</p></li>)}</ol></div></section>
<section className="guidance section dark-section" id="guidance"><div className="section-no">07 / WHY CANADIAN PROSPECTS RECRUITING</div><div className="guidance-grid reveal"><div><Logo className="guidance-logo"/><p className="eyebrow"><span/> YOUR BRIDGE TO OPPORTUNITY</p><h2>We see the player.<br/>We guide the person.</h2></div><div><p className="large-copy">Every athlete’s journey is different. Your guidance should be too.</p><p>CPR brings evaluation, education, recruiting support, and personal guidance into one relationship. We help you understand where you stand, what must happen next, and which opportunities genuinely fit your future.</p><div className="guidance-list"><span>Honest evaluation</span><span>Academic planning</span><span>Recruiting guidance</span><span>Global transition support</span></div></div></div></section>
<section className="resources section" id="resources">
  <div className="section-no">08 / RECRUITING RESOURCES</div>
  <div className="section-head reveal">
    <p className="eyebrow dark"><span/> RECRUITING RESOURCES</p>
    <h2>Every Recruiting Journey<br/>Starts With Preparation.</h2>
    <p>Success in college recruiting requires far more than athletic ability. The strongest opportunities belong to athletes who prepare early, understand NCAA eligibility requirements, stay academically eligible, and organize the recruiting process long before college coaches begin making decisions.</p>
    <p className="resources-lead">At Canadian Prospects Recruiting, our role goes beyond creating exposure. We help athletes and families understand the recruiting process, prepare the right documentation, and avoid common eligibility issues so they are ready when opportunities arise.</p>
  </div>

  <article className="resource-feature reveal">
    <div>
      <ImpactIcon type="grad"/>
      <h3>NCAA Eligibility Center</h3>
      <p>Student-athletes pursuing NCAA Division I or Division II opportunities should register with the NCAA Eligibility Center as early as possible during high school.</p>
      <p>The Eligibility Center evaluates academic records, amateur status, and graduation requirements to determine whether a student-athlete is eligible to compete at the NCAA level.</p>
      <p>Early registration helps families understand where they stand and provides time to address any academic or eligibility concerns before the recruiting process begins.</p>
    </div>
    <a className="button red" href="https://web3.ncaa.org/ecwr3/" target="_blank" rel="noopener noreferrer">Check Your NCAA Eligibility <Arrow/></a>
  </article>

  <div className="section-head reveal resources-subhead">
    <p className="eyebrow dark"><span/> REQUIREMENTS BY DIVISION</p>
    <h2>Know what each path asks of you.</h2>
  </div>
  <div className="division-grid">
    <article className="division-card reveal">
      <ImpactIcon type="clipboard"/>
      <span>01</span>
      <h3>NCAA Division I</h3>
      <p>Student-athletes pursuing Division I programs should:</p>
      <ul>
        <li><Check/>Register with the NCAA Eligibility Center.</li>
        <li><Check/>Complete sixteen NCAA-approved core courses.</li>
        <li><Check/>Meet NCAA minimum core GPA requirements.</li>
        <li><Check/>Maintain amateur status.</li>
        <li><Check/>Under current NCAA rules, student-athletes may compete for up to five seasons within a five-year eligibility clock.</li>
      </ul>
    </article>
    <article className="division-card featured reveal">
      <ImpactIcon type="ball"/>
      <span>02</span>
      <h3>NCAA Division II</h3>
      <p>Student-athletes pursuing Division II opportunities should:</p>
      <ul>
        <li><Check/>Register with the NCAA Eligibility Center.</li>
        <li><Check/>Complete sixteen NCAA-approved core courses.</li>
        <li><Check/>Meet NCAA academic requirements.</li>
        <li><Check/>Maintain amateur status.</li>
        <li><Check/>Student-athletes are limited to four seasons of competition within ten semesters or fifteen quarters.</li>
      </ul>
    </article>
    <article className="division-card reveal">
      <ImpactIcon type="checklist"/>
      <span>03</span>
      <h3>NCAA Division III</h3>
      <p>Division III schools establish their own admissions and academic eligibility requirements.</p>
      <p>Unlike Division I and Division II, Division III institutions do not use the NCAA Eligibility Center for initial eligibility certification.</p>
      <p>Athletes should work directly with each institution to understand admissions and participation requirements.</p>
    </article>
  </div>

  <div className="eligibility-note reveal">
    <p className="eyebrow dark"><span/> IMPORTANT ELIGIBILITY CONSIDERATIONS</p>
    <h3>Planning Early Creates More Opportunities</h3>
    <p>NCAA eligibility involves much more than grades alone. Families should understand that eligibility may also be affected by:</p>
    <div className="eligibility-tags">
      <span>Amateurism certification</span>
      <span>Academic progress</span>
      <span>Transfer rules</span>
      <span>Junior college enrollment</span>
      <span>Medical hardship waivers</span>
      <span>Redshirt seasons</span>
      <span>Graduation timelines</span>
    </div>
    <p>Preparing early allows families to avoid unexpected eligibility issues during the recruiting process.</p>
  </div>

  <article className="resource-feature reveal">
    <div>
      <ImpactIcon type="clipboard"/>
      <h3>International Athlete Fee Agreement</h3>
      <p>International athletes participating in Canadian Prospects Recruiting programs should complete the International Athlete Fee Agreement before beginning the recruiting process.</p>
      <p>Completing this agreement early helps ensure documentation is organized and allows recruiting activities to move forward without unnecessary delays.</p>
    </div>
    <a className="button red" href="https://docs.google.com/forms/d/e/1FAIpQLScnS-NAIhJnNDCVMbhFtAPbEtYZT9ZzZytagNu1THa9f80qmg/viewform?usp=publish-editor" target="_blank" rel="noopener noreferrer">Complete International Fee Agreement <Arrow/></a>
  </article>

  <div className="resources-why reveal">
    <p className="eyebrow dark"><span/> WHY THIS MATTERS</p>
    <h2>Preparation turns opportunity<br/>into reality.</h2>
    <p>Every athlete dreams about the opportunity to compete at the next level. Preparation is what turns that opportunity into reality.</p>
    <p>Understanding NCAA eligibility requirements, staying academically prepared, organizing recruiting materials, and completing required documentation early gives athletes the best opportunity to succeed when college coaches begin evaluating prospects.</p>
    <p className="closing-line">Canadian Prospects Recruiting is committed to helping families navigate every stage of that journey <em>with confidence.</em></p>
  </div>
</section>
<section className="final" id="begin"><img src="/images/campus-path.png" alt="A student-athlete walking alone across a university campus"/><div className="final-shade"/><Logo className="final-logo"/><div className="final-content reveal"><p className="eyebrow"><span/> YOUR NEXT CHAPTER</p><h2>From anywhere<br/>in the world.<br/>Toward what is next.</h2><p>Your dream deserves preparation. Your future deserves honest guidance. When you are ready to take the next step, CPR is ready to walk with you.</p><div className="actions"><a className="button red" href="mailto:info@canadianprospects.com?subject=Begin%20My%20Journey">Begin your journey <Arrow/></a><a className="button ghost" href="mailto:info@canadianprospects.com?subject=Schedule%20My%20Evaluation">Schedule an evaluation</a></div></div></section>
<footer><a className="brand" href="#top"><Logo/><span>CANADIAN PROSPECTS<small>RECRUITING INTERNATIONAL™</small></span></a><p>Guidance for male and female international student-athletes pursuing education and basketball opportunities in North America.</p><div><a href="#global">Global athletes</a><a href="#journey">Journey</a><a href="#requirements">Requirements</a><a href="#resources">Recruiting resources</a><a href="#guidance">Why CPR</a><a href="mailto:info@canadianprospects.com">Contact</a></div><small>© 2026 Canadian Prospects Recruiting International™</small></footer>
</main>}
export default App;
