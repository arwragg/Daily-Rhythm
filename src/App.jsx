import { useState, useEffect } from "react";

// ─── RESPONSIVE BREAKPOINT HOOK ───────────────────────────────────────────────
function useBreakpoint(){
  const [bp,setBp]=useState(()=>{
    const w=typeof window!=="undefined"?window.innerWidth:800;
    return w<480?"phone":w<768?"tablet":"desktop";
  });
  useEffect(()=>{
    const fn=()=>{
      const w=window.innerWidth;
      setBp(w<480?"phone":w<768?"tablet":"desktop");
    };
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);
  return bp;
}
const isMobile=(bp)=>bp==="phone"||bp==="tablet";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const PALETTES = {
  purple:{ bg:"#EEEDFE",light:"#CECBF6",mid:"#534AB7",dark:"#3C3489",text:"#26215C" },
  pink:  { bg:"#FBEAF0",light:"#F4C0D1",mid:"#D4537E",dark:"#993556",text:"#4B1528" },
  teal:  { bg:"#E1F5EE",light:"#9FE1CB",mid:"#1D9E75",dark:"#0F6E56",text:"#04342C" },
  amber: { bg:"#FAEEDA",light:"#FAC775",mid:"#BA7517",dark:"#854F0B",text:"#412402" },
  coral: { bg:"#FAECE7",light:"#F5C4B3",mid:"#D85A30",dark:"#993C1D",text:"#4A1B0C" },
  blue:  { bg:"#E6F1FB",light:"#B5D4F4",mid:"#378ADD",dark:"#185FA5",text:"#042C53" },
};
const PALETTE_NAMES = Object.keys(PALETTES);
const DOW_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DOW_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const uid = () => Math.random().toString(36).slice(2,9);
const todayKey = () => new Date().toISOString().slice(0,10);

// ─── DEFAULT DAY PRESETS (one per day of week) ────────────────────────────────
const makePreset = (label, blocks) => ({ label, blocks });
const DEFAULT_PRESETS = {
  0: makePreset("Sunday", [
    {id:uid(),time:"8:00 AM",label:"Family morning",sub:"slow start together",done:false},
    {id:uid(),time:"10:00 AM",label:"Church",sub:"",done:false},
    {id:uid(),time:"2:00 PM",label:"Rest & free time",sub:"",done:false},
    {id:uid(),time:"6:00 PM",label:"Family dinner",sub:"",done:false},
  ]),
  1: makePreset("Monday", [
    {id:uid(),time:"7:00 AM",label:"Morning routine",sub:"bed · teeth · dressed",done:false},
    {id:uid(),time:"8:00 AM",label:"Learning block",sub:"reading + math",done:false},
    {id:uid(),time:"10:00 AM",label:"Chores",sub:"assigned tasks",done:false},
    {id:uid(),time:"12:00 PM",label:"Lunch + free time",sub:"earned downtime",done:false},
    {id:uid(),time:"2:00 PM",label:"Extra gigs",sub:"optional",done:false},
    {id:uid(),time:"6:00 PM",label:"Evening routine",sub:"dinner + wind-down",done:false},
  ]),
  2: makePreset("Tuesday — school day", [
    {id:uid(),time:"7:00 AM",label:"Morning routine",sub:"early start",done:false},
    {id:uid(),time:"8:30 AM",label:"School",sub:"co-op / hybrid school",done:false},
    {id:uid(),time:"12:00 PM",label:"Lunch",sub:"",done:false},
    {id:uid(),time:"1:00 PM",label:"Homework + review",sub:"",done:false},
    {id:uid(),time:"3:00 PM",label:"Chores",sub:"assigned tasks",done:false},
    {id:uid(),time:"6:00 PM",label:"Evening routine",sub:"dinner + wind-down",done:false},
  ]),
  3: makePreset("Wednesday", [
    {id:uid(),time:"7:00 AM",label:"Morning routine",sub:"bed · teeth · dressed",done:false},
    {id:uid(),time:"8:00 AM",label:"Learning block",sub:"reading + math",done:false},
    {id:uid(),time:"10:00 AM",label:"Chores",sub:"assigned tasks",done:false},
    {id:uid(),time:"12:00 PM",label:"Lunch + free time",sub:"earned downtime",done:false},
    {id:uid(),time:"2:00 PM",label:"Extra gigs",sub:"optional",done:false},
    {id:uid(),time:"6:00 PM",label:"Evening routine",sub:"dinner + wind-down",done:false},
  ]),
  4: makePreset("Thursday — school day", [
    {id:uid(),time:"7:00 AM",label:"Morning routine",sub:"early start",done:false},
    {id:uid(),time:"8:30 AM",label:"School",sub:"co-op / hybrid school",done:false},
    {id:uid(),time:"12:00 PM",label:"Lunch",sub:"",done:false},
    {id:uid(),time:"1:00 PM",label:"Homework + review",sub:"",done:false},
    {id:uid(),time:"3:00 PM",label:"Chores",sub:"assigned tasks",done:false},
    {id:uid(),time:"6:00 PM",label:"Evening routine",sub:"dinner + wind-down",done:false},
  ]),
  5: makePreset("Friday", [
    {id:uid(),time:"7:00 AM",label:"Morning routine",sub:"bed · teeth · dressed",done:false},
    {id:uid(),time:"8:00 AM",label:"Learning block",sub:"reading + math",done:false},
    {id:uid(),time:"10:00 AM",label:"Chores",sub:"weekly deep clean",done:false},
    {id:uid(),time:"12:00 PM",label:"Lunch",sub:"",done:false},
    {id:uid(),time:"2:00 PM",label:"Free afternoon",sub:"earned screen time",done:false},
    {id:uid(),time:"6:00 PM",label:"Family night",sub:"",done:false},
  ]),
  6: makePreset("Saturday", [
    {id:uid(),time:"8:00 AM",label:"Morning chores",sub:"whole family",done:false},
    {id:uid(),time:"10:00 AM",label:"Outside time",sub:"yard / errands",done:false},
    {id:uid(),time:"12:00 PM",label:"Lunch",sub:"",done:false},
    {id:uid(),time:"2:00 PM",label:"Free time",sub:"",done:false},
    {id:uid(),time:"6:00 PM",label:"Family dinner",sub:"",done:false},
  ]),
};

// ─── DEFAULT GIGS LIBRARY ─────────────────────────────────────────────────────
const DEFAULT_GIGS = [
  {id:uid(),label:"Mow the lawn",pts:30,icon:"🌿",available:true},
  {id:uid(),label:"Wash the car",pts:25,icon:"🚗",available:true},
  {id:uid(),label:"Vacuum all rooms",pts:20,icon:"🧹",available:true},
  {id:uid(),label:"Clean bathroom",pts:20,icon:"🚿",available:true},
  {id:uid(),label:"Wash dishes",pts:15,icon:"🍽️",available:true},
  {id:uid(),label:"Fold & put away laundry",pts:20,icon:"👕",available:true},
  {id:uid(),label:"Help with dinner prep",pts:15,icon:"🥘",available:true},
  {id:uid(),label:"Water all plants",pts:10,icon:"🌱",available:true},
  {id:uid(),label:"Wipe down kitchen",pts:10,icon:"🧽",available:true},
  {id:uid(),label:"Take out all trash",pts:10,icon:"🗑️",available:true},
  {id:uid(),label:"Sweep the porch",pts:10,icon:"🏡",available:true},
  {id:uid(),label:"Organize pantry",pts:15,icon:"📦",available:true},
];

// ─── DEFAULT BOOKS LIBRARY ────────────────────────────────────────────────────
// difficulty: 1=easy, 2=medium, 3=hard — drives screen time reward
const DEFAULT_BOOKS = [
  // Jaxson (13) level
  {id:uid(),title:"The Hiding Place",author:"Corrie ten Boom",pts:45,difficulty:3,icon:"📗",ageMin:12,genre:"Biography/Faith",available:true},
  {id:uid(),title:"Mere Christianity",author:"C.S. Lewis",pts:50,difficulty:3,icon:"📘",ageMin:13,genre:"Theology",available:true},
  {id:uid(),title:"Carry On, Mr. Bowditch",author:"Jean Lee Latham",pts:35,difficulty:2,icon:"📙",ageMin:11,genre:"Historical Fiction",available:true},
  {id:uid(),title:"The Pilgrim's Progress",author:"John Bunyan",pts:50,difficulty:3,icon:"📕",ageMin:12,genre:"Allegory/Faith",available:true},
  {id:uid(),title:"Amos Fortune, Free Man",author:"Elizabeth Yates",pts:30,difficulty:2,icon:"📗",ageMin:10,genre:"Biography",available:true},
  // Mikiah (10) level
  {id:uid(),title:"My Side of the Mountain",author:"Jean Craighead George",pts:25,difficulty:2,icon:"📗",ageMin:9,genre:"Adventure",available:true},
  {id:uid(),title:"The Dangerous Book for Boys",author:"Conn Iggulden",pts:20,difficulty:1,icon:"📘",ageMin:8,genre:"Activity/Non-fiction",available:true},
  {id:uid(),title:"Johnny Tremain",author:"Esther Forbes",pts:30,difficulty:2,icon:"📙",ageMin:10,genre:"Historical Fiction",available:true},
  {id:uid(),title:"Where the Red Fern Grows",author:"Wilson Rawls",pts:30,difficulty:2,icon:"📕",ageMin:10,genre:"Classic Fiction",available:true},
  // Kennedy (6) level
  {id:uid(),title:"The Jesus Storybook Bible",author:"Sally Lloyd-Jones",pts:10,difficulty:1,icon:"📗",ageMin:4,genre:"Bible/Faith",available:true},
  {id:uid(),title:"Frog and Toad Are Friends",author:"Arnold Lobel",pts:10,difficulty:1,icon:"📘",ageMin:5,genre:"Early Reader",available:true},
  {id:uid(),title:"Owliver",author:"Robert Kraus",pts:10,difficulty:1,icon:"📙",ageMin:5,genre:"Picture Book",available:true},
  {id:uid(),title:"Little Pilgrim's Progress",author:"Helen Taylor",pts:15,difficulty:1,icon:"📕",ageMin:6,genre:"Allegory/Faith",available:true},
];

// ─── DEFAULT KIDS ─────────────────────────────────────────────────────────────
const makeKid = (id,name,age,initials,palette,tasks) => ({
  id,name,age,initials,palette,tasks,
  blocks: Object.fromEntries(Object.entries(DEFAULT_PRESETS).map(([d,p])=>[d,JSON.parse(JSON.stringify(p.blocks)).map(b=>({...b,id:uid()}))]))
});

const DEFAULT_KIDS = [
  makeKid("jaxson","Jaxson",13,"JX","purple",[
    {id:"jc1",cat:"Morning Routine",icon:"☀️",items:[
      {id:"j1",label:"Make bed & tidy room",done:false,pts:0,gig:false,days:[0,1,2,3,4,5,6]},
      {id:"j2",label:"Brush teeth & get dressed",done:false,pts:0,gig:false,days:[0,1,2,3,4,5,6]},
      {id:"j3",label:"Eat breakfast",done:false,pts:0,gig:false,days:[0,1,2,3,4,5,6]},
    ]},
    {id:"jc2",cat:"Learning Block",icon:"📖",items:[
      {id:"j4",label:"Reading — 30 min",done:false,pts:20,gig:false,days:[1,3,5]},
      {id:"j5",label:"Math practice",done:false,pts:20,gig:false,days:[1,3,5]},
    ]},
    {id:"jc3",cat:"Chores",icon:"🏠",items:[
      {id:"j6",label:"Vacuum living room",done:false,pts:15,gig:false,days:[0,1,2,3,4,5,6]},
      {id:"j7",label:"Take out trash",done:false,pts:10,gig:false,days:[0,1,2,3,4,5,6]},
    ]},
    {id:"jc4",cat:"Extra Gigs",icon:"⭐",items:[]},
  ]),
  makeKid("mikiah","Mikiah",10,"MK","pink",[
    {id:"mc1",cat:"Morning Routine",icon:"☀️",items:[
      {id:"m1",label:"Make bed",done:false,pts:0,gig:false,days:[0,1,2,3,4,5,6]},
      {id:"m2",label:"Brush teeth & get dressed",done:false,pts:0,gig:false,days:[0,1,2,3,4,5,6]},
    ]},
    {id:"mc2",cat:"Learning Block",icon:"📖",items:[
      {id:"m4",label:"Reading — 20 min",done:false,pts:15,gig:false,days:[1,3,5]},
      {id:"m5",label:"Spelling practice",done:false,pts:15,gig:false,days:[1,3,5]},
    ]},
    {id:"mc3",cat:"Chores",icon:"🏠",items:[
      {id:"m6",label:"Unload dishwasher",done:false,pts:10,gig:false,days:[0,1,2,3,4,5,6]},
      {id:"m7",label:"Wipe bathroom sink",done:false,pts:10,gig:false,days:[0,1,2,3,4,5,6]},
    ]},
    {id:"mc4",cat:"Extra Gigs",icon:"⭐",items:[]},
  ]),
  makeKid("kennedy","Kennedy",6,"KN","teal",[
    {id:"kc1",cat:"Morning Routine",icon:"☀️",items:[
      {id:"k1",label:"Get dressed",done:false,pts:0,gig:false,days:[0,1,2,3,4,5,6]},
      {id:"k2",label:"Brush teeth",done:false,pts:0,gig:false,days:[0,1,2,3,4,5,6]},
    ]},
    {id:"kc2",cat:"Learning Block",icon:"📖",items:[
      {id:"k4",label:"Story time — 15 min",done:false,pts:10,gig:false,days:[1,3,5]},
      {id:"k5",label:"Practice writing letters",done:false,pts:10,gig:false,days:[1,3,5]},
    ]},
    {id:"kc3",cat:"Chores",icon:"🏠",items:[
      {id:"k6",label:"Put away toys",done:false,pts:5,gig:false,days:[0,1,2,3,4,5,6]},
      {id:"k7",label:"Set the table",done:false,pts:5,gig:false,days:[0,1,2,3,4,5,6]},
    ]},
    {id:"kc4",cat:"Extra Gigs",icon:"⭐",items:[]},
  ]),
];

const DEFAULT_WORD = {
  theme:"diligence",
  jaxson:{verse:"Whatever you do, work at it with all your heart, as working for the Lord.",ref:"Colossians 3:23",reflect:"You are 13 — old enough to understand that how you do small things reveals who you are becoming.",quote:"We are what we repeatedly do. Excellence is not an act, but a habit.",attribution:"Aristotle",verseRead:false},
  mikiah:{verse:"Whatever you do, work heartily, as for the Lord and not for men.",ref:"Colossians 3:23",reflect:"A man who finishes what he starts builds a reputation worth having. What's one thing you can complete all the way today — no shortcuts?",quote:"Start by doing what is necessary, then what is possible, and suddenly you are doing the impossible.",attribution:"Francis of Assisi",verseRead:false},
  kennedy:{verse:"God is not unjust; he will not forget your work and the love you have shown him.",ref:"Hebrews 6:10",reflect:"God sees everything you do — even making your bed. He notices and He loves you!",quote:"Do your little bit of good where you are.",attribution:"Desmond Tutu",verseRead:false},
};

const DEFAULT_SETTINGS = { pin:"1234", calendarUrls:[], calendarColor:"#378ADD" };

// ─── DEFAULT REWARDS CATALOG ──────────────────────────────────────────────────
// Stars = 1 per day kid hits ≥80% task completion
const DEFAULT_REWARDS = [
  {id:uid(),label:"Movie night pick",cost:5,icon:"🎬",available:true},
  {id:uid(),label:"Stay up 30 min late",cost:7,icon:"🌙",available:true},
  {id:uid(),label:"Choose dinner",cost:5,icon:"🍕",available:true},
  {id:uid(),label:"Day trip destination pick",cost:20,icon:"🗺️",available:true},
  {id:uid(),label:"New book of your choice",cost:10,icon:"📚",available:true},
  {id:uid(),label:"Friend sleepover",cost:15,icon:"🏕️",available:true},
  {id:uid(),label:"Screen time bonus (1 hr)",cost:8,icon:"🎮",available:true},
  {id:uid(),label:"Special one-on-one outing",cost:25,icon:"⭐",available:true},
];

// Default streak structure per kid: { current, longest, lastCompletedDate, freezeUsed, frozenDate, totalStars }
const makeStreak = () => ({ current:0, longest:0, lastCompletedDate:null, freezeUsed:false, frozenDate:null, totalStars:0 });

// ─── DEFAULT GOALS ────────────────────────────────────────────────────────────
const GOAL_PERIODS = ["daily","weekly","monthly","yearly"];
const makeGoal = (label,desc,period,type,kidId)=>({
  id:uid(), label, desc, period, type, // type: "character"|"personal"
  kidId, // null = all kids
  done:false, createdDate:todayKey(),
  dueDate:null, // optional
});
const DEFAULT_GOALS = [
  makeGoal("Show kindness to a sibling","Do something kind without being asked","daily","character",null),
  makeGoal("Thank someone today","Genuinely thank a person in your life","daily","character",null),
  makeGoal("Serve someone without being asked","Find a need and meet it quietly","weekly","character",null),
  makeGoal("Read your Bible","Spend time in scripture on your own","daily","character",null),
  makeGoal("Memorize this week's verse","Know it by heart by Sunday","weekly","character",null),
];

// ─── NOTIFICATION / APPROVAL INBOX ────────────────────────────────────────────
// Types: "task_approval" | "reward_request" | "goal_complete" | "reminder"
const makeNotification = (type,title,body,kidId,meta={})=>({
  id:uid(), type, title, body, kidId, meta,
  createdAt:new Date().toISOString(), read:false, resolved:false,
});

// ─── STORAGE ──────────────────────────────────────────────────────────────────
async function load(key){try{const r=await window.storage.get(key);return r?JSON.parse(r.value):null;}catch{return null;}}
async function save(key,val){try{await window.storage.set(key,JSON.stringify(val));}catch{}}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function getStats(kid){
  const dow=new Date().getDay();
  let tot=0,dn=0,pts=0;
  kid.tasks.forEach(c=>c.items.forEach(t=>{
    if(!t.gig&&t.days.includes(dow)){tot++;if(t.done)dn++;}
    if(t.done&&t.pts>0)pts+=t.pts;
  }));
  return{tot,dn,pts,pct:tot?Math.round(dn/tot*100):0};
}

// Parse basic ICS text into event objects
function parseICS(text) {
  const events = [];
  const blocks = text.split("BEGIN:VEVENT");
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const get = (key) => {
      const m = block.match(new RegExp(`${key}[^:]*:([^\r\n]+)`));
      return m ? m[1].trim() : "";
    };
    const parseDate = (str) => {
      if (!str) return null;
      const clean = str.replace(/[TZ]/g,"");
      if (clean.length >= 8) {
        const y=clean.slice(0,4),mo=clean.slice(4,6),d=clean.slice(6,8);
        const h=clean.slice(8,10)||"00",mi=clean.slice(10,12)||"00";
        return new Date(`${y}-${mo}-${d}T${h}:${mi}:00`);
      }
      return null;
    };
    const summary = get("SUMMARY");
    const dtstart = parseDate(get("DTSTART"));
    const dtend = parseDate(get("DTEND"));
    if (summary && dtstart) events.push({ summary, dtstart, dtend, allDay: !get("DTSTART").includes("T") });
  }
  return events;
}

