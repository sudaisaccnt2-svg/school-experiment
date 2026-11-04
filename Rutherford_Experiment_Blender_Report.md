# Rutherford's Gold Foil Experiment: Research & Blender Production Report

*Project: school experiment (Grade IX Chemistry, Unit 02, Structure of an Atom, Fig 2.4 "Discovery of Nucleus")*
*Target software: Blender 4.5 LTS, EEVEE Next*

---

## Part A: The Science

### A1. Why the experiment was done
Around 1904, J.J. Thomson's **"plum-pudding" model** was the accepted picture of the atom: a sphere of spread-out
positive charge with electrons embedded in it. If that were true, the positive charge would be too thin and spread
out to strongly push a fast, heavy, positive alpha (α) particle. Every α-particle should pass through a thin metal foil
with at most a tiny wobble.

### A2. What was actually done (1909–1911)
Under Ernest Rutherford's direction, **Hans Geiger and Ernest Marsden** fired α-particles at a very thin foil of gold
and counted where they went.

| Part (textbook label) | What it really was | Why it matters |
|---|---|---|
| **Polonium (radioactive element)** | Source of α-particles (historically radium/radon compounds in a glass tube, later polonium). | α-particles are helium nuclei (2 protons + 2 neutrons, charge +2e), emitted at about 16,000 km/s. |
| **Lead container** | Thick lead block with a narrow hole (collimator). | Lead absorbs α-particles, so only a thin, straight **beam** escapes through the hole. |
| **Stream of α-particles** | The collimated beam. | Invisible in reality; we visualise it as glowing red dots. |
| **Thin gold foil** | Gold beaten to about 0.0004 mm (about 1000 atoms thick). | Gold can be made extremely thin, so each α-particle meets only a few atoms. |
| **Photographic film / luminescent screen (α-particle detector)** | A screen coated with **zinc sulphide (ZnS)** that surrounds the foil. | When an α-particle hits ZnS it gives a tiny flash of light (**scintillation**). Geiger counted the flashes in the dark through a microscope (about 50×). |
| *(not in textbook figure)* | The whole setup was inside an **evacuated (vacuum) chamber**. | Air would stop α-particles after a few cm. |

### A3. Observations
1. **Most α-particles passed straight through** the foil with no deflection.
2. **Some were deflected** through small angles.
3. **Very few (about 1 in 8000) bounced back** through angles larger than 90°.
   Rutherford said: *"It was almost as incredible as if you fired a 15-inch shell at a piece of tissue paper and it
   came back and hit you."*

### A4. Conclusions (why each observation matters)
| Observation | Conclusion |
|---|---|
| Most pass straight through | Most of the atom is **empty space**. |
| Some deflect | The positive charge is **concentrated**, so it repels the positive α-particle strongly when the particle passes close by. |
| Very few bounce back | The positive charge and almost all of the mass are packed into a **tiny, dense nucleus**. Only a nearly head-on hit can reverse an α-particle. |

### A5. The physics behind the paths (used directly in the animation)
The α-particle and the gold nucleus (charge +79e) repel through the Coulomb force F = kq₁q₂/r².
Under an inverse-square repulsion the α-particle follows a **hyperbola**. How much it turns depends on the
**impact parameter b** (how far off-centre it was aimed):

  tan(θ/2) = d / (2b),  where d is the distance of closest approach for a head-on hit.

* Large b (most particles): θ ≈ 0°, so it goes straight.
* Small b: large θ.
* b ≈ 0 (head-on): θ ≈ 180°, so it bounces back.

Because the nucleus is roughly 1/100,000 the size of the atom, small b is very rare. That is where the 1 in 8000
figure comes from. In the "zoom inside the foil" part of the animation, the trajectories are **numerically
integrated** from this force law (with electron screening outside the atom). They are not hand-drawn.

### A6. Rutherford's model (textbook section ii)
1. The atom has a positively charged central part called the nucleus.
2. Electrons revolve around the nucleus at very high speed, like planets around the sun.
3. The nucleus is very small compared with the atom, so most of the atom's volume is empty.
4. The atom is neutral because the number of electrons equals the number of protons.
5. The nucleus is responsible for the mass of the atom.

*(Known defects, useful for class discussion: an orbiting electron should radiate energy and spiral into the nucleus,
and the model cannot explain line spectra. Bohr fixed both in 1913.)*

---

## Part B: How Realistic 3D Works (research summary)

### B1. Modelling
* **Real-world scale.** Model in sensible units (here 1 Blender unit ≈ 10 cm of tabletop apparatus). Lights, depth of
  field, and motion blur all behave more naturally at a consistent scale.
* **Bevels catch light.** No real object has a perfectly sharp 90° edge. A small *Bevel* modifier (2–3 segments) makes
  edges pick up highlights. This is the single cheapest realism win.
* **Non-destructive modifiers.** Use Boolean for the collimator hole, Subdivision plus Displace for the wrinkled gold
  leaf, and Solidify for thickness. They stay editable.
