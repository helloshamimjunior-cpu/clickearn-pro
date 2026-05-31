import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const FF = "'Syne','Space Grotesk',sans-serif";
const INIT_USERS = [
  { id:"u1", name:"Arif Hossain", email:"user@clickearn.pro", balance:24.85, totalEarnings:127.40, totalClicks:127400, isBlocked:false, country:"Bangladesh", joinedAt:"2024-01-15", referralCode:"CEP7X2K9", referralEarnings:12.50, role:"user", paymentMethods:{ bkash:{number:"01712345678"}, binance:{uid:"987654321",email:"arif@binance.com"}, bank:{accountName:"Arif Hossain",accountNumber:"****4521",bankName:"Dutch-Bangla Bank"}, payoneer:{email:"arif@payoneer.com"}, rocket:{number:""} } },
  { id:"u2", name:"Sarah Chen", email:"sarah@clickearn.pro", balance:8.20, totalEarnings:55.30, totalClicks:55300, isBlocked:false, country:"China", joinedAt:"2024-02-01", referralCode:"CEP8A3X1", referralEarnings:3.20, role:"user", paymentMethods:{} },
  { id:"u3", name:"Mike Johnson", email:"mike@clickearn.pro", balance:0.00, totalEarnings:32.10, totalClicks:32100, isBlocked:true, country:"USA", joinedAt:"2024-01-20", referralCode:"CEP2B9K4", referralEarnings:0.00, role:"user", paymentMethods:{} },
  { id:"u4", name:"Fatima Hassan", email:"fatima@clickearn.pro", balance:45.60, totalEarnings:198.70, totalClicks:198700, isBlocked:false, country:"Egypt", joinedAt:"2024-01-10", referralCode:"CEP5N7P2", referralEarnings:21.00, role:"user", paymentMethods:{} },
  { id:"u5", name:"Diego Morales", email:"diego@clickearn.pro", balance:3.15, totalEarnings:19.80, totalClicks:19800, isBlocked:false, country:"Mexico", joinedAt:"2024-02-28", referralCode:"CEP3M6L8", referralEarnings:1.50, role:"user", paymentMethods:{} },
  { id:"u6", name:"Priya Sharma", email:"priya@clickearn.pro", balance:67.20, totalEarnings:312.50, totalClicks:312500, isBlocked:false, country:"India", joinedAt:"2024-01-05", referralCode:"CEP9Q1W7", referralEarnings:35.00, role:"user", paymentMethods:{} },
];
const INIT_TRANSACTIONS = [
  { id:"t1", userId:"u1", type:"earning", desc:"Click: TechGadget Review", amount:0.001, time:"2m ago", date:"2024-03-10" },
  { id:"t2", userId:"u1", type:"withdrawal", desc:"Withdrawal via Binance", amount:-15.00, time:"1d ago", date:"2024-03-09" },
  { id:"t3", userId:"u1", type:"bonus", desc:"Referral bonus - Sarah Chen", amount:2.50, time:"2d ago", date:"2024-03-08" },
  { id:"t4", userId:"u1", type:"earning", desc:"Daily target bonus", amount:1.00, time:"3d ago", date:"2024-03-07" },
  { id:"t5", userId:"u1", type:"withdrawal", desc:"bKash withdrawal (DONE)", amount:-20.00, time:"9d ago", date:"2024-03-01" },
];
const INIT_WITHDRAWALS = [
  { id:"w1", userId:"u1", amount:20.00, method:"bkash", status:"approved", date:"2024-03-01", txn:"TXN928374", note:"" },
  { id:"w2", userId:"u1", amount:15.00, method:"binance", status:"pending", date:"2024-03-10", txn:null, note:"" },
  { id:"w3", userId:"u1", amount:10.00, method:"payoneer", status:"rejected", date:"2024-02-20", txn:null, note:"Invalid account" },
  { id:"w4", userId:"u1", amount:50.00, method:"bank", status:"approved", date:"2024-02-01", txn:"TXN112233", note:"" },
  { id:"w4b", userId:"u4", amount:30.00, method:"bkash", status:"pending", date:"2024-03-09", txn:null, note:"" },
  { id:"w5", userId:"u6", amount:75.00, method:"bank", status:"pending", date:"2024-03-10", txn:null, note:"" },
];
const LINKS_DATA = [
  { id:"l1", name:"TechGadget Review 2024", url:"https://techgadget.example.com/review", category:"Technology", totalClicks:54300, uniqueClicks:32010, earned:32.01, rate:1000, active:true, desc:"Earn by promoting tech reviews" },
  { id:"l2", name:"Flash Sale Campaign", url:"https://shop.example.com/flash", category:"Shopping", totalClicks:89200, uniqueClicks:61004, earned:61.00, rate:1000, active:true, desc:"Limited time flash sale promotions" },
  { id:"l3", name:"Survey: AI Tools", url:"https://survey.example.com/ai", category:"Surveys", totalClicks:21000, uniqueClicks:18000, earned:36.00, rate:500, active:true, desc:"500 clicks = $1 (2x rate!)" },
  { id:"l4", name:"ProApp Beta Launch", url:"https://app.example.com/beta", category:"Apps", totalClicks:3200, uniqueClicks:2900, earned:2.90, rate:1000, active:false, desc:"Promote our mobile app" },
  { id:"l5", name:"Crypto News Portal", url:"https://cryptonews.example.com", category:"Finance", totalClicks:11500, uniqueClicks:9800, earned:9.80, rate:1000, active:true, desc:"Daily crypto and finance news" },
];
const NOTIFS_DATA = [
  { id:"n1", userId:"u1", title:"Withdrawal Approved!", msg:"$20 bKash withdrawal processed.", type:"success", read:false, time:"2h ago" },
  { id:"n2", userId:"u1", title:"New High-Reward Link", msg:"Crypto News Portal is now live!", type:"info", read:false, time:"5h ago" },
  { id:"n3", userId:"u1", title:"Referral Bonus", msg:"Sarah joined. +$2.50 added!", type:"success", read:true, time:"2d ago" },
  { id:"n4", userId:"u1", title:"Daily Target Reached", msg:"1,000 clicks today! +$1.00 bonus.", type:"success", read:true, time:"3d ago" },
];
const REFERRALS_DATA = [
  { name:"Sarah Chen", email:"sarah@ex.com", joined:"2024-02-01", earnings:2.50, clicks:55300, status:"active" },
  { name:"Reza Islam", email:"reza@ex.com", joined:"2024-02-15", earnings:1.20, clicks:12000, status:"active" },
  { name:"Ana Lima", email:"ana@ex.com", joined:"2024-03-01", earnings:0.80, clicks:8000, status:"active" },
  { name:"Tom Wilson", email:"tom@ex.com", joined:"2024-01-20", earnings:5.00, clicks:50000, status:"inactive" },
  { name:"Layla Hasan", email:"layla@ex.com", joined:"2024-03-05", earnings:3.00, clicks:30000, status:"active" },
];
const WEEK_DATA = [{d:"Mon",e:0.82,c:820},{d:"Tue",e:1.24,c:1240},{d:"Wed",e:0.95,c:950},{d:"Thu",e:1.68,c:1680},{d:"Fri",e:2.10,c:2100},{d:"Sat",e:1.45,c:1450},{d:"Sun",e:0.76,c:760}];
const MONTH_DATA = [{m:"Jan",e:18.4},{m:"Feb",e:24.2},{m:"Mar",e:31.8},{m:"Apr",e:28.5},{m:"May",e:35.2},{m:"Jun",e:42.1}];
const PIE_DATA = [{name:"Technology",v:38,color:"#7c3aed"},{name:"Shopping",v:29,color:"#06b6d4"},{name:"Surveys",v:18,color:"#f59e0b"},{name:"Finance",v:15,color:"#10b981"}];
const TASKS = [
  {task:"Complete your profile",reward:0.50,done:true,max:1,cur:1,icon:"👤"},
  {task:"Share 5 links today",reward:0.25,done:false,max:5,cur:4,icon:"🔗"},
  {task:"Refer 3 friends this week",reward:5.00,done:false,max:3,cur:1,icon:"👥"},
  {task:"Reach 1,000 daily clicks",reward:1.00,done:false,max:1000,cur:742,icon:"🖱️"},
  {task:"7-day login streak",reward:2.00,done:false,max:7,cur:4,icon:"🔥"},
  {task:"Earn your first $10",reward:2.50,done:true,max:1,cur:1,icon:"💰"},
];
const f$ = n=>`$${Number(n||0).toFixed(2)}`;
const fN = n=>n>=1000000?`${(n/1000000).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(1)}K`:String(n);
const cp = (t,cb)=>navigator.clipboard.writeText(t).then(cb);
const TT = {background:"#0f0f23",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,fontSize:12,fontFamily:FF};
const Card = ({children,style={},glow=false})=>(<div style={{background:"linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:20,position:"relative",overflow:"hidden",boxShadow:glow?"0 0 30px rgba(124,58,237,0.12)":"none",...style}}>{children}</div>);
const SC = ({label,value,sub,emoji,color="#7c3aed",trend})=>{const hex={"#7c3aed":"rgba(124,58,237,","#06b6d4":"rgba(6,182,212,","#10b981":"rgba(16,185,129,","#f59e0b":"rgba(245,158,11,","#ef4444":"rgba(239,68,68,"}[color]||"rgba(124,58,237,";return(<Card><div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:`radial-gradient(circle,${hex}0.15) 0%,transparent 70%)`}}/><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div style={{width:40,height:40,borderRadius:12,background:`${hex}0.15)`,border:`1px solid ${hex}0.3)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{emoji}</div>{trend!==undefined&&<span style={{fontSize:11,fontWeight:700,color:trend>=0?"#10b981":"#ef4444",background:trend>=0?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)",padding:"3px 8px",borderRadius:20}}>{trend>=0?"↑":"↓"}{Math.abs(trend)}%</span>}</div><div style={{color:"#fff",fontSize:22,fontWeight:800,marginBottom:4}}>{value}</div><div style={{color:"#6b7280",fontSize:12}}>{label}</div>{sub&&<div style={{color:color,fontSize:11,fontWeight:600,marginTop:3}}>{sub}</div>}</Card>);};
const Badge = ({status})=>{const s={approved:{c:"#10b981",bg:"rgba(16,185,129,0.12)"},pending:{c:"#f59e0b",bg:"rgba(245,158,11,0.12)"},rejected:{c:"#ef4444",bg:"rgba(239,68,68,0.12)"},active:{c:"#10b981",bg:"rgba(16,185,129,0.12)"},inactive:{c:"#6b7280",bg:"rgba(107,114,128,0.12)"},blocked:{c:"#ef4444",bg:"rgba(239,68,68,0.12)"},earning:{c:"#10b981",bg:"rgba(16,185,129,0.12)"},withdrawal:{c:"#ef4444",bg:"rgba(239,68,68,0.12)"},bonus:{c:"#a78bfa",bg:"rgba(124,58,237,0.12)"},deduction:{c:"#ef4444",bg:"rgba(239,68,68,0.12)"}}[status]||{c:"#6b7280",bg:"rgba(107,114,128,0.12)"};return <span style={{fontSize:10,fontWeight:700,color:s.c,background:s.bg,padding:"3px 8px",borderRadius:20,textTransform:"capitalize"}}>{status}</span>;};
const Btn = ({children,onClick,v="purple",sm=false,full=false,disabled=false})=>{const variants={purple:{bg:"rgba(124,58,237,0.15)",border:"rgba(124,58,237,0.3)",c:"#a78bfa"},green:{bg:"rgba(16,185,129,0.12)",border:"rgba(16,185,129,0.3)",c:"#34d399"},red:{bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.3)",c:"#f87171"},amber:{bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)",c:"#fbbf24"},primary:{bg:"linear-gradient(135deg,#7c3aed,#06b6d4)",border:"transparent",c:"#fff"}}[v]||{};return(<button onClick={onClick} disabled={disabled} style={{padding:sm?"7px 12px":"11px 18px",borderRadius:10,border:`1px solid ${variants.border}`,cursor:disabled?"not-allowed":"pointer",fontFamily:FF,fontWeight:700,fontSize:sm?11:13,color:variants.c,background:disabled?"rgba(255,255,255,0.04)":variants.bg,opacity:disabled?0.5:1,transition:"all 0.15s",whiteSpace:"nowrap",width:full?"100%":"auto",boxShadow:v==="primary"?"0 4px 15px rgba(124,58,237,0.3)":"none"}}>{children}</button>);};
const Input2 = ({label,...props})=>(<div>{label&&<div style={{color:"#9ca3af",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6,fontFamily:FF}}>{label}</div>}<input {...props} style={{width:"100%",padding:"11px 14px",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#fff",fontSize:13,fontFamily:FF,outline:"none",boxSizing:"border-box",...props.style}} onFocus={e=>e.target.style.borderColor="rgba(124,58,237,0.6)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}/></div>);
const Modal = ({open,onClose,title,children,width=460})=>{if(!open)return null;return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}><div style={{background:"#0f0f23",border:"1px solid rgba(255,255,255,0.1)",borderRadius:22,width:"100%",maxWidth:width,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 30px 80px rgba(0,0,0,0.6)",fontFamily:FF}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}><span style={{color:"#fff",fontWeight:800,fontSize:16}}>{title}</span><button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,width:32,height:32,cursor:"pointer",color:"#9ca3af",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div><div style={{padding:"20px 24px 24px"}}>{children}</div></div></div>);};

// ─── Auth ────────────────────────────────────────────────────────────────────
function Auth({onLogin}) {
  const [tab,setTab]=useState("login");
  const [forgot,setForgot]=useState(false);
  const [f,setF]=useState({name:"",email:"",pass:"",confirm:"",ref:""});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [ok,setOk]=useState("");
  const h=e=>setF(x=>({...x,[e.target.name]:e.target.value}));
  const submit=async()=>{setLoading(true);setErr("");setOk("");await new Promise(r=>setTimeout(r,700));if(forgot){if(f.email){setOk("Reset link sent!");setForgot(false);}else setErr("Enter your email.");}else if(tab==="login"){if(f.email==="admin@clickearn.pro"&&f.pass==="admin123")onLogin("admin");else if(f.email==="user@clickearn.pro"&&f.pass==="user123")onLogin("user");else setErr("Invalid credentials. Use demo credentials below.");}else{if(!f.name||!f.email||!f.pass)setErr("All fields required.");else if(f.pass.length<6)setErr("Password must be 6+ characters.");else if(f.pass!==f.confirm)setErr("Passwords do not match.");else onLogin("user");}setLoading(false);};
  const Fi=({label,name,type="text",placeholder})=>{const [fc,setFc]=useState(false);return(<div><div style={{color:"#9ca3af",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{label}</div><input name={name} type={type} placeholder={placeholder} value={f[name]} onChange={h} onFocus={()=>setFc(true)} onBlur={()=>setFc(false)} style={{width:"100%",padding:"11px 14px",background:"rgba(0,0,0,0.35)",border:`1px solid ${fc?"rgba(124,58,237,0.6)":"rgba(255,255,255,0.08)"}`,borderRadius:12,color:"#fff",fontSize:13,fontFamily:FF,outline:"none",boxSizing:"border-box",transition:"border 0.2s"}}/></div>);};
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#08080f 0%,#0d0d28 50%,#08121f 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FF,padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"15%",left:"10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.13) 0%,transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"20%",right:"10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:420,position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:56,height:56,borderRadius:18,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",marginBottom:14,boxShadow:"0 0 32px rgba(124,58,237,0.4)",fontSize:26}}>⚡</div>
          <div style={{color:"#fff",fontSize:26,fontWeight:800}}>ClickEarn <span style={{color:"#7c3aed"}}>Pro</span></div>
          <div style={{color:"#4b5563",fontSize:13,marginTop:5}}>{forgot?"Reset your password":tab==="login"?"Welcome back! Sign in":"Create your account"}</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:24,padding:28,backdropFilter:"blur(20px)"}}>
          {!forgot&&(<div style={{display:"flex",background:"rgba(0,0,0,0.3)",borderRadius:14,padding:4,marginBottom:22}}>{[["login","Sign In"],["register","Sign Up"]].map(([v,l])=>(<button key={v} onClick={()=>{setTab(v);setErr("");}} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",cursor:"pointer",fontFamily:FF,fontWeight:700,fontSize:13,transition:"all 0.2s",background:tab===v?"linear-gradient(135deg,#7c3aed,#5b21b6)":"transparent",color:tab===v?"#fff":"#6b7280",boxShadow:tab===v?"0 4px 15px rgba(124,58,237,0.35)":"none"}}>{l}</button>))}</div>)}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {tab==="register"&&!forgot&&<Fi label="Full Name" name="name" placeholder="Arif Hossain"/>}
            <Fi label="Email Address" name="email" type="email" placeholder="you@example.com"/>
            {!forgot&&<Fi label="Password" name="pass" type="password" placeholder="••••••••"/>}
            {tab==="register"&&!forgot&&<Fi label="Confirm Password" name="confirm" type="password" placeholder="••••••••"/>}
            {tab==="register"&&!forgot&&<Fi label="Referral Code (optional)" name="ref" placeholder="e.g. CEP7X2K9"/>}
            {err&&<div style={{color:"#f87171",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:10,padding:"10px 14px",fontSize:12}}>{err}</div>}
            {ok&&<div style={{color:"#34d399",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:10,padding:"10px 14px",fontSize:12}}>{ok}</div>}
            <button onClick={submit} disabled={loading} style={{padding:"13px 0",borderRadius:12,border:"none",cursor:"pointer",fontFamily:FF,fontWeight:800,fontSize:14,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",color:"#fff",boxShadow:"0 4px 20px rgba(124,58,237,0.4)",opacity:loading?0.7:1,transition:"all 0.2s"}}>{loading?"Please wait...":forgot?"Send Reset Link":tab==="login"?"Sign In":"Create Account"}</button>
            {tab==="login"&&!forgot&&<button onClick={()=>{setForgot(true);setErr("");}} style={{background:"none",border:"none",color:"#7c3aed",fontSize:12,cursor:"pointer",fontFamily:FF}}>Forgot password?</button>}
            {forgot&&<button onClick={()=>{setForgot(false);setErr("");}} style={{background:"none",border:"none",color:"#6b7280",fontSize:12,cursor:"pointer",fontFamily:FF}}>Back to Sign In</button>}
          </div>
          <div style={{marginTop:20,padding:"14px 16px",background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.18)",borderRadius:12,fontSize:12,color:"#9ca3af"}}>
            <div style={{color:"#a78bfa",fontWeight:700,marginBottom:6}}>Demo Credentials</div>
            <div style={{marginBottom:3}}>User: user@clickearn.pro / user123</div>
            <div>Admin: admin@clickearn.pro / admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── User Shell ──────────────────────────────────────────────────────────────
const USER_NAVS=[{id:"dash",icon:"⊞",label:"Dashboard"},{id:"links",icon:"🔗",label:"Links"},{id:"withdraw",icon:"💸",label:"Withdraw"},{id:"offers",icon:"🎁",label:"Offers"},{id:"stats",icon:"📊",label:"Statistics"},{id:"profile",icon:"⚙️",label:"Settings"}];

function UserShell({children,active,setActive,user,onSwitch,onLogout}) {
  const [mob,setMob]=useState(false);
  const [nd,setNd]=useState(false);
  const [notifs,setNotifs]=useState(NOTIFS_DATA);
  const unread=notifs.filter(n=>!n.read).length;
  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#080812",fontFamily:FF,color:"#e5e7eb"}}>
      <style>{`@media(min-width:768px){.sb{transform:translateX(0)!important;position:static!important;height:100vh!important}.mbt{display:none!important}}`}</style>
      {mob&&<div onClick={()=>setMob(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:40}}/>}
      <aside className="sb" style={{width:240,flexShrink:0,background:"linear-gradient(180deg,#0d0d1f,#09090f)",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:50,transform:mob?"translateX(0)":"translateX(-100%)",transition:"transform 0.3s"}}>
        <div style={{padding:"22px 20px 18px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 20px rgba(124,58,237,0.35)"}}>⚡</div>
            <div><div style={{color:"#fff",fontWeight:800,fontSize:16}}>ClickEarn <span style={{color:"#7c3aed"}}>Pro</span></div><div style={{color:"#374151",fontSize:11}}>User Panel</div></div>
          </div>
        </div>
        <nav style={{flex:1,padding:"14px 12px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
          <div style={{color:"#374151",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",padding:"4px 10px 10px"}}>Menu</div>
          {USER_NAVS.map(n=>(<button key={n.id} onClick={()=>{setActive(n.id);setMob(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:FF,fontWeight:600,fontSize:13,textAlign:"left",transition:"all 0.15s",background:active===n.id?"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.08))":"transparent",color:active===n.id?"#a78bfa":"#6b7280",borderLeft:active===n.id?"2px solid #7c3aed":"2px solid transparent"}}><span style={{fontSize:16}}>{n.icon}</span>{n.label}</button>))}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",marginTop:8,paddingTop:8}}>
            <button onClick={onSwitch} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:FF,fontWeight:600,fontSize:12,width:"100%",color:"#f59e0b",background:"rgba(245,158,11,0.06)"}}>⚙️ Switch to Admin</button>
          </div>
        </nav>
        <div style={{padding:"12px 12px 20px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.18)",borderRadius:14,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:"#fff"}}>{user.name[0]}</div>
              <div><div style={{color:"#e5e7eb",fontWeight:700,fontSize:12}}>{user.name}</div><div style={{color:"#10b981",fontSize:10,fontWeight:600}}>Verified</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"#6b7280"}}>Balance</span><span style={{color:"#a78bfa",fontWeight:800,fontSize:14}}>{f$(user.balance)}</span></div>
            <button onClick={onLogout} style={{width:"100%",marginTop:10,padding:"7px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.18)",borderRadius:8,color:"#f87171",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FF}}>Sign Out</button>
          </div>
        </div>
      </aside>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <header style={{background:"rgba(8,8,18,0.9)",borderBottom:"1px solid rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",padding:"0 20px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:30}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button className="mbt" onClick={()=>setMob(true)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,width:34,height:34,cursor:"pointer",fontSize:15,color:"#9ca3af"}}>☰</button>
            <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{USER_NAVS.find(n=>n.id===active)?.label}</div><div style={{color:"#4b5563",fontSize:11}}>Welcome back, {user.name.split(" ")[0]}</div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.25)",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#a78bfa"}}>💰 {f$(user.balance)}</div>
            <div style={{position:"relative"}}>
              <button onClick={()=>setNd(o=>!o)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",position:"relative"}}>
                🔔{unread>0&&<span style={{position:"absolute",top:-3,right:-3,width:15,height:15,background:"#ef4444",borderRadius:"50%",fontSize:9,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{unread}</span>}
              </button>
              {nd&&(<div style={{position:"absolute",right:0,top:46,width:310,background:"#0f0f23",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",zIndex:60,overflow:"hidden"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px 10px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><span style={{color:"#fff",fontWeight:700,fontSize:13}}>Notifications</span><button onClick={()=>setNotifs(n=>n.map(x=>({...x,read:true})))} style={{background:"none",border:"none",color:"#7c3aed",fontSize:11,cursor:"pointer",fontFamily:FF,fontWeight:600}}>Mark all read</button></div>
                {notifs.map(n=>(<div key={n.id} onClick={()=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x))} style={{display:"flex",gap:10,padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.03)",background:!n.read?"rgba(124,58,237,0.06)":"transparent",cursor:"pointer"}}><div style={{width:7,height:7,borderRadius:"50%",background:{success:"#10b981",info:"#7c3aed",warning:"#f59e0b"}[n.type]||"#7c3aed",marginTop:4,flexShrink:0}}/><div><div style={{color:!n.read?"#a78bfa":"#e5e7eb",fontSize:12,fontWeight:700,marginBottom:2}}>{n.title}</div><div style={{color:"#6b7280",fontSize:11}}>{n.msg}</div><div style={{color:"#374151",fontSize:10,marginTop:3}}>{n.time}</div></div></div>))}
              </div>)}
            </div>
          </div>
        </header>
        <main style={{flex:1,padding:"22px 20px",overflowY:"auto"}}><div key={active}>{children}</div></main>
        <footer style={{borderTop:"1px solid rgba(255,255,255,0.04)",padding:"10px 20px",textAlign:"center",color:"#374151",fontSize:11}}>ClickEarn Pro v2.0 © 2024 Built with love</footer>
      </div>
      {nd&&<div onClick={()=>setNd(false)} style={{position:"fixed",inset:0,zIndex:55}}/>}
    </div>
  );
}

// ─── User Pages ──────────────────────────────────────────────────────────────
function UDashboard({user,transactions}) {
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:14}}>
        <SC label="Total Balance" value={f$(user.balance)} sub="Available to withdraw" emoji="💰" color="#7c3aed" trend={12}/>
        <SC label="Total Earned" value={f$(user.totalEarnings)} sub="All time" emoji="📈" color="#10b981" trend={8}/>
        <SC label="Total Clicks" value={fN(user.totalClicks)} sub="Valid clicks" emoji="🖱️" color="#06b6d4" trend={5}/>
        <SC label="Today's Earnings" value="$2.10" sub="2,100 clicks" emoji="⚡" color="#f59e0b" trend={18}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}}>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>Weekly Earnings</div><div style={{color:"#6b7280",fontSize:12,marginTop:2}}>Performance over 7 days</div></div>
            <span style={{fontSize:11,fontWeight:700,color:"#10b981",background:"rgba(16,185,129,0.1)",padding:"4px 10px",borderRadius:20}}>+8.4% vs last week</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={WEEK_DATA}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="d" tick={{fontSize:11,fill:"#4b5563"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:"#4b5563"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <Tooltip formatter={v=>[`$${v}`,"Earnings"]} contentStyle={TT}/>
              <Area type="monotone" dataKey="e" stroke="#7c3aed" strokeWidth={2.5} fill="url(#g1)" dot={{fill:"#7c3aed",r:4,strokeWidth:2,stroke:"#080812"}}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card glow style={{display:"flex",flexDirection:"column"}}>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff",margin:"0 auto 10px",boxShadow:"0 0 22px rgba(124,58,237,0.35)"}}>{user.name[0]}</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:14}}>{user.name}</div>
            <div style={{color:"#4b5563",fontSize:11,marginTop:3}}>{user.email}</div>
            <div style={{color:"#10b981",fontSize:10,fontWeight:600,marginTop:4}}>Verified Member</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,flex:1}}>
            {[{l:"Balance",v:f$(user.balance),c:"#a78bfa"},{l:"Earned",v:f$(user.totalEarnings),c:"#10b981"},{l:"Referral",v:f$(user.referralEarnings),c:"#f59e0b"},{l:"Code",v:user.referralCode,c:"#06b6d4"}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"8px 10px"}}><span style={{color:"#6b7280",fontSize:11}}>{r.l}</span><span style={{color:r.c,fontSize:11,fontWeight:700}}>{r.v}</span></div>))}
          </div>
          <div style={{marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#6b7280",marginBottom:4}}><span>Next milestone</span><span style={{color:"#7c3aed"}}>$4.85/$5</span></div>
            <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{height:"100%",width:"97%",borderRadius:2,background:"linear-gradient(90deg,#7c3aed,#06b6d4)"}}/></div>
          </div>
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <div style={{color:"#fff",fontWeight:800,fontSize:14,marginBottom:14}}>Recent Activity</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {transactions.filter(t=>t.userId===user.id).slice(0,5).map((t,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,background:t.type==="earning"?"rgba(16,185,129,0.1)":t.type==="withdrawal"?"rgba(239,68,68,0.1)":"rgba(124,58,237,0.1)",flexShrink:0}}>{t.type==="earning"?"🖱️":t.type==="withdrawal"?"💸":"🎁"}</div><div style={{flex:1,minWidth:0}}><div style={{color:"#e5e7eb",fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc}</div><div style={{color:"#4b5563",fontSize:10,marginTop:2}}>{t.time}</div></div><span style={{fontSize:12,fontWeight:800,flexShrink:0,color:t.amount>=0?"#10b981":"#ef4444"}}>{t.amount>=0?"+":""}{f$(Math.abs(t.amount))}</span></div>))}
          </div>
        </Card>
        <Card>
          <div style={{color:"#fff",fontWeight:800,fontSize:14,marginBottom:14}}>Notifications</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {NOTIFS_DATA.slice(0,4).map(n=>(<div key={n.id} style={{display:"flex",gap:10,padding:"10px 12px",borderRadius:12,background:!n.read?"rgba(124,58,237,0.07)":"rgba(255,255,255,0.02)",border:`1px solid ${!n.read?"rgba(124,58,237,0.18)":"rgba(255,255,255,0.04)"}`}}><div style={{width:7,height:7,borderRadius:"50%",background:{success:"#10b981",info:"#7c3aed",warning:"#f59e0b"}[n.type]||"#7c3aed",marginTop:4,flexShrink:0}}/><div><div style={{color:!n.read?"#a78bfa":"#e5e7eb",fontSize:12,fontWeight:700,marginBottom:2}}>{n.title}</div><div style={{color:"#4b5563",fontSize:11}}>{n.msg}</div></div></div>))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ULinks({user}) {
  const [copied,setCopied]=useState(null);
  const [myClicks,setMyClicks]=useState({});
  const [filter,setFilter]=useState("all");
  const cats=["all",...new Set(LINKS_DATA.map(l=>l.category))];
  const shown=filter==="all"?LINKS_DATA:LINKS_DATA.filter(l=>l.category===filter);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
        <SC label="Active Links" value={LINKS_DATA.filter(l=>l.active).length} emoji="🔗" color="#7c3aed"/>
        <SC label="My Clicks" value="12,450" sub="This month" emoji="🖱️" color="#06b6d4"/>
        <SC label="Link Earnings" value="$12.45" emoji="💰" color="#10b981"/>
        <SC label="Reward Rate" value="1K/$1" emoji="⚡" color="#f59e0b"/>
      </div>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
          <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>Promotional Links</div><div style={{color:"#6b7280",fontSize:12}}>1,000 valid clicks = $1.00 reward</div></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:FF,fontSize:11,fontWeight:700,textTransform:"capitalize",background:filter===c?"linear-gradient(135deg,#7c3aed,#5b21b6)":"rgba(255,255,255,0.04)",color:filter===c?"#fff":"#6b7280"}}>{c}</button>)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {shown.map(link=>{const mc=myClicks[link.id]||0;const tot=link.totalClicks+mc;const pct=((tot%1000)/10).toFixed(0);return(
            <div key={link.id} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${link.active?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.03)"}`,borderRadius:16,padding:16,opacity:link.active?1:0.55}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:42,height:42,borderRadius:12,background:"rgba(124,58,237,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{link.category==="Technology"?"💻":link.category==="Shopping"?"🛒":link.category==="Surveys"?"📝":link.category==="Finance"?"📊":"📱"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{color:"#fff",fontWeight:800,fontSize:14}}>{link.name}</span><Badge status={link.active?"active":"inactive"}/>{link.rate===500&&<span style={{fontSize:10,fontWeight:700,color:"#f59e0b",background:"rgba(245,158,11,0.1)",padding:"2px 8px",borderRadius:20}}>2x Rate</span>}</div>
                  <div style={{color:"#7c3aed",fontSize:11,marginBottom:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link.url}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
                    {[{l:"Clicks",v:fN(tot),c:"#e5e7eb"},{l:"Unique",v:fN(link.uniqueClicks),c:"#e5e7eb"},{l:"My Clicks",v:fN(mc),c:"#a78bfa"},{l:"Rate",v:`${link.rate}/$1`,c:"#fbbf24"}].map((s,i)=>(<div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"7px 8px"}}><div style={{color:"#4b5563",fontSize:10}}>{s.l}</div><div style={{color:s.c,fontSize:12,fontWeight:700,marginTop:2}}>{s.v}</div></div>))}
                  </div>
                  {link.active&&(<div><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#6b7280",marginBottom:4}}><span>Progress to next $1</span><span style={{color:"#7c3aed",fontWeight:700}}>{tot%1000}/1,000</span></div><div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{height:"100%",width:`${pct}%`,borderRadius:2,background:"linear-gradient(90deg,#7c3aed,#06b6d4)",transition:"width 0.5s"}}/></div></div>)}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
                  {link.active&&<Btn onClick={()=>setMyClicks(c=>({...c,[link.id]:(c[link.id]||0)+1}))} v="green" sm>+Click</Btn>}
                  <Btn onClick={()=>cp(link.url,()=>{setCopied(link.id);setTimeout(()=>setCopied(null),2000);})} v="purple" sm>{copied===link.id?"Done":"Copy"}</Btn>
                </div>
              </div>
            </div>
          );})}
        </div>
      </Card>
    </div>
  );
}

