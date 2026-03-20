import{createClient}from"@supabase/supabase-js";
export async function GET(){
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const{data,error}=await supabase.from("coherence_snapshots").select("score,created_at").order("created_at",{ascending:false}).limit(1);
if(error||!data||data.length===0)return Response.json({score:null});
const snapshot=data[0];
const age=Date.now()-new Date(snapshot.created_at).getTime();
const maxAge=30*60*1000;
if(age>maxAge)return Response.json({score:null,stale:true});
return Response.json({score:snapshot.score,created_at:snapshot.created_at});}