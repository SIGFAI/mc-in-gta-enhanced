// Minecraft in GTA Enhanced (GrantMatas, MIT; a port of universal-modder's GTA V passthrough to GTA V Enhanced): real
// Minecraft 26.3 composited into GTA V Enhanced story mode, Steve picked from the character wheel. No upstream release:
// SIGF built MCPassthrough.asi and the Fabric jar from the pinned commit on a disposable AWS builder (library/QC.md
// section 4; source.json "built"), hosted on SIGFAI/mc-in-gta-enhanced with ReShade 6.8.0 (BSD-3-Clause, unchanged).
// Upstream's Windows launcher ("Minecraft in GTA.exe") is not shipped: it starts Minecraft as a Gradle dev client from a
// checkout; here Minecraft runs in the app's Prism instance with the player's account, and the app starts both games.
// ScriptHookV is linked, never shipped.
//   SIGF_LIBRARY_BUILDS=<dir> node library/mc-in-gta-enhanced/build.mjs      (outputs: library/lib.mjs)
import { instanceName } from '../../orchestrator/scripts/package-fusion.mjs';
import { mrpack, resolveFabricApi } from '../../orchestrator/src/recipe.js';
import { asset, card, dl, emit } from '../lib.mjs';
import { builtArtifacts, builtField, gtaAsset, gtaRequires, reshadeAsset, reshadeBundled, sourceOf } from '../um-gta5-passthrough/sigf-build.mjs';

const ID = 'mc-in-gta-enhanced', VERSION = '0.1.0', NAME = 'Minecraft in GTA Enhanced';
const SRC = sourceOf(ID);
const UP = { repo: SRC.repo, commit: SRC.commit, authors: ['GrantMatas', 'rehan-remade'] };
const MC = { mc: '26.3', loader: '0.19.5', fabricApi: '0.161.0+26.3', java: '25' }; // mc/gradle.properties at the commit
const JAR = 'passthrough-0.1.0.jar';
const TAGLINE = 'Real Minecraft 26.3 inside GTA V Enhanced story mode: pick Steve on the character wheel and build, fight and blow things up in Los Santos.';

const files = builtArtifacts(ID);
const reshade = reshadeAsset(files);
// args.txt as upstream's scripts/setup.ps1 stages it; ReShadePreset.ini is upstream's launcher/ReShadePreset.ini.
const gta = gtaAsset(ID, files, { args: '-nobattleye\r\n', preset: files.get('ReShadePreset.ini'), extra: [
  { name: 'LICENSE-mc-in-gta-enhanced.txt', data: files.get('LICENSE') },
  { name: 'THIRD_PARTY_NOTICES-mc-in-gta-enhanced.md', data: files.get('THIRD_PARTY_NOTICES.md') },
] });
const pack = async (offline) => {
  const fabricApi = offline ? null : await resolveFabricApi(MC.fabricApi, MC.mc);
  if (!offline && !fabricApi?.download) throw new Error(`Fabric API ${MC.fabricApi} not resolved on Modrinth`);
  return asset(`${ID}.mrpack`, mrpack({ name: NAME, summary: TAGLINE, versions: MC, versionId: VERSION, fabricApi,
    jars: [{ name: JAR, data: files.get(JAR) }], extra: [{ name: 'overrides/licenses/mc-in-gta-enhanced-LICENSE.txt', data: files.get('LICENSE') }] }));
};
const assets = [reshade, gta, await pack(false)];

