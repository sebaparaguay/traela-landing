import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import assert from 'node:assert/strict';
(async () => {
 const pg = new PGlite();
 try {
  await pg.exec('create role anon; create role authenticated; create role service_role;');
  await pg.exec(fs.readFileSync('supabase/operator.sql','utf8'));
  const key='a'.repeat(64), messageId='00000000-0000-4000-8000-000000000002';
  const receive=()=>pg.query('select traela_receive($1,$2,$3,$4) as result',[key,'Nike Pegasus 41',messageId,{}]);
  const c=(await receive()).rows[0].result;
  assert.equal(c.auto_enabled,true);
  assert.equal((await receive()).rows[0].result.duplicate,true);
  await pg.query('select traela_publish_auto($1,$2,$3,$4)',[c.id,'Necesita cotización',{},true]);
  const paused=(await pg.query('select auto_enabled,status from traela_conversations where id=$1',[c.id])).rows[0];
  assert.equal(paused.auto_enabled,false); assert.equal(paused.status,'needs_quote');
  assert.equal((await pg.query('select traela_publish_auto($1,$2,$3,$4) as sent',[c.id,'No debe enviarse',{},false])).rows[0].sent,false);
  await pg.query('select traela_operator_action($1,$2,$3,$4,$5,$6,$7,$8,$9)',[c.id,'quote','Cotización',null,null,null,800000,'2026-10-15','2026-10-20']);
  const quoted=(await pg.query('select quote_pyg,status from traela_conversations where id=$1',[c.id])).rows[0];
  assert.equal(Number(quoted.quote_pyg),800000); assert.equal(quoted.status,'waiting_payment');
  await pg.query('select traela_receive($1,$2,$3,$4)',['b'.repeat(64),'Otra consulta','00000000-0000-4000-8000-000000000003',{}]);
  assert.equal(Number((await pg.query('select count(*) from traela_conversations')).rows[0].count),2);
  await pg.exec('set role anon');
  await assert.rejects(pg.query('select * from traela_messages'));
  await assert.rejects(pg.query('select traela_receive($1,$2,$3,$4)',[key,'No permitido','00000000-0000-4000-8000-000000000004',{}]));
  console.log('PASS: deduplication, pause/handoff, quote transaction, session isolation and anonymous denial.');
 } finally { await pg.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
