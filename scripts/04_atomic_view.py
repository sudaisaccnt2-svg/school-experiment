# ---- 04: "inside the gold foil" - lattice of gold atoms, alpha paths integrated from Coulomb's law ----
C = "Atomic View"
O = Vector((60, 0, 10))       # zone centre; lattice lives in the XZ plane (u = x, v = z)
V0 = 0.2                      # alpha speed, units / frame
D_CLOSE = 0.05                # head-on distance of closest approach (unscreened)
K = V0 * V0 * D_CLOSE / 2     # Coulomb strength so that 1/2 v^2 = K / d
LAMBDA = 0.15                 # electron screening length (force fades outside the nucleus region)
U0, UMAX, VMAX = -11.0, 11.5, 7.0

m_cloud = mat_emit("Electron Cloud", (0.35, 0.55, 1.0), 0.35, alpha=0.10)
m_cloud_edge = mat_emit("Atom Outline", (0.45, 0.65, 1.0), 1.2)
m_nuc = mat_emit("Gold Nucleus", (1.0, 0.72, 0.25), 25.0)
m_alpha = bpy.data.materials.get("Alpha Particle") or mat_emit("Alpha Particle", (1.0, 0.22, 0.10), 30.0)
m_path = mat_emit("Alpha Path Atomic", (1.0, 0.3, 0.12), 4.0)
m_back = mat_pbr("Backdrop", (0.004, 0.005, 0.01), roughness=0.9)

# backdrop
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=30)
bd = mesh_obj("Atomic Backdrop", bm, C, m_back)
bd.location = O + Vector((0, 6, 0)); bd.rotation_euler = (math.radians(90), 0, 0)

# lattice (close-packed columns, foil is only a few atoms thick)
nuclei = []
cols = (-1.5, -0.5, 0.5, 1.5)
for ci, u in enumerate(cols):
    off = 0.5 if ci % 2 else 0.0
    for r in range(-4, 5):
        v = r + off
        if abs(v) > 3.6:
            continue
        nuclei.append((u, v))
me_cloud = sphere_mesh("CloudSphere", 0.5, 32, 16)
me_nuc = sphere_mesh("NucleusSphere", 0.04, 16, 8)
for j, (u, v) in enumerate(nuclei):
    p = O + Vector((u, 0, v))
    obj_from_mesh("Electron Cloud %02d" % j, me_cloud, C, p, m_cloud)
    obj_from_mesh("Gold Nucleus %02d" % j, me_nuc, C, p, m_nuc)
    # thin outline ring marking the atom's size
    ring = bpy.data.curves.new("AtomRing %02d" % j, 'CURVE')
    ring.dimensions = '3D'; ring.bevel_depth = 0.006
    sp = ring.splines.new('POLY'); n = 64; sp.points.add(n)
    for k, pt in enumerate(sp.points):
        a = 2 * math.pi * k / n
        pt.co = (0.5 * math.cos(a), 0, 0.5 * math.sin(a), 1)
    ro = bpy.data.objects.new("Atom Ring %02d" % j, ring); ro.location = p; link(ro, C)
    ring.materials.append(m_cloud_edge)


def accel(u, v):
    au = av = 0.0
    for nu, nv in nuclei:
        du, dv = u - nu, v - nv
        r2 = du * du + dv * dv
        if r2 > 1.0:
            continue
        r = math.sqrt(r2) + 1e-6
        f = K / r2 * math.exp(-r / LAMBDA)
        au += f * du / r; av += f * dv / r
    return au, av


def integrate(v_start, sub=60, max_frames=260):
    u, v, vu, vv = U0, v_start, V0, 0.0
    pts = [(u, v)]
    dt = 1.0 / sub
    au, av = accel(u, v)
    for _ in range(max_frames):
        for _ in range(sub):     # velocity Verlet
            u += vu * dt + 0.5 * au * dt * dt
            v += vv * dt + 0.5 * av * dt * dt
            nau, nav = accel(u, v)
            vu += 0.5 * (au + nau) * dt; vv += 0.5 * (av + nav) * dt
            au, av = nau, nav
        pts.append((u, v))
        if abs(v) > VMAX or u > UMAX or u < U0 - 0.5:
            break
    return pts, math.degrees(math.atan2(vv, vu))


# launch list: (start frame, impact height). Most random, a few aimed near a nucleus of the first column.
rng = random.Random(3)
launches = []
f = 676
specials = {3: -1.0 + 0.004, 6: 1.0 + 0.03, 9: 2.0 - 0.08, 12: -2.0 + 0.16}
for i in range(16):
    if i in specials:
        vs = specials[i]
    else:
        while True:
            vs = rng.uniform(-3.2, 3.2)
            if min(abs(vs - k) for k in range(-3, 4)) > 0.2:
                break
    launches.append((f, vs))
    f += 5

report = []
for i, (f0, vs) in enumerate(launches):
    pts, ang = integrate(vs)
    report.append("%d: b=%.3f -> %.1f deg (%d frames)" % (i, vs, ang, len(pts)))
    wpts = [O + Vector((u, 0, v)) for u, v in pts]
    ob = obj_from_mesh("Atomic Alpha %02d" % i, sphere_mesh("AtomicAlphaSphere", 0.07, 16, 8), C, wpts[0], m_alpha)
    kf(ob, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(ob, "scale", f0, (1, 1, 1), 'CONSTANT')
    kf(ob, "scale", f0 + len(wpts), (0, 0, 0), 'CONSTANT')
    for k, p in enumerate(wpts):
        kf(ob, "location", f0 + k, p, 'LINEAR')
    tr = poly_curve("Atomic Path %02d" % i, wpts, C, m_path, depth=0.012)
    kf(tr.data, "bevel_factor_end", 0, 0.0, 'CONSTANT')
    kf(tr.data, "bevel_factor_end", f0, 0.0, 'LINEAR')
    kf(tr.data, "bevel_factor_end", f0 + len(wpts) - 1, 1.0, 'CONSTANT')

print("\n".join(report))
print("atomic view ok")
