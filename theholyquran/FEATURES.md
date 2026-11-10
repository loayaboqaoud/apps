# Quran Studio — Feature & Functionality Map

Offline-first Progressive Web App (PWA) for reading the Uthmani Mushaf (QCF4 Hafs v1 fonts),
listening to recitations, reading word-by-word meanings/tafsir, and turning verses into
designed images and videos. Single-page app, no framework, no build step.

- Entry point: `index.html` (markup + CSS + one large inline `<script>`)
- Data: `data.js` (`SURAHS`, `DATA` — page/line/word glyph data)
- Meanings: `meanings.js` (`MEAN_BOOKS`, `MEAN` — tafsir/meaning entries per word segment)
- Config: `config.js` (`window.CONFIG.GIPHY_KEY`)
- Offline: `sw.js` (service worker), `manifest.webmanifest`
- Ready backgrounds: `backgrounds/` (images + optional `manifest.json`) — see 11b
- Local storage: `localStorage` key `mushaf2` (settings), `mushafStudio` (studio design settings),
  `mushafColors` (last 10 colors), `mushafReminderLast` (daily reminder date), `mushafPins`/`mushafReady`
  (ready backgrounds); IndexedDB DB `mushaf3` (design history + album handle)
- Export libs: `mp4-muxer.js`, `fix-webm-duration.js`
- Fonts: `fonts/QCF4_Hafs_01..47_W.woff2`, `QCF4_QBSML.woff2`, plus UI fonts
- No JS bundler/test runner; validation is manual/visual in a browser over http(s).

---

## 1. Data Model & Core Engine (`index.html` inline script)

- 1.1 Static datasets
  - 1.1.1 `SURAHS`: 114 surahs `{id, n(name), p(start page), c(ayah count)}`
  - 1.1.2 `DATA`: 604 mushaf pages keyed by page number
    - `DATA[p].s` = starting surah id
    - `DATA[p].l` = array of line objects
      - Line `t:'h'` = surah-header line (glyph in field `c`, font `f`)
      - Line `t:'b'` = basmala/standalone line
      - Line `t:'t'` = text line `{f: fontIdx, e: extent, w: words[]}`
      - Word tuple `[glyph, "surah:ayah", type, text]` where `type 0` starts a new word,
        `type >0` appends glyph to the current word, `type 2` is a special/close marker
  - 1.1.3 `MEAN_BOOKS`: meaning/tafsir books `{id, n(name), a(author)}` (4 books)
  - 1.1.4 `MEAN`: map `"s:a" -> [[bookId, title, text, startWordIdx, wordLen], ...]`
    (word-range anchored meanings for the overlay feature)
  - 1.1.5 `JUZ`: 28 Juz start pages; `MAXP=604`
- 1.2 Derived indexes built at startup
  - `CNT[surah]`, `ORDER[]` (all `s:a` keys in order), `IDX[key]` (position), `PAGEOF[key]`
  - `WU[key]` = reconstructed full-word list `[{c(glyphs), f(font), t(text)}]` (handles split words)
- 1.3 Text normalization & search index
  - `SSTRIP` regex strips diacritics/tatweel/Quranic marks; `SMAP` folds alif/hamza/ya/ta forms
  - `nq()` normalizes a query; `vnBuild()` builds `VN[key]={o(original),n(normalized),m(map)}`
  - `sFind(q)` returns `{R:[[key,count]], tot}`; `sHtml()` returns match-highlighted HTML (`<mark class="sh">`)
- 1.4 Persistence
  - State `st` persisted to `localStorage['mushaf2']` via `save()` (on change + `pagehide`/`visibilitychange`)
  - State fields: page `p`, audio accent/opacity `a`, mode `m` (h/v), background `bg`/`theme` `th`,
    reciter `rec`, playback mode `mode`, repeat count `n`, range `rs`/`re`, fit `fit`, night `night`,
    brightness `br`, font brightness `fb`, auto-scroll speed `sp`, last-light `lt`, last-dark `dk`,
    font color `fc`, UI language `lang`, meanings overlay `mo`, meanings color `mc`, enabled books `mb`
- 1.5 Audio source resolver
  - `aUrl(key)` → `https://everyayah.com/data/{reciter}/{SSS}{AAA}.mp3` (zero-padded surah/ayah)

---

## 2. Mushaf Reading (`#pager`, `.page`)

