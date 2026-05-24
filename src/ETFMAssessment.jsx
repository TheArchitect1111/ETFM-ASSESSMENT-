import { useState, useEffect } from "react";

const LOGO_URL = "https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png";
const CALENDLY = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";

const C = {
  bg: "#f7f4ef", dark: "#1a1a2e", gold: "#c9973a", goldSoft: "#c9973a18",
  text: "#1a1a2e", muted: "#7a7a8a", border: "#e8e3da", white: "#ffffff",
};

const SCORE_MAP = {
  no_idea:10,some_inconsistent:30,track_mentally:50,track_most:70,know_exactly:90,
  disappears_bills:10,spend_quickly:20,try_save:40,use_intentionally:70,save_invest:90,
  avoid:10,emotional_decisions:20,work_more:40,ask_others:50,slow_plan:85,
  debt:30,spending:25,saving:35,income_consistency:40,planning_future:45,investing:50,fairly_organized:80,
  stability:50,peace_of_mind:55,freedom_from_debt:60,time_freedom:65,ownership_wealth:75,security_family:70,dont_know:20,
};

function calcScore(answers){
  const scores=answers.map(a=>SCORE_MAP[a]||40);
  return Math.round(scores.reduce((s,n)=>s+n,0)/scores.length);
}

const FQ=[
  {id:"awareness",
   bot:"How clearly do you see where your money actually goes each month?",
   subtext:"Awareness is the starting point. No judgment here, just honesty.",
   options:[
     {label:"Honestly? I have no real idea",value:"no_idea"},
     {label:"I know some of it, but not consistently",value:"some_inconsistent"},
     {label:"I have a rough sense, mostly in my head",value:"track_mentally"},
     {label:"I track most of my spending",value:"track_most"},
     {label:"I know exactly where every dollar goes",value:"know_exactly"},
   ]},
  {id:"extra_money",
   bot:"When unexpected money comes in, what usually happens to it?",
   subtext:"How you treat extra money reveals your real financial pattern, not your intentions.",
   options:[
     {label:"It gets absorbed into bills and everyday expenses",value:"disappears_bills"},
     {label:"I spend it, sometimes without thinking",value:"spend_quickly"},
     {label:"I try to save it, but something usually comes up",value:"try_save"},
     {label:"I put it toward something intentional",value:"use_intentionally"},
     {label:"I save or invest it without hesitation",value:"save_invest"},
   ]},
  {id:"stress_response",
   bot:"When financial pressure builds, how do you usually respond?",
   subtext:"Your response under pressure shapes your financial life more than your income ever will.",
   options:[
     {label:"I avoid thinking about it as long as I can",value:"avoid"},
     {label:"I react, emotionally or impulsively",value:"emotional_decisions"},
     {label:"I try to work more to compensate",value:"work_more"},
     {label:"I ask others, but still feel uncertain about what to do",value:"ask_others"},
     {label:"I slow down and make a plan",value:"slow_plan"},
   ]},
  {id:"structural_weakness",
   bot:"Which part of your financial life currently feels the most out of control?",
   subtext:"Where your system is breaking is where we begin building.",
   options:[
     {label:"Debt",value:"debt"},
     {label:"Spending",value:"spending"},
     {label:"Saving",value:"saving"},
     {label:"Income consistency",value:"income_consistency"},
     {label:"Planning for the future",value:"planning_future"},
     {label:"Investing",value:"investing"},
     {label:"Honestly, I feel fairly organized",value:"fairly_organized"},
   ]},
  {id:"future_vision",
   bot:"What are you ultimately trying to build, financially?",
   subtext:"Naming your destination is the first real act of financial strategy.",
   options:[
     {label:"Stability I can count on",value:"stability"},
     {label:"Peace of mind",value:"peace_of_mind"},
     {label:"Freedom from debt",value:"freedom_from_debt"},
     {label:"More time and space in my life",value:"time_freedom"},
     {label:"Real ownership and lasting wealth",value:"ownership_wealth"},
     {label:"Security for the people I love",value:"security_family"},
     {label:"I haven't clearly defined it yet",value:"dont_know"},
   ]},
];