function formatTime(date) {
  if (!date) return "";
  return date.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true});
}

function sameDay(a, b) {
  return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
}

function daysInMonth(year, month) {
  return new Date(year, month+1, 0).getDate();
}

// ─── STREAK UTILS ─────────────────────────────────────────────────────────────
function updateStreak(streak, pct) {
  const today = todayKey();
  const s = streak ? {...streak} : makeStreak();

  // Already recorded today
  if (s.lastCompletedDate === today) return s;

  if (pct >= 80) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yKey = yesterday.toISOString().slice(0,10);
    const wasYesterday = s.lastCompletedDate === yKey;
    const wasFrozen = s.frozenDate === yKey; // freeze covered yesterday

    if (wasYesterday || wasFrozen) {
      s.current = (s.current||0) + 1;
    } else if (s.lastCompletedDate === null) {
      s.current = 1;
    } else {
      // Gap of >1 day — check if freeze available
      const daysSince = s.lastCompletedDate
        ? Math.round((new Date(today)-new Date(s.lastCompletedDate))/(1000*60*60*24))
        : 99;
      if (daysSince === 2 && !s.freezeUsed) {
        // Use freeze token — bridge the gap
        s.current = (s.current||0) + 1;
        s.freezeUsed = true;
        s.frozenDate = yKey;
      } else {
        s.current = 1; // streak broken
        s.freezeUsed = false;
      }
    }
    s.longest = Math.max(s.longest||0, s.current);
    s.lastCompletedDate = today;
  }
  return s;
}

// ─── CONFETTI (Kennedy) ───────────────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({length:28}, (_,i) => ({
    id:i,
    x: 10 + Math.random()*80,
    delay: Math.random()*0.6,
    dur: 1.2 + Math.random()*0.8,
    color: ['#534AB7','#D4537E','#1D9E75','#BA7517','#F4C0D1','#FAEEDA','#fff'][i%7],
    size: 6+Math.random()*8,
    rot: Math.random()*360,
  }));
  return (
    <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",overflow:"hidden",borderRadius:"inherit",zIndex:10}}>
      <style>{`
        @keyframes confFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(140px) rotate(360deg);opacity:0}}
      `}</style>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute",left:`${p.x}%`,top:0,
          width:p.size,height:p.size,borderRadius:p.id%3===0?"50%":2,
          background:p.color,
          animation:`confFall ${p.dur}s ${p.delay}s ease-in forwards`,
          transform:`rotate(${p.rot}deg)`,
        }}/>
      ))}
    </div>
  );
}

// ─── COMPLETION CELEBRATION ───────────────────────────────────────────────────
// age-differentiated: Kennedy=big+confetti, Mikiah=medium, Jaxson=subtle ring
function CompletionBadge({ kid, pct }) {
  const pal = PALETTES[kid.palette];
  const age = kid.age;
  const [show, setShow] = useState(false);
  const [prevPct, setPrevPct] = useState(pct);

  useEffect(() => {
    if (pct === 100 && prevPct < 100) {
      setShow(true);
      const t = setTimeout(() => setShow(false), age <= 7 ? 4000 : age <= 11 ? 3000 : 2500);
      setPrevPct(pct); // always sync so it can re-trigger if pct drops then hits 100 again
      return () => clearTimeout(t);
    }
    setPrevPct(pct);
  }, [pct]);

  if (!show && pct < 100) return null;
  if (pct < 100) return null;

  if (age <= 7) {
    // Kennedy — big, joyful, confetti
    return (
      <div style={{position:"relative",background:pal.bg,borderRadius:12,padding:"18px 20px",marginBottom:12,textAlign:"center",overflow:"hidden",border:`2px solid ${pal.mid}`}}>
        <Confetti active={show}/>
        <div style={{fontSize:40,marginBottom:6}}>🎉</div>
        <div style={{fontSize:18,fontWeight:600,color:pal.dark,marginBottom:4}}>Amazing job, {kid.name}!</div>
        <div style={{fontSize:13,color:pal.text}}>You finished all your tasks today! God sees your hard work and smiles!</div>
        <div style={{fontSize:28,marginTop:8}}>⭐🌟⭐</div>
      </div>
    );
  }
  if (age <= 11) {
    // Mikiah — medium, affirming
    return (
      <div style={{background:pal.bg,borderRadius:10,padding:"14px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:14,border:`1.5px solid ${pal.light}`}}>
        <div style={{fontSize:32}}>💪</div>
        <div>
          <div style={{fontSize:15,fontWeight:600,color:pal.dark}}>All done, {kid.name}!</div>
          <div style={{fontSize:12,color:pal.text,marginTop:2}}>Every task complete. That's what faithfulness looks like.</div>
        </div>
        <div style={{marginLeft:"auto",fontSize:11,fontWeight:600,color:pal.mid,background:pal.light,padding:"4px 10px",borderRadius:99}}>+1 ⭐</div>
      </div>
    );
  }
  // Jaxson — subtle ring + quiet text
  return (
    <div style={{background:"#fafafa",borderRadius:10,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:12,border:"0.5px solid #e0e0e0"}}>
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="none" stroke="#e8e8e8" strokeWidth="2.5"/>
        <circle cx="14" cy="14" r="12" fill="none" stroke={pal.mid} strokeWidth="2.5"
          strokeDasharray={`${2*Math.PI*12}`} strokeDashoffset="0"
          strokeLinecap="round" transform="rotate(-90 14 14)"
          style={{transition:"stroke-dashoffset 0.8s ease"}}/>
        <text x="14" y="18" textAnchor="middle" fontSize="11" fill={pal.mid} fontWeight="600">✓</text>
      </svg>
      <div>
        <div style={{fontSize:14,fontWeight:500,color:"#111"}}>Day complete, {kid.name}.</div>
        <div style={{fontSize:11,color:"#888",marginTop:1}}>Well done. +1 star toward your goal.</div>
      </div>
    </div>
  );
}

// ─── STREAK DISPLAY ───────────────────────────────────────────────────────────
function StreakBadge({ kid, streak }) {
  const pal = PALETTES[kid.palette];
  const s = streak || makeStreak();
  const cur = s.current || 0;
  const longest = s.longest || 0;
  const age = kid.age;

  if (age <= 7) {
    // Kennedy — big flame, visual stars
    return (
      <div style={{display:"flex",alignItems:"center",gap:10,background:cur>0?pal.bg:"#f5f5f5",borderRadius:10,padding:"10px 14px",marginBottom:12,border:`0.5px solid ${cur>0?pal.light:"#eee"}`}}>
        <div style={{fontSize:28}}>{cur>=7?"🔥":cur>=3?"🌟":"⭐"}</div>
        <div>
          <div style={{fontSize:16,fontWeight:600,color:cur>0?pal.dark:"#aaa"}}>{cur} day{cur!==1?"s":""} in a row!</div>
          <div style={{fontSize:11,color:cur>0?pal.text:"#bbb"}}>{cur===0?"Start your streak today!":cur>=7?"You're on fire! Keep going!":"Best: "+longest+" days"}</div>
        </div>
        {cur>0&&<div style={{marginLeft:"auto",display:"flex",gap:3}}>
          {Array.from({length:Math.min(cur,7)}).map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:pal.mid}}/>)}
        </div>}
      </div>
    );
  }
  if (age <= 11) {
    return (
      <div style={{display:"flex",alignItems:"center",gap:10,background:cur>0?pal.bg:"#f5f5f5",borderRadius:10,padding:"10px 14px",marginBottom:12,border:`0.5px solid ${cur>0?pal.light:"#eee"}`}}>
        <div style={{fontSize:22}}>{cur>=7?"🔥":cur>=3?"⚡":"💧"}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:cur>0?pal.dark:"#aaa"}}>{cur}-day streak {cur>=7?"🔥":""}</div>
          <div style={{fontSize:11,color:"#888"}}>Best: {longest} days</div>
        </div>
        <div style={{fontSize:18,fontWeight:600,color:pal.mid}}>{cur}</div>
      </div>
    );
  }
  // Jaxson — minimal, number-forward
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,background:"#fafafa",borderRadius:10,padding:"10px 14px",marginBottom:12,border:"0.5px solid #eee"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:cur>0?pal.mid:"#e0e0e0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <span style={{fontSize:14,fontWeight:600,color:"#fff"}}>{cur}</span>
      </div>
      <div>
        <div style={{fontSize:13,fontWeight:500,color:"#111"}}>{cur>0?`${cur}-day streak`:"No active streak"}</div>
        <div style={{fontSize:11,color:"#888"}}>Personal best: {longest} days · {cur>0&&s.freezeUsed?"freeze used":"1 freeze available"}</div>
      </div>
      {cur>=7&&<div style={{marginLeft:"auto",fontSize:11,background:"#EAF3DE",color:"#27500A",padding:"3px 10px",borderRadius:99,fontWeight:500}}>🔥 On fire</div>}
    </div>
  );
}