- 2.1 Page rendering (`pageEl(n)`) — draws header, lines, word `<span class="w" data-k="s:a">`,
  ayah-end markers, page footer number; words with meanings get class `mn`
  - Surah-header glyph sized `.062pw` inside the `.095pw` gold banner — worst-case QBSML
    glyph ink ≈ 90% of the banner height (was `.0694pw` ≈ 101.5%, which overflowed on iPhone)
- 2.2 Virtualized pager
  - `build()` creates 604 `.slide` sections and two IntersectionObservers
    - render observer mounts/unmounts page DOM (memory efficient)
    - ratio observer tracks the most-visible page (`setPage`)
  - `go(n,smooth)` programmatic navigation; `setPage()` updates state + title
- 2.3 Reading modes (`st.m`)
  - Horizontal page-flip reading (`h`) and vertical scroll reading (`v`)
  - `size()` computes page width and responsive fit; supports 2-page spread (`fit='2'`)
- 2.4 Fit modes (`data-fit`): Auto (`a`), Fit width (`w`), Fit height (`h`), Two pages (`2`)
- 2.5 Chrome toggle (`toggleChrome`): tap page to enter immersive "no chrome" mode (`body.nc`)
- 2.6 Resize/orientation/fullscreen handling (`size`, `bFs`)

---

## 3. Navigation & Index (`#sIdx`, `#bIdx`)

- 3.1 Top bar buttons: Index (`#bIdx`), Search (`#bSea`), Auto-scroll (`#bAsTop`), Night mode (`#bNight`),
  Meanings (`#bMn`), Page image (`#bPg`), Fit (`#bFit`), Keep screen on (`#bKeep`), Design (`#bDes`),
  Settings (`#bSet`), title `#ttl`
  - Mobile (≤900px): 5-column grid over two rows, compact 36px-per-button height (raised back from the
    over-compacted 1.2.4 sizing); desktop keeps the single 62px row with settings pinned left
- 3.2 Index sheet with three tabs
  - Surahs (`s`): id, name, ayah count, start page
  - Juz (`j`): 28 Juz with start page
  - Pages (`p`): grid of all 604 pages, current page highlighted
- 3.3 Row click → `go(page)`; current page auto-scrolled into view
- 3.4 Title shows current page, Juz, surah name (`title()`), transient messages (`flash()`)

---

## 4. Search (`#sSea`, `#seaQ`, `#seaR`)

- 4.1 Diacritic-insensitive, letter-folding full-Quran search
- 4.2 Debounced input (90ms), Enter/Search button = search all; short query (<2 letters) rejected
- 4.3 Results show surah, ayah, occurrence count per verse, page; matched text highlighted
- 4.4 Infinite/paged results (`sMore`, first 10 then loads more via scroll)
- 4.5 Jump to verse (`goVerse`) — navigates to page and highlights (`hlK`)

---

## 5. Word Meanings / Tafsir Overlay (`mn` words, `#sMean`, `#sVm`)

- 5.1 Words that have meanings are colored/highlighted (`cover()`, `--mn` color, `st.mo` toggle)
- 5.2 Tap a highlighted word → `showMean()` popover with title, text, book name (per word segment)
- 5.3 Verse-level meanings/tafsir (`showVm`, `#cMn`) grouped by enabled book
- 5.3.1 Book selection checkboxes in Settings (`#mbL`, `buildMb`) → `st.mb`
- 5.2 Source credited as Quranpedia.net

---

## 6. Audio Recitation (`Audio`, `#abar`)

- 5+ 5.1 Reciters/riwayat (`REC`, 79 verified everyayah sources): Hafs group (68 entries across
  Abdul Basit, Basfar, As-Sudais, AbdulSamad, Ash-Shaatree, Al-Ajamy, Alafasy, Ghamadi, Hani Rifai,
  Husary murattal/mujawwad/muallim, Hudhaify, Ibrahim Akhdar, Maher Al Muaiqly, Menshawi/Minshawy,
  Al-Tablaway, Ayyoub, Jibreel, Mustafa Ismail, Ash-Shuraym, Bukhatir, Al Qasim, Al-Juhaynee,
  Al Budair, Matroud, Neana, AbdulKareem, Al-Tunaiji, Al-Banna, Mansoori, Al-Qahtaanee, Ad-Dussary,
  Alqatami, AlSuesy, Sahl Yassin, aziz_alili, Salamah, AlAlaqimy, Ali Jaber, Fares Abbad, Ayman Sowaid)
  + Warsh group (3) + other-language recitations (9: English, MultiLanguage, Persian x3, Azerbaijani,
  Urdu x2, Bosnian)
