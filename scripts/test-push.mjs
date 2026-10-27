import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {PGlite} from '@electric-sql/pglite';
import webpush from 'web-push';
import {createECDH,randomBytes} from 'node:crypto';
const db=new PGlite();await db.exec('create role anon;create role authenticated;create role service_role bypassrls;');await db.exec(await readFile(new URL('../supabase/push.sql',import.meta.url),'utf8'));
for(const table of ['traela_push_config','traela_push_subscriptions']){for(const role of ['anon','authenticated']){const {rows}=await db.query(`select has_table_privilege('${role}','public.${table}','SELECT') as allowed`);assert.equal(rows[0].allowed,false);}const {rows}=await db.query(`select relrowsecurity from pg_class where relname='${table}'`);assert.equal(rows[0].relrowsecurity,true);}
await db.exec("set role service_role;insert into traela_push_config values(1,'public','private');reset role;");await assert.rejects(db.exec("insert into traela_push_config values(2,'public','private')"));
const vapid=webpush.generateVAPIDKeys(),ecdh=createECDH('prime256v1');ecdh.generateKeys();const subscription={endpoint:'https://fcm.googleapis.com/fcm/send/test',keys:{p256dh:ecdh.getPublicKey().toString('base64url'),auth:randomBytes(16).toString('base64url')}};
const req=webpush.generateRequestDetails(subscription,JSON.stringify({title:'Nuevo mensaje',body:'Abrí tu consola'}),{vapidDetails:{subject:'mailto:sebastian@trae.la',publicKey:vapid.publicKey,privateKey:vapid.privateKey},TTL:3600});assert.ok(req.headers.Authorization);assert.equal(req.headers['Content-Encoding'],'aes128gcm');assert.ok(!req.body.toString().includes('Abrí tu consola'));
const handlers={},notifications=[];vm.runInNewContext(await readFile(new URL('../public/operator-sw.js',import.meta.url),'utf8'),{URL,self:{location:{origin:'https://www.trae.la'},addEventListener:(name,handler)=>handlers[name]=handler,registration:{showNotification:async(...args)=>notifications.push(args)}}});let promise;handlers.push({data:{json:()=>({url:'https://evil.test',title:'Traela'})},waitUntil:p=>promise=p});await promise;assert.equal(notifications[0][1].data.url,'/operator');assert.ok(!notifications[0][1].body.includes('private'));
await db.close();console.log('PASS: private push tables, RLS, server grants, singleton keys, encrypted Web Push, safe notification links');
