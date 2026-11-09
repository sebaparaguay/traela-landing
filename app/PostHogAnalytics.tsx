"use client";
import { useEffect } from "react";
import Script from "next/script";
declare global { interface Window { posthog?: { init:(key:string,options:Record<string,unknown>)=>void; capture:(name:string,properties?:Record<string,unknown>)=>void; }; __traelaPosthogInitialized?:boolean } }
const key=process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host=process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
export default function PostHogAnalytics(){
 useEffect(()=>{
  if(!key)return;
  const onClick=(event:MouseEvent)=>{
   const el=event.target instanceof Element?event.target.closest("a,button"):null;
   if(!el)return;
   const link=el instanceof HTMLAnchorElement?el:null;
   if(link?.href?.startsWith("https://wa.me/")||link?.href?.includes("api.whatsapp.com")){
    window.posthog?.capture("whatsapp_cta_clicked",{location:window.location.pathname,cta_text:(el.textContent||"").trim().slice(0,100)});
   }
   if(link?.getAttribute("href")?.startsWith("/product"))window.posthog?.capture("product_opened",{location:window.location.pathname});
  };
  const onSubmit=(event:SubmitEvent)=>{
   const form=event.target;
   if(form instanceof HTMLFormElement && (form.querySelector('input[type="search"]')||form.querySelector('input[placeholder*="busc"]')||form.querySelector('input[placeholder*="encontrar"]')))window.posthog?.capture("shopping_search_submitted",{location:window.location.pathname});
  };
  document.addEventListener("click",onClick,true);
  document.addEventListener("submit",onSubmit,true);
  return()=>{document.removeEventListener("click",onClick,true);document.removeEventListener("submit",onSubmit,true)};
 },[]);
 if(!key)return null;
 return <Script src="https://us-assets.i.posthog.com/static/array.js" strategy="afterInteractive" onLoad={()=>{if(window.posthog&&!window.__traelaPosthogInitialized){window.__traelaPosthogInitialized=true;window.posthog.init(key,{api_host:host,person_profiles:"identified_only",capture_pageview:"history_change",capture_pageleave:true});}}}/>;
}