- `REC` generated from the official everyayah `recitations.js` catalogue; every folder HEAD-checked
  (all 200 OK; `Ibrahim_Akhdar_64kbps` excluded — 404). Stale/broken saved value
  `Husary_Mujawwad_128kbps` migrates to `Husary_128kbps_Mujawwad`; unknown `st.rec` falls back to
  `Husary_128kbps`
- 5/6.2 Transport controls bar (`#abar`) visible whenever the chrome is shown (`body:not(.nc)`), i.e.
  together with the top bar and toggled by the same page tap — no longer requires an active playback
  track. While idle it shows the active reciter name and Play/Next start at the first visible verse
- 6.3 Auto-advance on `ended` (`playAt`, `au.onended`), error handling with user message
- 6.4 Auto-follow current verse (`follow`) — scrolls page to the playing ayah unless user is scrolling
- 6.5 Playing-word highlight (`.w.play`) via `markPlay()`
- 6.6 Next-ayah preloading
- 6.7 Reciter switching: custom searchable RTL/touch dropdown (`#recBtn` → `#recSheet`, search `#recSearch`)
  layered over the verse actions sheet; `#rec` stays hidden as the source of truth. Display names strip the
  raw bitrate, and a small bracketed quality label (`(عادية)`/`(متوسطة)`/`(عالية)`) is mapped from the real source bitrate
  without changing the playback URL.
- 6.8 Background/suspension reliability (best effort): Media Session position state (`setPositionState`) and
  `seekto`/`seekbackward`/`seekforward` handlers, conservative resume/advance recovery on
  `visibilitychange`/`pageshow`/`focus` (`recitationRecover`), single retry on `waiting`/`stalled`, and an
  ongoing recitation notification when Notification permission is already granted (`quran-recitation-now`).
  Web/PWA cannot guarantee background audio like a native foreground service; the OS/browser may still
  suspend playback.

---

## 6b. Playback Modes & Repeat / Range (`#vbar`, `#modes`)

- Modes: Once (`once`), To end of surah (`end`), **Non-stop to end of Quran (`all`, default)**,
  Repeat verse (`v`, N times), Repeat surah (`s`, N times), Repeat range (`r`, N times).
  The old `cont` value migrates to `end`; state version `mv:2`.
- Repeat count `#rN` (0 = infinite); mode titles/tooltips above the repeat controls; helper text below.
- Set range start/end (`#setS`/`#setE`, `setRange`), clear range (`#clrR`); visible confirmed range state
  `#rgTx` (`.rangeState.on` + highlighted `.w.range` words) and a confirmation toast.
- Range settable from the context sheet too (`cRs`/`cRe`).
- Currently playing ayah becomes the selection (`playAt` sets `cur`), so opening verse actions from the
  player targets the playing verse; auto-follow handles both chrome-visible and chrome-hidden states.

---

## 7. Auto-Scroll (Teleprompter) (`#as`, `#bAs`)

- Continuous page scroll in vertical mode at adjustable speed (`st.sp`), width-scaled
- Controls: play/pause (`#asT`), slower (`#asM`), faster (`#asP`), close (`#asX`)
- Starts from Settings (`#bAs`); forces vertical mode; stops/pauses when user scrolls or at page end
- Notifies at Mushaf end (`نهاية المصحف`)

---

## 7b. Themes & Appearance (`#sSet`, `applyBg`)

- 6/7.c1 22 built-in themes (`TH`): 10 light, 10 dark, 2 glass (backdrop-blur); separate light/dark pickers (`#thL`,`#thD`,`#thG`)
- Night-reading toggle (`#night` → `selTheme`)
- Quick palettes (`PAL`) + custom page background color picker (`#sw`)
- Every color input uses a custom picker sheet (`#colorPop`): preview, last 10 used colors
  (`mushafColors`), preset swatches, native custom color, Apply/Cancel. Native inputs stay in the DOM as
  the source of truth and receive synthetic `input`/`change` events.
- Accent/font color picker + reset (`#fcol`/`#fcR`)
- Font opacity `#aRng`, screen brightness `#brR` (`#dim` overlay), font brightness `#fbR`
- CSS custom properties: `--green --gold --bg --card --txt --acc --paper --pink --fb --mn --a --pw`, `glass` class
- `theme-color` meta is updated on every theme change to the theme's main/nav color (glass themes use their
  accent fallback); `color-scheme` and the Apple status-bar meta are kept in sync (dark → `black-translucent`,
  light → `default`). `manifest.webmanifest` keeps `theme_color #0f4f45` / `background_color #fbf6e8`.

---

## 7c. UI Localization (i18n)