* **Imperfection.** Real gold leaf is never flat. Low-strength noise displacement sells it as real.

### B2. Materials (Physically Based Rendering)
Blender's **Principled BSDF** follows the metallic/roughness PBR workflow. Measured values used here:

| Material | Base colour (linear) | Metallic | Roughness | Notes |
|---|---|---|---|---|
| Gold foil | (1.00, 0.77, 0.34) | 1.0 | 0.22 | Measured gold reflectance (F0). Noise bump for the hammered look. |
| Lead | (0.33, 0.33, 0.35) | 1.0 | 0.55 | Dull, oxidised. Noise varies roughness 0.45–0.7. |
| Brass stand | (0.91, 0.78, 0.42) | 1.0 | 0.3 | |
| ZnS screen | (0.82, 0.85, 0.78) | 0.0 | 0.85 | Chalky phosphor coating. |
| Wooden bench | Wave-texture grain | 0.0 | 0.5 | Procedural, so it needs no image files. |
| α-particle, scintillation | Emission | – | – | Bright emitters (strength 20–40) drive the glow. |

Rules: metals are either 1.0 or 0.0 metallic, never in between. Real surfaces are never roughness 0. Colour lives in
the base colour for metals and in diffuse for non-metals.

### B3. Lighting
* **Three-point lighting.** A *key* light (large warm area light, soft shadows), a *fill* light (weak, opposite side,
  lifts the shadows), and a *rim/back* light (cool, behind the subject, separates the silhouette from the dark
  background).
* **Large light size gives soft shadows.** Small lights give hard, "CG-looking" shadows.
* **Dark, moody environment.** The real experiment was done **in the dark**, because the flashes were faint. A dim
  blue-grey world plus a slight **volumetric haze** gives atmosphere and makes glows read as light in air.
* **Practical lights.** The glowing source, particles, and flashes are emissive. In EEVEE Next with **ray tracing**
  on, emissive surfaces now contribute to screen-space GI and reflections. A tiny point light inside the collimator
  hole adds a real light cast.

### B4. Renderer choices (EEVEE Next vs Cycles)
EEVEE Next (Blender 4.2+) is a real-time rasteriser with screen-space ray tracing, virtual shadow maps, and volumetrics.
That is ideal for a roughly 40-second educational animation. Cycles would be more physically exact but 20–50× slower.
Settings used:
* Ray tracing ON (screen trace), high-quality shadows, 64 render samples.
* **Motion blur ON.** Fast particles smear into streaks like real photography.
* **Bloom.** EEVEE Next removed the old Bloom checkbox. Glow is now done in the **Compositor → Glare node (Bloom)**.
* **AgX view transform** (Blender 4.x default), Medium-High-Contrast look. Bright emitters roll off into natural
  white-hot cores instead of clipping to flat colour.
* **Depth of field** on close-up cameras for a macro-photography feel.

### B5. Animation principles used
* **Physics-driven motion.** Apparatus-scale paths are straight lines with a scattering angle drawn from the real
  distribution (exaggerated so that rare events are actually seen). Atomic-scale paths are integrated from Coulomb's law.
* **Trails** are poly-curves with one point per frame. Animating *Bevel Factor End* (mapping = Segments) draws the
  trail exactly in sync with the particle. Animating *Bevel Factor Start* with a lag makes a fading comet tail.
* **Scintillation flashes** pop up to full size on impact and ease out over about 12 frames, like a phosphor decay.
* **Camera language.** Wide establishing shot, then a close-up, then a book-style overview, then a "zoom inside", then
  the model. Cuts use timeline markers bound to cameras. Moves are slow with eased keyframes.
* **Staging and labels.** Labels pop in one at a time with leader lines that draw on, so the viewer's eye is led in the
  same order as the textbook explanation.

---

## Part C: Production Plan (implemented)

### C1. Storyboard (30 fps, 1260 frames ≈ 42 s)
| Frames | Camera | What happens |
|---|---|---|
| 1–150 | CamMain | Title "Rutherford's Gold Foil Experiment". Camera cranes up from a low wide view. |
| 150–250 | CamMain | Apparatus labels appear: lead container, polonium, α-stream, gold foil, ZnS screen. |
| 250–340 | CamSource | Close-up (DOF): α-particles start streaming out of the lead collimator. |
| 340–660 | CamMain | Book-style overhead view. About 100 α-particles fly. Most go straight, some deflect, a couple bounce back. Each hit flashes on the ZnS screen. Result labels appear. |
| 660–960 | CamAtomic | "Inside the gold foil (not to scale)". A lattice of gold atoms with tiny nuclei. α-paths are computed with Coulomb's law. Conclusions appear. |
| 960–1260 | CamModel | Rutherford's planetary model with orbiting electrons (6 p⁺ = 6 e⁻, so neutral). The 5 main points appear. |

### C2. Scene layout
* **Apparatus zone** (origin): bench top at z = 0, beam height z = 0.8. Lead box at x = −5.5, foil at (0, 0, 0.8), and
  the ZnS ring (radius 3, open ±22° toward the source) centred on the foil. This matches the textbook figure.
