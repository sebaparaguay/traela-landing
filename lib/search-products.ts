export type SearchProduct={id:string;title:string;image:string;source:string;url:string;estimate:number|null;recommended:boolean};
export function normalizeProducts(data:unknown):SearchProduct[]{
 const root=Array.isArray(data)?data[0]:data;
 if(!root||typeof root!=='object')return [];
 const d=root as Record<string,unknown>;
 const items=Array.isArray(d.products)?d.products:Array.isArray(d.results)?d.results:[];
 return items.slice(0,12).filter((x):x is Record<string,unknown>=>!!x&&typeof x==='object').map((p,i)=>({id:String(p.id||p.asin||i).slice(0,200),title:String(p.title||p.name||'Producto').slice(0,300),image:safeUrl(p.image_url||p.image||p.thumbnail),source:typeof p.source==='string'?p.source.slice(0,80):typeof p.seller==='string'?p.seller.slice(0,80):'',url:safeUrl(p.source_url||p.product_url||p.url||p.link),estimate:typeof p.traela_price_pyg==='number'&&Number.isFinite(p.traela_price_pyg)&&p.traela_price_pyg>0?p.traela_price_pyg:null,recommended:p.recommended===true}));
}
export function safeUrl(value:unknown){if(typeof value!=='string')return '';try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}}
export function productHref(p:SearchProduct,query:string){return '/product?'+new URLSearchParams({id:p.id,title:p.title,image:p.image,source:p.source,url:p.url,q:query,estimate:p.estimate?String(p.estimate):''}).toString();}

export const formatPYG=(value:number)=>new Intl.NumberFormat('es-PY',{style:'currency',currency:'PYG',maximumFractionDigits:0}).format(value);