- 10 UI languages: Arabic (`ar`), English, Spanish, Urdu, Hindi, French, Indonesian, Turkish, Bengali, Russian
- `DICT` dictionary (~223 Arabic UI keys → 9 translations); `T()` translates DOM text nodes live (`applyLang`)
- RTL for `ar`/`ur`, LTR otherwise (`documentElement.dir/lang`)
- Arabic-Indic digit rendering via `ar()` when UI is Arabic
- Language selector `#lang`

---

## 8. Verse Context Actions (`#sCtx`, long-press 480ms / right-click)

- Select word/verse; `ctxOpen` opens context sheet with title
- Actions: Listen (`cPlay`), Meanings (`cMn`), Copy text (`cCopy`), Share text (`cShare`),
  Quick image (`cImg`), Design image/video (`cDs` — opens Studio), Set range start (`cRs`), Set range end (`cRe`)
- Clipboard fallback (`execCommand`) when Clipboard API unavailable; Web Share API with text fallback
- `pointerdown` long-press detection with move-cancel; haptic vibration

---

## 9. Quick Verse Image Export ("صورى سريعة", `#vbar`)

- Config: font color `#vCol`, transparent background (`#vTr`), reciter select shown
- `quickPng()` renders verses onto canvas (wrapping via `lay`, `paint`) at high res
- Copy PNG to clipboard (`#vImg`, ClipboardItem) or download (`#vDl`)
- Copy text (`#vTxt`), open Studio (`#vDs`)

---

## 10. Design Studio (`#studio`) — for images & videos

- 10.1 Toolbar: Close (`#stX`), title, Randomize design (`#rndD` — random theme/effects/font/shadow)
- 10.2 Live preview canvas (`#pv`) with drag-to-position; selection for text/name/ref/sticker
- 10.3 Tabs (`#stTabs`): Text, Background, Size, Labels, Effects (`المؤثرات`), Export, History (`السجل`)
- 10.3b Studio settings autosave/restore (`mushafStudio`, debounced + `pagehide` flush): text/background/
  dimensions/labels/effects/signature are restored on next open; image/video/audio blobs are never stored.
- 10.3c No emojis, stickers or GIF search in the studio. The former stickers tab was removed; animated
  effects and the fixed signature remain.
- 10.4 Text tab (`tp-tx`)
  - Surah select `#dS`, ayah range `a1`/`a2`
  - Trim words from start/end (`cut0`/`cut1`), line-break chips (`#chips`, `brk`)
  - Font size `fs`, text box width `bw`, line spacing `ls`, horizontal/vertical position `bx`/`by`
  - Alignment `al` (right/center/left), font color `col`
  - Shadow: enable, color, opacity, angle, distance, blur
- 10.5 Background tab (`tp-bg`)
  - Type selector (`bg`): none, solid, gradient, pattern, image, video, **camera (AR)**
  - Controls are split into per-type sub-panels shown by `bgPanels()`: `#bgpC` (none/solid/gradient —
    color 1/2, with the gradient angle/stops in `.gradOnly` shown only for gradient), `#bgpP` (pattern
    colors), `#bgpI` (image), `#bgpV` (video), `#camBox` (camera). Shared controls duplicated per panel.
  - Image from device (`#imFile`) or Wikimedia Commons image search (`#imGo`, license/artist note)
  - Video from device (`#vdFile`) or Wikimedia Commons video search (`#vdGo`)
  - Background scale `bs`, position `bgx`/`bgy`, dimming `dim`
  - Video trim start/end (`vt0`/`vt1`) + preview (`#vPrev`)