* **Atomic zone** at (60, 0, 10) with a dark backdrop.
* **Model zone** at (120, 0, 10) with a dark backdrop.

### C3. Scripts (in `scripts/`, sent to Blender over the BlenderMCP socket, port 9876)
| File | Purpose |
|---|---|
| `bsend.py` | Sends one or more .py files to Blender for execution. |
| `common.py` | Shared helpers: materials, keyframing, text, and curves. |
| `01_setup.py` | Clears the scene and sets render settings, world, compositor bloom, and colour management. |
| `02_apparatus.py` | Bench, lead box plus collimator, polonium, gold foil and stand, ZnS screen, and lights. |
| `03_alpha_stream.py` | α-particle stream, trails, and scintillation flashes. |
| `04_atomic_view.py` | Gold lattice and Coulomb-integrated trajectories. |
| `05_model.py` | Rutherford planetary model. |
| `06_cameras_labels.py` | Cameras, camera cuts, all titles, labels, and leader lines. Also saves the file. |

Re-running `python bsend.py common.py 01_setup.py 02_... 06_...` rebuilds the whole scene from nothing.

### C4. Artistic liberties (to state honestly to students)
* The α-beam and the particles are drawn as glowing dots. Real α-particles are invisible.
* Large-angle scattering is shown far more often than 1 in 8000 so that it appears on screen at all.
* The textbook ring is used for the detector. Historically, a single ZnS screen and microscope were rotated around the
  foil.
* The atomic view uses an exaggerated nucleus size. At true scale (1 : 100,000) the nucleus would be invisible.

### Sources
* [Geiger–Marsden experiment, Encyclopedia MDPI](https://encyclopedia.pub/entry/30564)
* [AIP: Rutherford's Nuclear World](https://history.aip.org/exhibits/rutherford/sections/alpha-particles-atom.html)
* [ChemTeam: Geiger & Marsden 1909](https://www.chemteam.info/Chem-History/GM-1909.html)
* [PhysicsOpenLab: The Rutherford-Geiger-Marsden Experiment](https://physicsopenlab.org/2017/04/11/the-rutherford-geiger-marsden-experiment/)
* [Katsbits: EEVEE & light-emitting materials](https://www.katsbits.com/codex/eevee-light-emitting-materials/)
* [SuperRenders: Blender render settings, Cycles & EEVEE](https://superrendersfarm.com/article/blender-render-settings-optimization-guide)

---

## Part D: Optimisation & iPad Delivery

### D1. Render-time profile (1920×1080, one frame of the busy act-2 shot)
| Setting | Frame time |
|---|---|
| Original (64 samples, full volumetrics + volumetric shadows) | 40.7 s |
| 32 samples | 19.7 s |
| + cheaper volumetrics (16 px tiles, 32 samples, 25 m range) | 15.2 s |
| + 24 samples | 14.3 s |
| + volumetric shadows off | **8.5 s** |

The average across the whole film is now about 8 s per frame, about 2.9 h in total (it was about 12 h).

### D2. What was changed (all in the build scripts)
* **Samples 64 → 24.** EEVEE's temporal anti-aliasing converges fast. The difference is invisible at 1080p.
* **Volumetric shadows off.** These cost about 40% of the frame. The haze is too thin for shadowed light shafts to show.
* **Volumetrics cheaper.** 16 px tiles, 32 samples, 25-unit range.
* **Per-act visibility (`07_optimize.py`).** Each object is keyframed to render only during its own act. The apparatus
  (361 objects and its lights) is skipped in the atomic and model acts, and vice versa.
* **Compositor glare quality** set from High to Medium. Viewport samples 16 → 8, for smoother playback.
* **Output as a PNG sequence** with *overwrite off* and *placeholders on*. A crash or restart resumes where it stopped,
  and several Blender instances can share the render.

### D3. iPad-compatible video
`scripts/encode_mp4.py` (Blender's built-in FFmpeg, so no extra install) produces
`Rutherford_Gold_Foil_Experiment_iPad.mp4`:
* **H.264, High profile, yuv420p, MP4 (isom) container**. This is the format iPadOS decodes in hardware. It plays in
  Photos, Files, Keynote, and PowerPoint for iPad.
* 1920×1080, 30 fps, no audio track, high quality (CRF "High"), a keyframe every second so scrubbing is smooth.
* Transfer it by AirDrop, the Files app, or iCloud Drive. For Keynote on iPad, choose Insert → Photo or Video.
* 16:9 fits Keynote/PowerPoint slides. For a full-screen 4:3 iPad playback, set resolution to 1920×1440 before
  rendering. The cameras keep their horizontal framing, so nothing is cropped.

### D4. Commands
```
# full render (background, resumable)
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" -b "school experiment.blend" -a
# encode to iPad MP4
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" -b --factory-startup --python scripts\encode_mp4.py
```
