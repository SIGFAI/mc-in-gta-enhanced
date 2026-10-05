# Minecraft in GTA Enhanced

Real Minecraft 26.3 inside GTA V Enhanced story mode: pick Steve on the character wheel and build, fight and blow things up in Los Santos.

**Minecraft in GTA Enhanced is made by [GrantMatas](https://github.com/GrantMatas).** All credit for the mod goes to them. It is derived from [rehan-remade/universal-modder](https://github.com/rehan-remade/universal-modder) (`examples/minecraft-gta5-passthrough`), by rehan-remade.

- Original project: https://github.com/GrantMatas/minecraft-in-gta-enhanced
- Report bugs and ask questions there: https://github.com/GrantMatas/minecraft-in-gta-enhanced/issues
- Upstream version packaged here: 0.1.0 (commit [`981f14a`](https://github.com/GrantMatas/minecraft-in-gta-enhanced/tree/981f14ab109d7a8f57b533d4c7ea09a9a36d4255))
- **Built by SIGF from commit [`981f14ab109d7a8f57b533d4c7ea09a9a36d4255`](https://github.com/GrantMatas/minecraft-in-gta-enhanced/tree/981f14ab109d7a8f57b533d4c7ea09a9a36d4255)**, on a disposable build machine (AWS EC2 i-0022be8314df37721 (c6i.4xlarge, Windows Server 2022, terminated after the build)). The app installs these SIGF builds, not binaries from the author.

> **Beta.** Nobody at SIGF has played this build yet. Back up your saves.
> Bugs in the mod itself go to the author's issue tracker above; problems with the one-click install go to this repository's issues.

## What you need

- **GTA V Enhanced** ([Steam](https://store.steampowered.com/app/3240220/)): GTA V Enhanced (GTA5_Enhanced.exe), loaded upstream on 1.0.1158.16; Legacy is not supported.
- **Minecraft**: Java Edition 26.3.
- scripthookv: Script Hook V for your GTA V Enhanced build: copy ScriptHookV.dll, dinput8.dll and xinput1_4.dll from its download into the GTA V Enhanced folder (https://www.dev-c.com/gtav/scripthookv/).
- Windows and the [SIGF app](https://sigf.ai). The app installs reshade 6.8.0 (add-on), fabric-loader 0.19.5, fabric-api 0.161.0+26.3 for you.

## Install

In the SIGF app, open **Minecraft in GTA Enhanced** in the catalog, press **Install**, then **Play**. **Restore** puts your game folders back exactly as they were.
The app follows `mashup.json` in this repository: every download is pinned by sha256. The files come from the release [`v0.1.0`](../../releases/tag/v0.1.0).

### Good to know

- You need GTA V Enhanced (Steam, GTA5_Enhanced.exe; not the Legacy edition) and Minecraft: Java Edition. Windows only.
- Install Script Hook V for your Enhanced build yourself first (it may not be redistributed): from dev-c.com, copy ScriptHookV.dll, dinput8.dll and xinput1_4.dll into the GTA V Enhanced folder. Check that it supports your exact game build.
- The app adds MCPassthrough.asi, ReShade 6.8.0 (as ReShade64.asi, with ReShade.ini and the MCPassthrough effect) and args.txt (-nobattleye) to the GTA folder; Restore removes them and puts back any file they replaced.
- Press Play: Minecraft starts first (the app's Prism instance "sigf-mc-in-gta-enhanced", Minecraft 26.3, Fabric Loader 0.19.5, Fabric API 0.161.0+26.3, Java 25, your own Minecraft account); leave its window open. Then GTA V Enhanced starts with BattlEye off: enter Story Mode, then pick Steve on the character wheel (Left Alt or D-pad Down). Picking a GTA character leaves Steve mode; F7 toggles it, F8 re-levels the ground.
- Story mode only: the mod switches itself off in GTA Online. Back up your saves first.
- Upstream's own launcher EXE is not included: it runs Minecraft as a developer client; the app starts both games instead.
- The link listens on 127.0.0.1:25599 with no authentication while Minecraft runs (upstream design).
- SIGF build of 981f14a (no upstream release; the author calls it experimental). Beta: report bugs to the author on the upstream issue tracker.

## What this repository holds

1. The upstream source tree at commit [`981f14ab109d7a8f57b533d4c7ea09a9a36d4255`](https://github.com/GrantMatas/minecraft-in-gta-enhanced/tree/981f14ab109d7a8f57b533d4c7ea09a9a36d4255), every file unchanged (same git blobs). Upstream's own `README.md` is there, unchanged; GitHub shows this file (`.github/README.md`) first.
2. Added by SIGF in the same commit: this file, `THIRD-PARTY.md` (licenses and sources of the third-party files in the release), and `sigf/` (the scripts that built the release assets, for reference: they run inside the SIGF repository).
3. `mashup.json`, the SIGF app recipe (the next commit).
4. The release `v0.1.0` (its tag is the first commit):

| Asset | Size | sha256 | What it is |
|---|---|---|---|
| `reshade-6.8.0-addon.zip` | 2460727 B | `d4167356162b209be93b6a35cf7e1253cffb2ac00746cf007a7201d362b00d07` | ReShade 6.8.0 (add-on build, crosire): the official `ReShade64.dll` unchanged as `ReShade64.asi`, its BSD-3-Clause license and the CC0 shader headers (see THIRD-PARTY.md); into the GTA V folder. |
| `mc-in-gta-enhanced-gta5.zip` | 200191 B | `7c60f158dfd25e3a2a4bb750bab47d8ad44094073bcf46ed0136f4910308dbd7` | the SIGF build of `MCPassthrough.asi` and `MCPassthrough.fx` from the pinned commit, upstream's LICENSE and THIRD_PARTY_NOTICES, `ReShade.ini`, `ReShadePreset.ini` and `args.txt` (story mode, BattlEye off); into the GTA V folder. |
| `mc-in-gta-enhanced.mrpack` | 210804 B | `7f62aead92f64ba52bf128279f6c81e8a610223f315c864c4e723eabbb8fcd9a` | the Minecraft side: the SIGF build of `passthrough-0.1.0.jar` from the pinned commit, with upstream's LICENSE, for Minecraft 26.3 with Fabric Loader 0.19.5; Fabric API 0.161.0+26.3 is a Modrinth download link, not stored here. |

The sha256 of every file inside the zips is in `mashup.json` (`contents`).

## Licenses

| Part | License | Where |
|---|---|---|
| minecraft-in-gta-enhanced (all of the upstream tree, and the SIGF builds) | MIT, Copyright Grant Matas; derived from universal-modder (MIT) | `LICENSE`, `THIRD_PARTY_NOTICES.md` |
| ReShade 6.8.0 (release asset) | BSD-3-Clause; shader headers CC0-1.0 | `THIRD-PARTY.md` |
| Fabric API (downloaded from Modrinth by the app, not stored here) | Apache-2.0 | https://github.com/FabricMC/fabric |

## Why this repository exists

The SIGF app (https://sigf.ai) installs mods from recipes (`mashup.json`) whose downloads are pinned release files. This repository makes Minecraft in GTA Enhanced installable in one click, credited to GrantMatas. If you are the author and want anything changed or taken down, open an issue here.