- 10.5b Camera / AR background (`D.bg=='cam'`, `camStart`)
  - "الكاميرا (AR)" button requests `getUserMedia` (video only) and uses the live stream as the
    background (`camVid`), drawn cover-fit in `drawBg` with scale/position/dim; front camera mirrored
  - Front/back swap (`camSwap`), fullscreen preview toggle (`#pvw.fs`), release on leaving cam or closing studio
  - Floating AR control bar (`#arBar`) over the preview: snapshot, record, mic toggle, recitation toggle,
    swap, fullscreen, stop; buttons reflect state via `camUi()`
  - Editing text/effects/labels/stickers and live preview keep working while the camera is the background
  - Snapshot (`camShot`): captures the mirrored camera frame and sets it as the design background
    (`D.bg='img'`, `D.vclipAudio=null`), so the whole design stays editable/previewable in the canvas
  - Live recording (`arStartRec`/`arStopRec`): records the **camera + microphone only** (never the ayah
    recitation) via `MediaRecorder` on `canvas.captureStream(30)`, so text/effects are not baked in and
    remain editable; on stop the clip becomes the design's video background (`camUseClip`: `D.bg='vid'`,
    loop, auto-play) and its audio is decoded into `D.vclipAudio` for re-export
  - The AR toggle (`#camAud`/`#arAud`, "تشغيل تلاوة الآيات أثناء تصوير الفيديو") makes the recitation play
    **audibly during recording** (through `arAC.destination`, i.e. the speakers, at the `#camVol` level) so
    the user can follow it and voice over it — it is *not* captured into the clip (only the mic track is);
    headphones are recommended so the mic does not also pick up the speaker playback
  - The recitation is (re)added at export time, so the export/audio panel (`tp-ex` → `#asrc`/`#atrim`) is
    the single source of truth for the final sound; the AR toggle only *seeds* that default (`arSetAud`
    maps it to `D.asrc`, `camUseClip` keeps `arAudOn?'ayat':'none'`), and the export panel can override it
    (choosing "بلا صوت" excludes the recitation even if the AR toggle is on)
  - `exportRec()` always plays the recorded voice (`D.vclipAudio`) when a clip is the background, and
    *additionally* mixes the panel-selected audio (`D.asrc`: آيات or a file) at the `#camVol` level when
    it is not "بلا صوت"; duration is `max(clip, recitation)`
  - The recorded clip is previewed **unmuted** (`v.muted=false`) so the user hears their own voice while
    designing/exporting
  - Mic input (`#camMic`, `#arMic`) with live mute/unmute; recitation toggle + level (`#camAud`, `#camVol`)
    changeable mid-recording (level applies to live playback and to the export)
  - Optional 3-second countdown before recording (`#camCd`), cancellable by tapping record again
  - Recording quality selector (`#camRes`: 1920/1280/854/640 long side → scaled bitrate 8/5.3/3.5/2.6 Mbps)
  - Optional burned-in REC indicator + timer in the video (`#camOv`); always-on on-screen REC pill
    (`#arPill`/`#arPillT`) over the preview during recording
  - Auto-stop when the recitation ends (`#camAs`) using the computed audio duration
  - Mic input (`#camMic`, `#arMic`) with live mute/unmute; recitation toggle + level (`#camAud`, `#camVol`)
    via a `GainNode`, all changeable mid-recording
  - Microphone is acquired in the **same** `getUserMedia` call as the video (with a video-only fallback),
    avoiding the iOS/Safari bug where a second, separate audio request fails/stops the stream and made the
    toggle appear to revert; `connectMic()` wires the mic into the recorder whenever it is enabled, so
    switching the mic on mid-recording is captured too
  - Mic state is synced back to the checkbox/icon after startup, so if the mic is unavailable/blocked the
    checkbox is unchecked (not left falsely "on")
  - A visible global toast (`toast()`) reports failures (mic blocked/not found, camera denied, or the
    insecure-context case) since the camera panel's note is hidden until the camera is running — important
    because a page served over a LAN IP (non-localhost `http`) is **not** a secure context and cannot use
    the camera at all
  - Requires a secure context (HTTPS/localhost) and `isSecureContext`; clear error messages otherwise
  - Fullscreen preview (`#pvw.fs`) auto-exits whenever the camera mode ends (stopping the camera, taking a
    snapshot, or finishing a recording) and via the `Escape` key, so the design panel is never left hidden
  - `exportVideo()` routes camera through `exportRec()` (real-time) since WebCodecs can't seek a live stream;
    `exportRec()` mixes `D.vclipAudio` (recorded voice) with the panel-selected `D.asrc` audio, and
    `D.vclipAudio` is cleared whenever another image/video/background is chosen
- 10.6 Size tab (`tp-sz`)
  - Aspect ratios: 1:1, 4:5, 3:4, 2:3, 9:16, 16:9, 4:3, 3:2, 21:9, custom
  - Width/Height inputs; device presets (iPhone, iPhone Pro, iPhone Pro Max); flip orientation
- 10.7 Labels tab (`tp-lb`)
  - Target: text / surah name / reference
  - Surah name overlay (`nm.on`, size, color, x, y) drawn from QBSML glyph font
  - Reference overlay (`rf.on`, size, color, x, y) e.g. "الآية ١" / "الآيات ١ - ٣"
