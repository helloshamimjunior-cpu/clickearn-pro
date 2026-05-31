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
const Modal = ({open,onClose,title,children,width=460})=>{if(!open)return null;return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}><div style={{background:"#0f0f23",border:"1px solid rgba(255,255,255,0.1)",borderRadius:22,width:"100%",maxWidth:width,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 30px 80px rgba(0,0,0,0.6)",fontFamily:FF}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}><span style={{color:"#fff",fontWeight:800,fontSize:16}}>{title}</span><button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,width:32,height:32,cursor:"pointer",color:"#9ca3af",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>x</button></div><div style={{padding:"20px 24px 24px"}}>{children}</div></div></div>);};
