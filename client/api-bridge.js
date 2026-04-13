
const API_BASE = "/api";

async function apiGet(url){
  const r = await fetch(API_BASE + url);
  return await r.json();
}
async function apiPost(url, data){
  return await fetch(API_BASE + url, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(data||{})
  });
}
async function apiDelete(url){
  return await fetch(API_BASE + url, { method:"DELETE" });
}

let cache = [];

async function loadAll(){
  try {
    cache = await apiGet("/orphans");
  } catch(e){ cache=[]; }
}

window.API = {
  list: ()=>apiGet("/orphans"),
  add: (d)=>apiPost("/orphans", d),
  delete: (id)=>apiDelete("/orphans/"+id)
};

document.addEventListener("DOMContentLoaded", loadAll);