const BQ=[
  {id:"full_review",
   section:"Financial Visibility",
   bot:"When did you last look at all of your financial obligations and resources together, at the same time?",
   subtext:"Income, bills, debt, savings, subscriptions, investments. Everything in one honest picture.",
   options:[
     {label:"Never, that I can recall",value:"never"},
     {label:"More than a year ago",value:"over_12mo"},
     {label:"Within the last few months",value:"few_months"},
     {label:"Within the last 30 days",value:"last_30_days"},
     {label:"I review everything regularly",value:"consistent"},
   ]},
  {id:"income_expense_accuracy",
   section:"Financial Visibility",
   bot:"Right now, how accurately could you state your total monthly income and total monthly spending?",
   subtext:"This reveals the gap between what you think you know and what you actually know.",
   options:[
     {label:"Honestly, I wouldn't know where to start",value:"would_not_know"},
     {label:"I know my income, but not what I'm spending",value:"income_only"},
     {label:"I have a general sense, but nothing precise",value:"most_not_precise"},
     {label:"I know both fairly accurately",value:"fairly_accurate"},
     {label:"I track both consistently and precisely",value:"precise"},
   ]},
  {id:"least_control",
   section:"Financial Visibility",
   bot:"Which area of your financial life currently feels the least in your control?",
   subtext:"Where things feel out of control is where the system needs to be rebuilt first.",
   options:[
     {label:"Debt",value:"debt"},
     {label:"Spending",value:"spending"},
     {label:"Saving",value:"saving"},
     {label:"Income consistency",value:"income_consistency"},
     {label:"Investing",value:"investing"},
     {label:"Planning for the future",value:"planning"},
     {label:"Honestly, I feel generally organized",value:"organized"},
   ]},
  {id:"extra_money_pattern",
   section:"Pattern Recognition",
   bot:"The last time you had extra money available, what actually happened to it?",
   subtext:"This single question reveals more about your financial pattern than almost any other.",
   options:[
     {label:"It disappeared into everyday expenses",value:"disappeared"},
     {label:"I spent it on things I wanted or felt I'd earned",value:"spent_deserved"},
     {label:"An unexpected situation consumed it",value:"emergency"},
     {label:"I saved or invested part of it",value:"partially_saved"},
     {label:"I directed it intentionally toward a goal",value:"intentional"},
   ]},
  {id:"repeated_behavior",
   section:"Pattern Recognition",
   bot:"Which financial behavior has shown up most repeatedly throughout your life?",
   subtext:"Patterns repeat because they are structural, not a willpower problem.",
   options:[
     {label:"Starting strong, then losing momentum",value:"not_maintaining"},
     {label:"Spending emotionally or in the moment",value:"emotional_spending"},
     {label:"Avoiding financial decisions until pressure forces action",value:"avoidance"},
     {label:"Putting others first financially, at my own expense",value:"helping_others"},
     {label:"Restarting financially, again and again",value:"restarting"},
     {label:"Feeling stuck despite working hard",value:"stuck_working"},
     {label:"I've built fairly consistent financial habits",value:"consistent_habits"},
   ]},
  {id:"pressure_response",
   section:"Pattern Recognition",
   bot:"When financial pressure increases, what is your typical response?",
   subtext:"How you respond under pressure is your most important financial habit, even if you've never named it.",
   options:[
     {label:"I avoid it completely",value:"avoid"},
     {label:"I make fast, emotionally driven decisions",value:"fast_emotional"},
     {label:"I try to work more to compensate",value:"work_more"},
     {label:"I talk to others, but still feel uncertain",value:"talk_uncertain"},
     {label:"I step back and create a plan",value:"step_back_plan"},
     {label:"I stay structured and respond intentionally",value:"structured_response"},
   ]},
  {id:"emotional_stress",
   section:"Pattern Recognition",
   bot:"Which financial situation creates the most emotional weight for you?",
   subtext:"Where you feel the most stress is where your system feels the most fragile.",
   options:[
     {label:"Unexpected expenses I wasn't prepared for",value:"unexpected_expenses"},
     {label:"The weight of carrying debt",value:"debt_balances"},
     {label:"Not having savings to fall back on",value:"no_savings"},
     {label:"Feeling behind compared to where I thought I'd be",value:"feeling_behind"},
     {label:"Uncertainty about what the future holds",value:"future_uncertainty"},
     {label:"Not knowing what move to make next",value:"dont_know_move"},
     {label:"A deep fear of failing financially",value:"fear_failure"},
   ]},
  {id:"income_predictability",
   section:"System Architecture",
   bot:"How predictable is your income from one month to the next?",
   subtext:"Income stability shapes everything, your emergency fund, your debt strategy, your ability to automate.",
   options:[
     {label:"Extremely unpredictable",value:"extremely_unpredictable"},
     {label:"It varies, some months are fine, others aren't",value:"somewhat_inconsistent"},
     {label:"Mostly stable with occasional variation",value:"mostly_stable"},
     {label:"Very stable and reliable",value:"very_stable"},
     {label:"I have multiple stable income sources",value:"multiple_stable"},
   ]},
  {id:"consumer_debt",
   section:"System Architecture",
   bot:"How much consumer debt do you currently carry?",
   subtext:"Credit cards, personal loans, auto loans, not your mortgage.",
   options:[
     {label:"Under $5,000",value:"under_5k"},
     {label:"$5,000 to $25,000",value:"5k_25k"},
     {label:"$25,000 to $75,000",value:"25k_75k"},
     {label:"Over $75,000",value:"over_75k"},
     {label:"I'm currently debt free",value:"debt_free"},
   ]},
  {id:"income_runway",
   section:"System Architecture",
   bot:"If your income stopped today, how long could you maintain your current lifestyle?",
   subtext:"This is your financial runway, one of the most important numbers you can know about yourself.",
   options:[
     {label:"Less than 1 month",value:"under_1mo"},
     {label:"1 to 3 months",value:"1_3mo"},
     {label:"3 to 6 months",value:"3_6mo"},
     {label:"6 to 12 months",value:"6_12mo"},
     {label:"Over 12 months",value:"over_12mo"},
   ]},
  {id:"money_organization",
   section:"System Architecture",
   bot:"How is your money currently organized, structurally?",
   subtext:"Structure determines behavior more than intention does. This is where we look first.",
   options:[
     {label:"Everything runs through one account",value:"one_account"},
     {label:"Multiple accounts, but no real structure behind them",value:"multiple_no_structure"},
     {label:"A basic budgeting system",value:"basic_budget"},
     {label:"Accounts organized around specific purposes",value:"organized_accounts"},
     {label:"Automated and intentionally structured",value:"automated_structured"},
   ]},
  {id:"automation_level",
   section:"System Architecture",
   bot:"How much of your financial life currently runs automatically?",
   subtext:"Automation is what separates reacting to your finances from intentionally building with them.",
   options:[
     {label:"Almost nothing is automated",value:"almost_nothing"},
     {label:"A few bills, that's it",value:"few_bills"},
     {label:"Some savings or investing is automated",value:"some_savings"},
     {label:"Most major systems run automatically",value:"most_automated"},
     {label:"My finances are fully and intentionally systemized",value:"fully_systemized"},
   ]},
  {id:"most_pressure",
   section:"System Architecture",
   bot:"Which area creates the most consistent financial pressure in your life right now?",
   subtext:"This is where your system is under the most strain.",
   options:[
     {label:"Monthly bills",value:"monthly_bills"},
     {label:"Debt payments",value:"debt_payments"},
     {label:"Inconsistent income",value:"inconsistent_income"},
     {label:"Lack of savings",value:"lack_savings"},
     {label:"Taxes",value:"taxes"},
     {label:"Spending habits",value:"spending_habits"},
     {label:"Supporting others financially",value:"supporting_others"},
     {label:"Not knowing what to prioritize",value:"no_priority"},
   ]},
  {id:"actively_building",
   section:"Ownership & Positioning",
   bot:"Which of these are you actively and intentionally building right now?",
   subtext:"This separates surviving from building toward something real.",
   options:[
     {label:"Emergency savings",value:"emergency_savings"},
     {label:"Retirement accounts",value:"retirement"},
     {label:"Investment accounts",value:"investments"},
     {label:"A business",value:"business"},
     {label:"Real estate or property",value:"real_estate"},
     {label:"Passive income streams",value:"passive_income"},
     {label:"Nothing consistently, not yet",value:"none"},
   ]},
  {id:"financial_freedom_meaning",
   section:"Ownership & Positioning",
   bot:"What would financial freedom actually mean for your life?",
   subtext:"Most people have never taken the time to define this clearly. Your answer shapes everything that follows.",
   options:[
     {label:"Real peace of mind",value:"peace_mind"},
     {label:"Being completely free of debt",value:"debt_free"},
     {label:"More time and space for what matters",value:"time_freedom"},
     {label:"Knowing my family is protected",value:"family_security"},
     {label:"Ownership and building lasting wealth",value:"ownership_wealth"},
     {label:"The freedom to walk away from work I don't love",value:"leave_work"},
     {label:"Simply no longer surviving month to month",value:"stop_surviving"},
   ]},
  {id:"current_financial_life",
   section:"Ownership & Positioning",
   bot:"Which statement most honestly describes where you are financially right now?",
   subtext:"Honest positioning is the only foundation real strategy can be built on.",
   options:[
     {label:"I'm surviving month to month",value:"surviving"},
     {label:"I'm stable, but I'm not moving forward",value:"stable_not_progressing"},
     {label:"I'm making progress, but slowly",value:"slow_progress"},
     {label:"I'm building with intention",value:"building_intentionally"},
     {label:"I feel aligned, strategic, and on track",value:"aligned_strategic"},
   ]},
  {id:"five_year_feeling",
   section:"Future Trajectory",
   bot:"If nothing financially changed over the next five years, how would you honestly feel?",
   subtext:"This is your compass. Let yourself be honest.",
   options:[
     {label:"Scared",value:"scared"},
     {label:"Frustrated",value:"frustrated"},
     {label:"Disappointed",value:"disappointed"},
     {label:"Stuck",value:"stuck"},
     {label:"Mostly okay, but limited",value:"okay_limited"},
     {label:"Optimistic",value:"optimistic"},
     {label:"Confident",value:"confident"},
   ]},
  {id:"biggest_barrier",
   section:"Future Trajectory",
   bot:"What is the single biggest thing standing between you and the financial life you want?",
   subtext:"Your answer here becomes the foundation of your entire roadmap.",
   options:[
     {label:"I don't have a real financial structure",value:"no_structure"},
     {label:"My habits are inconsistent",value:"inconsistent_habits"},
     {label:"I don't have enough financial knowledge",value:"no_knowledge"},
     {label:"Debt is holding me back",value:"debt"},
     {label:"My income feels limited",value:"income_limits"},
     {label:"Fear, or feeling completely overwhelmed",value:"fear_overwhelm"},
     {label:"I don't have a clear long-term strategy",value:"no_strategy"},
     {label:"I've been trying to figure it all out alone",value:"doing_alone"},
   ]},
];

const OPT={display:"block",width:"100%",padding:"16px",marginBottom:"12px",backgroundColor:"#ffffff",color:"#1a1a2e",border:"1px solid #e8e3da",borderRadius:"8px",cursor:"pointer",fontSize:"15px",textAlign:"left",transition:"all 0.2s ease"};

const CreditNote=({dark=false})=>(
  <div style={{marginTop:"20px",padding:"16px",backgroundColor:dark?"rgba(201,151,58,0.12)":C.goldSoft,borderRadius:"6px",border:"1px solid rgba(201,151,58,0.3)"}}>
    <p style={{color:C.gold,fontSize:"14px",margin:"0 0 10px",lineHeight:"1.6",fontWeight:"bold"}}>Your Blueprint Investment Carries Forward</p>
    <p style={{color:dark?"#c8c8d8":"#555",fontSize:"14px",margin:0,lineHeight:"1.8"}}>
      If you decide to invest in the ETFM Financial Reset ($499), your $47 Blueprint investment is fully credited toward your total. That credit also unlocks an additional discount, bringing your final investment to $425. Your first step toward clarity never loses its value. It builds on it.
    </p>
  </div>
);

