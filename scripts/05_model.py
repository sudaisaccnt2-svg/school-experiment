# ---- 05: Rutherford's planetary model (6 protons, 6 neutrons, 6 electrons -> neutral) ----
C = "Planetary Model"
O = Vector((114, 0, 10))
F0, F1 = 940, 1270

m_p = mat_pbr("Proton", (0.75, 0.06, 0.04), roughness=0.35, coat=0.6)
m_n = mat_pbr("Neutron", (0.35, 0.38, 0.42), roughness=0.4, coat=0.6)
# the nucleus glows by its own material (no light): protons warm red, neutrons faint cool
for _m, _c, _s in ((m_p, (1.0, 0.18, 0.1), 2.5), (m_n, (0.6, 0.72, 1.0), 0.8)):
    _b = _m.node_tree.nodes["Principled BSDF"]
    _b.inputs["Emission Color"].default_value = (*_c, 1)
    _b.inputs["Emission Strength"].default_value = _s
m_e = mat_emit("Electron", (0.2, 0.55, 1.0), 18.0)
m_orbit = mat_emit("Orbit Line", (0.35, 0.6, 1.0), 1.5)
m_back = bpy.data.materials.get("Backdrop") or mat_pbr("Backdrop", (0.004, 0.005, 0.01), roughness=0.9)

bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=30)
bd = mesh_obj("Model Backdrop", bm, C, m_back)
bd.location = Vector((120, 6, 10)); bd.rotation_euler = (math.radians(90), 0, 0)

# nucleus: 12 nucleons packed on a small sphere (fibonacci), alternating p / n
nuc = bpy.data.objects.new("Nucleus", None); nuc.location = O; link(nuc, C)
me_nucleon = sphere_mesh("NucleonSphere", 0.26, 32, 16)
pts = [(0, 0, 0)]
n = 11
for k in range(n):
    y = 1 - 2 * (k + 0.5) / n
    r = math.sqrt(1 - y * y)
    a = k * math.pi * (3 - math.sqrt(5))
    pts.append((0.36 * r * math.cos(a), 0.36 * y, 0.36 * r * math.sin(a)))
for k, p in enumerate(pts):
    ob = obj_from_mesh("Nucleon %02d" % k, me_nucleon, C, p, m_p)
    # object-linked material so protons and neutrons share one mesh
    ob.material_slots[0].link = 'OBJECT'
    ob.material_slots[0].material = m_p if k % 2 == 0 else m_n
    ob.parent = nuc
kf(nuc, "rotation_euler", F0, (0, 0, 0), 'LINEAR')
kf(nuc, "rotation_euler", F1, (0.6, 0.3, 2.2), 'LINEAR')
# (no glow light on the nucleus: removed by request)

# three tilted elliptical orbits, 2 electrons each
me_e = sphere_mesh("ElectronSphere", 0.11, 16, 8)
orbits = [(3.4, 1.5, (math.radians(90), 0, math.radians(0))),
          (3.4, 1.5, (math.radians(90), math.radians(60), 0)),
          (3.4, 1.5, (math.radians(90), math.radians(-60), 0))]
for oi, (a, b, rot) in enumerate(orbits):
    piv = bpy.data.objects.new("Orbit %d" % oi, None); piv.location = O; piv.rotation_euler = rot; link(piv, C)
    # orbit plane = local XY
    cu = bpy.data.curves.new("OrbitCurve %d" % oi, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.01
    sp = cu.splines.new('POLY'); sp.use_cyclic_u = True; m = 128; sp.points.add(m - 1)
    for k, pt in enumerate(sp.points):
        t = 2 * math.pi * k / m
        pt.co = (a * math.cos(t), b * math.sin(t), 0, 1)
    co = bpy.data.objects.new("Orbit Line %d" % oi, cu); link(co, C); co.parent = piv
    cu.materials.append(m_orbit)
    speed = 2 * math.pi / (110 + 25 * oi)   # radians per frame
    for ei in range(2):
        e = obj_from_mesh("Electron %d%d" % (oi, ei), me_e, C, (0, 0, 0), m_e)
        e.parent = piv
        ph = ei * math.pi + oi * 0.9
        for fr in range(F0, F1 + 1, 2):
            t = ph + speed * (fr - F0)
            kf(e, "location", fr, (a * math.cos(t), b * math.sin(t), 0), 'LINEAR')
print("model ok")
