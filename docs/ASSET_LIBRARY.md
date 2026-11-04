# Shared asset library (models + sounds), 2026-10-11

**File:** `assets/library/asawera_library.blend`, built by `scripts/build_library.py` from the models that
`scripts/fetch_polyhaven.py` downloads (Poly Haven, CC0: free for anything, no credit needed).
Open it in Blender: every model is one collection `LIB_<name>`, marked as an asset (Asset Browser → Current File).

## Rule
Every lesson LINKS library collections (File › Link, or drag from the Asset Browser with "Link"), never copies them.
One model = one place to improve it, one copy in memory in Blender, and one shared download in the app.

## Your retopology + bake workflow (per model)
1. Duplicate the collection as `LIB_<name>_LOW`; retopologize (target below), UV unwrap once.
2. Bake from the original (high) onto LOW: base colour, normal, roughness/metal (+ AO into base colour) into ONE
   1024 px texture set (512 px for small props).
3. Keep LOW in the library; lessons link LOW. Keep the high version in a `_SRC` collection for future re-bakes.

| Prop size on screen | Target faces | Texture |
|---|---|---|
| hero (fills the frame: microscope, burner, beaker) | 3,000–8,000 | 1024 px |
| medium (tools, lamp, bowl) | 800–3,000 | 512–1024 px |
| small / repeated (coins, lumps, rocks, ions) | 100–800 | 256–512 px, instanced |

## In the library now (faces before retopology)
chemistry_set 21k (beakers, flasks, tubes) · bunsen_burner 4k · industrial_microscope 9k · vintage_microscope 11k ·
lightbulb_01 2k · magnifying_glass_01 4k · retro_multimeter 7k · cross_pein_hammer 1k · pliers 2.5k ·
propane_torch 2.4k · metal_jug 3k · wooden_bowl_01 14k · circuit_board 8k · street_lamp_01 15k ·
vintage_pocket_watch 2k · rock_07 28k · stone_01 72k · moon_rock_01 19k · SchoolDesk_01 2k ·
standing_chalkboard_01 1k · desk_lamp_arm_01 13k · book_encyclopedia_set_01 34k · round_spectacles 6k

## Still needed (search these; check the licence of each file)
gas jar with lid · glass trough · test-tube rack · litmus paper · tongs · watch glass · electrolysis cell and
electrodes · battery · copper/zinc plates · coins · gold ring / jewellery · car catalytic converter · aircraft ·
fireworks · salt crystals · sodium under kerosene jar.
- **Poly Haven** (CC0) · **Quaternius** and **Kenney** (CC0) · **BlenderKit** free models (royalty-free licence)
- **Sketchfab** (filter Downloadable + licence CC0 or CC-BY; CC-BY needs a credit line in the app's About screen)
- **Fab** free assets (Standard licence; usable in any engine)

## Effects (made once, reused everywhere)
Fire, fizz, splash, smoke, sparks, explosion flash, gas wisps: made as reusable three.js effect modules
(flipbook sprites + particles) driven by markers in the films, so every lesson gets the same recognizable effect.

## Sound effects (reusable, no narration for now)
One small library of short sounds (fizz, flame whoosh, splash, glass clink, metal thud, spark, pop, soft UI tick),
triggered by the same markers as the effects, so a sound plays only where something happens.
Free sources: **Kenney** audio packs (CC0) · **Sonniss GDC bundles** (royalty-free, commercial use) · **freesound.org**
(filter CC0) · **Pixabay** sound effects (Pixabay licence). Keep each sound short and quiet; one sound at a time.