- 10.8 Effects tab (`tp-sk`)
  - Animated full-frame effects (`FX`): Snow, Rain, Stars, Lights/Bokeh, Sparks, Birds,
    Audio Visualizer, Smoke, Flux Lines, Molten Metal, Strands, Splash Cursor, Flames
  - Strands (خيوط): WebGL2 silk-strands shader ported from ReactBits; autonomous motion
    (level/lean/sway driven by effect time), full-frame mode, 7-role palette derived from
    the selected color, size slider maps to amplitude/thickness
  - Splash Cursor (رذاذ المؤشر): WebGL2 fluid simulation (13 passes: splat/burst/crown/
    advection/divergence/curl/vorticity/pressure/gradient/prefilter/blur/display) ported
    from ReactBits; simulates random pointer movement — wanders between waypoints with
    jitter plus periodic bursts — palette from the selected color, dye at full frame res
    (sim 128); silently skipped if float render targets are unsupported
  - "المؤثرات" list (`#skList`), color (`#skC`), size/density (`#skS`), rotation (`#skR`), position
    (`#skX`/`#skY`), delete (`#skDel`)
  - Effects are draggable on the preview and saved/restored with the studio design
  - No emoji/text stickers and no GIF/image stickers (removed); the fixed signature lives below the
    effects list
- 10.9 Auto-fit (`autoFit`) — finds max font size that fits the frame; `ref`/`nm` reserve space
- 10.10 Render pipeline: `drawBg` → `drawFg` → `drawStk` (`draw`); live loop for animated content (`liveLoop`)
- 10.11 Real-time word reveal modes (`rv`): none, fade in/out, show & keep, single-line ticker
  - Word timing from audio durations (`revTimes`, `ayatSegs`, `revAlpha`, `ticker`)
  - Word timing preview (`#wPrev`) using live playback (`wpPlan`, `wpOn`)

---

## 11. Image & Video Export (`tp-ex`)

- 11.1 Resolution: HD (1x), 2K/4K, Original (`res`, `outDims` caps ~16.7MP)
- 11.2 Save PNG (`#xPng`), Share image (`#xShP`) — `exportBlob()` canvas render; every export is added to the design history
- 11.3 Video audio source (`asrc`): none, verse recitation (everyayah), or local audio file (`#auF`)
  - Audio trim start/end (`at0`/`at1`) + preview (`#aPrv`); no-audio duration (`vsec`)
- 11.4 Word-reveal mode and smoothness (`wf`) for video
- 11.5 Video export (`#xVid`) — `exportVideo()`:
  - Preferred path: WebCodecs `VideoEncoder`/`AudioEncoder` + `mp4-muxer` (AVC/AAC MP4, VP9/Opus opt-in)
  - Fallback path: `MediaRecorder` + canvas `captureStream` + Web Audio mixing (MP4/WebM), patched by `fix-webm-duration`
  - Background video frame-accurate seeking; result/error messages in `#exMsg`
  - Share video (`#xShV`), result cached in `lastV`
- 11.6 Export progress (`#exProg`): floating progress bar with percentage + stage label
  (`exStart`/`exSet`/`exEnd`); shown for PNG, share-image, video and share-video exports
  - Cancel button (`#exProgCancel`) with confirmation dialog; `exCheck()` aborts image render,
    WebCodecs encode loops, audio prep/fetch loops and `MediaRecorder` capture cleanly
    (`{cancelled:1}` errors never trigger the mp4→recorder fallback)
- 11.7 File naming `fname(ext)` with timestamp
- 11.8 Watermark / signature (`D.wm`, studio Design tab "التوقيع"):
  - Optional, fixed signature baked into all canvas output: live preview (`#pv`) + video export frames
    (`exportRec` / `exportMp4`) + PNG export (`draw()` → `drawWM`). OFF by default.
  - Controls (all `data-k="wm.*"`, generic studio binding): show (`on`), text (`text`), font (`ff`, `#wmF`
    populated from `SKF`), bold (`b`), color + alpha (`col`/`ca`), size (`size`), app-icon toggle (`icon`),
    text shadow (`shOn`/`shCol`/`sha`/`shb`/`shd`), background pill + alpha + radius (`bgOn`/`bgCol`/`bga`/`rad`),
    position (`x`/`y`, 0–100%).
  - Geometry `wmGeom(W,H)` (measures via `mctx`+`stkFont`, clamps the box so it always stays inside the canvas);
    drawing `drawWM(x,W,H,pv)` (rounded-rect bg `rr`, shadow, icon, text); dashed selection box when `D.tgt=='wm'`.
  - Drag to move on `#pv` (hit-test in `onpointerdown`; clamped in `onpointermove`), so it can never leave the design.
  - Icon uses the embedded data-URL `window.__ICON_B64` (`icon-b64.js`, 128×128) to avoid canvas tainting on
    `file://` (local image → `toDataURL`/`captureStream` `SecurityError`).
  - Font is loaded before drawing/export via `fontsFor()` + the `after('wm*')` hook.
  - Signature text/style and the `wm.on` checkbox persist in `localStorage` (`mushafStudio`); while the
    checkbox is enabled the signature is auto-added to future designs, and unchecking it stops that.