const Spinner=()=>(
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 0"}}>
    <div style={{
      width:"44px",height:"44px",borderRadius:"50%",
      border:`4px solid ${C.border}`,
      borderTopColor:C.gold,
      animation:"etfm-spin 0.9s linear infinite",
      marginBottom:"16px"
    }}/>
    <style>{`@keyframes etfm-spin{to{transform:rotate(360deg)}}`}</style>
    <p style={{color:C.muted,fontSize:"14px",margin:0}}>Building your Snapshot. Just a moment...</p>
  </div>
);

const DotCred=({label,sub})=>(
  <div style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"10px 0",borderBottom:`0.5px solid ${C.border}`}}>
    <span style={{width:"5px",height:"5px",borderRadius:"50%",background:C.gold,flexShrink:0,marginTop:"7px",opacity:0.7}}/>
    <div>
      <p style={{margin:0,fontSize:"14px",fontWeight:"500",color:C.text,lineHeight:"1.4"}}>{label}</p>
      {sub&&<p style={{margin:"2px 0 0",fontSize:"12px",color:C.muted,fontWeight:"300"}}>{sub}</p>}
    </div>
  </div>
);

export default function ETFMAssessment(){
  const p=new URLSearchParams(window.location.search);
  const hasSid=p.get("session");
  const showBlueprint=p.get("showBlueprint")==="true";
  const showSession=p.get("showSession")==="true";
  const showReset=p.get("showReset")==="true";
  const sessionPaid=p.get("sessionPaid")==="true";
  const resetPaid=p.get("resetPaid")==="true";
  const hasBlueprint=p.get("hasBlueprint")==="true";

  const initScreen=()=>{
    if(hasSid&&p.get("cancelled")==="true") return "blueprint_cancelled";
    if(hasSid) return "loading";
    if(sessionPaid) return "session_confirmed";
    if(resetPaid) return "reset_confirmed";
    if(showBlueprint) return "blueprint_offer";
    if(showSession) return "session_offer";
    if(showReset) return "reset_offer";
    return "intro";
  };

  const[screen,setScreen]=useState(initScreen());
  const[freeIdx,setFreeIdx]=useState(0);
  const[freeAns,setFreeAns]=useState([]);
  const[bpIdx,setBpIdx]=useState(0);
  const[bpAns,setBpAns]=useState([]);
  const[firstName,setFirstName]=useState(p.get("firstName")?decodeURIComponent(p.get("firstName")):"");
  const[email,setEmail]=useState(p.get("email")?decodeURIComponent(p.get("email")):"");
  const[loading,setLoading]=useState(false);
  const[score,setScore]=useState(null);
  const[sid,setSid]=useState(null);
  const[blueprintClient,setBlueprintClient]=useState(hasBlueprint);

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[screen,freeIdx,bpIdx]);

  useEffect(()=>{
    if(!loading) return;
    const t=setTimeout(()=>setLoading(false),3000);
    return()=>clearTimeout(t);
  },[loading]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const s=params.get("session");
    const cancelled=params.get("cancelled");
    if(s&&!params.get("sessionPaid")){
      setSid(s);
      if(cancelled==="true"){setScreen("blueprint_cancelled");}
      else{checkBlueprintSession(s);}
    }
  },[]);

  const checkBlueprintSession=async(s)=>{
    try{
      const res=await fetch(`/api/blueprint-session?session_id=${s}`);
      const data=await res.json();
      if(data.status==="paid"){
        setFirstName(data.first_name||"");
        setEmail(data.email||"");
        setBlueprintClient(true);
        setScreen("blueprint_chat");
      }else{setScreen("blueprint_unpaid");}
    }catch(e){setScreen("blueprint_unpaid");}
  };

  const selectFree=(val)=>{
    const a=[...freeAns,val];
    setFreeAns(a);
    if(freeIdx<FQ.length-1){setFreeIdx(freeIdx+1);}
    else{setScore(calcScore(a));setScreen("transition");}
  };

  const submitFree=async(e)=>{
    e.preventDefault();
    if(!firstName.trim()||!email.trim()) return alert("Please fill in both fields");
    setLoading(true);
    const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")),3000));
    try{
      await Promise.race([
        fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"subscribe",firstName,email,answers:freeAns.map((v,i)=>({question:FQ[i].bot,answer:v}))})}),
        timeout,
      ]);
      setScreen("snapshot_confirmed");
    }catch(e){
      setScreen("snapshot_confirmed");
    }finally{setLoading(false);}
  };

  const payBlueprint=async()=>{
    if(!email.trim()) return alert("Please enter your email");
    setLoading(true);
    try{
      const res=await fetch("/api/blueprint-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"create",email,firstName,freeAnswers:{}})});
      const data=await res.json();
      if(data.checkoutUrl) window.location.href=data.checkoutUrl;
    }catch(e){alert("Something went wrong. Please try again.");}
    finally{setLoading(false);}
  };

  const paySession=async()=>{
    if(!email.trim()) return alert("Please enter your email");
    setLoading(true);
    try{
      const res=await fetch("/api/session-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,firstName,hasBlueprint:blueprintClient})});
      const data=await res.json();
      if(data.checkoutUrl) window.location.href=data.checkoutUrl;
    }catch(e){alert("Something went wrong. Please try again.");}
    finally{setLoading(false);}
  };

  const selectBp=(val)=>{
    const a=[...bpAns,val];
    setBpAns(a);
    if(bpIdx<BQ.length-1){setBpIdx(bpIdx+1);}
    else{setScreen("blueprint_complete");submitBpReport(a);}
  };

  const submitBpReport=async(answers)=>{
    try{
      await fetch("/api/blueprint-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"complete",sessionId:sid,blueprintAnswers:answers.map((v,i)=>({question:BQ[i].bot,answer:v}))})});
    }catch(e){console.error(e);}
  };

  const Wrap=({children,max="560px"})=>(
    <div style={{minHeight:"100vh",backgroundColor:C.bg,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 20px"}}>
      <div style={{maxWidth:max,width:"100%",textAlign:"center"}}>{children}</div>
    </div>
  );
  const Tag=({t})=><p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"16px"}}>{t}</p>;
  const Hr=()=><div style={{borderTop:`1px solid ${C.border}`,margin:"32px 0"}}/>;
  const BtnPrimary=({onClick,disabled,children})=>(
    <button onClick={onClick} disabled={disabled} style={{display:"block",width:"100%",padding:"16px",backgroundColor:disabled?C.muted:C.gold,color:C.dark,border:"none",borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:disabled?"not-allowed":"pointer",marginBottom:"12px"}}>
      {children}
    </button>
  );

  if(screen==="loading") return <Wrap><p style={{color:C.muted,fontFamily:"Georgia, serif"}}>One moment. Retrieving your session...</p></Wrap>;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if(screen==="intro") return(
    <Wrap max="600px">
      <div style={{width:"110px",height:"110px",borderRadius:"50%",backgroundColor:C.dark,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 30px",boxShadow:"0 4px 24px rgba(0,0,0,0.18)"}}>
        <img src={LOGO_URL} alt="ETFM" style={{width:"86px",height:"86px",objectFit:"contain"}} onError={e=>e.target.style.display="none"}/>
      </div>
      <Tag t="Escape The Financial Matrix"/>
      <h1 style={{fontSize:"42px",fontFamily:"Georgia, serif",marginBottom:"20px",color:C.text,lineHeight:"1.2"}}>Most people don't have a money problem. They have a pattern problem.</h1>
      <p style={{fontSize:"17px",color:C.muted,marginBottom:"16px",lineHeight:"1.8"}}>The same cycles repeat. The same pressure returns. The same intentions don't stick, not because of effort or character, but because nobody has ever helped you see the underlying pattern driving your financial decisions.</p>
      <p style={{fontSize:"17px",color:C.muted,marginBottom:"40px",lineHeight:"1.8"}}>The ETFM Snapshot is a 5-question financial awareness assessment. It identifies your Financial Archetype, calculates your personal Awareness Score, and delivers a targeted strategic insight straight to your inbox. It takes about two minutes. It is completely free.</p>

      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"32px",marginBottom:"36px",textAlign:"left"}}>
        <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"3px",color:C.gold,marginBottom:"20px",textAlign:"center"}}>Who Built This</p>
        <p style={{fontSize:"16px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.8",marginBottom:"20px",fontStyle:"italic"}}>
          "I've spent 12 years watching people do everything right and still feel lost when it comes to money. They work hard. They try to save. They search for answers at midnight. But nobody ever sat down with them, looked at their actual situation, and helped them build something real. That's why I created this."
        </p>
        <p style={{fontSize:"14px",color:C.muted,marginBottom:"24px",fontWeight:"bold",textAlign:"right"}}>Robert Brickey, Creator of ETFM</p>
        <div style={{borderTop:`0.5px solid ${C.border}`,paddingTop:"20px"}}>
          <DotCred label="Duke University Graduate" sub="Former Basketball Team Captain"/>
          <DotCred label="Financial Strategist" sub="12 years of client strategic guidance"/>
          <DotCred label="Radio Host" sub="WIDU 1600 AM, Fayetteville NC"/>
          <DotCred label="Speaker & Educator" sub="Financial literacy across the Carolinas"/>
          <DotCred label="Creator of ETFM" sub="A financial operating system built for real life"/>
        </div>
      </div>

      <button onClick={()=>setScreen("snapshot_intro")} style={{backgroundColor:C.gold,color:C.dark,border:"none",padding:"16px 44px",fontSize:"16px",fontWeight:"bold",borderRadius:"8px",cursor:"pointer"}}>Start Your Snapshot</button>
      <p style={{fontSize:"12px",color:C.muted,marginTop:"16px"}}>Five questions. Two minutes. Free, no strings attached.</p>
    </Wrap>
  );

  // SNAPSHOT INTRO
  if(screen==="snapshot_intro") return(
    <Wrap max="600px">
      <Tag t="Escape The Financial Matrix"/>
      <h1 style={{fontSize:"34px",fontFamily:"Georgia, serif",marginBottom:"16px",color:C.text,lineHeight:"1.3"}}>Your Financial Clarity Snapshot</h1>
      <p style={{fontSize:"16px",color:C.text,marginBottom:"20px",lineHeight:"1.7",fontWeight:"500"}}>Before we begin, here is what this is and why it matters.</p>
      <p style={{fontSize:"16px",color:C.muted,marginBottom:"40px",lineHeight:"1.8"}}>This is a 5-question snapshot designed to identify your current financial patterns and awareness level. It takes about 2 minutes. There are no right or wrong answers. At the end you will receive your Financial Archetype, a portion of your Awareness Score, and a personalized insight. Your full score and complete breakdown will arrive in your email shortly after.</p>
      <button onClick={()=>setScreen("chat")} style={{backgroundColor:C.gold,color:C.dark,border:"none",padding:"16px 44px",fontSize:"16px",fontWeight:"bold",borderRadius:"8px",cursor:"pointer"}}>Begin My Snapshot</button>
    </Wrap>
  );

  // FREE CHAT
  if(screen==="chat"){
    const q=FQ[freeIdx];
    const prog=((freeIdx+1)/FQ.length)*100;
    return(
      <div style={{minHeight:"100vh",backgroundColor:C.bg,padding:"40px 20px"}}>
        <div style={{maxWidth:"680px",margin:"0 auto"}}>
          {freeIdx===0&&(
            <div style={{marginBottom:"28px",padding:"22px 24px",backgroundColor:C.white,borderRadius:"10px",border:`1px solid ${C.border}`,textAlign:"left"}}>
              <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",margin:"0 0 10px"}}>What This Experience Is</p>
              <p style={{color:C.text,fontSize:"13px",lineHeight:"1.8",margin:"0 0 20px",fontWeight:300}}>This is not a budgeting quiz. This is a guided financial awareness experience designed to help you see where your current system is helping you and where it may be quietly working against you. Most people are not financially stuck because they are lazy. They are stuck because they are operating without clarity, structure, and visibility. These 5 questions are designed to help you pause long enough to see your patterns clearly. No judgment. No shame. Just awareness.</p>
              <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",margin:"0 0 10px"}}>What You'll Receive</p>
              <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"16px"}}>
                <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                  <span style={{color:C.gold,fontWeight:"bold",flexShrink:0}}>—</span>
                  <p style={{color:C.text,fontSize:"13px",lineHeight:"1.7",margin:0}}><strong>Your Financial Archetype:</strong> A snapshot of how you currently operate financially and the patterns influencing your decisions.</p>
                </div>
                <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                  <span style={{color:C.gold,fontWeight:"bold",flexShrink:0}}>—</span>
                  <p style={{color:C.text,fontSize:"13px",lineHeight:"1.7",margin:0}}><strong>Your Awareness Score (0–100):</strong> A measurement of how much visibility, structure, and financial awareness currently exists in your system.</p>
                </div>
                <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                  <span style={{color:C.gold,fontWeight:"bold",flexShrink:0}}>—</span>
                  <p style={{color:C.text,fontSize:"13px",lineHeight:"1.7",margin:0}}><strong>Personalized Strategic Insight:</strong> A guided explanation of what may be creating financial pressure, disorganization, or inconsistency and where your reset should begin.</p>
                </div>
              </div>
              <p style={{color:C.muted,fontSize:"12px",lineHeight:"1.7",margin:"0 0 14px"}}>Everything will be delivered directly to your inbox, completely free.</p>
              <p style={{color:C.gold,fontSize:"13px",fontFamily:"Georgia, serif",fontStyle:"italic",margin:0,lineHeight:"1.7",borderTop:`1px solid ${C.border}`,paddingTop:"14px"}}>"The goal here is not perfection. The goal is clarity. Because clarity is where real change begins."</p>
            </div>
          )}
          <div style={{marginBottom:"8px",display:"flex",justifyContent:"space-between"}}>
            <p style={{fontSize:"11px",color:C.muted,textTransform:"uppercase",letterSpacing:"1px",margin:0}}>ETFM Snapshot</p>
            <p style={{fontSize:"11px",color:C.muted,margin:0}}>{freeIdx+1} of {FQ.length}</p>
          </div>
          <div style={{marginBottom:"36px",backgroundColor:C.border,height:"3px",borderRadius:"2px",overflow:"hidden"}}>
            <div style={{backgroundColor:C.gold,height:"100%",width:`${prog}%`,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{marginBottom:"32px",padding:"24px",backgroundColor:C.white,borderRadius:"10px",border:`1px solid ${C.border}`}}>
            <p style={{color:C.muted,fontSize:"13px",margin:"0 0 10px"}}>{q.subtext}</p>
            <h2 style={{fontSize:"22px",fontFamily:"Georgia, serif",color:C.text,margin:0,lineHeight:"1.4"}}>{q.bot}</h2>
          </div>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>selectFree(opt.value)} style={OPT}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor=C.goldSoft;e.currentTarget.style.borderColor=C.gold;}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor=C.white;e.currentTarget.style.borderColor=C.border;}}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // TRANSITION
  if(screen==="transition"){
    const SCORE_CATEGORIES=["Awareness","Money Pattern","Stress Response","Financial Structure","Your Vision"];
    const breakdown=freeAns.map((val,i)=>{
      const opt=FQ[i].options.find(o=>o.value===val);
      return{category:SCORE_CATEGORIES[i],answer:opt?opt.label:val,score:SCORE_MAP[val]||40};
    });
    return(
    <div style={{minHeight:"100vh",backgroundColor:C.bg,padding:"40px 20px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
      <div style={{maxWidth:"580px",width:"100%",textAlign:"center"}}>
        <Tag t="Snapshot Complete"/>
        <h2 style={{fontSize:"32px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>Your pattern has been identified.</h2>
        <p style={{fontSize:"16px",color:C.muted,marginBottom:"40px",lineHeight:"1.7"}}>What you've uncovered isn't a reflection of your potential, it's a reflection of the patterns currently shaping your financial decisions. Seeing them clearly is always where real movement begins.</p>
        <p style={{fontSize:"14px",color:C.muted,lineHeight:"1.8",marginBottom:"16px"}}>Your Awareness Score is built from multiple behavioral and structural indicators across your responses, including visibility, consistency, organization, and financial decision-making patterns. What you see here is only a partial snapshot. Your complete score breakdown, Financial Archetype, and personalized strategic insights will be delivered to your inbox with guided next steps designed to help you move forward with greater clarity and structure.</p>
        <div style={{backgroundColor:C.dark,borderRadius:"12px",padding:"36px 30px",marginBottom:"30px",textAlign:"left"}}>
          <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"20px",textAlign:"center"}}>Your ETFM Awareness Score</p>
          <p style={{color:"#6a6a7a",fontSize:"13px",marginBottom:"16px",textAlign:"center",lineHeight:"1.7",fontStyle:"italic"}}>Your Awareness Score is made up of five components: Financial Visibility, Money Patterns, Behavioral Awareness, Stress Response, and System Readiness. Each is scored individually. Your total score reflects where you are right now, not where you are going.</p>
          {breakdown.map((item,i)=>(
            <div key={i} style={{marginBottom:"8px",padding:"10px 14px",backgroundColor:"rgba(255,255,255,0.04)",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px"}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{color:"#7a7a8a",fontSize:"10px",textTransform:"uppercase",letterSpacing:"1px",margin:"0 0 3px"}}>{item.category}</p>
                <p style={{color:"#c8c8d8",fontSize:"13px",margin:0,lineHeight:"1.4",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.answer}</p>
              </div>
              {i===0&&<span style={{color:C.gold,fontSize:"17px",fontWeight:"bold",flexShrink:0}}>{item.score}</span>}
            </div>
          ))}
          <div style={{marginTop:"16px",padding:"10px 0 0",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
            {["Structure","Momentum","Ownership Positioning","System Strength"].map(cat=>(
              <div key={cat} style={{marginBottom:"6px",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px",backgroundColor:"rgba(255,255,255,0.02)",borderRadius:"6px"}}>
                <span style={{color:"#4a4a5a",fontSize:"13px"}}>{cat}</span>
                <span style={{color:"#3a3a4a",fontSize:"12px",fontStyle:"italic"}}>Unlocked in your Blueprint</span>
              </div>
            ))}
          </div>
          <p style={{color:"#5a5a6a",fontSize:"12px",textAlign:"center",marginTop:"16px",marginBottom:0,lineHeight:"1.6"}}>Your full Strategic Score and personalized Snapshot will be delivered to your inbox.</p>
        </div>

        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"28px",marginBottom:"30px",textAlign:"left"}}>
          <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",color:C.gold,marginBottom:"16px"}}>A Note From Robert, ETFM Founder</p>
          <p style={{fontSize:"15px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.8",marginBottom:"16px",fontStyle:"italic"}}>
            "Most people never take the time to look honestly at their financial patterns. You just did. That matters more than you know. Where you are right now is not where you have to stay. Awareness is always where real movement begins."
          </p>
          <div style={{marginTop:"20px",padding:"16px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 6px",fontSize:"13px",color:C.muted,fontStyle:"italic"}}>"I left that conversation knowing exactly what to do for the first time."</p>
            <p style={{margin:0,fontSize:"12px",color:C.gold}}>Strategic Reset Client</p>
            <p style={{margin:"4px 0 0",fontSize:"11px",color:C.muted,fontStyle:"italic"}}>Name protected for privacy.</p>
          </div>
          <div style={{marginTop:"12px",padding:"16px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 6px",fontSize:"13px",color:C.muted,fontStyle:"italic"}}>"Most advisors talk at you. Robert actually looked at my situation."</p>
            <p style={{margin:0,fontSize:"12px",color:C.gold}}>ETFM Client</p>
            <p style={{margin:"4px 0 0",fontSize:"11px",color:C.muted,fontStyle:"italic"}}>Name protected for privacy.</p>
          </div>
        </div>

        <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"36px 30px"}}>
          <h3 style={{fontSize:"18px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"8px"}}>Send me my Snapshot and Awareness Score</h3>
          <p style={{fontSize:"14px",color:C.muted,marginBottom:"24px"}}>Enter your details and we'll send your Financial Archetype, Awareness Score, and personalized insight right away.</p>
          {loading ? <Spinner/> : (
            <form onSubmit={submitFree}>
              <div style={{marginBottom:"16px",textAlign:"left"}}>
                <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>First Name</label>
                <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Your first name" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:"20px",textAlign:"left"}}>
                <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
              </div>
              <button type="submit" style={{width:"100%",padding:"14px",backgroundColor:C.gold,color:C.dark,border:"none",borderRadius:"6px",fontSize:"16px",fontWeight:"bold",cursor:"pointer"}}>
                Send My Snapshot
              </button>
            </form>
          )}
          <p style={{fontSize:"11px",color:C.muted,marginTop:"16px",textAlign:"center"}}>Your information is never sold or shared.</p>
        </div>
      </div>
    </div>
  );};

  // SNAPSHOT CONFIRMED
  if(screen==="snapshot_confirmed") return(
    <Wrap>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>&#10003;</div>
      <Tag t="Snapshot Delivered"/>
      <h2 style={{fontSize:"36px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"20px",lineHeight:"1.3"}}>
        Your Snapshot is on its way.
      </h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"24px"}}>
        Your Snapshot is on its way. Check your inbox in the next few minutes. If you do not see it, check your spam folder.
      </p>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"16px"}}>
        You just did something most people never do, you took an honest look at your own financial patterns. That kind of awareness is the foundation of everything that changes next.
      </p>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"40px"}}>
        Your Financial Archetype, Awareness Score, and personalized strategic insight are on their way to your inbox now. Check your spam folder if you don't see it within a few minutes.
      </p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"24px",textAlign:"left"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"16px"}}>What to do next</p>
        {[
          "Open your Snapshot email",
          "Read your Financial Archetype and Awareness Score",
          "Review your personalized strategic insight",
          "Follow the next steps outlined inside the email",
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 0",color:"#c8c8d8",fontSize:"14px",lineHeight:"1.6",borderBottom:i<3?"1px solid rgba(255,255,255,0.06)":"none"}}>{i+1}.&nbsp;&nbsp;{item}</div>
        ))}
      </div>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // BLUEPRINT OFFER
  if(screen==="blueprint_offer") return(
    <Wrap>
      <Tag t="ETFM Strategic Blueprint"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>Now that you can see the pattern, it's time to understand it fully.</h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.8",marginBottom:"16px"}}>Most people spend years reacting financially without ever identifying the underlying patterns driving their decisions. They try harder, restart plans, and still find themselves in the same place.</p>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.8",marginBottom:"32px"}}>The ETFM Blueprint is an 18-question diagnostic designed to surface the habits, blind spots, behavioral patterns, and system gaps shaping your financial life. Not to give you generic advice. To help you finally understand why the same cycles keep repeating, and what to do differently.</p>

      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"20px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"20px"}}>What Changes After Your Blueprint</p>
        {[
          {title:"You understand your financial archetype and operating pattern",body:"Not a label. A clear picture of how your financial decisions are actually being made and why certain cycles keep repeating."},
          {title:"You see where your system is breaking",body:"A personalized breakdown of where your financial structure is strong, where it is fragile, and where the hidden gaps are creating the most pressure."},
          {title:"You have a real framework to work from",body:"The ETFM Financial Operating System gives you a structure to organize your financial life around clarity, priorities, and intentional decisions rather than reaction."},
          {title:"You have a 30-day starting point",body:"A guided 30-Day Strategic Reset Protocol so you can begin applying what you've learned immediately and start building momentum."},
          {title:"You know what to focus on first",body:"Immediate priority action steps so the path forward is clear, not overwhelming."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            <p style={{margin:"0 0 4px",color:C.white,fontSize:"14px",fontWeight:"bold"}}>{item.title}</p>
            <p style={{margin:"0 0 0 0",color:"#a0a0b0",fontSize:"13px",lineHeight:"1.6"}}>{item.body}</p>
          </div>
        ))}
        <div style={{marginTop:"20px",padding:"16px",backgroundColor:"rgba(201,151,58,0.08)",borderRadius:"6px",border:"1px solid rgba(201,151,58,0.2)"}}>
          <p style={{color:"#c8c8d8",fontSize:"14px",margin:0,lineHeight:"1.8",fontStyle:"italic"}}>Structured financial clarity and organization services can often cost thousands of dollars or require large investment minimums. The Blueprint is designed to give you diagnostic clarity and a structured starting framework at a fraction of that investment.</p>
        </div>
        <CreditNote dark={true}/>
      </div>

      <p style={{fontSize:"14px",color:C.muted,marginBottom:"20px",lineHeight:"1.7"}}>After payment, you'll answer 18 diagnostic questions. Robert's team generates your personalized Blueprint and delivers it to your inbox, typically within minutes.</p>
      {!email&&(
        <div style={{marginBottom:"20px",textAlign:"left"}}>
          <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>Confirm your email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
        </div>
      )}
      <div style={{backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px 24px",marginBottom:"20px",textAlign:"left"}}>
        <p style={{color:C.dark,fontSize:"12px",fontWeight:"bold",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>Before You Continue</p>
        <p style={{color:C.muted,fontSize:"13px",lineHeight:"1.8",margin:"0 0 10px"}}>The ETFM Strategic Blueprint is designed for educational and awareness purposes only. The content, scores, and recommendations generated are not individualized financial guidance and do not constitute a professional strategic guidance relationship. For guidance specific to your financial situation, please consult a licensed financial professional.</p>
        <p style={{color:C.muted,fontSize:"13px",lineHeight:"1.8",margin:0}}>All sales are final. Due to the personalized and immediately delivered nature of the Blueprint, refunds are not available once your diagnostic has been processed. By completing payment you acknowledge you have read and agree to these terms.</p>
      </div>
      <BtnPrimary onClick={payBlueprint} disabled={loading}>{loading?"One moment, setting up your Blueprint...":"Unlock Your Blueprint: $47"}</BtnPrimary>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // BLUEPRINT CHAT
  if(screen==="blueprint_chat"){
    const q=BQ[bpIdx];
    const prog=((bpIdx+1)/BQ.length)*100;
    return(
      <div style={{minHeight:"100vh",backgroundColor:C.bg,padding:"40px 20px"}}>
        <div style={{maxWidth:"680px",margin:"0 auto"}}>
          <div style={{marginBottom:"8px",display:"flex",justifyContent:"space-between"}}>
            <p style={{fontSize:"11px",color:C.gold,textTransform:"uppercase",letterSpacing:"1px",margin:0}}>Strategic Blueprint: {q.section}</p>
            <p style={{fontSize:"11px",color:C.muted,margin:0}}>{bpIdx+1} of {BQ.length}</p>
          </div>
          <div style={{marginBottom:"36px",backgroundColor:C.border,height:"3px",borderRadius:"2px",overflow:"hidden"}}>
            <div style={{backgroundColor:C.gold,height:"100%",width:`${prog}%`,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{marginBottom:"32px",padding:"24px",backgroundColor:C.white,borderRadius:"10px",border:`1px solid ${C.border}`}}>
            <p style={{color:C.muted,fontSize:"13px",margin:"0 0 10px"}}>{q.subtext}</p>
            <h2 style={{fontSize:"22px",fontFamily:"Georgia, serif",color:C.text,margin:0,lineHeight:"1.4"}}>{q.bot}</h2>
          </div>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>selectBp(opt.value)} style={OPT}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor=C.goldSoft;e.currentTarget.style.borderColor=C.gold;}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor=C.white;e.currentTarget.style.borderColor=C.border;}}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // BLUEPRINT COMPLETE
  if(screen==="blueprint_complete") return(
    <Wrap max="620px">
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <img src={LOGO_URL} alt="ETFM" style={{width:"64px",display:"block",margin:"0 auto 16px"}}/>
        <Tag t="Blueprint Complete"/>
      </div>
      <div style={{backgroundColor:C.white,borderRadius:"12px",border:`1px solid ${C.border}`,overflow:"hidden",textAlign:"left"}}>
        <div style={{backgroundColor:C.dark,padding:"32px 40px",textAlign:"center"}}>
          <h1 style={{margin:0,color:C.white,fontSize:"26px",fontFamily:"Georgia, serif",fontWeight:"normal",lineHeight:"1.4"}}>Your Strategic Blueprint<br/>has been prepared.</h1>
        </div>
        <div style={{padding:"40px"}}>
          <p style={{color:C.text,fontSize:"16px",lineHeight:"1.8",marginBottom:"16px"}}>What you did today took honesty, and that matters.</p>
          <p style={{color:C.muted,fontSize:"15px",lineHeight:"1.9",marginBottom:"32px"}}>Most people avoid looking closely at their financial patterns. You didn't. Your personalized Blueprint, strategic roadmap, and 30-Day Reset Protocol will be in your inbox shortly, typically within a few minutes. Check your spam folder if you don't see it right away.</p>
          <div style={{backgroundColor:C.bg,borderRadius:"8px",padding:"20px 24px",marginBottom:"32px",borderLeft:`3px solid ${C.gold}`}}>
            <p style={{margin:"0 0 10px",color:C.gold,fontSize:"14px",fontWeight:"bold",lineHeight:"1.6"}}>Your Blueprint Investment Carries Forward</p>
            <p style={{margin:0,color:C.muted,fontSize:"14px",lineHeight:"1.8"}}>If you decide to invest in the ETFM Financial Reset ($499), your $47 Blueprint investment is fully credited toward your total. That credit also unlocks an additional discount, bringing your final investment to $425. Your first step toward clarity never loses its value. It builds on it.</p>
          </div>
          <div style={{textAlign:"center",padding:"24px 0",borderTop:`1px solid ${C.border}`}}>
            <p style={{margin:0,color:C.text,fontSize:"16px",lineHeight:"2.4",fontFamily:"Georgia, serif",fontStyle:"italic"}}>Clarity creates control.<br/>Control creates momentum.<br/>Momentum creates freedom.</p>
          </div>
        </div>
        <div style={{backgroundColor:C.bg,padding:"20px 40px",textAlign:"center",borderTop:`1px solid ${C.border}`}}>
          <p style={{margin:0,color:C.muted,fontSize:"13px"}}>Questions? <a href="mailto:exit@etfm.systems" style={{color:C.gold,textDecoration:"none"}}>exit@etfm.systems</a></p>
        </div>
      </div>
    </Wrap>
  );

  // SESSION OFFER
  if(screen==="session_offer") return(
    <Wrap>
      <Tag t="ETFM Financial Reset"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>You've been figuring this out alone long enough.</h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.8",marginBottom:"16px"}}>Most people have never had someone actually sit down with their real numbers, not to judge, not to sell them something, but to look honestly at where they are, understand what's creating the pressure, and build a plan that fits their actual life.</p>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.8",marginBottom:"24px"}}>Structured financial clarity and organization can easily cost several thousand dollars, and often requires large investment minimums just to get started. The ETFM Financial Reset is designed to deliver the same personalized strategic clarity at a fraction of that.</p>

      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"28px",marginBottom:"24px",textAlign:"left"}}>
        <p style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",color:C.gold,marginBottom:"16px"}}>A Personal Note From Robert</p>
        <p style={{fontSize:"15px",color:C.text,fontFamily:"Georgia, serif",lineHeight:"1.8",marginBottom:"20px",fontStyle:"italic"}}>
          "You've already done the hard part. You stopped, looked honestly at your situation, and decided to take it seriously. That's not nothing. Most people never get there. What I want for you is simple: a plan that is real, clear, and built around your actual life. Not a template. Not generic guidance. Something you can actually follow. That's what this session is built to give you."
        </p>
        <div style={{marginBottom:"20px"}}>
          <DotCred label="Financial Strategist" sub="12 years of client strategic guidance"/>
          <DotCred label="Creator of ETFM" sub="A financial operating system built for real life"/>
        </div>
        <div style={{padding:"20px",backgroundColor:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`}}>
          <p style={{margin:"0 0 8px",fontSize:"15px",color:C.text,fontFamily:"Georgia, serif",fontStyle:"italic",lineHeight:"1.7"}}>"The moment you take charge of your financial life, everything else becomes possible. You don't need to be perfect. You just need a clear direction and the right structure to move in it."</p>
          <p style={{margin:0,fontSize:"12px",color:C.gold,textTransform:"uppercase",letterSpacing:"1px"}}>Robert Brickey, Financial Strategist</p>
        </div>
      </div>

      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"20px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"16px"}}>{blueprintClient?"What You Get: $425 (Blueprint client rate)":"What You Get: $499"}</p>
        {[
          {title:"Your financial situation is fully reviewed before the first call",body:"You complete a short intake form in advance. Robert reviews your actual numbers, obligations, and goals before you speak so nothing is wasted and nothing is generic."},
          {title:"Two private 1-on-1 strategy sessions with Robert",body:"No group calls. No assistants. A focused pre-session call to build your plan and a post-session call to review it together, answer questions, and confirm your direction."},
          {title:"A personalized financial action plan built around your real life",body:"Not a template. A plan built specifically around your income, obligations, goals, and lifestyle. Something you can actually follow."},
          {title:"Clear financial structure recommendations",body:"Guidance on how to organize your accounts, allocate your income, and build a system that reduces decision fatigue and makes consistent progress possible."},
          {title:"Strategic next-step planning so you leave with clarity",body:"You end each session knowing exactly what to focus on next and in what order. No more guessing. No more starting over. A clear path forward."},
          {title:"Detailed session notes delivered after both calls",body:"Comprehensive written notes sent directly to you after each session so you can revisit the plan, stay on track, and keep moving."},
          {title:"90-day priority follow-up support",body:"Questions come up after the calls. Robert's team is available for 90 days to make sure momentum continues and you don't get stuck."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <p style={{margin:"0 0 4px",color:C.text,fontSize:"14px",fontWeight:"bold"}}>{item.title}</p>
            <p style={{margin:"0",color:C.muted,fontSize:"13px",lineHeight:"1.6"}}>{item.body}</p>
          </div>
        ))}
        <CreditNote dark={false}/>
      </div>

      <div style={{backgroundColor:C.bg,borderRadius:"8px",padding:"20px 24px",marginBottom:"24px",textAlign:"left",border:`1px solid ${C.border}`}}>
        <p style={{color:C.dark,fontSize:"14px",fontWeight:"bold",marginBottom:"12px"}}>How it works</p>
        {[
          "Book your pre-session call and choose a time that works for you",
          "Complete your secure payment to confirm your spot",
          "You will receive a short intake form within 24 hours. Complete it so Robert arrives fully prepared",
          "Your first 30-minute call with Robert. He has already reviewed your situation",
          "Receive your personalized plan, financial score, and 90-day roadmap",
          "Your second 30-minute call. Review your plan together and confirm your next move",
        ].map((step,i)=>(
          <div key={i} style={{padding:"8px 0",color:C.muted,fontSize:"14px",lineHeight:"1.6",borderBottom:i<5?`1px solid ${C.border}`:"none"}}>{i+1}.&nbsp;&nbsp;{step}</div>
        ))}
      </div>

      {!email&&(
        <div style={{marginBottom:"20px",textAlign:"left"}}>
          <label style={{display:"block",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",color:C.muted}}>Your email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",padding:"12px",backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",fontSize:"15px",boxSizing:"border-box"}}/>
        </div>
      )}
      <div style={{backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px 24px",marginBottom:"20px",textAlign:"left"}}>
        <p style={{color:C.dark,fontSize:"12px",fontWeight:"bold",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>Before You Book</p>
        <p style={{color:C.muted,fontSize:"13px",lineHeight:"1.8",margin:"0 0 10px"}}>The ETFM Financial Reset is designed for educational and organizational awareness purposes only. The content, plans, and recommendations provided during your sessions are not individualized financial guidance and do not constitute a formal strategic guidance relationship. For guidance specific to your situation, please consult a licensed financial professional.</p>
        <p style={{color:C.muted,fontSize:"13px",lineHeight:"1.8",margin:"0 0 10px"}}><strong style={{color:C.text}}>Cancellation and Rescheduling:</strong> Sessions may be rescheduled up to 48 hours before your scheduled call at no charge. Cancellations made less than 48 hours before your call are non-refundable. No-shows are non-refundable. If Robert needs to reschedule, you will be offered a full rescheduling option or a complete refund.</p>
        <p style={{color:C.muted,fontSize:"13px",lineHeight:"1.8",margin:0}}><strong style={{color:C.text}}>Refund Policy:</strong> Due to the personalized, preparation-intensive nature of this program, refunds are not available once your intake form has been reviewed and your first session has been completed. Refund requests submitted before intake review will be considered on a case-by-case basis. By completing payment you acknowledge you have read and agree to these terms.</p>
      </div>
      <a href={`${CALENDLY}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(firstName)}`} target="_blank" rel="noopener noreferrer"
        style={{display:"block",width:"100%",padding:"16px",backgroundColor:C.gold,color:C.dark,borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:"pointer",textDecoration:"none",marginBottom:"12px",boxSizing:"border-box",textAlign:"center"}}>
        Book Your Pre-Session Call
      </a>
      <p style={{fontSize:"13px",color:C.muted,textAlign:"center",marginBottom:"24px"}}>A real plan, built around your real life. Starting now.</p>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // SESSION CONFIRMED
  if(screen==="session_confirmed") return(
    <Wrap>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>&#10003;</div>
      <Tag t="ETFM Financial Reset"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"20px",lineHeight:"1.3"}}>
        You're confirmed. Let's get to work.
      </h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"32px"}}>Your ETFM Financial Reset with Robert Brickey is confirmed and your payment has been received. Check your Calendly confirmation email for your pre-session call date and time.</p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"20px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"16px"}}>What happens next</p>
        {[
          "Check your email for your Calendly pre-session call confirmation",
          "A short intake form will arrive within 24 hours, complete it before your first call",
          "Attend your first 30-minute strategy call with Robert, he'll arrive fully prepared",
          "Receive your personalized financial roadmap and strategic score",
          "Attend your second 30-minute call to review your plan and confirm your direction",
          "Detailed session notes will be sent to you after both calls",
        ].map((step,i)=>(
          <div key={i} style={{padding:"10px 0",color:"#c8c8d8",fontSize:"14px",lineHeight:"1.6",borderBottom:i<5?"1px solid rgba(255,255,255,0.06)":"none"}}>{i+1}.&nbsp;&nbsp;{step}</div>
        ))}
      </div>
      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px 24px",textAlign:"left"}}>
        <p style={{color:C.text,fontSize:"14px",fontWeight:"bold",marginBottom:"8px"}}>Your Reset includes:</p>
        <p style={{color:C.muted,fontSize:"14px",lineHeight:"1.8",margin:0}}>Two private 1-on-1 strategy sessions with Robert. A personalized financial action plan built around your real situation. Financial structure recommendations. Clear next-step planning. Detailed session notes from both calls. 90 days of priority follow-up support.</p>
      </div>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <a href="mailto:exit@etfm.systems" style={{color:C.gold,textDecoration:"none"}}>exit@etfm.systems</a></p>
    </Wrap>
  );

  // BLUEPRINT UNPAID
  if(screen==="blueprint_unpaid") return(
    <Wrap max="500px">
      <h2 style={{fontSize:"28px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px"}}>This session hasn't been activated yet.</h2>
      <p style={{fontSize:"16px",color:C.muted,marginBottom:"32px",lineHeight:"1.7"}}>Complete your payment to unlock your Strategic Blueprint and begin the diagnostic.</p>
      <a href="https://buy.stripe.com/bJe7sM5CE9jwbtnace8Vi0d" style={{display:"inline-block",backgroundColor:C.gold,color:C.dark,textDecoration:"none",padding:"14px 36px",borderRadius:"6px",fontWeight:"bold",fontSize:"16px"}}>Unlock Your Blueprint: $47</a>
    </Wrap>
  );

  // BLUEPRINT CANCELLED
  if(screen==="blueprint_cancelled") return(
    <Wrap max="500px">
      <h2 style={{fontSize:"28px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px"}}>Completely fine.</h2>
      <p style={{fontSize:"16px",color:C.muted,marginBottom:"32px",lineHeight:"1.7"}}>Your Snapshot is still in your inbox. Whenever you're ready to go deeper, to understand the patterns behind the patterns, the Blueprint will be right here waiting.</p>
      <a href="https://buy.stripe.com/bJe7sM5CE9jwbtnace8Vi0d" style={{display:"inline-block",backgroundColor:C.gold,color:C.dark,textDecoration:"none",padding:"14px 36px",borderRadius:"6px",fontWeight:"bold",fontSize:"16px"}}>Unlock Your Blueprint: $47</a>
    </Wrap>
  );

  // RESET CONFIRMED
  if(screen==="reset_confirmed") return(
    <Wrap>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>&#10003;</div>
      <Tag t="ETFM Financial Reset, Step 3"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"20px",lineHeight:"1.3"}}>
        Your Reset Experience is confirmed.
      </h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.7",marginBottom:"32px"}}>
        Your purchase is complete. You now have access to the ETFM Financial Reset, a guided operating system built to replace the patterns keeping you stuck with structure that actually holds.
      </p>
      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"24px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"20px"}}>The 4 Phases You're About to Work Through</p>
        {[
          {phase:"Phase 1",title:"Stabilize",body:"Reduce pressure and confusion. This phase is about getting clear on where things actually stand before trying to change them."},
          {phase:"Phase 2",title:"Organize",body:"Build visibility and structure. You'll establish the financial architecture your decisions can flow through reliably."},
          {phase:"Phase 3",title:"Simplify",body:"Create repeatable systems. Complexity is replaced with routines you can sustain without willpower."},
          {phase:"Phase 4",title:"Execute",body:"Build consistency and momentum. You stop restarting and start compounding, one intentional week at a time."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.08)":"none"}}>
            <p style={{margin:"0 0 4px",color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px"}}>{item.phase}</p>
            <p style={{margin:"0 0 4px",color:C.white,fontSize:"14px",fontWeight:"bold"}}>{item.title}</p>
            <p style={{margin:0,color:"#a0a0b0",fontSize:"13px",lineHeight:"1.6"}}>{item.body}</p>
          </div>
        ))}
      </div>
      <div style={{backgroundColor:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"18px 22px",marginBottom:"24px",textAlign:"left"}}>
        <p style={{margin:0,color:C.muted,fontSize:"14px",lineHeight:"1.8"}}>Your dashboard access will be delivered to your email within <strong style={{color:C.text}}>24 hours</strong>. Check your inbox, and your spam folder if you don't see it.</p>
      </div>
      <a href="https://different-cow.super.site"
        style={{display:"block",width:"100%",padding:"16px",backgroundColor:C.gold,color:C.dark,borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:"pointer",textDecoration:"none",marginBottom:"12px",boxSizing:"border-box",textAlign:"center"}}>
        Begin Your Reset Experience
      </a>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  // RESET OFFER
  if(screen==="reset_offer") return(
    <Wrap>
      <Tag t="ETFM Financial Reset, Step 3"/>
      <h2 style={{fontSize:"34px",fontFamily:"Georgia, serif",color:C.text,marginBottom:"16px",lineHeight:"1.3"}}>You understand the pattern. Now it is time to build the systems that create stability.</h2>
      <p style={{fontSize:"16px",color:C.muted,lineHeight:"1.8",marginBottom:"16px"}}>The ETFM Reset Experience is a guided implementation system designed to help you reduce financial chaos, organize your financial life, and create more consistency, visibility, and control through practical weekly structure.</p>

      <div style={{backgroundColor:C.dark,borderRadius:"10px",padding:"28px",textAlign:"left",marginBottom:"20px"}}>
        <p style={{color:C.gold,fontSize:"11px",textTransform:"uppercase",letterSpacing:"2px",marginBottom:"20px"}}>Inside the Reset Experience You Will Build</p>
        {[
          {title:"Financial Reset Workbook",body:"Identify the financial patterns, pressure points, and behaviors currently shaping your financial life."},
          {title:"Financial Reality Audit",body:"Organize your income, obligations, debt, recurring expenses, and financial responsibilities into one clear picture."},
          {title:"Bill Organization System",body:"Centralize bills, subscriptions, due dates, and recurring obligations to reduce mental clutter and missed payments."},
          {title:"Financial Calendar and Visibility System",body:"Create a monthly structure that helps you anticipate responsibilities before they become stressful surprises."},
          {title:"Spending Pattern Analysis",body:"Review the habits and behaviors influencing where your money goes each month without shame or judgment."},
          {title:"Weekly System Review Framework",body:"A recurring weekly reset process designed to build consistency, awareness, and operational control over time."},
          {title:"Guided Five-Phase Reset Journey",body:"Move step-by-step through Awareness, Stabilization, Control, Positioning, and Expansion."},
          {title:"Strategic Guidance and Coaching Notes from Robert Brickey",body:"Ongoing insight, mindset guidance, and implementation direction throughout the experience."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            <p style={{margin:"0 0 6px",color:C.white,fontSize:"14px",fontWeight:"bold"}}>{item.title}</p>
            <p style={{margin:0,color:"#a0a0b0",fontSize:"13px",lineHeight:"1.6"}}>{item.body}</p>
          </div>
        ))}
        <div style={{marginTop:"20px",padding:"16px",backgroundColor:"rgba(201,151,58,0.08)",borderRadius:"6px",border:"1px solid rgba(201,151,58,0.2)"}}>
          <p style={{color:"#c8c8d8",fontSize:"14px",margin:0,lineHeight:"1.8",fontStyle:"italic"}}>This is not another budgeting course. This is a practical financial operating system designed to help you move from reaction to structure, one step, one system, and one week at a time.</p>
        </div>
      </div>

      <div style={{backgroundColor:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"20px 24px",marginBottom:"20px",textAlign:"left"}}>
        <p style={{color:C.dark,fontSize:"12px",fontWeight:"bold",marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>Before You Continue</p>
        <p style={{color:C.muted,fontSize:"13px",lineHeight:"1.8",margin:"0 0 10px"}}>The ETFM Financial Reset systems are designed for educational and organizational awareness purposes only. The content, frameworks, and recommendations provided are not individualized financial guidance and do not constitute a professional strategic guidance relationship. For guidance specific to your financial situation, please consult a licensed financial professional.</p>
        <p style={{color:C.muted,fontSize:"13px",lineHeight:"1.8",margin:0}}>All sales are final. Due to the personalized and immediately delivered nature of this program, refunds are not available once your access has been provided. By completing payment you acknowledge you have read and agree to these terms.</p>
      </div>
      <a href="https://buy.stripe.com/fZueVee9agLY7d7esu8Vi0f"
        style={{display:"block",width:"100%",padding:"16px",backgroundColor:C.gold,color:C.dark,borderRadius:"6px",fontWeight:"bold",fontSize:"16px",cursor:"pointer",textDecoration:"none",marginBottom:"12px",boxSizing:"border-box",textAlign:"center"}}>
        Begin Your Reset: $99
      </a>
      <Hr/>
      <p style={{fontSize:"13px",color:C.muted}}>Questions? <strong>exit@etfm.systems</strong></p>
    </Wrap>
  );

  return null;
}