// ─── REWARD GOAL TRACKER ──────────────────────────────────────────────────────
function RewardGoalTracker({ kid, rewards, streaks, onClaimGoal, onRedeemGoal }) {
  const pal = PALETTES[kid.palette];
  const streak = streaks[kid.id] || makeStreak();
  const stars = streak.totalStars || 0;
  const activeGoal = kid.activeGoal || null; // { rewardId, startStars }
  const available = rewards.filter(r => r.available);
  const [picking, setPicking] = useState(false);

  const goalReward = activeGoal ? rewards.find(r=>r.id===activeGoal.rewardId) : null;
  const starsTowardGoal = goalReward ? Math.min(stars - (activeGoal.startStars||0), goalReward.cost) : 0;
  const goalPct = goalReward ? Math.round(starsTowardGoal/goalReward.cost*100) : 0;
  const goalComplete = goalPct >= 100;

  return (
    <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #e0e0e0",padding:16,marginBottom:12}}>
      {/* Stars balance */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{width:40,height:40,borderRadius:10,background:pal.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⭐</div>
        <div>
          <div style={{fontSize:11,color:"#888",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em"}}>Stars earned</div>
          <div style={{fontSize:22,fontWeight:600,color:pal.mid}}>{stars} <span style={{fontSize:13,color:"#888",fontWeight:400}}>stars</span></div>
        </div>
        <div style={{marginLeft:"auto",fontSize:11,color:"#888",textAlign:"right"}}>
          <div>1 star = 1 full day</div>
          <div style={{color:pal.mid,fontWeight:500}}>≥80% tasks</div>
        </div>
      </div>

      {/* Active goal */}
      {goalReward && !goalComplete && (
        <div style={{background:pal.bg,borderRadius:10,padding:12,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span style={{fontSize:20}}>{goalReward.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500,color:pal.dark}}>{goalReward.label}</div>
              <div style={{fontSize:11,color:pal.text}}>{starsTowardGoal}/{goalReward.cost} stars</div>
            </div>
            <div style={{fontSize:12,fontWeight:600,color:pal.mid}}>{goalPct}%</div>
          </div>
          <div style={{height:8,borderRadius:99,background:"rgba(0,0,0,0.08)",overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:99,background:pal.mid,width:`${goalPct}%`,transition:"width 0.5s ease"}}/>
          </div>
          <div style={{fontSize:11,color:pal.text,marginTop:6}}>{goalReward.cost-starsTowardGoal} more star{goalReward.cost-starsTowardGoal!==1?"s":""} to go</div>
        </div>
      )}

      {goalComplete && goalReward && (
        <div style={{background:pal.mid,borderRadius:10,padding:14,marginBottom:10,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:4}}>{goalReward.icon}</div>
          <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:4}}>Goal reached!</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.85)",marginBottom:12}}>{goalReward.label} — go claim it!</div>
          <button onClick={()=>onRedeemGoal(kid.id)} style={{background:"#fff",border:"none",borderRadius:8,padding:"8px 20px",fontSize:13,fontWeight:600,color:pal.mid,cursor:"pointer"}}>
            Redeem reward
          </button>
        </div>
      )}

      {!goalReward && (
        <div style={{background:"#f7f7f7",borderRadius:10,padding:12,marginBottom:10,textAlign:"center"}}>
          <div style={{fontSize:13,color:"#888",marginBottom:8}}>{kid.name} hasn't set a goal yet</div>
          <button onClick={()=>setPicking(true)} style={{fontSize:12,padding:"6px 16px",borderRadius:8,border:"none",background:pal.mid,color:"#fff",cursor:"pointer"}}>
            Pick a goal
          </button>
        </div>
      )}

      {goalReward && !goalComplete && (
        <button onClick={()=>setPicking(true)} style={{fontSize:11,color:"#888",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",padding:0}}>
          Change goal
        </button>
      )}

      {/* Goal picker */}
      {picking && (
        <div style={{marginTop:10,borderTop:"0.5px solid #eee",paddingTop:12}}>
          <div style={{fontSize:11,fontWeight:600,color:"#888",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Choose a goal</div>
          {available.map(r=>(
            <div key={r.id} onClick={()=>{onClaimGoal(kid.id,r);setPicking(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:8,background:"#fafafa",border:"0.5px solid #eee",marginBottom:6,cursor:"pointer"}}>
              <span style={{fontSize:18}}>{r.icon}</span>
              <span style={{flex:1,fontSize:13,color:"#111"}}>{r.label}</span>
              <span style={{fontSize:12,fontWeight:600,color:pal.mid}}>{r.cost} ⭐</span>
            </div>
          ))}
          <button onClick={()=>setPicking(false)} style={{fontSize:12,color:"#aaa",background:"none",border:"none",cursor:"pointer",marginTop:4}}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function Avatar({kid,size=38}){const p=PALETTES[kid.palette];return <div style={{width:size,height:size,borderRadius:"50%",background:p.bg,color:p.dark,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:Math.round(size*.3),flexShrink:0}}>{kid.initials}</div>;}
function Bar({pct,color,h=6}){return <div style={{height:h,borderRadius:99,background:"#e8e8e8",overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:color,width:`${pct}%`,transition:"width .4s"}}/></div>;}
function Chk({checked,color,onClick,size=20}){
  return <div onClick={onClick} style={{width:size,height:size,minWidth:size,minHeight:size,borderRadius:6,flexShrink:0,cursor:"pointer",border:checked?`1.5px solid ${color}`:"1.5px solid #ccc",background:checked?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .18s",touchAction:"manipulation"}}>
    {checked&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
  </div>;
}
function SecHead({label}){return <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",color:"#aaa",marginBottom:8}}>{label}</div>;}
function Field({label,children}){return <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#888",marginBottom:4,fontWeight:500}}>{label}</div>{children}</div>;}
function Btn({onClick,text,disabled,full,danger,outline,color="#534AB7"}){return <button onClick={onClick} disabled={disabled} style={{width:full?"100%":undefined,padding:"9px 14px",borderRadius:8,fontSize:13,cursor:disabled?"wait":"pointer",fontWeight:500,background:danger?"#E24B4A":outline?"transparent":color,color:outline?"#555":"#fff",border:outline?"0.5px solid #ccc":danger?"none":`1.5px solid ${color}`,opacity:disabled?.6:1}}>{text}</button>;}
function Overlay({children}){return <div style={{minHeight:440,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"flex-start",justifyContent:"center",borderRadius:12,padding:"16px 4px"}}>{children}</div>;}
function Modal({title,onClose,children,wide}){return <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:wide?660:460,overflow:"hidden"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"0.5px solid #eee"}}><div style={{fontWeight:500,fontSize:15}}>{title}</div><button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#aaa",lineHeight:1}}>✕</button></div><div style={{padding:18,maxHeight:"76vh",overflowY:"auto"}}>{children}</div></div>;}

// ─── NOTIFICATION BELL ────────────────────────────────────────────────────────
function NotificationBell({notifications,kids,rewards,onApproveTask,onDenyTask,onApproveReward,onDenyReward,onMarkRead,onClearAll}){
  const [open,setOpen]=useState(false);
  const bp=useBreakpoint();
  const unread=notifications.filter(n=>!n.read&&!n.resolved);
  const pending=notifications.filter(n=>!n.resolved&&(n.type==="task_approval"||n.type==="reward_request"));
  const dropdownStyle=bp==="phone"
    ?{position:"fixed",top:0,left:0,right:0,bottom:0,background:"#fff",zIndex:200,overflowY:"auto"}
    :{position:"absolute",right:0,top:42,width:320,background:"#fff",borderRadius:12,border:"0.5px solid #e0e0e0",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:100,overflow:"hidden"};

  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{position:"relative",background:"none",border:"0.5px solid #ccc",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",gap:4}}>
        🔔
        {unread.length>0&&<div style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:"#E24B4A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,color:"#fff"}}>{unread.length}</div>}
      </button>
      {open&&(
        <div style={dropdownStyle}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderBottom:"0.5px solid #eee"}}>
            <div style={{fontWeight:500,fontSize:14}}>Notifications</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {notifications.length>0&&<button onClick={()=>{onClearAll();setOpen(false);}} style={{fontSize:11,color:"#aaa",background:"none",border:"none",cursor:"pointer"}}>Clear all</button>}
              <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#aaa"}}>✕</button>
            </div>
          </div>
          <div style={{maxHeight:400,overflowY:"auto"}}>
            {notifications.length===0&&<div style={{padding:"24px",textAlign:"center",fontSize:13,color:"#aaa"}}>All caught up ✓</div>}

            {/* Pending approvals first */}
            {pending.map(n=>(
              <div key={n.id} style={{padding:"12px 14px",borderBottom:"0.5px solid #f5f5f5",background:"#FFFBF0"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
                  <div style={{fontSize:16,flexShrink:0}}>{n.type==="task_approval"?"✅":"⭐"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:"#111",marginBottom:2}}>{n.title}</div>
                    <div style={{fontSize:11,color:"#888"}}>{n.body}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{
                    n.type==="task_approval"?onApproveTask(n.kidId,n.meta.taskId,n.id):onApproveReward(n.kidId,n.meta.rewardId,n.id);
                  }} style={{flex:1,padding:"6px",borderRadius:6,border:"none",background:"#1D9E75",color:"#fff",fontSize:12,fontWeight:500,cursor:"pointer"}}>
                    ✓ Approve
                  </button>
                  <button onClick={()=>{
                    if(n.type==="task_approval") onDenyTask(n.kidId,n.meta.taskId,n.id);
                    else if(n.type==="reward_request") onDenyReward(n.kidId,n.meta.rewardId,n.id);
                    else onMarkRead(n.id,true);
                  }} style={{flex:1,padding:"6px",borderRadius:6,border:"0.5px solid #ccc",background:"transparent",fontSize:12,color:"#666",cursor:"pointer"}}>
                    ✗ Deny
                  </button>
                </div>
              </div>
            ))}

            {/* Other notifications */}
            {notifications.filter(n=>n.resolved||n.type==="reminder"||n.type==="goal_complete").slice(0,10).map(n=>(
              <div key={n.id} onClick={()=>onMarkRead(n.id,false)} style={{padding:"10px 14px",borderBottom:"0.5px solid #f5f5f5",opacity:n.read?.6:1,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:8}}>
                <div style={{fontSize:14,flexShrink:0}}>{n.type==="goal_complete"?"🎯":n.type==="reminder"?"⏰":"📋"}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:500,color:"#111"}}>{n.title}</div>
                  <div style={{fontSize:11,color:"#888"}}>{n.body}</div>
                  <div style={{fontSize:10,color:"#bbb",marginTop:2}}>{new Date(n.createdAt).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GOALS TAB (kid-facing goals view) ───────────────────────────────────────
function GoalsPanel({kid,goals,onToggleGoal,onAddPersonalGoal}){
  const pal=PALETTES[kid.palette];
  const [period,setPeriod]=useState("daily");
  const [adding,setAdding]=useState(false);
  const [newGoal,setNewGoal]=useState({label:"",desc:"",period:"daily",type:"personal"});

  const filtered=goals.filter(g=>(g.kidId===kid.id||g.kidId===null)&&g.period===period);
  const done=filtered.filter(g=>g.done).length;

  return (
    <div style={{marginBottom:4}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <span style={{fontSize:16}}>🎯</span>
        <div style={{flex:1}}>
          <div style={{fontWeight:500,fontSize:13,color:"#111"}}>{done}/{filtered.length} complete this {period}</div>
        </div>
      </div>

      {/* Period tabs */}
      <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
        {GOAL_PERIODS.map(p=>(
          <div key={p} onClick={()=>setPeriod(p)} style={{padding:"4px 12px",borderRadius:99,fontSize:11,fontWeight:500,cursor:"pointer",background:period===p?pal.mid:"#f0f0f0",color:period===p?"#fff":"#555",textTransform:"capitalize"}}>
            {p}
          </div>
        ))}
      </div>

      <div>
        {filtered.length===0&&!adding&&<div style={{fontSize:12,color:"#aaa",textAlign:"center",padding:"16px 0"}}>No {period} goals set yet</div>}

        {filtered.map(g=>{
          const isChar=g.type==="character";
          return (
            <div key={g.id} onClick={()=>onToggleGoal(g.id,kid.id)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 10px",borderRadius:9,marginBottom:6,cursor:"pointer",background:g.done?pal.bg:"#fafafa",border:`0.5px solid ${g.done?pal.light:"#eee"}`}}>
              <div style={{width:22,height:22,borderRadius:6,flexShrink:0,border:g.done?`1.5px solid ${pal.mid}`:"1.5px solid #ccc",background:g.done?pal.mid:"transparent",display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                {g.done&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{fontSize:11,padding:"1px 7px",borderRadius:99,background:isChar?"#EEEDFE":"#EAF3DE",color:isChar?"#3C3489":"#27500A",fontWeight:500}}>{isChar?"Character":"Personal"}</span>
                  {g.dueDate&&<span style={{fontSize:10,color:"#aaa"}}>due {g.dueDate}</span>}
                </div>
                <div style={{fontSize:13,fontWeight:500,color:g.done?pal.dark:"#111",textDecoration:g.done?"line-through":"none"}}>{g.label}</div>
                {g.desc&&<div style={{fontSize:11,color:"#888",marginTop:2,lineHeight:1.4}}>{g.desc}</div>}
              </div>
            </div>
          );
        })}

        {/* Add personal goal */}
        {adding?(
          <div style={{background:"#f8f8ff",borderRadius:10,padding:12,border:"0.5px solid #CECBF6",marginTop:8}}>
            <Field label="Goal"><input value={newGoal.label} onChange={e=>setNewGoal(p=>({...p,label:e.target.value}))} style={{width:"100%"}} placeholder="e.g. Learn to tie a fishing knot"/></Field>
            <Field label="Description (optional)"><input value={newGoal.desc} onChange={e=>setNewGoal(p=>({...p,desc:e.target.value}))} style={{width:"100%"}} placeholder="What does success look like?"/></Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <Field label="Period">
                <select value={newGoal.period} onChange={e=>setNewGoal(p=>({...p,period:e.target.value}))} style={{width:"100%"}}>
                  {GOAL_PERIODS.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Type">
                <select value={newGoal.type} onChange={e=>setNewGoal(p=>({...p,type:e.target.value}))} style={{width:"100%"}}>
                  <option value="personal">Personal</option>
                  <option value="character">Character</option>
                </select>
              </Field>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn outline onClick={()=>setAdding(false)} text="Cancel" full/>
              <Btn onClick={()=>{if(newGoal.label.trim()){onAddPersonalGoal({...newGoal,kidId:kid.id});setAdding(false);setNewGoal({label:"",desc:"",period:"daily",type:"personal"});}}} text="Add goal" full/>
            </div>
          </div>
        ):(
          <button onClick={()=>setAdding(true)} style={{width:"100%",padding:"9px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:12,color:"#888",cursor:"pointer",marginTop:4}}>
            + Add personal goal
          </button>
        )}
      </div>
    </div>
  );
}

// ─── GOALS PARENT TAB ─────────────────────────────────────────────────────────
function GoalsParentTab({kids,goals,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(goals)));
  const [selKid,setSelKid]=useState("all");
  const [msg,setMsg]=useState("");
  const [adding,setAdding]=useState(false);
  const [newG,setNewG]=useState({label:"",desc:"",period:"weekly",type:"character",kidId:null});

  function del(id){setLocal(p=>p.filter(g=>g.id!==id));}
  function upd(id,f,v){setLocal(p=>p.map(g=>g.id!==id?g:{...g,[f]:v}));}
  function addGoal(){if(!newG.label.trim())return;setLocal(p=>[...p,{...newG,id:uid(),done:false,createdDate:todayKey()}]);setAdding(false);setNewG({label:"",desc:"",period:"weekly",type:"character",kidId:null});}
  function save(){onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}

  const filtered=local.filter(g=>selKid==="all"?true:(g.kidId===selKid||g.kidId===null));

  return <div>
    <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:12,background:"#f8f8ff",borderRadius:8,padding:"10px 12px"}}>
      Set character and personal goals for your kids. Character goals (show kindness, serve others) apply to all children by default. Personal goals are assigned to a specific child.
    </div>
    <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
      <div onClick={()=>setSelKid("all")} style={{padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:500,cursor:"pointer",background:selKid==="all"?"#534AB7":"#f0f0f0",color:selKid==="all"?"#fff":"#555"}}>All</div>
      {kids.map(k=><div key={k.id} onClick={()=>setSelKid(k.id)} style={{padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:500,cursor:"pointer",background:selKid===k.id?PALETTES[k.palette].mid:"#f0f0f0",color:selKid===k.id?"#fff":"#555"}}>{k.name}</div>)}
    </div>
    {filtered.map(g=><div key={g.id} style={{background:"#fafafa",borderRadius:9,padding:10,marginBottom:8,border:"0.5px solid #eee"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:11,padding:"2px 8px",borderRadius:99,background:g.type==="character"?"#EEEDFE":"#EAF3DE",color:g.type==="character"?"#3C3489":"#27500A",fontWeight:500}}>{g.type==="character"?"Character":"Personal"}</span>
        <span style={{fontSize:10,color:"#aaa",background:"#f0f0f0",padding:"2px 7px",borderRadius:99}}>{g.period}</span>
        {g.kidId&&<span style={{fontSize:10,color:"#aaa"}}>{kids.find(k=>k.id===g.kidId)?.name}</span>}
        <button onClick={()=>del(g.id)} style={{marginLeft:"auto",background:"none",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:11}}>Remove</button>
      </div>
      <input value={g.label} onChange={e=>upd(g.id,"label",e.target.value)} style={{width:"100%",fontSize:13,marginBottom:4}}/>
      <input value={g.desc||""} onChange={e=>upd(g.id,"desc",e.target.value)} style={{width:"100%",fontSize:11}} placeholder="Description (optional)"/>
    </div>)}

    {adding?(
      <div style={{background:"#f0f0ff",borderRadius:10,padding:12,marginBottom:12,border:"0.5px solid #CECBF6"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <Field label="Type"><select value={newG.type} onChange={e=>setNewG(p=>({...p,type:e.target.value}))} style={{width:"100%"}}><option value="character">Character</option><option value="personal">Personal</option></select></Field>
          <Field label="Period"><select value={newG.period} onChange={e=>setNewG(p=>({...p,period:e.target.value}))} style={{width:"100%"}}>{GOAL_PERIODS.map(p=><option key={p} value={p}>{p}</option>)}</select></Field>
          <Field label="Assign to"><select value={newG.kidId||"all"} onChange={e=>setNewG(p=>({...p,kidId:e.target.value==="all"?null:e.target.value}))} style={{width:"100%"}}><option value="all">All children</option>{kids.map(k=><option key={k.id} value={k.id}>{k.name}</option>)}</select></Field>
        </div>
        <Field label="Goal"><input value={newG.label} onChange={e=>setNewG(p=>({...p,label:e.target.value}))} style={{width:"100%"}} placeholder="e.g. Serve someone without being asked"/></Field>
        <Field label="Description"><input value={newG.desc} onChange={e=>setNewG(p=>({...p,desc:e.target.value}))} style={{width:"100%"}} placeholder="What does this look like?"/></Field>
        <div style={{display:"flex",gap:8}}><Btn outline onClick={()=>setAdding(false)} text="Cancel" full/><Btn onClick={addGoal} text="Add goal" full/></div>
      </div>
    ):(
      <button onClick={()=>setAdding(true)} style={{width:"100%",padding:"9px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:12,color:"#888",cursor:"pointer",marginBottom:12}}>+ Add goal</button>
    )}
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={save} full text="Save goals"/>
  </div>;
}

// ─── WEEKLY PARENT REPORT ─────────────────────────────────────────────────────
function WeeklyReport({kids,streaks,goals,onClose}){
  const bp=useBreakpoint();
  const endDate=new Date();
  const startDate=new Date();startDate.setDate(endDate.getDate()-6);
  const fmt=(d)=>d.toLocaleDateString("en-US",{month:"short",day:"numeric"});

  return (
    <Overlay>
      <Modal title={`Weekly report · ${fmt(startDate)} – ${fmt(endDate)}`} onClose={onClose} wide>
        <div style={{marginBottom:16}}>
          {kids.map(kid=>{
            const pal=PALETTES[kid.palette];
            const streak=streaks[kid.id]||makeStreak();
            const kidGoals=goals.filter(g=>(g.kidId===kid.id||g.kidId===null));
            const doneGoals=kidGoals.filter(g=>g.done);
            const booksRead=Object.keys(kid.booksRead||{}).length; // total unique books ever finished

            return (
              <div key={kid.id} style={{background:"#fafafa",borderRadius:12,padding:14,marginBottom:14,border:`1.5px solid ${pal.light}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:pal.bg,color:pal.dark,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:13}}>{kid.initials}</div>
                  <div>
                    <div style={{fontWeight:500,fontSize:15,color:"#111"}}>{kid.name}</div>
                    <div style={{fontSize:12,color:"#888"}}>Age {kid.age}</div>
                  </div>
                  {streak.current>0&&<div style={{marginLeft:"auto",fontSize:14,fontWeight:600,color:"#BA7517"}}>{streak.current>=7?"🔥":streak.current>=3?"⚡":"✦"} {streak.current}-day streak</div>}
                </div>

                <div style={{display:"grid",gridTemplateColumns:bp==="phone"?"repeat(2,1fr)":"repeat(3,1fr)",gap:10,marginBottom:12}}>
                  {[
                    {label:"Current streak",val:`${streak.current} days`,icon:"🔥"},
                    {label:"Personal best",val:`${streak.longest} days`,icon:"🏆"},
                    {label:"Total stars",val:`${streak.totalStars||0} ⭐`,icon:""},
                    {label:"Books finished (all-time)",val:booksRead,icon:"📚"},
                    {label:"Goals complete",val:`${doneGoals.length}/${kidGoals.length}`,icon:"🎯"},
                    {label:"Active goal",val:kid.activeGoal?"Yes":"None",icon:""},
                  ].map((s,i)=>(
                    <div key={i} style={{background:"#fff",borderRadius:8,padding:"10px 12px",textAlign:"center",border:"0.5px solid #eee"}}>
                      <div style={{fontSize:11,color:"#888",marginBottom:4}}>{s.label}</div>
                      <div style={{fontSize:16,fontWeight:600,color:pal.mid}}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Goals completed this week */}
                {doneGoals.length>0&&(
                  <div>
                    <SecHead label="Goals completed"/>
                    {doneGoals.map(g=><div key={g.id} style={{fontSize:12,color:"#555",padding:"4px 0",borderBottom:"0.5px solid #f0f0f0",display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:"#1D9E75"}}>✓</span>{g.label}
                      <span style={{fontSize:10,color:"#aaa",marginLeft:"auto"}}>{g.period}</span>
                    </div>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{fontSize:11,color:"#aaa",textAlign:"center",lineHeight:1.6}}>
          This report covers the current week's data.<br/>
          Streaks and stars accumulate automatically as kids complete their daily rhythms.
        </div>
      </Modal>
    </Overlay>
  );
}

// ─── BROWSER REMINDER SETUP ───────────────────────────────────────────────────
function ReminderSetup({onClose}){
  const [perm,setPerm]=useState(typeof Notification!=="undefined"?Notification.permission:"unsupported");
  const [morning,setMorning]=useState("07:30");
  const [evening,setEvening]=useState("18:00");
  const [msg,setMsg]=useState("");

  async function requestPerm(){
    if(typeof Notification==="undefined"){setPerm("unsupported");return;}
    const result=await Notification.requestPermission();
    setPerm(result);
  }

  function scheduleReminders(){
    // Store reminder times — a service worker would handle these,
    // but we use a simpler setInterval-based approach for now
    try{
      localStorage.setItem("dr_reminder_morning",morning);
      localStorage.setItem("dr_reminder_evening",evening);
      setMsg("Reminders saved! Keep the app open in a browser tab for reminders to fire.");
      setTimeout(()=>setMsg(""),4000);
    }catch{}
  }

  function testNotification(){
    if(perm==="granted"){
      new Notification("The Daily Rhythm ✦",{body:"Good morning! Time to start your daily rhythm.",icon:"/favicon.svg"});
    }
  }

  return (
    <Overlay>
      <Modal title="Reminders & notifications" onClose={onClose}>
        <div style={{marginBottom:16}}>
          {perm==="unsupported"&&<div style={{background:"#FFF3CD",borderRadius:8,padding:12,fontSize:12,color:"#856404",marginBottom:12}}>
            Your browser doesn't support notifications. Try Chrome or Edge on desktop, or add this site to your Home Screen on iPhone for notification support.
          </div>}

          {perm==="default"&&<div style={{background:"#E6F1FB",borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:500,color:"#185FA5",marginBottom:4}}>Enable browser notifications</div>
            <div style={{fontSize:12,color:"#378ADD",marginBottom:10}}>Get morning reminders for the kids and alerts when tasks need approval. Works when the app is open in a browser tab.</div>
            <Btn onClick={requestPerm} text="Enable notifications" full/>
          </div>}

          {perm==="granted"&&<div style={{background:"#E1F5EE",borderRadius:8,padding:10,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <span>✓</span><span style={{fontSize:12,color:"#0F6E56",fontWeight:500}}>Notifications enabled</span>
            <button onClick={testNotification} style={{marginLeft:"auto",fontSize:11,color:"#0F6E56",background:"none",border:"0.5px solid #0F6E56",borderRadius:6,padding:"3px 10px",cursor:"pointer"}}>Send test</button>
          </div>}

          {perm==="denied"&&<div style={{background:"#FAECE7",borderRadius:8,padding:10,marginBottom:12,fontSize:12,color:"#993C1D"}}>
            Notifications blocked. Go to your browser settings → Site permissions → Notifications → allow this site.
          </div>}
        </div>

        <Field label="Morning reminder time">
          <input type="time" value={morning} onChange={e=>setMorning(e.target.value)} style={{width:"100%"}}/>
        </Field>
        <Field label="Evening check-in time">
          <input type="time" value={evening} onChange={e=>setEvening(e.target.value)} style={{width:"100%"}}/>
        </Field>
        {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
        <div style={{display:"flex",gap:8}}>
          <Btn outline onClick={onClose} text="Cancel" full/>
          <Btn onClick={scheduleReminders} text="Save reminder times" full disabled={perm!=="granted"}/>
        </div>
        <div style={{fontSize:11,color:"#aaa",marginTop:12,lineHeight:1.6}}>
          💡 For true background push notifications that work with the app closed, install the app to your home screen (iPhone: Share → Add to Home Screen, Android: browser menu → Install app).
        </div>
      </Modal>
    </Overlay>
  );
}
function PinGate({correctPin,onUnlock,onClose}){
  const [val,setVal]=useState("");const [err,setErr]=useState(false);
  function check(){if(val===correctPin)onUnlock();else{setErr(true);setVal("");setTimeout(()=>setErr(false),1200);}}
  return <Overlay><Modal title="Parent access" onClose={onClose}><div style={{textAlign:"center"}}><div style={{fontSize:12,color:"#888",marginBottom:14}}>Enter your PIN</div><input type="password" maxLength={8} value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} placeholder="••••" style={{width:"100%",textAlign:"center",fontSize:22,letterSpacing:10,marginBottom:8}} autoFocus/>{err&&<div style={{fontSize:12,color:"#E24B4A",marginBottom:8}}>Incorrect PIN</div>}<div style={{fontSize:11,color:"#ccc",marginBottom:14}}>Default: 1234</div><div style={{display:"flex",gap:8}}><Btn outline onClick={onClose} text="Cancel" full/><Btn onClick={check} text="Unlock" full/></div></div></Modal></Overlay>;
}

// ─── CALENDAR VIEW ────────────────────────────────────────────────────────────
function CalendarView({events,kids}){
  const today=new Date();
  const [view,setView]=useState("month");
  const [cursor,setCursor]=useState(new Date());

  const eventsOnDay=(date)=>events.filter(e=>e.dtstart&&sameDay(e.dtstart,date));

  // DAY VIEW
  function DayView(){
    const dayEvents=eventsOnDay(cursor);
    const hours=Array.from({length:15},(_,i)=>i+7);
    return <div>
      <div style={{fontWeight:500,fontSize:15,marginBottom:14,color:"#111"}}>
        {cursor.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
      </div>
      {dayEvents.length>0&&<div style={{marginBottom:16}}>
        <SecHead label="Today's events"/>
        {dayEvents.map((e,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,background:"#E6F1FB",marginBottom:6}}>
          <div style={{width:3,height:32,borderRadius:2,background:"#378ADD",flexShrink:0}}/>
          <div><div style={{fontSize:13,fontWeight:500,color:"#185FA5"}}>{e.summary}</div><div style={{fontSize:11,color:"#378ADD"}}>{e.allDay?"All day":`${formatTime(e.dtstart)}${e.dtend?" – "+formatTime(e.dtend):""}`}</div></div>
        </div>)}
      </div>}
      <SecHead label="Time blocks"/>
      {hours.map(h=>{
        const label=`${h>12?h-12:h}:00 ${h>=12?"PM":"AM"}`;
        const slotEvents=events.filter(e=>e.dtstart&&sameDay(e.dtstart,cursor)&&e.dtstart.getHours()===h);
        return <div key={h} style={{display:"flex",gap:10,minHeight:36,borderTop:"0.5px solid #f0f0f0",paddingTop:4,paddingBottom:4}}>
          <div style={{width:52,flexShrink:0,fontSize:10,color:"#bbb",paddingTop:2}}>{label}</div>
          <div style={{flex:1}}>
            {slotEvents.map((e,i)=><div key={i} style={{background:"#E6F1FB",borderRadius:6,padding:"3px 8px",fontSize:12,color:"#185FA5",fontWeight:500,marginBottom:2}}>{e.summary}</div>)}
          </div>
        </div>;
      })}
    </div>;
  }

  // WEEK VIEW
  function WeekView(){
    const startOfWeek=new Date(cursor);
    startOfWeek.setDate(cursor.getDate()-cursor.getDay());
    const days=Array.from({length:7},(_,i)=>{const d=new Date(startOfWeek);d.setDate(startOfWeek.getDate()+i);return d;});
    return <div>
      <div style={{display:"grid",gridTemplateColumns:"40px repeat(7,1fr)",gap:1,marginBottom:8}}>
        <div/>
        {days.map((d,i)=>{
          const isToday=sameDay(d,today);
          return <div key={i} style={{textAlign:"center",padding:"6px 2px"}}>
            <div style={{fontSize:10,color:"#aaa"}}>{DOW_SHORT[i]}</div>
            <div style={{width:26,height:26,borderRadius:"50%",background:isToday?"#534AB7":"transparent",color:isToday?"#fff":"#111",display:"flex",alignItems:"center",justifyContent:"center",margin:"2px auto 0",fontSize:13,fontWeight:isToday?500:400}}>{d.getDate()}</div>
          </div>;
        })}
      </div>
      {Array.from({length:13},(_,i)=>i+7).map(h=>{
        const label=`${h>12?h-12:h}${h>=12?"p":"a"}`;
        return <div key={h} style={{display:"grid",gridTemplateColumns:"40px repeat(7,1fr)",gap:1,minHeight:32,borderTop:"0.5px solid #f5f5f5"}}>
          <div style={{fontSize:9,color:"#ccc",paddingTop:2,textAlign:"right",paddingRight:6}}>{label}</div>
          {days.map((d,di)=>{
            const slotEv=events.filter(e=>e.dtstart&&sameDay(e.dtstart,d)&&e.dtstart.getHours()===h);
            return <div key={di} style={{background:sameDay(d,today)?"rgba(83,74,183,0.03)":"transparent",padding:"1px 2px"}}>
              {slotEv.map((e,ei)=><div key={ei} style={{background:"#378ADD",borderRadius:3,padding:"1px 4px",fontSize:10,color:"#fff",marginBottom:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.summary}</div>)}
            </div>;
          })}
        </div>;
      })}
    </div>;
  }

  // MONTH VIEW
  function MonthView(){
    const year=cursor.getFullYear(),month=cursor.getMonth();
    const firstDow=new Date(year,month,1).getDay();
    const days=daysInMonth(year,month);
    const cells=[];
    for(let i=0;i<firstDow;i++)cells.push(null);
    for(let d=1;d<=days;d++)cells.push(new Date(year,month,d));
    while(cells.length%7!==0)cells.push(null);

    return <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:4}}>
        {DOW_SHORT.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:600,color:"#aaa",padding:"4px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((d,i)=>{
          if(!d)return <div key={i}/>;
          const isToday=sameDay(d,today);
          const isCursor=sameDay(d,cursor);
          const dayEv=eventsOnDay(d);
          return <div key={i} onClick={()=>{setCursor(d);setView("day");}} style={{minHeight:56,borderRadius:7,padding:"4px 6px",background:isCursor?"#EEEDFE":isToday?"#f8f8ff":"#fafafa",border:isToday?"1.5px solid #534AB7":"0.5px solid #eee",cursor:"pointer"}}>
            <div style={{fontSize:12,fontWeight:isToday?600:400,color:isToday?"#534AB7":"#333",marginBottom:2}}>{d.getDate()}</div>
            {dayEv.slice(0,2).map((e,ei)=><div key={ei} style={{fontSize:9,background:"#378ADD",color:"#fff",borderRadius:3,padding:"1px 4px",marginBottom:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.summary}</div>)}
            {dayEv.length>2&&<div style={{fontSize:9,color:"#888"}}>+{dayEv.length-2} more</div>}
          </div>;
        })}
      </div>
    </div>;
  }

  function navLabel(){
    if(view==="day")return cursor.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    if(view==="week"){const s=new Date(cursor);s.setDate(cursor.getDate()-cursor.getDay());const e=new Date(s);e.setDate(s.getDate()+6);return `${s.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${e.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;}
    return cursor.toLocaleDateString("en-US",{month:"long",year:"numeric"});
  }
  function nav(dir){
    const d=new Date(cursor);
    if(view==="day")d.setDate(d.getDate()+dir);
    else if(view==="week")d.setDate(d.getDate()+dir*7);
    else d.setMonth(d.getMonth()+dir);
    setCursor(d);
  }

  return <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #e0e0e0",padding:18}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:3}}>
        {["day","week","month"].map(v=><div key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",borderRadius:99,fontSize:12,fontWeight:500,cursor:"pointer",background:view===v?"#534AB7":"#f0f0f0",color:view===v?"#fff":"#555",textTransform:"capitalize"}}>{v}</div>)}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
        <button onClick={()=>nav(-1)} style={{background:"none",border:"0.5px solid #ddd",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:14}}>‹</button>
        <div style={{fontSize:13,fontWeight:500,color:"#111",minWidth:160,textAlign:"center"}}>{navLabel()}</div>
        <button onClick={()=>nav(1)} style={{background:"none",border:"0.5px solid #ddd",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:14}}>›</button>
        <button onClick={()=>setCursor(new Date())} style={{fontSize:11,padding:"4px 10px",borderRadius:6,border:"0.5px solid #ddd",background:"transparent",cursor:"pointer",color:"#555"}}>Today</button>
      </div>
    </div>
    {events.length===0&&<div style={{padding:"20px 0",textAlign:"center",fontSize:13,color:"#aaa"}}>No calendar connected yet — add a calendar URL in Manage → Settings</div>}
    {view==="day"&&<DayView/>}
    {view==="week"&&<WeekView/>}
    {view==="month"&&<MonthView/>}
  </div>;
}

// ─── GIGS PANEL (full-width, below kid card) ──────────────────────────────────
function GigsPanel({gigs,kids,onAddGigToKid}){
  const [selKid,setSelKid]=useState(kids[0]?.id);
  const [open,setOpen]=useState(true);
  const available=gigs.filter(g=>g.available);
  return <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #e0e0e0",overflow:"hidden",marginTop:14}}>
    <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",cursor:"pointer",userSelect:"none",borderBottom:open?"0.5px solid #eee":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:16}}>⭐</span>
        <div>
          <div style={{fontWeight:500,fontSize:14,color:"#111"}}>Available gigs</div>
          <div style={{fontSize:11,color:"#888"}}>{available.length} gigs · earn extra screen time</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {open&&<select value={selKid} onChange={e=>{e.stopPropagation();setSelKid(e.target.value);}} onClick={e=>e.stopPropagation()} style={{fontSize:12,padding:"4px 8px",borderRadius:6}}>
          {kids.map(k=><option key={k.id} value={k.id}>{k.name}</option>)}
        </select>}
        <div style={{fontSize:16,color:"#aaa",transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>⌄</div>
      </div>
    </div>
    {open&&<div style={{padding:"14px 18px"}}>
      {available.length===0&&<div style={{fontSize:12,color:"#aaa",textAlign:"center",padding:"16px 0"}}>No gigs available — manage in the Gig library</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
        {available.map(g=>{
          const kid=kids.find(k=>k.id===selKid);
          const alreadyAdded=kid?.tasks.find(c=>c.cat==="Extra Gigs")?.items.some(t=>t.label===g.label);
          return <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,background:"#fafafa",border:"0.5px solid #eee"}}>
            <span style={{fontSize:20,flexShrink:0}}>{g.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,color:"#111",fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.label}</div>
              <div style={{fontSize:11,color:"#1D9E75",fontWeight:500}}>+{g.pts} min screen time</div>
            </div>
            <button onClick={()=>onAddGigToKid(selKid,g)} disabled={alreadyAdded} style={{fontSize:11,padding:"5px 10px",borderRadius:6,border:"none",background:alreadyAdded?"#eee":"#534AB7",color:alreadyAdded?"#aaa":"#fff",cursor:alreadyAdded?"default":"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
              {alreadyAdded?"✓ Added":"+ Add"}
            </button>
          </div>;
        })}
      </div>
    </div>}
  </div>;
}

// ─── BOOK SHELF (per-kid reading reward panel) ────────────────────────────────
function BookShelf({books,kids,activeKidId,onLogRead}){
  const [selKid,setSelKid]=useState(activeKidId);
  const [open,setOpen]=useState(true);
  const [filter,setFilter]=useState("all");
  const kid=kids.find(k=>k.id===selKid);

  // sync when parent switches kid
  useEffect(()=>setSelKid(activeKidId),[activeKidId]);

  const DIFF_LABEL={1:"Easy",2:"Medium",3:"Challenging"};
  const DIFF_COLOR={1:"#1D9E75",2:"#BA7517",3:"#D85A30"};

  const filtered = books.filter(b => {
    if(!b.available) return false;
    if(filter==="all") return true;
    if(filter==="easy") return b.difficulty===1;
    if(filter==="medium") return b.difficulty===2;
    if(filter==="hard") return b.difficulty===3;
    return true;
  });

  // how many times has this kid logged this book?
  const readCount=(bookId)=>(kid?.booksRead||{})[bookId]||0;

  return <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #e0e0e0",overflow:"hidden",marginTop:14}}>
    <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",cursor:"pointer",userSelect:"none",borderBottom:open?"0.5px solid #eee":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:16}}>📚</span>
        <div>
          <div style={{fontWeight:500,fontSize:14,color:"#111"}}>Reading rewards</div>
          <div style={{fontSize:11,color:"#888"}}>Finish a book · earn screen time</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {open&&<select value={selKid} onChange={e=>{e.stopPropagation();setSelKid(e.target.value);}} onClick={e=>e.stopPropagation()} style={{fontSize:12,padding:"4px 8px",borderRadius:6}}>
          {kids.map(k=><option key={k.id} value={k.id}>{k.name}</option>)}
        </select>}
        <div style={{fontSize:16,color:"#aaa",transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>⌄</div>
      </div>
    </div>

    {open&&<div style={{padding:"14px 18px"}}>
      {/* difficulty filter */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {[{id:"all",label:"All books"},{id:"easy",label:"Easy +10–15"},{id:"medium",label:"Medium +20–35"},{id:"hard",label:"Challenging +40–50"}].map(f=>(
          <div key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"4px 12px",borderRadius:99,fontSize:11,fontWeight:500,cursor:"pointer",background:filter===f.id?"#534AB7":"#f0f0f0",color:filter===f.id?"#fff":"#555"}}>{f.label}</div>
        ))}
      </div>

      {filtered.length===0&&<div style={{fontSize:12,color:"#aaa",textAlign:"center",padding:"16px 0"}}>No books in this category</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
        {filtered.map(b=>{
          const count=readCount(b.id);
          const pal=PALETTES[kid?.palette]||PALETTES.purple;
          return <div key={b.id} style={{borderRadius:10,border:"0.5px solid #eee",overflow:"hidden",background:"#fafafa"}}>
            <div style={{padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
                <span style={{fontSize:22,flexShrink:0}}>{b.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#111",lineHeight:1.3,marginBottom:2}}>{b.title}</div>
                  <div style={{fontSize:11,color:"#888"}}>{b.author}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:10}}>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:DIFF_COLOR[b.difficulty]+"22",color:DIFF_COLOR[b.difficulty],fontWeight:600}}>{DIFF_LABEL[b.difficulty]}</span>
                <span style={{fontSize:10,color:"#888"}}>{b.genre}</span>
                <span style={{fontSize:11,color:"#1D9E75",fontWeight:600,marginLeft:"auto"}}>+{b.pts} min</span>
              </div>
              {count>0&&<div style={{fontSize:11,color:"#888",marginBottom:8}}>Read {count}× by {kid?.name}</div>}
              <button onClick={()=>onLogRead(selKid,b)} style={{width:"100%",padding:"7px",borderRadius:7,border:"none",background:pal.mid,color:"#fff",fontSize:12,fontWeight:500,cursor:"pointer"}}>
                ✓ I finished this book! (+{b.pts} min)
              </button>
            </div>
          </div>;
        })}
      </div>

      <div style={{marginTop:14,padding:"10px 14px",background:"#f8f8ff",borderRadius:8,fontSize:12,color:"#555",lineHeight:1.6}}>
        💡 Harder books earn more screen time. Parents can add or remove books in <strong>Manage → Books</strong>.
      </div>
    </div>}
  </div>;
}

// ─── REWARDS TAB (parent catalog management) ──────────────────────────────────
function RewardsTab({rewards,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(rewards)));
  const [msg,setMsg]=useState("");
  function upd(id,f,v){setLocal(p=>p.map(r=>r.id!==id?r:{...r,[f]:v}));}
  function del(id){setLocal(p=>p.filter(r=>r.id!==id));}
  function add(){setLocal(p=>[...p,{id:uid(),label:"New reward",cost:10,icon:"🎁",available:true}]);}
  function save(){onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}
  return <div>
    <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:12,background:"#f8f8ff",borderRadius:8,padding:"10px 12px"}}>
      Kids earn 1 star for every day they hit ≥80% of their tasks. They choose a goal from this list and work toward it. Set the star cost to reflect how meaningful the reward is.
    </div>
    {local.map(r=><div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,background:"#fafafa",border:"0.5px solid #eee",marginBottom:6}}>
      <input value={r.icon} onChange={e=>upd(r.id,"icon",e.target.value)} style={{width:36,textAlign:"center",fontSize:18,padding:"4px"}}/>
      <input value={r.label} onChange={e=>upd(r.id,"label",e.target.value)} style={{flex:1,fontSize:13}}/>
      <input type="number" value={r.cost} onChange={e=>upd(r.id,"cost",parseInt(e.target.value)||1)} style={{width:52,fontSize:12,textAlign:"center"}}/>
      <span style={{fontSize:11,color:"#888",width:26,flexShrink:0}}>⭐</span>
      <div onClick={()=>upd(r.id,"available",!r.available)} style={{width:34,height:20,borderRadius:10,background:r.available?"#1D9E75":"#ccc",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:2,left:r.available?16:2,transition:"left .2s"}}/>
      </div>
      <button onClick={()=>del(r.id)} style={{background:"none",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
    </div>)}
    <button onClick={add} style={{width:"100%",padding:"9px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:12,color:"#888",cursor:"pointer",marginBottom:12}}>+ Add reward</button>
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={save} full text="Save reward catalog"/>
  </div>;
}

// ─── BOOKS TAB (parent management) ───────────────────────────────────────────
function BooksTab({books,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(books)));
  const [msg,setMsg]=useState("");
  const bp=useBreakpoint();
  const DIFF_LABEL={1:"Easy",2:"Medium",3:"Challenging"};
  function upd(id,f,v){setLocal(p=>p.map(b=>b.id!==id?b:{...b,[f]:v}));}
  function del(id){setLocal(p=>p.filter(b=>b.id!==id));}
  function add(){setLocal(p=>[...p,{id:uid(),title:"New Book",author:"",pts:20,difficulty:2,icon:"📗",ageMin:8,genre:"",available:true}]);}
  function save(){onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}
  return <div>
    <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:12,background:"#f8f8ff",borderRadius:8,padding:"10px 12px"}}>
      Books earn screen time when a child marks them finished. Set difficulty to control how much time they earn.
    </div>
    {local.map(b=><div key={b.id} style={{background:"#fafafa",borderRadius:10,padding:12,marginBottom:10,border:"0.5px solid #eee"}}>
      <div style={{display:"grid",gridTemplateColumns:bp==="phone"?"36px 1fr":"36px 1fr 1fr",gap:8,marginBottom:8}}>
        <input value={b.icon} onChange={e=>upd(b.id,"icon",e.target.value)} style={{textAlign:"center",fontSize:18,padding:"4px"}}/>
        <Field label="Title"><input value={b.title} onChange={e=>upd(b.id,"title",e.target.value)} style={{width:"100%"}}/></Field>
        {bp!=="phone"&&<Field label="Author"><input value={b.author} onChange={e=>upd(b.id,"author",e.target.value)} style={{width:"100%"}}/></Field>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:bp==="phone"?"1fr 1fr":"1fr 1fr 1fr 80px",gap:8,alignItems:"end"}}>
        <Field label="Genre"><input value={b.genre} onChange={e=>upd(b.id,"genre",e.target.value)} style={{width:"100%"}}/></Field>
        <Field label="Difficulty">
          <select value={b.difficulty} onChange={e=>upd(b.id,"difficulty",parseInt(e.target.value))} style={{width:"100%"}}>
            <option value={1}>Easy</option><option value={2}>Medium</option><option value={3}>Hard</option>
          </select>
        </Field>
        {bp!=="phone"&&<Field label="Screen time (min)"><input type="number" value={b.pts} onChange={e=>upd(b.id,"pts",parseInt(e.target.value)||0)} style={{width:"100%"}}/></Field>}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,paddingBottom:12}}>
          <div style={{fontSize:10,color:"#888"}}>Active</div>
          <div onClick={()=>upd(b.id,"available",!b.available)} style={{width:34,height:20,borderRadius:10,background:b.available?"#1D9E75":"#ccc",cursor:"pointer",position:"relative",transition:"background .2s"}}>
            <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:2,left:b.available?16:2,transition:"left .2s"}}/>
          </div>
        </div>
      </div>
      <div style={{textAlign:"right"}}>
        <button onClick={()=>del(b.id)} style={{background:"none",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:11}}>Remove</button>
      </div>
    </div>)}
    <button onClick={add} style={{width:"100%",padding:"9px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:12,color:"#888",cursor:"pointer",marginBottom:12}}>+ Add book</button>
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={save} full text="Save book library"/>
  </div>;
}

// ─── PARENT DASH ──────────────────────────────────────────────────────────────
// ─── SCHEDULE TAB (per-kid, per-day block editor) ─────────────────────────────
function ScheduleTab({kids,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(kids)));
  const [selKid,setSelKid]=useState(kids[0]?.id);
  const [selDay,setSelDay]=useState(new Date().getDay());
  const [msg,setMsg]=useState("");

  const kid=local.find(k=>k.id===selKid);
  // blocks is an object keyed by day-of-week number
  const dayBlocks=()=>(kid?.blocks?.[selDay]||[]);

  function updBlock(id,f,v){
    setLocal(p=>p.map(k=>{
      if(k.id!==selKid)return k;
      const updated=(k.blocks?.[selDay]||[]).map(b=>b.id!==id?b:{...b,[f]:v});
      return{...k,blocks:{...k.blocks,[selDay]:updated}};
    }));
  }
  function addBlock(){
    setLocal(p=>p.map(k=>{
      if(k.id!==selKid)return k;
      const existing=k.blocks?.[selDay]||[];
      return{...k,blocks:{...k.blocks,[selDay]:[...existing,{id:uid(),time:"9:00 AM",label:"New block",sub:"",done:false}]}};
    }));
  }
  function delBlock(id){
    setLocal(p=>p.map(k=>{
      if(k.id!==selKid)return k;
      return{...k,blocks:{...k.blocks,[selDay]:(k.blocks?.[selDay]||[]).filter(b=>b.id!==id)}};
    }));
  }
  function moveBlock(id,dir){
    setLocal(p=>p.map(k=>{
      if(k.id!==selKid)return k;
      const blocks=[...(k.blocks?.[selDay]||[])];
      const i=blocks.findIndex(b=>b.id===id);
      const ni=i+dir;
      if(ni<0||ni>=blocks.length)return k;
      [blocks[i],blocks[ni]]=[blocks[ni],blocks[i]];
      return{...k,blocks:{...k.blocks,[selDay]:blocks}};
    }));
  }
  function copyPresetToKid(presetBlocks){
    setLocal(p=>p.map(k=>{
      if(k.id!==selKid)return k;
      const fresh=JSON.parse(JSON.stringify(presetBlocks)).map(b=>({...b,id:uid(),done:false}));
      return{...k,blocks:{...k.blocks,[selDay]:fresh}};
    }));
  }
  function save(){onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}

  const blocks=dayBlocks();
  if(!kid)return null;

  return <div>
    <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:12,background:"#f8f8ff",borderRadius:8,padding:"10px 12px"}}>
      Edit each child's schedule independently for any day of the week. Changes here only affect this child — use Day Presets to edit the shared templates.
    </div>
    {/* Child selector */}
    <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
      {local.map(k=><div key={k.id} onClick={()=>setSelKid(k.id)} style={{padding:"5px 12px",borderRadius:99,fontSize:12,fontWeight:500,cursor:"pointer",background:k.id===selKid?PALETTES[k.palette].mid:"#f0f0f0",color:k.id===selKid?"#fff":"#555"}}>{k.name}</div>)}
    </div>
    {/* Day selector */}
    <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
      {DOW_SHORT.map((d,i)=><div key={i} onClick={()=>setSelDay(i)} style={{padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:500,cursor:"pointer",background:selDay===i?"#534AB7":"#f0f0f0",color:selDay===i?"#fff":"#555"}}>{d}</div>)}
    </div>
    <SecHead label={`${kid.name}'s ${DOW_FULL[selDay]} schedule (${blocks.length} blocks)`}/>
    {blocks.length===0&&<div style={{fontSize:12,color:"#aaa",padding:"8px 0",marginBottom:8}}>No blocks yet — add one below or copy from the day preset.</div>}
    {blocks.map((b,bi)=><div key={b.id} style={{background:"#fafafa",borderRadius:9,padding:10,marginBottom:8,border:"0.5px solid #eee"}}>
      <div style={{display:"grid",gridTemplateColumns:"90px 1fr 1fr",gap:8}}>
        <input value={b.time} onChange={e=>updBlock(b.id,"time",e.target.value)} style={{fontSize:12,padding:"5px 8px"}} placeholder="8:00 AM"/>
        <input value={b.label} onChange={e=>updBlock(b.id,"label",e.target.value)} style={{fontSize:12,padding:"5px 8px"}} placeholder="Block name"/>
        <input value={b.sub} onChange={e=>updBlock(b.id,"sub",e.target.value)} style={{fontSize:12,padding:"5px 8px"}} placeholder="Description"/>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:6,marginTop:6}}>
        <button onClick={()=>moveBlock(b.id,-1)} disabled={bi===0} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:13}}>↑</button>
        <button onClick={()=>moveBlock(b.id,1)} disabled={bi===blocks.length-1} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:13}}>↓</button>
        <button onClick={()=>delBlock(b.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#E24B4A",fontSize:11}}>Remove</button>
      </div>
    </div>)}
    <div style={{display:"flex",gap:8,marginBottom:12}}>
      <button onClick={addBlock} style={{flex:1,padding:"9px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:12,color:"#888",cursor:"pointer"}}>+ Add block</button>
    </div>
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={save} full text={`Save ${kid.name}'s schedule`}/>
  </div>;
}

function ParentDash({kids,word,settings,gigs,books,rewards,goals,presets,onSaveKids,onSaveWord,onSaveSettings,onSaveGigs,onSaveBooks,onSaveRewards,onSaveGoals,onSavePresets,onResetDay,onClose}){
  const [tab,setTab]=useState("children");
  const bp=useBreakpoint();
  const TABS=[{id:"children",label:"Children"},{id:"tasks",label:"Tasks"},{id:"schedule",label:"Schedule"},{id:"presets",label:"Day presets"},{id:"gigs",label:"Gig library"},{id:"goals",label:"Goals"},{id:"rewards",label:"Rewards"},{id:"books",label:"Books"},{id:"word",label:"Word"},{id:"calendar",label:"Calendar"},{id:"settings",label:"Settings"}];
  return <Overlay><Modal title="Manage" onClose={onClose} wide>
    <div style={{display:"flex",gap:3,marginBottom:16,overflowX:"auto",paddingBottom:4,flexWrap:bp==="desktop"?"wrap":"nowrap"}}>
      {TABS.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{padding:"6px 14px",borderRadius:99,fontSize:12,fontWeight:500,cursor:"pointer",background:tab===t.id?"#534AB7":"#f0f0f0",color:tab===t.id?"#fff":"#555",flexShrink:0,whiteSpace:"nowrap"}}>{t.label}</div>)}
    </div>
    {tab==="children"&&<ChildrenTab kids={kids} onSave={onSaveKids}/>}
    {tab==="tasks"&&<TasksTab kids={kids} onSave={onSaveKids}/>}
    {tab==="schedule"&&<ScheduleTab kids={kids} onSave={onSaveKids}/>}
    {tab==="presets"&&<PresetsTab presets={presets} kids={kids} onSave={onSavePresets}/>}
    {tab==="gigs"&&<GigsTab gigs={gigs} onSave={onSaveGigs}/>}
    {tab==="goals"&&<GoalsParentTab kids={kids} goals={goals} onSave={onSaveGoals}/>}
    {tab==="rewards"&&<RewardsTab rewards={rewards} onSave={onSaveRewards}/>}
    {tab==="books"&&<BooksTab books={books} onSave={onSaveBooks}/>}
    {tab==="word"&&<WordTab kids={kids} word={word} onSave={onSaveWord}/>}
    {tab==="calendar"&&<CalendarSettingsTab settings={settings} onSave={onSaveSettings}/>}
    {tab==="settings"&&<SettingsTab settings={settings} onSave={onSaveSettings} onResetDay={()=>{onResetDay();onClose();}}/>}
  </Modal></Overlay>;
}

// ─── PRESETS TAB ──────────────────────────────────────────────────────────────
function PresetsTab({presets,kids,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(presets)));
  const [selDay,setSelDay]=useState(new Date().getDay());
  const [msg,setMsg]=useState("");

  function updBlock(id,f,v){
    setLocal(prev=>{const n=JSON.parse(JSON.stringify(prev));if(!n[selDay])n[selDay]={label:DOW_FULL[selDay],blocks:[]};n[selDay].blocks=n[selDay].blocks.map(b=>b.id!==id?b:{...b,[f]:v});return n;});
  }
  function addBlock(){
    setLocal(prev=>{const n=JSON.parse(JSON.stringify(prev));if(!n[selDay])n[selDay]={label:DOW_FULL[selDay],blocks:[]};n[selDay].blocks.push({id:uid(),time:"9:00 AM",label:"New block",sub:"",done:false});return n;});
  }
  function delBlock(id){setLocal(prev=>{const n=JSON.parse(JSON.stringify(prev));n[selDay].blocks=n[selDay].blocks.filter(b=>b.id!==id);return n;});}
  function moveBlock(id,dir){
    setLocal(prev=>{
      const n=JSON.parse(JSON.stringify(prev));
      const blocks=n[selDay].blocks;
      const i=blocks.findIndex(b=>b.id===id);
      const ni=i+dir;
      if(ni<0||ni>=blocks.length)return prev;
      [blocks[i],blocks[ni]]=[blocks[ni],blocks[i]];
      return n;
    });
  }
  function updLabel(v){setLocal(prev=>{const n=JSON.parse(JSON.stringify(prev));n[selDay].label=v;return n;});}
  function save(){onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}

  const preset=local[selDay]||{label:DOW_FULL[selDay],blocks:[]};

  return <div>
    <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:12,background:"#f8f8ff",borderRadius:8,padding:"10px 12px"}}>
      Each day of the week has its own schedule template. When you reset the day, the matching preset loads automatically.
    </div>
    <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
      {DOW_SHORT.map((d,i)=><div key={i} onClick={()=>setSelDay(i)} style={{padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:500,cursor:"pointer",background:selDay===i?"#534AB7":"#f0f0f0",color:selDay===i?"#fff":"#555"}}>{d}</div>)}
    </div>
    <Field label="Day label">
      <input value={preset.label} onChange={e=>updLabel(e.target.value)} style={{width:"100%"}}/>
    </Field>
    <SecHead label="Time blocks for this day"/>
    {preset.blocks.map((b,bi)=><div key={b.id} style={{background:"#fafafa",borderRadius:9,padding:10,marginBottom:8,border:"0.5px solid #eee"}}>
      <div style={{display:"grid",gridTemplateColumns:"90px 1fr 1fr",gap:8}}>
        <input value={b.time} onChange={e=>updBlock(b.id,"time",e.target.value)} style={{fontSize:12,padding:"5px 8px"}} placeholder="8:00 AM"/>
        <input value={b.label} onChange={e=>updBlock(b.id,"label",e.target.value)} style={{fontSize:12,padding:"5px 8px"}} placeholder="Block name"/>
        <input value={b.sub} onChange={e=>updBlock(b.id,"sub",e.target.value)} style={{fontSize:12,padding:"5px 8px"}} placeholder="Description"/>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:6,marginTop:6}}>
        <button onClick={()=>moveBlock(b.id,-1)} disabled={bi===0} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:13}}>↑</button>
        <button onClick={()=>moveBlock(b.id,1)} disabled={bi===preset.blocks.length-1} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:13}}>↓</button>
        <button onClick={()=>delBlock(b.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#E24B4A",fontSize:11}}>Remove</button>
      </div>
    </div>)}
    <button onClick={addBlock} style={{width:"100%",padding:"9px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:12,color:"#888",cursor:"pointer",marginBottom:12}}>+ Add time block</button>
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={save} full text="Save day presets"/>
  </div>;
}

// ─── GIGS TAB ─────────────────────────────────────────────────────────────────
function GigsTab({gigs,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(gigs)));
  const [msg,setMsg]=useState("");
  function upd(id,f,v){setLocal(p=>p.map(g=>g.id!==id?g:{...g,[f]:v}));}
  function del(id){setLocal(p=>p.filter(g=>g.id!==id));}
  function add(){setLocal(p=>[...p,{id:uid(),label:"New gig",pts:15,icon:"⭐",available:true}]);}
  function save(){onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}
  return <div>
    <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:12,background:"#f8f8ff",borderRadius:8,padding:"10px 12px"}}>
      These gigs appear in the sidebar for kids to claim. Toggle availability to control what's active on any given day.
    </div>
    {local.map(g=><div key={g.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,background:"#fafafa",border:"0.5px solid #eee",marginBottom:6}}>
      <input value={g.icon} onChange={e=>upd(g.id,"icon",e.target.value)} style={{width:36,textAlign:"center",fontSize:16,padding:"4px"}}/>
      <input value={g.label} onChange={e=>upd(g.id,"label",e.target.value)} style={{flex:1,fontSize:13}}/>
      <input type="number" value={g.pts} onChange={e=>upd(g.id,"pts",parseInt(e.target.value)||0)} style={{width:52,fontSize:12,textAlign:"center"}}/>
      <span style={{fontSize:11,color:"#1D9E75",width:26,flexShrink:0}}>min</span>
      <div onClick={()=>upd(g.id,"available",!g.available)} style={{width:34,height:20,borderRadius:10,background:g.available?"#1D9E75":"#ccc",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:2,left:g.available?16:2,transition:"left .2s"}}/>
      </div>
      <button onClick={()=>del(g.id)} style={{background:"none",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
    </div>)}
    <button onClick={add} style={{width:"100%",padding:"9px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:12,color:"#888",cursor:"pointer",marginBottom:12}}>+ Add gig</button>
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={save} full text="Save gig library"/>
  </div>;
}

// ─── CALENDAR SETTINGS TAB ───────────────────────────────────────────────────
function CalendarSettingsTab({settings,onSave}){
  const [urls,setUrls]=useState(settings.calendarUrls||[]);
  const [newUrl,setNewUrl]=useState("");
  const [newName,setNewName]=useState("");
  const [msg,setMsg]=useState("");

  function add(){
    if(!newUrl.trim())return;
    setUrls(p=>[...p,{id:uid(),name:newName||"My Calendar",url:newUrl.trim()}]);
    setNewUrl("");setNewName("");
  }
  function remove(id){setUrls(p=>p.filter(u=>u.id!==id));}
  function save(){onSave({...settings,calendarUrls:urls});setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}

  return <div>
    <div style={{background:"#EEEDFE",borderRadius:10,padding:14,marginBottom:16}}>
      <div style={{fontWeight:500,fontSize:13,color:"#3C3489",marginBottom:8}}>How to get your calendar URL</div>
      <div style={{fontSize:12,color:"#534AB7",lineHeight:1.7}}>
        <div style={{marginBottom:6}}><strong>Google Calendar:</strong> Open Google Calendar → click ⋮ next to a calendar → Settings → scroll to "Integrate calendar" → copy "Public address in iCal format"</div>
        <div style={{marginBottom:6}}><strong>Apple iCloud:</strong> Open iCloud.com/calendar → click share icon next to a calendar → check "Public Calendar" → copy the link</div>
        <div><strong>Outlook:</strong> Settings → View all Outlook settings → Calendar → Shared calendars → Publish a calendar → copy ICS link</div>
      </div>
    </div>

    <SecHead label="Connected calendars"/>
    {urls.length===0&&<div style={{fontSize:12,color:"#aaa",padding:"10px 0",marginBottom:10}}>No calendars connected yet</div>}
    {urls.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,background:"#fafafa",border:"0.5px solid #eee",marginBottom:6}}>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:500,color:"#111"}}>{u.name}</div>
        <div style={{fontSize:10,color:"#aaa",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:320}}>{u.url}</div>
      </div>
      <button onClick={()=>remove(u.id)} style={{background:"none",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:12}}>Remove</button>
    </div>)}

    <div style={{background:"#fafafa",borderRadius:10,padding:14,border:"0.5px solid #eee",marginBottom:12}}>
      <SecHead label="Add a calendar"/>
      <Field label="Calendar name (e.g. Family Calendar)">
        <input value={newName} onChange={e=>setNewName(e.target.value)} style={{width:"100%"}} placeholder="Family Calendar"/>
      </Field>
      <Field label="iCal / ICS URL">
        <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} style={{width:"100%"}} placeholder="https://calendar.google.com/calendar/ical/..."/>
      </Field>
      <Btn onClick={add} text="Add calendar" full/>
    </div>

    <div style={{fontSize:11,color:"#aaa",marginBottom:12,lineHeight:1.6}}>
      Note: Calendar events are fetched fresh each time the app loads. If events don't appear, make sure the calendar is set to public in your calendar app.
    </div>
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={save} full text="Save calendar settings"/>
  </div>;
}

// ─── CHILDREN TAB ─────────────────────────────────────────────────────────────
function ChildrenTab({kids,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(kids)));
  const [adding,setAdding]=useState(false);
  const [nk,setNk]=useState({name:"",age:"",initials:"",palette:"blue"});
  const [msg,setMsg]=useState("");
  function upd(id,f,v){setLocal(p=>p.map(k=>k.id!==id?k:{...k,[f]:v}));}
  function saveAll(){onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}
  function addKid(){
    if(!nk.name.trim())return;
    const id=nk.name.toLowerCase().replace(/\s+/g,"-")+uid();
    const kid=makeKid(id,nk.name,parseInt(nk.age)||8,nk.initials||nk.name.slice(0,2).toUpperCase(),nk.palette,[
      {id:uid(),cat:"Morning Routine",icon:"☀️",items:[]},
      {id:uid(),cat:"Chores",icon:"🏠",items:[]},
      {id:uid(),cat:"Extra Gigs",icon:"⭐",items:[]},
    ]);
    const u=[...local,kid];setLocal(u);onSave(u);setAdding(false);setNk({name:"",age:"",initials:"",palette:"blue"});
  }
  function removeKid(id){if(!window.confirm("Remove this child?"))return;const u=local.filter(k=>k.id!==id);setLocal(u);onSave(u);}
  return <div>
    {local.map(kid=><div key={kid.id} style={{background:"#fafafa",borderRadius:10,padding:14,marginBottom:12,border:"0.5px solid #eee"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <Avatar kid={kid} size={34}/><div style={{fontWeight:500,fontSize:14,flex:1}}>{kid.name}</div>
        <button onClick={()=>removeKid(kid.id)} style={{background:"none",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:12}}>Remove</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Name"><input value={kid.name} onChange={e=>upd(kid.id,"name",e.target.value)} style={{width:"100%"}}/></Field>
        <Field label="Age"><input type="number" value={kid.age} onChange={e=>upd(kid.id,"age",parseInt(e.target.value)||0)} style={{width:"100%"}}/></Field>
        <Field label="Initials"><input value={kid.initials} maxLength={2} onChange={e=>upd(kid.id,"initials",e.target.value.toUpperCase())} style={{width:"100%"}}/></Field>
        <Field label="Color"><select value={kid.palette} onChange={e=>upd(kid.id,"palette",e.target.value)} style={{width:"100%"}}>{PALETTE_NAMES.map(p=><option key={p} value={p}>{p}</option>)}</select></Field>
      </div>
    </div>)}
    {adding?<div style={{background:"#f0f0ff",borderRadius:10,padding:14,marginBottom:12,border:"0.5px solid #CECBF6"}}>
      <div style={{fontWeight:500,fontSize:13,marginBottom:10}}>New child</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Name"><input value={nk.name} onChange={e=>setNk(p=>({...p,name:e.target.value}))} style={{width:"100%"}} placeholder="Jordan"/></Field>
        <Field label="Age"><input type="number" value={nk.age} onChange={e=>setNk(p=>({...p,age:e.target.value}))} style={{width:"100%"}} placeholder="8"/></Field>
        <Field label="Initials"><input value={nk.initials} maxLength={2} onChange={e=>setNk(p=>({...p,initials:e.target.value.toUpperCase()}))} style={{width:"100%"}} placeholder="JO"/></Field>
        <Field label="Color"><select value={nk.palette} onChange={e=>setNk(p=>({...p,palette:e.target.value}))} style={{width:"100%"}}>{PALETTE_NAMES.map(p=><option key={p} value={p}>{p}</option>)}</select></Field>
      </div>
      <div style={{display:"flex",gap:8,marginTop:8}}><Btn outline onClick={()=>setAdding(false)} text="Cancel" full/><Btn onClick={addKid} text="Add child" full/></div>
    </div>:<button onClick={()=>setAdding(true)} style={{width:"100%",padding:"10px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:13,color:"#888",cursor:"pointer",marginBottom:12}}>+ Add another child</button>}
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={saveAll} full text="Save changes"/>
  </div>;
}

// ─── TASKS TAB ────────────────────────────────────────────────────────────────
function TasksTab({kids,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(kids)));
  const [selKid,setSelKid]=useState(kids[0]?.id);
  const [editId,setEditId]=useState(null);
  const [addingCat,setAddingCat]=useState(false);
  const [newCat,setNewCat]=useState("");
  const [msg,setMsg]=useState("");
  const kid=local.find(k=>k.id===selKid);
  const pal=PALETTES[kid?.palette]||PALETTES.purple;
  function save(){onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}
  function updTask(cId,tId,f,v){setLocal(p=>p.map(k=>k.id!==selKid?k:{...k,tasks:k.tasks.map(c=>c.id!==cId?c:{...c,items:c.items.map(t=>t.id!==tId?t:{...t,[f]:v})})}));}
  function delTask(cId,tId){setLocal(p=>p.map(k=>k.id!==selKid?k:{...k,tasks:k.tasks.map(c=>c.id!==cId?c:{...c,items:c.items.filter(t=>t.id!==tId)})}));}
  function addTask(cId){const t={id:uid(),label:"New task",done:false,pts:10,gig:false,days:[0,1,2,3,4,5,6]};setLocal(p=>p.map(k=>k.id!==selKid?k:{...k,tasks:k.tasks.map(c=>c.id!==cId?c:{...c,items:[...c.items,t]})}));setEditId(t.id);}
  function updCatName(cId,v){setLocal(p=>p.map(k=>k.id!==selKid?k:{...k,tasks:k.tasks.map(c=>c.id!==cId?c:{...c,cat:v})}));}
  function delCat(cId){if(!window.confirm("Delete category?"))return;setLocal(p=>p.map(k=>k.id!==selKid?k:{...k,tasks:k.tasks.filter(c=>c.id!==cId)}));}
  function addCat(){if(!newCat.trim())return;const c={id:uid(),cat:newCat,icon:"📌",items:[]};setLocal(p=>p.map(k=>k.id!==selKid?k:{...k,tasks:[...k.tasks,c]}));setAddingCat(false);setNewCat("");}
  if(!kid)return null;
  return <div>
    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
      {local.map(k=><div key={k.id} onClick={()=>setSelKid(k.id)} style={{padding:"5px 12px",borderRadius:99,fontSize:12,fontWeight:500,cursor:"pointer",background:k.id===selKid?PALETTES[k.palette].mid:"#f0f0f0",color:k.id===selKid?"#fff":"#555"}}>{k.name}</div>)}
    </div>
    {kid.tasks.map(cat=><div key={cat.id} style={{marginBottom:14,background:"#fafafa",borderRadius:10,padding:12,border:"0.5px solid #eee"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span>{cat.icon}</span>
        <input value={cat.cat} onChange={e=>updCatName(cat.id,e.target.value)} style={{flex:1,fontWeight:500,fontSize:13,border:"none",background:"transparent",padding:0}}/>
        <button onClick={()=>delCat(cat.id)} style={{background:"none",border:"none",color:"#E24B4A",cursor:"pointer",fontSize:11}}>Delete</button>
      </div>
      {cat.items.map((t,ti)=><div key={t.id} style={{background:"#fff",borderRadius:8,padding:10,marginBottom:6,border:"0.5px solid #e8e8e8"}}>
        {editId===t.id?<div>
          <Field label="Task name"><input value={t.label} onChange={e=>updTask(cat.id,t.id,"label",e.target.value)} style={{width:"100%"}}/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <Field label="Screen time (min)"><input type="number" value={t.pts} onChange={e=>updTask(cat.id,t.id,"pts",parseInt(e.target.value)||0)} style={{width:"100%"}}/></Field>
            <Field label="Type"><select value={t.gig?"gig":"core"} onChange={e=>updTask(cat.id,t.id,"gig",e.target.value==="gig")} style={{width:"100%"}}><option value="core">Core task</option><option value="gig">Extra gig</option></select></Field>
            <Field label="Approval required">
              <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:6}}>
                <div onClick={()=>updTask(cat.id,t.id,"needsApproval",!t.needsApproval)} style={{width:34,height:20,borderRadius:10,background:t.needsApproval?"#534AB7":"#ccc",cursor:"pointer",position:"relative",transition:"background .2s"}}>
                  <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:2,left:t.needsApproval?16:2,transition:"left .2s"}}/>
                </div>
                <span style={{fontSize:12,color:"#555"}}>Parent must approve when done</span>
              </div>
            </Field>
          </div>
          <Field label="Active days">
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {DOW_SHORT.map((d,i)=><div key={i} onClick={()=>{const days=t.days.includes(i)?t.days.filter(x=>x!==i):[...t.days,i].sort();updTask(cat.id,t.id,"days",days);}} style={{padding:"4px 8px",borderRadius:6,fontSize:11,cursor:"pointer",fontWeight:500,background:t.days.includes(i)?pal.mid:"#eee",color:t.days.includes(i)?"#fff":"#555"}}>{d}</div>)}
            </div>
          </Field>
          <Btn onClick={()=>setEditId(null)} text="Done" full/>
        </div>:<div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{flex:1,fontSize:13}}>{t.label}</div>
          {t.pts>0&&<span style={{fontSize:11,color:"#1D9E75",fontWeight:500}}>+{t.pts} min</span>}
          {t.gig&&<span style={{fontSize:10,background:"#EAF3DE",color:"#27500A",padding:"2px 7px",borderRadius:99}}>gig</span>}
          <button onClick={()=>setEditId(t.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#534AB7",fontSize:11}}>Edit</button>
          <button onClick={()=>delTask(cat.id,t.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#E24B4A",fontSize:11}}>✕</button>
        </div>}
      </div>)}
      <button onClick={()=>addTask(cat.id)} style={{width:"100%",padding:"7px",borderRadius:7,border:"1.5px dashed #ddd",background:"transparent",fontSize:12,color:"#888",cursor:"pointer"}}>+ Add task</button>
    </div>)}
    {addingCat?<div style={{background:"#f0f0ff",borderRadius:10,padding:12,marginBottom:12,border:"0.5px solid #CECBF6"}}>
      <Field label="Category name"><input value={newCat} onChange={e=>setNewCat(e.target.value)} style={{width:"100%"}} placeholder="e.g. Quiet Time" autoFocus/></Field>
      <div style={{display:"flex",gap:8}}><Btn outline onClick={()=>setAddingCat(false)} text="Cancel" full/><Btn onClick={addCat} text="Add" full/></div>
    </div>:<button onClick={()=>setAddingCat(true)} style={{width:"100%",padding:"9px",borderRadius:8,border:"1.5px dashed #ccc",background:"transparent",fontSize:12,color:"#888",cursor:"pointer",marginBottom:12}}>+ Add category</button>}
    {msg&&<div style={{fontSize:12,color:"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={save} full text="Save tasks"/>
  </div>;
}

// ─── WORD TAB ─────────────────────────────────────────────────────────────────
function WordTab({kids,word,onSave}){
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(word)));
  const [generating,setGenerating]=useState(false);
  const [msg,setMsg]=useState("");
  function updField(kidId,f,v){setLocal(p=>({...p,[kidId]:{...p[kidId],[f]:v}}));}
  async function generate(){
    if(!local.theme.trim())return;setGenerating(true);
    try{
      const kidList=kids.map(k=>`${k.name} age ${k.age}`).join(", ");
      const fields=kids.map(k=>`"${k.id}":{"verse":"...","ref":"Book Ch:V","reflect":"2-3 sentence age-appropriate reflection","quote":"wisdom quote","attribution":"name"}`).join(",\n");
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1400,messages:[{role:"user",content:`Generate a weekly Christian family devotional. Kids: ${kidList}. Theme: "${local.theme}". Tailor to each age — oldest gets identity/character depth, youngest gets warm God-loves-me language. ONLY return valid JSON, no markdown:\n{"theme":"${local.theme}",\n${fields}}`}]})});
      const data=await res.json();
      const text=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      const next={theme:parsed.theme};
      kids.forEach(k=>{if(parsed[k.id])next[k.id]={...parsed[k.id],verseRead:false};});
      setLocal(next);onSave(next);setMsg("Generated!");
    }catch{setMsg("Error — check connection and try again");}
    setGenerating(false);setTimeout(()=>setMsg(""),3000);
  }
  return <div>
    <Field label="Weekly theme">
      <div style={{display:"flex",gap:8}}>
        <input value={local.theme} onChange={e=>setLocal(p=>({...p,theme:e.target.value}))} style={{flex:1}} placeholder="e.g. courage, humility, gratitude"/>
        <Btn onClick={generate} disabled={generating} text={generating?"Generating…":"AI generate ↗"}/>
      </div>
    </Field>
    {kids.map(kid=>{const w=local[kid.id];if(!w)return null;const pal=PALETTES[kid.palette];
      return <div key={kid.id} style={{background:"#fafafa",borderRadius:10,padding:14,marginBottom:14,border:`1.5px solid ${pal.light}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Avatar kid={kid} size={26}/><div style={{fontWeight:500,fontSize:13}}>{kid.name}</div></div>
        <Field label="Verse"><textarea value={w.verse} onChange={e=>updField(kid.id,"verse",e.target.value)} style={{width:"100%",height:56,resize:"vertical",fontSize:13}}/></Field>
        <Field label="Reference"><input value={w.ref} onChange={e=>updField(kid.id,"ref",e.target.value)} style={{width:"100%"}}/></Field>
        <Field label="Reflection"><textarea value={w.reflect} onChange={e=>updField(kid.id,"reflect",e.target.value)} style={{width:"100%",height:56,resize:"vertical",fontSize:13}}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Quote"><textarea value={w.quote} onChange={e=>updField(kid.id,"quote",e.target.value)} style={{width:"100%",height:48,resize:"vertical",fontSize:13}}/></Field>
          <Field label="Attribution"><input value={w.attribution} onChange={e=>updField(kid.id,"attribution",e.target.value)} style={{width:"100%"}}/></Field>
        </div>
      </div>;
    })}
    {msg&&<div style={{fontSize:12,color:msg.includes("Error")?"#E24B4A":"#1D9E75",marginBottom:8}}>{msg}</div>}
    <Btn onClick={()=>{onSave(local);setMsg("Saved!");setTimeout(()=>setMsg(""),2000);}} full text="Save word content"/>
  </div>;
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab({settings,onSave,onResetDay}){
  const [pin,setPin]=useState(settings.pin);
  const [confirm,setConfirm]=useState("");
  const [msg,setMsg]=useState("");
  function savePin(){if(pin.length<4){setMsg("PIN must be at least 4 digits");return;}if(pin!==confirm){setMsg("PINs don't match");return;}onSave({...settings,pin});setMsg("PIN updated!");setConfirm("");setTimeout(()=>setMsg(""),2000);}
  return <div>
    <SecHead label="Parent PIN"/>
    <div style={{background:"#fafafa",borderRadius:10,padding:14,marginBottom:16,border:"0.5px solid #eee"}}>
      <Field label="New PIN"><input type="password" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,""))} maxLength={8} style={{width:"100%"}}/></Field>
      <Field label="Confirm"><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value.replace(/\D/g,""))} maxLength={8} style={{width:"100%"}}/></Field>
      {msg&&<div style={{fontSize:12,color:msg.includes("!")||msg.includes("updated")?"#1D9E75":"#E24B4A",marginBottom:8}}>{msg}</div>}
      <Btn onClick={savePin} full text="Update PIN"/>
    </div>
    <SecHead label="Daily reset"/>
    <div style={{background:"#fafafa",borderRadius:10,padding:14,border:"0.5px solid #eee",marginBottom:16}}>
      <div style={{fontSize:13,color:"#555",lineHeight:1.6,marginBottom:12}}>Clears all checkboxes. Today's day-of-week preset loads automatically.</div>
      <Btn danger onClick={onResetDay} full text="Reset today for all children"/>
    </div>
  </div>;
}

// ─── KID CARD ─────────────────────────────────────────────────────────────────
function KidCard({kid,word,streak,rewards,goals,onToggleTask,onToggleBlock,onToggleVerse,onClaimGoal,onRedeemGoal,onRequestTaskApproval,onAddPersonalGoal,onToggleGoal,streaks}){
  const [tab,setTab]=useState("word");
  const bp=useBreakpoint();
  const pal=PALETTES[kid.palette];
  const s=getStats(kid);
  const w=word[kid.id]||{};
  const dow=new Date().getDay();
  const blocks=kid.blocks?.[dow]||[];
  const pendingApproval=kid.tasks.flatMap(c=>c.items).filter(t=>t.pendingApproval).length;

  return <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #e0e0e0",overflow:"hidden"}}>
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:"0.5px solid #eee"}}>
      <Avatar kid={kid} size={bp==="phone"?32:38}/>
      <div style={{flex:1}}><div style={{fontWeight:500,fontSize:bp==="phone"?14:15,color:"#111"}}>{kid.name}'s day</div><div style={{fontSize:12,color:"#888"}}>{s.pct}% done · {s.pts} min earned</div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:500,color:pal.mid}}>{s.pts}</div><div style={{fontSize:10,color:"#aaa"}}>min</div></div>
    </div>
    <div style={{display:"flex",borderBottom:"0.5px solid #eee",overflowX:"auto"}}>
      {[{id:"word",label:"Word"},{id:"timeline",label:"Schedule"},{id:"tasks",label:`Tasks${pendingApproval>0?` (${pendingApproval}⏳)`:""}`},{id:"goals",label:"Goals"},{id:"rewards",label:"Rewards"}].map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:bp==="phone"?"14px 16px":"10px 10px",fontSize:12,fontWeight:500,textAlign:"center",cursor:"pointer",color:tab===t.id?pal.mid:"#aaa",borderBottom:tab===t.id?`2px solid ${pal.mid}`:"2px solid transparent",transition:"all .15s",whiteSpace:"nowrap",touchAction:"manipulation"}}>{t.label}</div>)}
    </div>
    <div style={{padding:18}}>
      {tab==="word"&&<div>
        <div style={{background:pal.bg,borderRadius:10,padding:"16px 18px",marginBottom:12}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",background:pal.light,color:pal.text,padding:"3px 10px",borderRadius:99,marginBottom:10}}>✦ {word.theme}</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:15,lineHeight:1.65,color:pal.text,marginBottom:6}}>"{w.verse}"</div>
          <div style={{fontSize:11,fontWeight:600,color:pal.dark}}>{w.ref}</div>
          <div style={{fontSize:12,color:pal.dark,marginTop:10,paddingTop:10,borderTop:`0.5px solid ${pal.light}`,lineHeight:1.6}}>{w.reflect}</div>
        </div>
        <div style={{borderLeft:"2px solid #e0e0e0",paddingLeft:14,marginBottom:14}}>
          <div style={{fontSize:13,color:"#555",fontStyle:"italic",lineHeight:1.6,marginBottom:4}}>"{w.quote}"</div>
          <div style={{fontSize:11,color:"#999"}}>— {w.attribution}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#f7f7f7",borderRadius:8}}>
          <Chk checked={w.verseRead} color={pal.mid} onClick={()=>onToggleVerse(kid.id)} size={20}/>
          <span style={{fontSize:13,color:"#666"}}>I read my verse today</span>
        </div>
      </div>}

      {tab==="timeline"&&<div>
        <SecHead label={`${DOW_FULL[dow]} schedule`}/>
        {blocks.length===0&&<div style={{fontSize:13,color:"#aaa",textAlign:"center",padding:"20px 0"}}>No schedule set for today — add blocks in Manage → Day presets</div>}
        {blocks.map((b)=><div key={b.id} onClick={()=>onToggleBlock(kid.id,dow,b.id)} style={{display:"flex",gap:10,alignItems:"stretch",marginBottom:6,cursor:"pointer"}}>
          <div style={{fontSize:10,color:"#aaa",width:52,flexShrink:0,paddingTop:6}}>{b.time}</div>
          <div style={{flex:1,borderRadius:8,padding:"8px 12px",background:b.done?pal.mid:pal.bg,transition:"background .2s"}}>
            <div style={{fontSize:13,fontWeight:500,color:b.done?"#fff":pal.dark}}>{b.done?"✓ ":""}{b.label}</div>
            {b.sub&&<div style={{fontSize:11,color:b.done?"rgba(255,255,255,0.75)":pal.mid,marginTop:2}}>{b.sub}</div>}
          </div>
        </div>)}
      </div>}

      {tab==="tasks"&&<div>
        <CompletionBadge kid={kid} pct={s.pct}/>
        {kid.tasks.map(cat=>{
          const visible=cat.items.filter(t=>t.days.includes(dow));
          if(!visible.length)return null;
          return <div key={cat.id} style={{marginBottom:14}}>
            <SecHead label={`${cat.icon} ${cat.cat}`}/>
            {visible.map(t=>{
              const needsApproval=t.needsApproval;
              const isPending=t.pendingApproval&&!t.done;
              const isApproved=t.done;
              return (
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:bp==="phone"?"12px 8px":"8px 8px",borderRadius:8,cursor:isPending?"default":"pointer",opacity:isApproved?.55:1,touchAction:"manipulation"}}
                  onClick={()=>!isPending&&!isApproved&&(needsApproval?onRequestTaskApproval(kid.id,t.id):onToggleTask(kid.id,t.id))}>
                  {isPending?(
                    <div style={{width:20,height:20,borderRadius:6,background:"#FAEEDA",border:"1.5px solid #BA7517",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>⏳</div>
                  ):(
                    <Chk checked={isApproved} color={pal.mid} size={20}/>
                  )}
                  <span style={{flex:1,fontSize:13,color:"#111",textDecoration:isApproved?"line-through":"none"}}>{t.label}</span>
                  {needsApproval&&!isApproved&&!isPending&&<span style={{fontSize:9,color:"#BA7517",background:"#FAEEDA",padding:"2px 6px",borderRadius:99}}>needs approval</span>}
                  {isPending&&<span style={{fontSize:9,color:"#BA7517",background:"#FAEEDA",padding:"2px 6px",borderRadius:99}}>waiting…</span>}
                  {t.pts>0&&<span style={{fontSize:11,color:"#1D9E75",fontWeight:500}}>+{t.pts} min</span>}
                  {t.gig&&<span style={{fontSize:10,background:"#EAF3DE",color:"#27500A",padding:"2px 8px",borderRadius:99}}>gig</span>}
                </div>
              );
            })}
          </div>;
        })}
        <div style={{display:"flex",alignItems:"center",gap:12,background:"#f7f7f7",borderRadius:8,padding:"10px 14px",marginTop:8}}>
          <span style={{fontSize:18}}>📺</span>
          <div style={{flex:1}}><div style={{fontSize:12,color:"#888",marginBottom:4}}>Screen time earned</div><Bar pct={Math.min(100,Math.round(s.pts/120*100))} color={pal.mid} h={6}/></div>
          <div><span style={{fontSize:20,fontWeight:500}}>{s.pts}</span><span style={{fontSize:11,color:"#888"}}> min</span></div>
        </div>
      </div>}

      {tab==="goals"&&<GoalsPanel kid={kid} goals={goals} onToggleGoal={onToggleGoal} onAddPersonalGoal={onAddPersonalGoal}/>}

      {tab==="rewards"&&<div>
        <StreakBadge kid={kid} streak={streak}/>
        <RewardGoalTracker kid={kid} rewards={rewards} streaks={streaks} onClaimGoal={onClaimGoal} onRedeemGoal={onRedeemGoal}/>
      </div>}
    </div>
  </div>;
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const bp=useBreakpoint();
  const [kids,setKids]=useState(DEFAULT_KIDS);
  const [word,setWord]=useState(DEFAULT_WORD);
  const [settings,setSettings]=useState(DEFAULT_SETTINGS);
  const [gigs,setGigs]=useState(DEFAULT_GIGS);
  const [books,setBooks]=useState(DEFAULT_BOOKS);
  const [rewards,setRewards]=useState(DEFAULT_REWARDS);
  const [goals,setGoals]=useState(DEFAULT_GOALS);
  const [presets,setPresets]=useState(DEFAULT_PRESETS);
  const [streaks,setStreaks]=useState({});
  const [notifications,setNotifications]=useState([]);
  const [events,setEvents]=useState([]);
  const [activeKid,setActiveKid]=useState("jaxson");
  const [mainView,setMainView]=useState("today");
  const [modal,setModal]=useState(null); // null|"pin"|"parent"|"report"|"reminders"
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{(async()=>{
    const [k,w,s,g,p,b,r,st,gl,nt]=await Promise.all([
      load("dr_kids_"+todayKey()),load("dr_word"),load("dr_settings"),load("dr_gigs"),
      load("dr_presets"),load("dr_books"),load("dr_rewards"),load("dr_streaks"),
      load("dr_goals"),load("dr_notifications")
    ]);
    if(k)setKids(k);if(w)setWord(w);if(s)setSettings(s);if(g)setGigs(g);
    if(p)setPresets(p);if(b)setBooks(b);if(r)setRewards(r);if(st)setStreaks(st);
    if(gl)setGoals(gl);if(nt)setNotifications(nt);
    setLoaded(true);
  })();},[]);

  useEffect(()=>{
    if(!settings.calendarUrls?.length)return;
    (async()=>{
      const allEvents=[];
      for(const cal of settings.calendarUrls){
        try{
          const proxyUrl=`https://api.allorigins.win/get?url=${encodeURIComponent(cal.url)}`;
          const res=await fetch(proxyUrl);const data=await res.json();
          allEvents.push(...parseICS(data.contents||""));
        }catch(e){console.warn("Calendar fetch failed:",cal.name);}
      }
      setEvents(allEvents);
    })();
  },[settings.calendarUrls]);

  useEffect(()=>{if(loaded)save("dr_kids_"+todayKey(),kids);},[kids,loaded]);
  useEffect(()=>{if(loaded)save("dr_word",word);},[word,loaded]);
  useEffect(()=>{if(loaded)save("dr_settings",settings);},[settings,loaded]);
  useEffect(()=>{if(loaded)save("dr_gigs",gigs);},[gigs,loaded]);
  useEffect(()=>{if(loaded)save("dr_presets",presets);},[presets,loaded]);
  useEffect(()=>{if(loaded)save("dr_books",books);},[books,loaded]);
  useEffect(()=>{if(loaded)save("dr_rewards",rewards);},[rewards,loaded]);
  useEffect(()=>{if(loaded)save("dr_streaks",streaks);},[streaks,loaded]);
  useEffect(()=>{if(loaded)save("dr_goals",goals);},[goals,loaded]);
  useEffect(()=>{if(loaded)save("dr_notifications",notifications);},[notifications,loaded]);

  // Auto-update streaks when tasks change
  useEffect(()=>{
    if(!loaded)return;
    kids.forEach(k=>{
      const s=getStats(k);
      if(s.pct>=80){
        setStreaks(prev=>{
          const cur=prev[k.id]||makeStreak();
          const updated=updateStreak(cur,s.pct);
          if(updated.lastCompletedDate===todayKey()&&cur.lastCompletedDate!==todayKey()){
            updated.totalStars=(cur.totalStars||0)+1;
          }
          if(JSON.stringify(updated)===JSON.stringify(cur))return prev;
          return{...prev,[k.id]:updated};
        });
      }
    });
  },[kids,loaded]);

  // ── task handlers ──
  function toggleTask(kidId,tId){setKids(p=>p.map(k=>k.id!==kidId?k:{...k,tasks:k.tasks.map(c=>({...c,items:c.items.map(t=>t.id!==tId?t:{...t,done:!t.done})}))}));}
  function toggleBlock(kidId,dow,bId){setKids(p=>p.map(k=>k.id!==kidId?k:{...k,blocks:{...k.blocks,[dow]:(k.blocks?.[dow]||[]).map(b=>b.id!==bId?b:{...b,done:!b.done})}}));}
  function toggleVerse(kidId){setWord(p=>({...p,[kidId]:{...p[kidId],verseRead:!p[kidId].verseRead}}));}

  // ── approval system ──
  function requestTaskApproval(kidId,taskId){
    // Mark task as pending
    setKids(p=>p.map(k=>k.id!==kidId?k:{...k,tasks:k.tasks.map(c=>({...c,items:c.items.map(t=>t.id!==taskId?t:{...t,pendingApproval:true})}))}));
    const kid=kids.find(k=>k.id===kidId);
    const task=kid?.tasks.flatMap(c=>c.items).find(t=>t.id===taskId);
    const n=makeNotification("task_approval",`${kid?.name} completed a task`,`"${task?.label}" needs your approval`,kidId,{taskId});
    setNotifications(p=>[n,...p.slice(0,49)]);
    if(typeof Notification!=="undefined"&&Notification.permission==="granted"){
      new Notification("The Daily Rhythm ✦",{body:`${kid?.name} says they finished: ${task?.label}`,icon:"/favicon.svg"});
    }
  }

  function approveTask(kidId,taskId,notifId){
    setKids(p=>p.map(k=>k.id!==kidId?k:{...k,tasks:k.tasks.map(c=>({...c,items:c.items.map(t=>t.id!==taskId?t:{...t,done:true,pendingApproval:false})}))}));
    setNotifications(p=>p.map(n=>n.id!==notifId?n:{...n,resolved:true,read:true}));
  }

  function denyTask(kidId,taskId,notifId){
    // Clear pendingApproval so kid can re-submit or task can be toggled normally
    setKids(p=>p.map(k=>k.id!==kidId?k:{...k,tasks:k.tasks.map(c=>({...c,items:c.items.map(t=>t.id!==taskId?t:{...t,pendingApproval:false})}))}));
    setNotifications(p=>p.map(n=>n.id!==notifId?n:{...n,resolved:true,read:true,body:n.body+" ✗ Not yet"}));
  }

  // ── reward cash-in ──
  function requestRewardCashIn(kidId,rewardId){
    const kid=kids.find(k=>k.id===kidId);
    const reward=rewards.find(r=>r.id===rewardId);
    const n=makeNotification("reward_request",`${kid?.name} wants to cash in a reward`,`"${reward?.label}" — ${reward?.cost} stars`,kidId,{rewardId});
    setNotifications(p=>[n,...p.slice(0,49)]);
    if(typeof Notification!=="undefined"&&Notification.permission==="granted"){
      new Notification("The Daily Rhythm ✦",{body:`${kid?.name} is requesting: ${reward?.label}`,icon:"/favicon.svg"});
    }
  }

  function approveReward(kidId,rewardId,notifId){
    const reward=rewards.find(r=>r.id===rewardId); // capture before callbacks
    setKids(p=>p.map(k=>k.id!==kidId?k:{...k,activeGoal:null}));
    setStreaks(p=>{
      const cur=p[kidId]||makeStreak();
      const deducted=Math.max(0,(cur.totalStars||0)-(reward?.cost||0));
      return{...p,[kidId]:{...cur,totalStars:deducted}};
    });
    setNotifications(p=>p.map(n=>n.id!==notifId?n:{...n,resolved:true,read:true,body:n.body+" ✓ Approved"}));
  }

  function denyReward(kidId,rewardId,notifId){
    setNotifications(p=>p.map(n=>n.id!==notifId?n:{...n,resolved:true,read:true,body:n.body+" ✗ Denied"}));
  }

  function markNotifRead(id,resolve=false){
    setNotifications(p=>p.map(n=>n.id!==id?n:{...n,read:true,...(resolve?{resolved:true}:{})}));
  }

  // ── goals ──
  function toggleGoal(goalId,kidId){
    setGoals(p=>p.map(g=>{
      if(g.id!==goalId)return g;
      const nowDone=!g.done;
      if(nowDone&&kidId){
        const kid=kids.find(k=>k.id===kidId);
        const n=makeNotification("goal_complete",`${kid?.name} completed a goal`,`"${g.label}"`,kidId,{goalId});
        setNotifications(prev=>[n,...prev.slice(0,49)]);
      }
      return{...g,done:nowDone};
    }));
  }
  function addPersonalGoal(goal){setGoals(p=>[...p,{...goal,id:uid(),done:false,createdDate:todayKey()}]);}

  // ── books ──
  function logRead(kidId,book){
    setKids(p=>p.map(k=>{
      if(k.id!==kidId)return k;
      const prev=(k.booksRead||{});
      const gigCatIdx=k.tasks.findIndex(c=>c.cat==="Extra Gigs");
      const readTask={id:uid(),label:`Finished: ${book.title}`,done:true,pts:book.pts,gig:true,days:[new Date().getDay()]};
      let tasks=k.tasks;
      if(gigCatIdx===-1){tasks=[...tasks,{id:uid(),cat:"Extra Gigs",icon:"⭐",items:[readTask]}];}
      else{tasks=tasks.map((c,i)=>i!==gigCatIdx?c:{...c,items:[...c.items,readTask]});}
      return{...k,booksRead:{...prev,[book.id]:(prev[book.id]||0)+1},tasks};
    }));
  }

  // ── rewards ──
  function claimGoal(kidId,reward){
    const streak=streaks[kidId]||makeStreak();
    setKids(p=>p.map(k=>k.id!==kidId?k:{...k,activeGoal:{rewardId:reward.id,startStars:streak.totalStars||0}}));
  }
  function redeemGoal(kidId){
    const kid=kids.find(k=>k.id===kidId);
    const reward=rewards.find(r=>r.id===kid?.activeGoal?.rewardId);
    if(reward)requestRewardCashIn(kidId,reward.id);
  }

  // ── reset ──
  function resetDay(){
    const dow=new Date().getDay();
    const today=new Date();
    const freshBlocks=()=>{const preset=presets[dow];if(!preset)return{};return{[dow]:JSON.parse(JSON.stringify(preset.blocks)).map(b=>({...b,id:uid(),done:false}))};};

    setKids(p=>p.map(k=>({
      ...k,
      tasks:k.tasks.map(c=>({
        ...c,
        items:c.items
          // Bug 12: strip out one-time gig tasks added from the sidebar (they have gig:true and were added today)
          .filter(t=>!t.gig||!t.addedDate||t.addedDate!==todayKey())
          .map(t=>({...t,done:false,pendingApproval:false}))
      })),
      blocks:{...k.blocks,...freshBlocks()},
    })));

    setWord(p=>{const n={...p};kids.forEach(k=>{if(n[k.id])n[k.id]={...n[k.id],verseRead:false};});return n;});

    // Bug 11: reset goals by period — daily always, weekly on Sunday, monthly on 1st, yearly on Jan 1
    setGoals(p=>p.map(g=>{
      if(g.period==="daily") return {...g,done:false};
      if(g.period==="weekly"&&dow===0) return {...g,done:false}; // Sunday
      if(g.period==="monthly"&&today.getDate()===1) return {...g,done:false};
      if(g.period==="yearly"&&today.getMonth()===0&&today.getDate()===1) return {...g,done:false};
      return g;
    }));
  }

  function addGigToKid(kidId,gig){
    setKids(p=>p.map(k=>{
      if(k.id!==kidId)return k;
      const gigCatIdx=k.tasks.findIndex(c=>c.cat==="Extra Gigs");
      const newTask={id:uid(),label:gig.label,done:false,pts:gig.pts,gig:true,days:[0,1,2,3,4,5,6],addedDate:todayKey()};
      if(gigCatIdx===-1)return{...k,tasks:[...k.tasks,{id:uid(),cat:"Extra Gigs",icon:"⭐",items:[newTask]}]};
      return{...k,tasks:k.tasks.map((c,i)=>i!==gigCatIdx?c:{...c,items:[...c.items,newTask]})};
    }));
  }

  const today=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const kid=kids.find(k=>k.id===activeKid)||kids[0];
  const todayEvents=events.filter(e=>e.dtstart&&sameDay(e.dtstart,new Date()));

  if(!loaded)return <div style={{padding:40,textAlign:"center",color:"#aaa",fontFamily:"system-ui"}}>Loading…</div>;

  return <div style={{fontFamily:"system-ui,-apple-system,sans-serif",padding:bp==="phone"?"12px":"16px 0",maxWidth:720,margin:"0 auto"}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:9,background:"#534AB7",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:16}}>✦</span></div>
        <div><div style={{fontWeight:500,fontSize:17,color:"#111"}}>The Daily Rhythm</div><div style={{fontSize:12,color:"#888"}}>{today}</div></div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <div style={{display:"flex",gap:3}}>
          {[{id:"today",label:"Today"},{id:"calendar",label:"Calendar"}].map(v=><div key={v.id} onClick={()=>setMainView(v.id)} style={{padding:"5px 12px",borderRadius:99,fontSize:12,fontWeight:500,cursor:"pointer",background:mainView===v.id?"#111":"#f0f0f0",color:mainView===v.id?"#fff":"#555"}}>{v.label}</div>)}
        </div>
        {/* Notification bell */}
        <NotificationBell
          notifications={notifications} kids={kids} rewards={rewards}
          onApproveTask={approveTask} onDenyTask={denyTask}
          onApproveReward={approveReward}
          onDenyReward={denyReward} onMarkRead={markNotifRead}
          onClearAll={()=>setNotifications([])}
        />
        {/* Weekly report */}
        <button onClick={()=>setModal("report")} style={{fontSize:12,color:"#666",padding:"6px 10px",borderRadius:8,border:"0.5px solid #ccc",background:"transparent",cursor:"pointer"}} title="Weekly report">📊</button>
        {/* Reminders */}
        <button onClick={()=>setModal("reminders")} style={{fontSize:12,color:"#666",padding:"6px 10px",borderRadius:8,border:"0.5px solid #ccc",background:"transparent",cursor:"pointer"}} title="Reminders">⏰</button>
        <button onClick={()=>setModal("pin")} style={{fontSize:12,color:"#666",padding:"6px 12px",borderRadius:8,border:"0.5px solid #ccc",background:"transparent",cursor:"pointer",fontWeight:500}}>🔒 Manage</button>
      </div>
    </div>

    {/* Modals */}
    {modal==="pin"&&<div style={{marginBottom:16}}><PinGate correctPin={settings.pin} onUnlock={()=>setModal("parent")} onClose={()=>setModal(null)}/></div>}
    {modal==="parent"&&<div style={{marginBottom:16}}><ParentDash kids={kids} word={word} settings={settings} gigs={gigs} books={books} rewards={rewards} goals={goals} presets={presets} onSaveKids={setKids} onSaveWord={setWord} onSaveSettings={setSettings} onSaveGigs={setGigs} onSaveBooks={setBooks} onSaveRewards={setRewards} onSaveGoals={setGoals} onSavePresets={setPresets} onResetDay={resetDay} onClose={()=>setModal(null)}/></div>}
    {modal==="report"&&<div style={{marginBottom:16}}><WeeklyReport kids={kids} streaks={streaks} goals={goals} onClose={()=>setModal(null)}/></div>}
    {modal==="reminders"&&<div style={{marginBottom:16}}><ReminderSetup onClose={()=>setModal(null)}/></div>}

    {modal===null&&mainView==="calendar"&&<CalendarView events={events} kids={kids}/>}

    {modal===null&&mainView==="today"&&<>
      {/* Today's events banner */}
      {todayEvents.length>0&&<div style={{background:"#E6F1FB",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"flex-start",gap:10}}>
        <span style={{fontSize:16,flexShrink:0}}>📅</span>
        <div>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#185FA5",marginBottom:4}}>Today's events</div>
          {todayEvents.map((e,i)=><div key={i} style={{fontSize:13,color:"#185FA5",marginBottom:2}}>{e.allDay?e.summary:`${formatTime(e.dtstart)} — ${e.summary}`}</div>)}
        </div>
      </div>}

      {/* Family strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        {kids.map(k=>{
          const s=getStats(k);const pal=PALETTES[k.palette];
          const st=streaks[k.id]||makeStreak();
          const pendingCount=k.tasks.flatMap(c=>c.items).filter(t=>t.pendingApproval).length;
          return <div key={k.id} onClick={()=>setActiveKid(k.id)} style={{background:"#fff",borderRadius:12,padding:"12px 14px",cursor:"pointer",border:k.id===activeKid?`2px solid ${pal.mid}`:"0.5px solid #e0e0e0",transition:"border .15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{position:"relative"}}>
                <Avatar kid={k} size={32}/>
                {pendingCount>0&&<div style={{position:"absolute",top:-3,right:-3,width:14,height:14,borderRadius:"50%",background:"#E24B4A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:600,color:"#fff"}}>{pendingCount}</div>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:13,color:"#111"}}>{k.name}</div>
                <div style={{fontSize:11,color:"#888"}}>Age {k.age}</div>
              </div>
              {st.current>0&&<div style={{fontSize:12,fontWeight:600,color:"#BA7517"}}>{st.current>=7?"🔥":st.current>=3?"⚡":"✦"}{st.current}</div>}
            </div>
            <Bar pct={s.pct} color={pal.mid} h={5}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888",marginTop:5}}><span>{s.dn}/{s.tot} tasks</span><span>{s.pts} min</span></div>
          </div>;
        })}
      </div>

      {/* Kid card */}
      {kid&&<KidCard
        kid={kid} word={word}
        streak={streaks[kid.id]}
        rewards={rewards}
        goals={goals}
        streaks={streaks}
        onToggleTask={toggleTask}
        onToggleBlock={toggleBlock}
        onToggleVerse={toggleVerse}
        onClaimGoal={claimGoal}
        onRedeemGoal={redeemGoal}
        onRequestTaskApproval={requestTaskApproval}
        onAddPersonalGoal={addPersonalGoal}
        onToggleGoal={toggleGoal}
      />}

      <GigsPanel gigs={gigs} kids={kids} onAddGigToKid={addGigToKid}/>
      <BookShelf books={books} kids={kids} activeKidId={activeKid} onLogRead={logRead}/>
    </>}
  </div>;
}