---

## 11b. Design History, Album Folder, Ready Backgrounds & Page Image

### Design history (`tp-hi`, studio tab "السجل")
- Every image/video export (PNG, share-image, video, share-video, full-page image) is stored automatically
  as a Blob in IndexedDB (`mushaf3` DB, store `designs`, key `id`; helpers `idb`, `tx`, `histAdd`, `histList`,
  `histDel`, `histClear`).
- Tab render `histRender()`: thumbnail grid (`.hiC`); images get a "خلفية" button (`setImg(url)`),
  each item has a delete button; tap = share/`dl`.
- "تنزيل الكل" (download all), "مسح السجل" (clear). Opened via the studio "السجل" tab (`#stTabs`, wired to call `histRender`).

### App album folder (File System Access API)
- Optional real folder on the device (`showDirectoryPicker`, handle persisted in IndexedDB store `meta`, key `album`;
  `albumInit`, `albumPick`, `albumPerm`, `albumSave`, `albumUi`).
- When a folder is linked and permission granted, `histAdd` also writes each export there (`albumSave`).
- Buttons in `tp-hi`: "مجلد الألبوم" (pick/change), "السماح بالكتابة" (re-grant permission; browser resets it each load).
- Safe no-op on browsers without the API.

### Ready-made backgrounds (`#bgReady` in Background→Image panel)
- Loader `readyList(force)` / `renderReady(force)`, refresh button `#rdR`.
- Discovery is a **union** (deduplicated by filename, case-insensitive) of:
  1. `backgrounds/list.js` (`window.__READY_BG`) — loaded via `<script>`, so it works on `file://`, http and offline.
  2. `backgrounds/manifest.json` — array of filenames/URLs or `{file|name|url, added}` objects.
  3. Directory listing of `backgrounds/` (HTML `<a href>` links or JSON) — works on dev servers that list directories.
  4. GitHub Contents API (`ghRepo()` from `CONFIG.BG_REPO` or `*.github.io` hostname) - auto-lists the deployed repo,
     so newly committed images appear without regenerating any file.
- Regenerate both `manifest.json` and `list.js` with `node backgrounds/update-manifest.mjs`.
- Image types (`RD_EXT`): `jpg jpeg jfif jpe png apng webp avif gif bmp svg ico`.
- Ordering: **pinned first** (`localStorage` key `mushafPins`, toggled by the 📌 button on each tile), then by
  `added` timestamp descending (`HEAD` `Last-Modified` when the manifest omits it), then by filename.
- Filenames are URL-encoded per path segment (`rdEnc`), so spaces, parentheses and Arabic names work.
- Results cached 30 min in `localStorage` (`mushafReady`); an empty fresh result falls back to the previous cache (offline).
- Admin-only model: end users cannot upload — they can only tap to select and 📌 pin/unpin a favorite.

### Save / share full page as image
- `pagePng(n)` renders the current mushaf page to a `canvas` (1080×1728 logical, ×2 device = 2160×3456 PNG).
- Reproduces the DOM geometry: paper + 1px border, `.ph` juz/surah header (top `.02pw`) + `.pf` page number
  (bottom `.016pw`), per-line flex spacing (`space-between`, or `space-evenly` when <15 lines) with header lines
  sized `.107pw` (banner) vs `.098pw` (verse), glyph font `F<f>` at the same ratios (header `.062pw`, basmala
  `.0559pw`, verse `R*L.e` rule) and the `.13em` baseline shift.
- Colours: text uses `st.fc || pg()[1]`; `.lines` opacity `st.a/100`; the `.mn` meaning-word colour is intentionally
  ignored (plain ink); the `.ln.hd` gold banner is drawn (`--gold`).
- `savePageImage(share)` → adds to history + `dl`/`share`; wired to settings buttons `#bPgDl` (save) and `#bPgSh` (share).

---

## 12. Auto-Scroll (see 6b) & Print

- Print sheet (`#bPrint`): page range From/To (`#pFrom`/`#pTo`), renders pages into `#print`, `window.print()`,
  clears on `afterprint`
