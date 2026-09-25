import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { MODULE_1_HANDBOOKS, buildMediumStyleHandbook } from './module1_authoring';

const envContent = fs.existsSync('.env.local')
  ? fs.readFileSync('.env.local', 'utf8')
  : fs.existsSync('.env')
  ? fs.readFileSync('.env', 'utf8')
  : '';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim() ||
  '';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() ||
  '';

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

async function rewriteModule1() {
  console.log('Fetching 50 Module 1 nodes from Supabase...');
  const { data: nodes, error } = await supabase
    .from('curriculum_nodes')
    .select('id, title, curriculum_spec_markdown, starter_code, test_suite')
    .eq('phase_id', 'module-1')
    .order('order_index');

  if (error || !nodes) {
    console.error('Failed to fetch nodes:', error);
    process.exit(1);
  }

  console.log(`Rewriting ${nodes.length} lessons with Medium-style educative handbooks...`);

  let updatedCount = 0;
  for (const node of nodes) {
    const starterText = typeof node.starter_code === 'object' && node.starter_code
      ? Object.values(node.starter_code).join('\n')
      : String(node.starter_code || '');

    const testText = typeof node.test_suite === 'object' && node.test_suite
      ? Object.values(node.test_suite).join('\n')
      : String(node.test_suite || '');

    const customData = MODULE_1_HANDBOOKS[node.id];
    const newHandbook = buildMediumStyleHandbook(
      node.id,
      node.title,
      node.curriculum_spec_markdown || '',
      starterText,
      testText,
      customData
    );

    const { error: updateErr } = await supabase
      .from('curriculum_nodes')
      .update({
        handbook_markdown: newHandbook,
        content_status: 'reviewed'
      })
      .eq('id', node.id);

    if (updateErr) {
      console.error(`Error updating ${node.id}:`, updateErr);
    } else {
      updatedCount++;
    }
  }

  console.log(`✓ Successfully updated ${updatedCount}/50 Module 1 lessons in Supabase!`);
}

rewriteModule1();
