import type {Product} from './product-search';
type Entry={product:Product;saved:number};
const KEY='traela_product_details_v1';
export function rememberProduct(product:Product){
 try{const entries:Entry[]=JSON.parse(sessionStorage.getItem(KEY)||'[]');const next=[{product,saved:Date.now()},...(Array.isArray(entries)?entries:[]).filter(e=>e.product?.id!==product.id)].slice(0,16);sessionStorage.setItem(KEY,JSON.stringify(next));}catch{/* The URL can restore text-search products when browser storage is unavailable. */}
}
export function recalledProduct(id:string,query:string):Product|null{
 try{const entries:Entry[]=JSON.parse(sessionStorage.getItem(KEY)||'[]');if(!Array.isArray(entries))return null;return entries.find(e=>e.product?.id===id&&e.product.product_query===query&&Date.now()-e.saved<600000)?.product||null;}catch{return null;}
}