function UWithdraw({user,withdrawals,onNewWithdraw}) {
  const [amount,setAmount]=useState("");
  const [method,setMethod]=useState("bkash");
  const [step,setStep]=useState(1);
  const [filter,setFilter]=useState("all");
  const methods=[{id:"bkash",icon:"📱",label:"bKash",desc:"Instant 0% fee"},{id:"rocket",icon:"🚀",label:"Rocket",desc:"Instant 0% fee"},{id:"binance",icon:"₿",label:"Binance",desc:"1-2h 1% fee"},{id:"payoneer",icon:"💳",label:"Payoneer",desc:"1-3d 2% fee"},{id:"bank",icon:"🏦",label:"Bank Wire",desc:"2-5d 3% fee"}];
  const sel=methods.find(m=>m.id===method);
  const myW=withdrawals.filter(w=>w.userId===user.id);
  const shown=filter==="all"?myW:myW.filter(w=>w.status===filter);
  const confirm=()=>{onNewWithdraw({id:`w${Date.now()}`,userId:user.id,amount:parseFloat(amount),method,status:"pending",date:new Date().toISOString().slice(0,10),txn:null,note:""});setStep(3);};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
        <SC label="Available" value={f$(user.balance)} sub="Ready to withdraw" emoji="💰" color="#7c3aed"/>
        <SC label="Pending" value={f$(myW.filter(w=>w.status==="pending").reduce((s,w)=>s+w.amount,0))} emoji="⏳" color="#f59e0b"/>
        <SC label="Total Withdrawn" value={f$(myW.filter(w=>w.status==="approved").reduce((s,w)=>s+w.amount,0))} emoji="📤" color="#10b981"/>
        <SC label="Minimum" value="$5.00" emoji="💲" color="#06b6d4"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:16}}>
        <Card glow>
          <div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:18}}>{step===3?"Submitted!":step===2?"Confirm Request":"New Withdrawal"}</div>
          {step===3?(<div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:46,marginBottom:12}}>🎉</div><div style={{color:"#fff",fontWeight:800,fontSize:16,marginBottom:8}}>Request Submitted!</div><div style={{color:"#6b7280",fontSize:13,lineHeight:1.6,marginBottom:18}}>{f$(amount)} via {sel?.label} under review. 24-48h processing.</div><Btn onClick={()=>{setStep(1);setAmount("");}} v="primary" full>New Request</Btn></div>)
          :step===2?(<div style={{display:"flex",flexDirection:"column",gap:14}}><div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:16}}>{[{l:"Amount",v:f$(amount),big:true},{l:"Method",v:`${sel?.icon} ${sel?.label}`},{l:"Arrival",v:sel?.desc},{l:"Net Amount",v:f$(parseFloat(amount)),c:"#10b981"}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.04)":"none"}}><span style={{color:"#6b7280",fontSize:12}}>{r.l}</span><span style={{color:r.c||"#e5e7eb",fontSize:r.big?20:13,fontWeight:r.big?800:600}}>{r.v}</span></div>))}</div><div style={{display:"flex",gap:8}}><Btn onClick={()=>setStep(1)} v="red" full>Back</Btn><Btn onClick={confirm} v="primary" full>Confirm</Btn></div></div>)
          :(<>
            <div style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.18)",borderRadius:14,padding:"14px 16px",marginBottom:16}}><div style={{color:"#6b7280",fontSize:11,marginBottom:4}}>Available Balance</div><div style={{color:"#a78bfa",fontSize:28,fontWeight:800}}>{f$(user.balance)}</div><div style={{color:"#4b5563",fontSize:11}}>Minimum: $5.00</div></div>
            <div style={{marginBottom:14}}><div style={{color:"#9ca3af",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Amount (USD)</div><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="5" step="0.01" placeholder="0.00" style={{width:"100%",padding:"12px 14px",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#fff",fontSize:20,fontWeight:800,fontFamily:FF,outline:"none",boxSizing:"border-box"}}/><div style={{display:"flex",gap:6,marginTop:8}}>{["5","10","20","50"].map(v=><button key={v} onClick={()=>setAmount(Math.min(parseFloat(v),user.balance).toFixed(2))} style={{flex:1,padding:"7px 0",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"#9ca3af",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FF}}>${v}</button>)}<button onClick={()=>setAmount(user.balance.toFixed(2))} style={{flex:1,padding:"7px 0",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:8,color:"#a78bfa",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FF}}>Max</button></div></div>
            <div style={{marginBottom:16}}><div style={{color:"#9ca3af",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Payment Method</div><div style={{display:"flex",flexDirection:"column",gap:6}}>{methods.map(m=>(<button key={m.id} onClick={()=>setMethod(m.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:method===m.id?"rgba(124,58,237,0.1)":"rgba(255,255,255,0.02)",border:`1px solid ${method===m.id?"rgba(124,58,237,0.4)":"rgba(255,255,255,0.06)"}`,borderRadius:12,cursor:"pointer",fontFamily:FF,textAlign:"left",transition:"all 0.15s"}}><span style={{fontSize:18}}>{m.icon}</span><div style={{flex:1}}><div style={{color:method===m.id?"#a78bfa":"#e5e7eb",fontSize:12,fontWeight:700}}>{m.label}</div><div style={{color:"#4b5563",fontSize:11}}>{m.desc}</div></div>{method===m.id&&<span style={{color:"#7c3aed"}}>●</span>}</button>))}</div></div>
            <Btn onClick={()=>amount&&parseFloat(amount)>=5&&parseFloat(amount)<=user.balance&&setStep(2)} v="primary" full disabled={!amount||parseFloat(amount)<5||parseFloat(amount)>user.balance}>Continue to Review</Btn>
          </>)}
        </Card>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:15}}>Withdrawal History</div>
            <div style={{display:"flex",gap:5}}>{["all","pending","approved","rejected"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:FF,fontSize:11,fontWeight:700,textTransform:"capitalize",background:filter===f?"#7c3aed":"rgba(255,255,255,0.04)",color:filter===f?"#fff":"#6b7280"}}>{f}</button>)}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {shown.length===0&&<div style={{color:"#4b5563",textAlign:"center",padding:"30px 0",fontSize:13}}>No {filter} withdrawals</div>}
            {shown.map(w=>(<div key={w.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:14}}><div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{methods.find(m=>m.id===w.method)?.icon||"💰"}</div><div style={{flex:1,minWidth:0}}><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{f$(w.amount)}</div><div style={{color:"#6b7280",fontSize:11,textTransform:"capitalize"}}>{w.method} {w.date}</div>{w.note&&<div style={{color:"#ef4444",fontSize:11,marginTop:2}}>{w.note}</div>}</div><div style={{textAlign:"right",flexShrink:0}}><Badge status={w.status}/>{w.txn&&<div style={{color:"#4b5563",fontSize:10,fontFamily:"monospace",marginTop:4}}>#{w.txn}</div>}</div></div>))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function UOffers({user}) {
  const [coped,setCoped]=useState(false);
  const refLink=`https://clickearn.pro/ref/${user.referralCode}`;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
        <SC label="Task Earnings" value="$3.00" emoji="⚡" color="#f59e0b"/>
        <SC label="Referral Earnings" value={f$(user.referralEarnings)} emoji="👥" color="#7c3aed"/>
        <SC label="Active Referrals" value={REFERRALS_DATA.filter(r=>r.status==="active").length} emoji="🟢" color="#10b981"/>
        <SC label="Bonus Available" value="$3.00" emoji="🎁" color="#ef4444"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card glow>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:36,height:36,borderRadius:10,background:"rgba(245,158,11,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎁</div><div><div style={{color:"#fff",fontWeight:800,fontSize:14}}>Referral Program</div><div style={{color:"#6b7280",fontSize:11}}>Earn 10% of referrals forever</div></div></div>
          <div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:12,marginBottom:14}}><div style={{color:"#6b7280",fontSize:11,marginBottom:6}}>Your Referral Link</div><div style={{display:"flex",alignItems:"center",gap:8}}><code style={{flex:1,fontSize:11,color:"#7c3aed",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{refLink}</code><Btn onClick={()=>{cp(refLink,()=>{setCoped(true);setTimeout(()=>setCoped(false),2000)});}} v="purple" sm>{coped?"Done":"Copy"}</Btn></div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>{[{l:"Referrals",v:REFERRALS_DATA.length},{l:"Active",v:REFERRALS_DATA.filter(r=>r.status==="active").length},{l:"Earned",v:f$(user.referralEarnings)}].map((s,i)=>(<div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px",textAlign:"center"}}><div style={{color:"#fff",fontWeight:800,fontSize:16}}>{s.v}</div><div style={{color:"#6b7280",fontSize:10}}>{s.l}</div></div>))}</div>
          <div style={{background:"rgba(124,58,237,0.07)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:12,padding:12,marginBottom:14}}><div style={{color:"#a78bfa",fontSize:11,fontWeight:700,marginBottom:8}}>How It Works</div>{["Share your referral link","Friend registers and starts clicking","You earn 10% of their earnings forever"].map((s,i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:5,fontSize:11}}><span style={{width:16,height:16,borderRadius:"50%",background:"rgba(124,58,237,0.2)",color:"#a78bfa",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,flexShrink:0,fontSize:10}}>{i+1}</span><span style={{color:"#9ca3af"}}>{s}</span></div>))}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[["📤","WhatsApp"],["📧","Email"],["📣","Telegram"],["🔗","Copy"]].map(([ic,l],i)=>(<button key={i} style={{padding:"9px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,color:"#9ca3af",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:FF}}>{ic} {l}</button>))}</div>
        </Card>
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:36,height:36,borderRadius:10,background:"rgba(6,182,212,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚡</div><div><div style={{color:"#fff",fontWeight:800,fontSize:14}}>Special Tasks</div><div style={{color:"#6b7280",fontSize:11}}>{TASKS.filter(t=>t.done).length}/{TASKS.length} completed</div></div></div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {TASKS.map((t,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:t.done?"rgba(16,185,129,0.06)":"rgba(255,255,255,0.02)",border:`1px solid ${t.done?"rgba(16,185,129,0.15)":"rgba(255,255,255,0.05)"}`,borderRadius:12}}><div style={{width:30,height:30,borderRadius:9,background:t.done?"#10b981":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:t.done?13:15,color:"#fff",flexShrink:0}}>{t.done?"✓":t.icon}</div><div style={{flex:1,minWidth:0}}><div style={{color:t.done?"#6b7280":"#e5e7eb",fontSize:12,fontWeight:700,textDecoration:t.done?"line-through":"none"}}>{t.task}</div>{!t.done&&t.max>1&&(<div style={{marginTop:4}}><div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{height:"100%",width:`${(t.cur/t.max)*100}%`,background:"linear-gradient(90deg,#7c3aed,#06b6d4)",borderRadius:2}}/></div></div>)}</div><span style={{color:t.done?"#10b981":"#f59e0b",fontWeight:800,fontSize:13,flexShrink:0}}>{f$(t.reward)}</span></div>))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function UStats() {
  const [range,setRange]=useState("weekly");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
        <SC label="Total Clicks" value="127.4K" emoji="🖱️" color="#7c3aed" trend={12}/>
        <SC label="Daily Average" value="$1.82" emoji="📅" color="#06b6d4" trend={8}/>
        <SC label="This Week" value="$9.00" emoji="📊" color="#10b981" trend={15}/>
        <SC label="This Month" value="$35.20" emoji="📈" color="#f59e0b" trend={22}/>
      </div>
      <div style={{display:"flex",gap:6}}>{["daily","weekly","monthly"].map(r=><button key={r} onClick={()=>setRange(r)} style={{padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:FF,fontSize:12,fontWeight:700,textTransform:"capitalize",background:range===r?"linear-gradient(135deg,#7c3aed,#5b21b6)":"rgba(255,255,255,0.04)",color:range===r?"#fff":"#6b7280"}}>{r}</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
        <Card>
          <div style={{color:"#fff",fontWeight:800,fontSize:14,marginBottom:16}}>Performance Chart</div>
          <ResponsiveContainer width="100%" height={210}>
            {range==="monthly"?(<BarChart data={MONTH_DATA}><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/><XAxis dataKey="m" tick={{fontSize:11,fill:"#4b5563"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:"#4b5563"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/><Tooltip contentStyle={TT}/><Bar dataKey="e" fill="url(#bg)" radius={[6,6,0,0]}/></BarChart>):(<AreaChart data={WEEK_DATA}><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/><XAxis dataKey="d" tick={{fontSize:11,fill:"#4b5563"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:"#4b5563"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/><Tooltip contentStyle={TT}/><Area type="monotone" dataKey="e" stroke="#7c3aed" strokeWidth={2.5} fill="url(#wg)" dot={{fill:"#7c3aed",r:4}}/></AreaChart>)}
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{color:"#fff",fontWeight:800,fontSize:14,marginBottom:16}}>Click Sources</div>
          <ResponsiveContainer width="100%" height={170}><PieChart><Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={46} outerRadius={76} dataKey="v" strokeWidth={0}>{PIE_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip formatter={v=>[`${v}%`]} contentStyle={TT}/></PieChart></ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>{PIE_DATA.map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:2,background:d.color}}/><span style={{color:"#6b7280"}}>{d.name}</span></div><span style={{color:"#e5e7eb",fontWeight:700}}>{d.v}%</span></div>)}</div>
        </Card>
      </div>
    </div>
  );
}

function UProfile({user,onUpdateUser}) {
  const [tab,setTab]=useState("personal");
  const [form,setForm]=useState({name:user.name,email:user.email,phone:"+880 17XXXXXXXX",country:user.country});
  const [pw,setPw]=useState({cur:"",newp:"",conf:""});
  const [saved,setSaved]=useState("");
  const save=(msg)=>{setSaved(msg);setTimeout(()=>setSaved(""),2000);};
  const savePro=()=>{onUpdateUser({...user,...form});save("profile");};
  const pms=[{id:"bkash",icon:"📱",label:"bKash"},{id:"rocket",icon:"🚀",label:"Rocket"},{id:"binance",icon:"₿",label:"Binance"},{id:"payoneer",icon:"💳",label:"Payoneer"},{id:"bank",icon:"🏦",label:"Bank Wire"}];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:4,alignSelf:"flex-start",flexWrap:"wrap"}}>
        {[["personal","Personal"],["security","Security"],["payments","Payments"],["notif","Alerts"]].map(([id,l])=>(<button key={id} onClick={()=>setTab(id)} style={{padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:FF,fontSize:12,fontWeight:700,background:tab===id?"linear-gradient(135deg,#7c3aed,#5b21b6)":"transparent",color:tab===id?"#fff":"#6b7280",whiteSpace:"nowrap"}}>{l}</button>))}
      </div>
      {tab==="personal"&&(<div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:16}}><Card style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}><div style={{width:60,height:60,borderRadius:18,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff",margin:"0 auto 12px",boxShadow:"0 0 24px rgba(124,58,237,0.35)"}}>{user.name[0]}</div><div style={{color:"#fff",fontWeight:800,fontSize:14}}>{form.name}</div><div style={{color:"#4b5563",fontSize:11,marginTop:3}}>{form.email}</div><div style={{color:"#10b981",fontSize:10,fontWeight:600,marginTop:5}}>Verified Member</div><div style={{color:"#4b5563",fontSize:10,marginTop:3}}>Joined {user.joinedAt}</div><div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 12px",marginTop:14,width:"100%"}}><div style={{color:"#6b7280",fontSize:10,marginBottom:4}}>Referral Code</div><div style={{color:"#a78bfa",fontSize:13,fontWeight:800,fontFamily:"monospace"}}>{user.referralCode}</div></div></Card><Card><div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:18}}>Personal Information</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>{[{l:"Full Name",n:"name"},{l:"Email",n:"email",t:"email"},{l:"Phone",n:"phone",t:"tel"},{l:"Country",n:"country"}].map(fi=>(<Input2 key={fi.n} label={fi.l} name={fi.n} type={fi.t||"text"} value={form[fi.n]} onChange={e=>setForm(f=>({...f,[fi.n]:e.target.value}))}/>))}</div>{saved==="profile"&&<div style={{color:"#34d399",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:10,padding:"10px 14px",fontSize:12,marginBottom:14}}>Profile saved!</div>}<Btn onClick={savePro} v="primary">Save Changes</Btn></Card></div>)}
      {tab==="security"&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Card><div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:18}}>Change Password</div><div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>{[{l:"Current Password",k:"cur"},{l:"New Password",k:"newp"},{l:"Confirm New",k:"conf"}].map(fi=>(<Input2 key={fi.k} label={fi.l} type="password" value={pw[fi.k]} onChange={e=>setPw(p=>({...p,[fi.k]:e.target.value}))} placeholder="••••••••"/>))}</div>{saved==="pw"&&<div style={{color:"#34d399",background:"rgba(52,211,153,0.08)",borderRadius:10,padding:"10px",fontSize:12,marginBottom:12}}>Password updated!</div>}<Btn onClick={()=>save("pw")} v="primary">Update Password</Btn></Card><Card><div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:16}}>Security Settings</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{[{l:"Two-Factor Auth",d:"Extra login security",on:false},{l:"Login Alerts",d:"Notify on new logins",on:true},{l:"Session Timeout",d:"Auto-logout on inactivity",on:true}].map((s,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12}}><div><div style={{color:"#e5e7eb",fontSize:13,fontWeight:600}}>{s.l}</div><div style={{color:"#4b5563",fontSize:11,marginTop:2}}>{s.d}</div></div><div style={{width:38,height:21,borderRadius:11,background:s.on?"#7c3aed":"rgba(255,255,255,0.06)",position:"relative",cursor:"pointer"}}><div style={{width:15,height:15,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:s.on?"calc(100% - 18px)":3}}/></div></div>))}</div></Card></div>)}
      {tab==="payments"&&(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14}}>{pms.map(m=>{const sv=user.paymentMethods?.[m.id];const isSet=sv&&Object.values(sv).some(v=>v);return(<Card key={m.id}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><span style={{fontSize:22}}>{m.icon}</span><div><div style={{color:"#fff",fontWeight:800,fontSize:14}}>{m.label}</div><div style={{color:isSet?"#10b981":"#4b5563",fontSize:11,fontWeight:600}}>{isSet?"Configured":"Not set up"}</div></div></div>{m.id==="bkash"&&<Input2 label="bKash Number" placeholder="01XXXXXXXXX" defaultValue={sv?.number}/>}{m.id==="rocket"&&<Input2 label="Rocket Number" placeholder="01XXXXXXXXX" defaultValue={sv?.number}/>}{m.id==="binance"&&<><Input2 label="Binance UID" placeholder="123456789" defaultValue={sv?.uid}/><div style={{marginTop:8}}/><Input2 label="Email" placeholder="you@email.com" defaultValue={sv?.email}/></>}{m.id==="payoneer"&&<Input2 label="Payoneer Email" placeholder="you@payoneer.com" defaultValue={sv?.email}/>}{m.id==="bank"&&<><Input2 label="Account Name" defaultValue={sv?.accountName}/><div style={{marginTop:8}}/><Input2 label="Account Number" defaultValue={sv?.accountNumber}/><div style={{marginTop:8}}/><Input2 label="Bank Name" defaultValue={sv?.bankName}/></>}<div style={{marginTop:12}}><Btn onClick={()=>save("pay")} v="purple" sm>Save</Btn></div></Card>);})}</div>)}
      {tab==="notif"&&(<Card style={{maxWidth:560}}><div style={{color:"#fff",fontWeight:800,fontSize:15,marginBottom:16}}>Notification Preferences</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{[{l:"Withdrawal Status",d:"Approved or rejected updates",on:true},{l:"New Links",d:"When admin adds new links",on:true},{l:"Referral Activity",d:"When someone uses your code",on:true},{l:"Daily Summary",d:"End-of-day earnings email",on:false},{l:"Milestones",d:"Click and earning milestones",on:true},{l:"Security Alerts",d:"Suspicious login activity",on:true}].map((n,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 15px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12}}><div><div style={{color:"#e5e7eb",fontSize:13,fontWeight:600}}>{n.l}</div><div style={{color:"#4b5563",fontSize:11,marginTop:2}}>{n.d}</div></div><div style={{width:38,height:21,borderRadius:11,background:n.on?"#7c3aed":"rgba(255,255,255,0.06)",position:"relative",cursor:"pointer",flexShrink:0}}><div style={{width:15,height:15,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:n.on?"calc(100% - 18px)":3}}/></div></div>))}</div><div style={{marginTop:14}}><Btn onClick={()=>save("notif")} v="primary">Save Preferences</Btn></div>{saved==="notif"&&<div style={{color:"#34d399",fontSize:12,marginTop:8}}>Saved!</div>}</Card>)}
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminShell({children,onSwitch,onLogout}) {
  return(
    <div style={{minHeight:"100vh",background:"#080812",fontFamily:FF,color:"#e5e7eb"}}>
      <header style={{background:"linear-gradient(135deg,rgba(13,13,31,0.98),rgba(9,9,15,0.98))",borderBottom:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",padding:"0 24px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:30}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 16px rgba(124,58,237,0.4)"}}>⚡</div>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:15}}>ClickEarn <span style={{color:"#7c3aed"}}>Pro</span> <span style={{fontSize:11,color:"#f59e0b",background:"rgba(245,158,11,0.1)",padding:"2px 8px",borderRadius:6,fontWeight:700}}>ADMIN</span></div>
            <div style={{color:"#374151",fontSize:11}}>Balance Management</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onSwitch} style={{padding:"7px 14px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:9,color:"#f59e0b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FF}}>👤 User View</button>
          <button onClick={onLogout} style={{padding:"7px 14px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:9,color:"#f87171",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FF}}>Sign Out</button>
        </div>
      </header>
      <main style={{padding:"24px 20px",maxWidth:1200,margin:"0 auto"}}>{children}</main>
    </div>
  );
}

function AdminBalanceManager({users,onUpdateUsers}) {
  const [search,setSearch]=useState("");
  const [editModal,setEditModal]=useState(null); // { user, mode: "set"|"add"|"subtract" }
  const [amount,setAmount]=useState("");
  const [note,setNote]=useState("");
  const [toast,setToast]=useState(null);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const filtered=users.filter(u=>
    u.name.toLowerCase().includes(search.toLowerCase())||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit=(user,mode)=>{setEditModal({user,mode});setAmount("");setNote("");};

  const applyChange=()=>{
    const val=parseFloat(amount);
    if(isNaN(val)||val<0){showToast("Invalid amount","error");return;}
    const updated=users.map(u=>{
      if(u.id!==editModal.user.id)return u;
      let newBal=u.balance;
      if(editModal.mode==="set") newBal=val;
      else if(editModal.mode==="add") newBal=u.balance+val;
      else if(editModal.mode==="subtract") newBal=Math.max(0,u.balance-val);
      return {...u,balance:parseFloat(newBal.toFixed(2))};
    });
    onUpdateUsers(updated);
    const u=editModal.user;
    const modeLabel={set:"set to",add:"added to",subtract:"deducted from"}[editModal.mode];
    showToast(`$${val.toFixed(2)} ${modeLabel} ${u.name}`);
    setEditModal(null);
  };

  const totalBalance=users.reduce((s,u)=>s+u.balance,0);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Toast */}
      {toast&&(
        <div style={{position:"fixed",top:80,right:24,zIndex:300,background:toast.type==="error"?"rgba(239,68,68,0.15)":"rgba(16,185,129,0.15)",border:`1px solid ${toast.type==="error"?"rgba(239,68,68,0.4)":"rgba(16,185,129,0.4)"}`,borderRadius:14,padding:"12px 20px",color:toast.type==="error"?"#f87171":"#34d399",fontWeight:700,fontSize:13,fontFamily:FF,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
          {toast.type==="error"?"❌":"✅"} {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
        <SC label="Total Users" value={users.length} emoji="👥" color="#7c3aed"/>
        <SC label="Total Balance" value={f$(totalBalance)} sub="All users combined" emoji="💰" color="#10b981"/>
        <SC label="Avg Balance" value={f$(totalBalance/users.length)} emoji="📊" color="#06b6d4"/>
        <SC label="Zero Balance" value={users.filter(u=>u.balance===0).length} sub="Users" emoji="⚠️" color="#ef4444"/>
      </div>

      {/* User List */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:16}}>User Balance Manager</div>
            <div style={{color:"#6b7280",fontSize:12,marginTop:2}}>Set, add, or deduct balance for any user</div>
          </div>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search users..."
            style={{padding:"9px 14px",background:"rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#fff",fontSize:13,fontFamily:FF,outline:"none",width:220}}
          />
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(u=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,transition:"border-color 0.15s"}}>
              {/* Avatar */}
              <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:"#fff",flexShrink:0}}>
                {u.name[0]}
              </div>

              {/* Info */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                  <span style={{color:"#fff",fontWeight:800,fontSize:14}}>{u.name}</span>
                  {u.isBlocked&&<Badge status="blocked"/>}
                  <span style={{color:"#4b5563",fontSize:11}}>{u.country}</span>
                </div>
                <div style={{color:"#6b7280",fontSize:11}}>{u.email}</div>
              </div>

              {/* Balance display */}
              <div style={{textAlign:"center",minWidth:80}}>
                <div style={{color:"#a78bfa",fontWeight:800,fontSize:20}}>{f$(u.balance)}</div>
                <div style={{color:"#4b5563",fontSize:10,marginTop:2}}>balance</div>
              </div>

              {/* Action buttons */}
              <div style={{display:"flex",gap:6,flexShrink:0,flexWrap:"wrap"}}>
                <button
                  onClick={()=>openEdit(u,"add")}
                  style={{padding:"7px 14px",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:9,color:"#34d399",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FF,whiteSpace:"nowrap"}}
                >+ Add</button>
                <button
                  onClick={()=>openEdit(u,"subtract")}
                  style={{padding:"7px 14px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:9,color:"#f87171",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FF,whiteSpace:"nowrap"}}
                >− Deduct</button>
                <button
                  onClick={()=>openEdit(u,"set")}
                  style={{padding:"7px 14px",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:9,color:"#a78bfa",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FF,whiteSpace:"nowrap"}}
                >Set</button>
              </div>
            </div>
          ))}
          {filtered.length===0&&(
            <div style={{color:"#4b5563",textAlign:"center",padding:"40px 0",fontSize:13}}>No users found</div>
          )}
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        open={!!editModal}
        onClose={()=>setEditModal(null)}
        title={editModal?`${editModal.mode==="set"?"Set Balance":editModal.mode==="add"?"Add to Balance":"Deduct from Balance"} — ${editModal.user.name}`:""}>
        {editModal&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Current balance info */}
            <div style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.18)",borderRadius:14,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"#9ca3af",fontSize:12}}>Current Balance</div>
              <div style={{color:"#a78bfa",fontSize:22,fontWeight:800}}>{f$(editModal.user.balance)}</div>
            </div>

            {/* Mode indicator */}
            <div style={{display:"flex",gap:6}}>
              {[["set","Set Exact","#7c3aed"],["add","Add Amount","#10b981"],["subtract","Deduct Amount","#ef4444"]].map(([m,l,c])=>(
                <button key={m} onClick={()=>setEditModal(e=>({...e,mode:m}))} style={{flex:1,padding:"9px 0",borderRadius:10,border:`1px solid ${editModal.mode===m?c:"rgba(255,255,255,0.08)"}`,cursor:"pointer",fontFamily:FF,fontSize:12,fontWeight:700,background:editModal.mode===m?`${c}22`:"transparent",color:editModal.mode===m?c:"#6b7280"}}>{l}</button>
              ))}
            </div>

            {/* Amount input */}
            <div>
              <div style={{color:"#9ca3af",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>
                {editModal.mode==="set"?"New Balance (USD)":editModal.mode==="add"?"Amount to Add (USD)":"Amount to Deduct (USD)"}
              </div>
              <input
                type="number"
                value={amount}
                onChange={e=>setAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                autoFocus
                style={{width:"100%",padding:"14px 16px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(124,58,237,0.4)",borderRadius:12,color:"#fff",fontSize:24,fontWeight:800,fontFamily:FF,outline:"none",boxSizing:"border-box",textAlign:"center"}}
              />
              {/* Quick amounts */}
              <div style={{display:"flex",gap:6,marginTop:8}}>
                {["1","5","10","20","50","100"].map(v=>(
                  <button key={v} onClick={()=>setAmount(v)} style={{flex:1,padding:"6px 0",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"#9ca3af",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FF}}>${v}</button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {amount&&!isNaN(parseFloat(amount))&&(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"12px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#6b7280",marginBottom:6}}><span>Current</span><span>{f$(editModal.user.balance)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                  <span style={{color:"#6b7280"}}>Change</span>
                  <span style={{color:editModal.mode==="subtract"?"#f87171":editModal.mode==="add"?"#34d399":"#a78bfa",fontWeight:700}}>
                    {editModal.mode==="set"?"→":editModal.mode==="add"?"+":"−"} {f$(parseFloat(amount))}
                  </span>
                </div>
                <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800}}>
                  <span style={{color:"#9ca3af"}}>New Balance</span>
                  <span style={{color:"#a78bfa"}}>
                    {f$(editModal.mode==="set"
                      ?parseFloat(amount)
                      :editModal.mode==="add"
                        ?editModal.user.balance+parseFloat(amount)
                        :Math.max(0,editModal.user.balance-parseFloat(amount)))}
                  </span>
                </div>
              </div>
            )}

            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>setEditModal(null)} v="red" full>Cancel</Btn>
              <Btn onClick={applyChange} v="primary" full disabled={!amount||isNaN(parseFloat(amount))}>Confirm</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role,setRole]=useState(null); // null | "user" | "admin"
  const [users,setUsers]=useState(INIT_USERS);
  const [transactions,setTransactions]=useState(INIT_TRANSACTIONS);
  const [withdrawals,setWithdrawals]=useState(INIT_WITHDRAWALS);
  const [activeNav,setActiveNav]=useState("dash");

  const currentUser=users.find(u=>u.id==="u1");

  const handleLogin=(r)=>setRole(r);
  const handleLogout=()=>setRole(null);

  const updateCurrentUser=(updated)=>setUsers(us=>us.map(u=>u.id===updated.id?updated:u));
  const addWithdrawal=(w)=>setWithdrawals(ws=>[...ws,w]);

  if(!role) return <Auth onLogin={handleLogin}/>;

  if(role==="admin") return(
    <AdminShell onSwitch={()=>setRole("user")} onLogout={handleLogout}>
      <AdminBalanceManager users={users} onUpdateUsers={setUsers}/>
    </AdminShell>
  );

  return(
    <UserShell active={activeNav} setActive={setActiveNav} user={currentUser} onSwitch={()=>setRole("admin")} onLogout={handleLogout}>
      {activeNav==="dash"&&<UDashboard user={currentUser} transactions={transactions}/>}
      {activeNav==="links"&&<ULinks user={currentUser}/>}
      {activeNav==="withdraw"&&<UWithdraw user={currentUser} withdrawals={withdrawals} onNewWithdraw={addWithdrawal}/>}
      {activeNav==="offers"&&<UOffers user={currentUser}/>}
      {activeNav==="stats"&&<UStats/>}
      {activeNav==="profile"&&<UProfile user={currentUser} onUpdateUser={updateCurrentUser}/>}
    </UserShell>
  );
}