- Save/share full page as image (see 11b): `#bPgDl` / `#bPgSh`

---

## 13. Settings Sheet (`#sSet`)

- Appearance: theme swatches (`thL`/`thD`/`thG`), night reading, page background palette/custom, font color+reset,
  font opacity, screen brightness, font brightness
- Reading: horizontal/vertical, fit mode, auto-scroll speed, auto-scroll/stop, fullscreen, from/to sound controls
  (`#bAs`/`#bFs`)
- Word meanings: enable overlay, words color+reset, book selection (`#mbL`)
- Print: page range + print; save/share current page as image
- Design history tab lives in the studio (`tp-hi`), see 11b
- Language selector `#lang`
- Offline: cache status check (`#bOff`, counts cached files vs ~50)
- Daily reminder (`#remOn`): best-effort local notification at 21:00 local time; requires Notification
  permission, works while open/in background, cannot be guaranteed if the app is fully closed. Compatible
  with a future Push backend.
- Updates: version display (`#appVersion`), manual check (`#checkUpdatesButton`), automatic check on open
  (silent on connectivity failure), success toast `تم تحديث التطبيق إلى أحدث إصدار` after reload
  - Spinning indicator (`#updateSpin`) next to the version while a check/apply is in progress
    (manual and background); button disabled + status text for manual runs
  - Background check runs shortly after load on http(s) only when online (`navigator.onLine`), and
    retried when connectivity returns (`online` event); concurrent checks are guarded by `updateBusy`
- Help (`#bHelp` → `#sHelp`): large popup with an expandable/collapsible nested topic tree, fully localized
- About (`#bAbout`)

---

## 14. Offline / PWA

- `manifest.webmanifest`: Arabic name, `standalone`, theme color, RTL, 3 icons (any/maskable)
- `sw.js`: cache-first with network fallback and runtime caching
  - Precache core assets + all fonts (best-effort `allSettled`); includes `backgrounds/list.js` and
    `icon-b64.js` (embedded watermark icon)
  - `backgrounds/manifest.json` is bypassed (network) so new ready-made backgrounds appear; background images are cached normally
  - Versioned app cache (currently `mushaf-20261110-1.2.7`); old caches purged on activate; `skipWaiting`/`clients.claim`
  - `notificationclick` focuses an existing window or opens the app for daily reminders
- Service worker registered only over http(s); an automatic update check runs shortly after registration
- App designed to work fully offline once cached
- `backgrounds/` folder holds ready-made background images (+ optional `manifest.json`; regenerate with `backgrounds/update-manifest.mjs`) for GitHub Pages hosting

---

## 15. About Sheet (`#sAbout`)

- Developer: Loay Abu Qaoud; date 2026-11-10; version 1.2.7
- Credits: King Fahd Complex (QCF4), Quranpedia, everyayah.com, Wikimedia Commons, Lucide, Tajawal, mp4-muxer

---

## 16. Cross-cutting UX

- Overlay/back-button integration: `#modes`/sheets observed via MutationObserver; hardware/browser Back closes top overlay (`OV`, `popstate`)
- Custom SVG icon system (`<symbol>#i-*`) applied by `decorate()`/`ico()`
- Range inputs enhanced with numeric value readout and stepper buttons (`enh`, `sv`)
- Long-press context menu; right-click suppressed on pager
- Responsive to resize/orientation/fullscreen

---

## 17. Known Gaps / Notes (candidates for fixes & new work)

- 17.1 `DICT` covers UI chrome and the new help/reminder/reciter/range/color strings; some dynamic canvas/status templates still rely on Arabic `T()` fragments
- 17.2 Meaning overlay is word-range based; only 4 books bundled in `MEAN_BOOKS`
- 17.3 Recitation/background search/media require internet (everyayah.com, Wikimedia)
- 17.4 GIF/sticker integration was removed; `config.js` `GIPHY_KEY` is no longer used and kept only for backward compatibility
- 17.5 Word-reveal timing is estimated by duration/number-of-words when metadata is unavailable
- 17.6 No automated tests, lint, or type checking configured
- 17.7 Single monolithic `index.html` inline script; no modules/bundler
- 17.8 Ready backgrounds discovery is best-effort: `manifest.json` always works, directory listing needs a server that lists directories, GitHub API needs a public repo and is rate-limited (~60 req/h); results cached 6h
- 17.9 Album folder uses File System Access (Chromium only); write permission must be re-granted each session
- 17.10 `pagePng` reproduces the page deterministically and intentionally ignores the `.w.mn` meaning color and the font-brightness (`--fb`) filter
