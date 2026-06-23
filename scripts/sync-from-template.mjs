#!/usr/bin/env node
/**
 * Sync the shared "mold" from the viaje-template, keeping THIS trip's content.
 *
 * One repo per trip means a fix in the mold (components, schema, lib, skills, CI,
 * config, docs) doesn't reach trips already spun up. Run this in a trip repo to
 * pull the latest mold from the template WITHOUT touching the content layer
 * (site.config.ts, trip.ts, images.ts, the fetch-images QUERIES, public/img).
 *
 *   git remote add template https://github.com/bzamoraur/mobileapp.git   # once
 *   npm run sync-template
 *   npm install && npm run check    # then review the diff, commit, open a PR
 *
 * Flags:
 *   --remote <name>   template remote name (default: "template")
 *   --branch <name>   template branch       (default: "main")
 */
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const remote = opt('--remote', 'template');
const branch = opt('--branch', 'main');
const ref = `${remote}/${branch}`;

const sh = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();
const run = (cmd) => execSync(cmd, { stdio: 'pipe' });

// Files/dirs that belong to THIS trip — never overwritten by the template.
const CONTENT_FILES = new Set([
  'src/site.config.ts',
  'src/data/trip.ts',
  'src/data/images.ts',
  'scripts/fetch-images.mjs', // holds the per-trip image QUERIES
]);
const CONTENT_DIRS = ['public/img/'];
const isContent = (f) => CONTENT_FILES.has(f) || CONTENT_DIRS.some((d) => f.startsWith(d));

// 1. Refuse on a dirty tree, so the sync lands as a clean, reviewable diff.
if (sh('git status --porcelain')) {
  console.error('Working tree not clean. Commit or stash your changes first, then re-run.');
  process.exit(1);
}

// 2. Verify the template remote exists.
const remotes = sh('git remote').split('\n').filter(Boolean);
if (!remotes.includes(remote)) {
  console.error(
    `No "${remote}" git remote found. Add it once:\n` +
      `  git remote add ${remote} https://github.com/bzamoraur/mobileapp.git\n` +
      'then re-run:  npm run sync-template',
  );
  process.exit(1);
}

// 3. Fetch the template branch.
console.log(`Fetching ${ref} …`);
run(`git fetch ${remote} ${branch}`);

// 4. Mold = every file in the template except the content layer.
const templateFiles = sh(`git ls-tree -r --name-only ${ref}`).split('\n').filter(Boolean);
const moldFiles = templateFiles.filter((f) => !isContent(f));

// 5. Overwrite the mold from the template; the content layer is left untouched.
for (let i = 0; i < moldFiles.length; i += 200) {
  const chunk = moldFiles
    .slice(i, i + 200)
    .map((f) => `'${f}'`)
    .join(' ');
  run(`git checkout ${ref} -- ${chunk}`);
}

// 6. Report what changed.
const changed = sh('git status --porcelain').split('\n').filter(Boolean);
if (changed.length === 0) {
  console.log('✓ Already up to date with the template — no mold changes.');
} else {
  console.log(`✓ Synced the mold from ${ref}. ${changed.length} file(s) changed:`);
  console.log(changed.map((l) => '  ' + l).join('\n'));
  console.log(
    '\nContent preserved: site.config.ts, trip.ts, images.ts, fetch-images QUERIES, public/img.\n' +
      'Next: npm install && npm run check → review the diff → commit → open a PR.',
  );
}
console.log(
  '\nNote: a file deleted in the template is not auto-removed here — scan git status for stragglers.',
);