const make = (urls, set) => {
  const mp = set.find(a => a.name.endsWith('.mrpack'));
  return {
    id: `sigf/${ID}`,
    version: VERSION,
    name: NAME,
    tagline: TAGLINE,
    kind: 'passthrough',
    games: [
      { game: 'gta5', role: 'host', label: 'GTA V Enhanced', engine: 'GTA V Enhanced (RAGE, story mode) + ScriptHookV ASI MCPassthrough (C++) + ReShade add-on', apps: { steam: '3240220' }, builds: { steam: ['1.0.1158.16'] }, runtime: 'GTA V Enhanced (GTA5_Enhanced.exe), loaded upstream on 1.0.1158.16; Legacy is not supported' },
      { game: 'minecraft', role: 'guest', label: 'Minecraft', engine: 'Minecraft Java 26.3 + Fabric mod passthrough (Java)', mc: MC.mc, loader: `fabric@${MC.loader}`, java: MC.java },
    ],
    requires: [
      ...gtaRequires(reshade, urls, { shvNote: 'Script Hook V for your GTA V Enhanced build: copy ScriptHookV.dll, dinput8.dll and xinput1_4.dll from its download into the GTA V Enhanced folder' }),
      { id: 'fabric-loader', version: MC.loader },
      { id: 'fabric-api', version: MC.fabricApi, note: 'in the Minecraft pack (downloaded from Modrinth)' },
    ],
    install: [
      { game: 'gta5', strategy: 'game-dir-snapshot', loader: 'scripthookv', files: [
        { src: reshade.name, dst: '{game}', unpack: true, contents: reshade.contents, ...dl(reshade, urls) },
        { src: gta.name, dst: '{game}', unpack: true, contents: gta.contents, ...dl(gta, urls) },
      ] },
      { game: 'minecraft', strategy: 'mrpack', pack: { src: mp.name, ...dl(mp, urls) } },
    ],
    // Minecraft first (its mod serves the link on 127.0.0.1:25599), then GTA V Enhanced; the player picks Story Mode.
    launch: [{ game: 'minecraft', wait: 'port:25599' }, { game: 'gta5', args: [] }],
    files: set.map(a => ({ name: a.name, ...dl(a, urls) })),
    source: {
      repo: UP.repo, license: 'MIT AND BSD-3-Clause', upstream_license: SRC.license, commit: UP.commit,
      hosted: `https://github.com/SIGFAI/${ID}`,
      derived_from: { repo: 'https://github.com/rehan-remade/universal-modder', path: 'examples/minecraft-gta5-passthrough', commit: '15d6f9d', license: 'MIT' },
      built: builtField(ID),
      bundled: [reshadeBundled()],
    },
    media: {},
    built_by: { author: UP.authors[0], authors: UP.authors, packaged_by: 'SIGF' },
    idea_by: UP.authors[0],
    built_at: '2026-10-05T00:00:00.000Z',
    ...card(UP.repo),
    notes: [
      'You need GTA V Enhanced (Steam, GTA5_Enhanced.exe; not the Legacy edition) and Minecraft: Java Edition. Windows only.',
      'Install Script Hook V for your Enhanced build yourself first (it may not be redistributed): from dev-c.com, copy ScriptHookV.dll, dinput8.dll and xinput1_4.dll into the GTA V Enhanced folder. Check that it supports your exact game build.',
      'The app adds MCPassthrough.asi, ReShade 6.8.0 (as ReShade64.asi, with ReShade.ini and the MCPassthrough effect) and args.txt (-nobattleye) to the GTA folder; Restore removes them and puts back any file they replaced.',
      `Press Play: Minecraft starts first (the app's Prism instance "${instanceName(`sigf/${ID}`)}", Minecraft ${MC.mc}, Fabric Loader ${MC.loader}, Fabric API ${MC.fabricApi}, Java ${MC.java}, your own Minecraft account); leave its window open. Then GTA V Enhanced starts with BattlEye off: enter Story Mode, then pick Steve on the character wheel (Left Alt or D-pad Down). Picking a GTA character leaves Steve mode; F7 toggles it, F8 re-levels the ground.`,
      'Story mode only: the mod switches itself off in GTA Online. Back up your saves first.',
      'Upstream\'s own launcher EXE is not included: it runs Minecraft as a developer client; the app starts both games instead.',
      'The link listens on 127.0.0.1:25599 with no authentication while Minecraft runs (upstream design).',
      `SIGF build of ${UP.commit.slice(0, 7)} (no upstream release; the author calls it experimental). Beta: report bugs to the author on the upstream issue tracker.`,
    ],
  };
};

emit({ slug: ID, version: VERSION, assets, make });
