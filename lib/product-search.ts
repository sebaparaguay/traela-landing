// Pure normalization/ranking shared by the server, UI and regression tests.
export type Product = {
 id:string; title:string; image_url:string|null; images:string[]; source:string;
 source_url:string; rating:number|null; reviews:number|null; condition:string;
 description:string; highlights:string[]; match_reasons:string[]; product_query:string;
};
type Row=Record<string,unknown>;
export const normalizeText=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
export function safeUrl(value:unknown){if(typeof value!=='string')return '';try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}}
const text=(v:unknown,n=400)=>typeof v==='string'?v.slice(0,n):'';
const number=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)?v:null;
export function normalizeProducts(payload:unknown):Product[]{
 const root=Array.isArray(payload)?payload[0]:payload;
 if(!root||typeof root!=='object')return [];
 const d=root as Row,rows=Array.isArray(d.products)?d.products:Array.isArray(d.shopping_results)?d.shopping_results:[];
 return rows.slice(0,60).filter((p):p is Row=>!!p&&typeof p==='object'&&typeof p.title==='string').map((p,i)=>{
  const images=[p.image_url,p.thumbnail,...(Array.isArray(p.images)?p.images:[]),...(Array.isArray(p.thumbnails)?p.thumbnails:[])].map(safeUrl).filter(Boolean);
  const rating=number(p.rating),reviews=number(p.reviews);
  return {id:String(p.id||p.product_id||i).slice(0,180),title:text(p.title,350),image_url:images[0]||null,images:[...new Set(images)].slice(0,6),source:text(p.source,100),source_url:safeUrl(p.source_url||p.product_link||p.link),rating:rating!==null&&rating>=0&&rating<=5?rating:null,reviews:reviews!==null&&reviews>=0?Math.floor(reviews):null,condition:text(p.second_hand_condition||p.condition,100),description:text(p.description||p.snippet,1800),highlights:(Array.isArray(p.highlights)?p.highlights:Array.isArray(p.extensions)?p.extensions:[]).filter((v):v is string=>typeof v==='string').slice(0,6).map(v=>v.slice(0,240)),match_reasons:[],product_query:''};
 });
}
const stop=new Set('busco buscar quiero comprar necesito para por de del la el los las un una unos unas y con que me recomendas recomienda hasta menos mas presupuesto guaranies guarani pyg usd dolares algo'.split(' '));
const expand=(s:string)=>s.replace(/zapatillas?|championes?|calzados?/g,'shoes').replace(/correr|running/g,'running').replace(/auriculares?|audifonos?/g,'headphones').replace(/inalambricos?/g,'wireless').replace(/cafeteras?/g,'coffee maker').replace(/hombres?|mens?|masculinos?|caballeros?/g,'men').replace(/mujeres?|womens?|femeninos?|damas?/g,'women').replace(/negros?/g,'black').replace(/blancos?/g,'white').replace(/azules?/g,'blue').replace(/rojos?/g,'red');
const gender=(s:string)=>/\b(women|mujer|femenin|dama)/.test(s)?'women':/\b(men|hombre|masculin|caballero)/.test(s)?'men':'';
const isChild=(s:string)=>/\b(kids?|child|children|junior|toddler|boys?|girls?|ninos?|ninas?|infantil|baby)\b/.test(s);
const accessory=/\b(case|funda|protector|cover|replacement|repuesto|attachment|charger|cargador|correa|strap)\b/;
export function rankProducts(products:Product[],query:string):Product[]{
 const clean=normalizeText(query.replace(/(?:₲|\bPYG\b|\bUSD\b|\$)\s*[\d.,]+/gi,'')).replace(/\b(?:talle|size|hasta|presupuesto)\s+\d+\b/g,' ').replace(/\b\d+\s*(?:km|kilos|kg|gs|pyg|usd|guaranies)\b/g,' ');
 const expanded=expand(clean),tokens=[...new Set(expanded.split(' ').filter(t=>t.length>1&&!stop.has(t)))];
 const models=clean.match(/\b[a-z]*\d+[a-z]*\b/g)||[],wantedGender=gender(expanded),wantsChild=isChild(clean),wantsAccessory=accessory.test(clean),wantsUsed=/\b(usado|used|refurbished|reacondicionado|segunda mano)\b/.test(clean),wantsNew=/\b(nuevo|new|original sellado)\b/.test(clean);
 const brands=['nike','adidas','dyson','apple','samsung','sony','bose','garmin','lenovo','asus','tumi','canon','nintendo'];
 const brand=brands.find(b=>new RegExp('\\b'+b+'\\b').test(clean));
 const seen=new Set<string>();
 return products.map((p,index)=>{
  const title=expand(normalizeText(p.title)),words=new Set(title.split(' ')),pg=gender(title),reasons:string[]=[];
  if(models.some(m=>!words.has(m)))return null;
  if(brand&&!words.has(brand))return null;
  if(wantedGender&&pg&&wantedGender!==pg&&!/unisex/.test(title))return null;
  if(!wantsChild&&isChild(title))return null;
  if(!wantsAccessory&&accessory.test(title))return null;
  const colors=['black','white','blue','red','pink','green'];
  const requestedColor=colors.find(c=>new RegExp('\\b'+c+'\\b').test(expanded));
  const listedColors=colors.filter(c=>words.has(c));
  if(requestedColor&&listedColors.length&&!listedColors.includes(requestedColor))return null;
  const used=/\b(used|refurbished|pre owned|second hand|usado|reacondicionado)\b/.test(title+' '+normalizeText(p.condition))||/\bcloset\b/.test(title);
  if(wantsNew&&used)return null;
  const hits=tokens.filter(t=>words.has(t)),coverage=tokens.length?hits.length/tokens.length:0;
  if(tokens.length&&coverage<.2)return null;
  let score=coverage*100+models.length*20-index*.05;
  if(brand)reasons.push('Coincide con la marca que buscás');
  if(models.length)reasons.unshift('Coincide con el modelo solicitado');
  if(wantedGender&&pg===wantedGender){score+=12;reasons.push('Coincide con la variante indicada');}
  if(wantsChild&&isChild(title))score+=12;
  if(used&&!wantsUsed)score-=30;
  if(p.source_url)score+=3;
  if(p.image_url)score+=2;
  if(p.rating!==null&&p.reviews!==null&&p.reviews>=5)score+=Math.min(5,Math.max(0,p.rating-3)*Math.log10(p.reviews+1));
  if(!reasons.length)reasons.push('Coincide con los términos de tu búsqueda');
  return {p:{...p,match_reasons:reasons.slice(0,3),product_query:query},score};
 }).filter((p):p is NonNullable<typeof p>=>p!==null).sort((a,b)=>b.score-a.score).filter(({p})=>{
  const key=normalizeText(p.title)+'|'+normalizeText(p.source);if(seen.has(key))return false;seen.add(key);return true;
 }).slice(0,8).map(({p})=>p);
}
export function providerQuery(query:string){return expand(normalizeText(query).replace(/^(busco|buscar|quiero comprar|necesito)\s+/,'' )).split(' ').filter(t=>!stop.has(t)).join(' ').slice(0,250);}
export function productHref(p:Pick<Product,'id'|'product_query'>){return '/product?'+new URLSearchParams({id:p.id,q:p.product_query.slice(0,250)}).toString();}

export function resolveSearchQuery(message:string,history:{role:string;text:string}[]){
 const q=normalizeText(message);
 if(!/^(mas (barato|economico|opciones)|mostrame (algo )?mas|en (negro|blanco|azul|rojo)|negro|blanco|azul|rojo|para (hombre|mujer)|hombre|mujer)/.test(q))return message;
 const previous=[...history].reverse().find(t=>t.role==='user'&&t.text.trim().length>12&&!/^(hola|gracias|cotiz)/i.test(t.text));
 return previous?(previous.text+' '+message).slice(0,250):message;
}
