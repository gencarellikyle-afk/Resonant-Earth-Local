import{createClient}from"@supabase/supabase-js";
export async function POST(req){
const authHeader=req.headers.get("authorization");
if(authHeader!=="Bearer "+process.env.CRON_SECRET&&process.env.NODE_ENV!=="development")return Response.json({error:"Unauthorized"},{status:401});
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const now=new Date();
const oneHourAgo=new Date(now.getTime()-60*60*1000).toISOString();
const oneDayAgo=new Date(now.getTime()-24*60*60*1000).toISOString();
const[recentSigs,daySigs,lastTen]=await Promise.all([
supabase.from("signals").select("id,country,coherence").gte("created_at",oneHourAgo),
supabase.from("signals").select("id,country").gte("created_at",oneDayAgo),
supabase.from("signals").select("text,coherence").order("created_at",{ascending:false}).limit(10)
]);
const recentCount=recentSigs.data?.length||0;
const dayCount=daySigs.data?.length||1;
const hourlyAvg=dayCount/24;
const velocity=Math.min(1,recentCount/(hourlyAvg*2+0.1));
const countries=new Set((daySigs.data||[]).map(s=>s.country).filter(Boolean)).size;
const geoSpread=Math.min(1,countries/10);
const texts=(lastTen.data||[]).map(s=>s.text).filter(Boolean);
let sentimentAvg=0.5;
if(texts.length>0){
try{
const response=await fetch("https://api.anthropic.com/v1/messages",{
method:"POST",
headers:{"Content-Type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:200,messages:[{role:"user",content:"Score the collective presence and groundedness of these field signals on a scale from 0.0 to 1.0. 0 = scattered, fearful, disconnected. 1 = grounded, present, clear. Return only a JSON object like: {score: 0.72}. Signals: "+JSON.stringify(texts)}]})
});
const result=await response.json();console.log("anthropic result:",JSON.stringify(result).slice(0,500));
const text=result.content?.[0]?.text||"";
const match=text.match(/[\d.]+/);
if(match)sentimentAvg=Math.max(0,Math.min(1,parseFloat(match[0])));
}catch(e){sentimentAvg=0.5;}}
const safeSentiment=sentimentAvg||0.5;const score=Math.max(0.1,Math.min(1,velocity*0.4+safeSentiment*0.35+geoSpread*0.15+0.1));
await supabase.from("coherence_snapshots").insert({score,signal_velocity:velocity,sentiment_avg:sentimentAvg,geo_spread:geoSpread,return_rate:0.1,signal_count:recentCount});
return Response.json({score,velocity,sentimentAvg,geoSpread,signalCount:recentCount});}