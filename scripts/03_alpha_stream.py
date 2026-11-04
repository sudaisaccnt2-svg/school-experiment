# ---- 03: alpha-particle stream, trails and ZnS scintillations (apparatus scale) ----
C = "Alpha Stream"
BEAM_Z = 0.8
RING_R = 3.0
GAP = math.radians(22)
SPEED = 0.3          # blender units per frame
START_X = -5.33      # inside the collimator hole, at the polonium
FIRST, EVERY, N = 256, 3, 100

m_alpha = mat_emit("Alpha Particle", (1.0, 0.22, 0.10), 30.0)
m_trail = mat_emit("Alpha Trail", (1.0, 0.28, 0.12), 2.0)
m_flash = mat_emit("Scintillation", (0.08, 1.0, 0.3), 9.0)
me_alpha = sphere_mesh("AlphaSphere", 0.035, 12, 8)
me_flash = sphere_mesh("FlashSphere", 0.07, 12, 8)

rng = random.Random(7)
special = {12: 38.0, 20: 95.0, 38: 145.0, 47: -22.0, 55: -128.0, 63: 17.0, 71: -172.0, 84: -60.0, 90: 12.0}
thetas = []
for i in range(N):
    if i in special:
        thetas.append(special[i])
    elif rng.random() < 0.10:
        thetas.append(rng.choice((-1, 1)) * rng.uniform(4, 20))
    else:
        thetas.append(rng.gauss(0, 1.2))

for i, th_deg in enumerate(thetas):
    f0 = FIRST + i * EVERY
    th = math.radians(th_deg)
    phi = math.radians(rng.uniform(-4, 4))
    y0, z0 = rng.uniform(-0.02, 0.02), BEAM_Z + rng.uniform(-0.02, 0.02)
    p_start = Vector((START_X, y0, z0))
    p_foil = Vector((0, y0, z0))
    d = Vector((math.cos(th), math.sin(th), math.tan(phi))).normalized()
    dxy = math.hypot(d.x, d.y)
    through_gap = abs(th) > math.pi - GAP
    out_len = 4.5 if through_gap else (RING_R - 0.03) / dxy
    p_end = p_foil + d * out_len

    t_foil = (p_foil - p_start).length / SPEED
    t_out = out_len / SPEED
    fa, fb = f0 + t_foil, f0 + t_foil + t_out

    # particle
    ob = obj_from_mesh("Alpha %03d" % i, me_alpha, C, p_start, m_alpha)
    kf(ob, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(ob, "scale", f0, (1, 1, 1), 'CONSTANT')
    kf(ob, "scale", math.ceil(fb) + 1, (0, 0, 0), 'CONSTANT')
    kf(ob, "location", f0, p_start, 'LINEAR')
    kf(ob, "location", fa, p_foil, 'LINEAR')
    kf(ob, "location", fb, p_end, 'LINEAR')

    # trail: one point per frame so bevel factor (segment mapping) follows the particle exactly
    pts = []
    nf = int(math.ceil(t_foil + t_out))
    for k in range(nf + 1):
        t = min(k, t_foil + t_out)
        pts.append(p_start + (p_foil - p_start) * (t / t_foil) if t <= t_foil else p_foil + d * ((t - t_foil) * SPEED))
    pts[-1] = p_end
    tr = poly_curve("Trail %03d" % i, pts, C, m_trail, depth=0.004)
    cu = tr.data
    kf(cu, "bevel_factor_end", 0, 0.0, 'CONSTANT')
    kf(cu, "bevel_factor_end", f0, 0.0, 'LINEAR')
    kf(cu, "bevel_factor_end", f0 + nf, 1.0, 'LINEAR')
    lasting = abs(th_deg) > 8
    if not lasting:  # comet tail: start chases end, trail disappears
        lag = 6
        kf(cu, "bevel_factor_start", 0, 0.0, 'CONSTANT')
        kf(cu, "bevel_factor_start", f0 + lag, 0.0, 'LINEAR')
        kf(cu, "bevel_factor_start", f0 + nf + lag, 1.0, 'LINEAR')

    # scintillation flash on the screen, decaying to a faint lasting dot
    if not through_gap:
        fl = obj_from_mesh("Flash %03d" % i, me_flash, C, p_end, m_flash)
        h = math.ceil(fb)
        kf(fl, "scale", 0, (0, 0, 0), 'CONSTANT')
        kf(fl, "scale", h - 1, (0, 0, 0), 'LINEAR')
        kf(fl, "scale", h, (1.6, 1.6, 1.6), 'BEZIER')
        kf(fl, "scale", h + 14, (0.35, 0.35, 0.35), 'BEZIER')

print("alpha stream ok, last hit ~", FIRST + N * EVERY + 30)
