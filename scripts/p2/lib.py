# ---- Part 2 shared library. Append after scripts/common.py:  bsend.py common.py p2/lib.py p2/<film>.py ----
# Conventions (see CLAUDE.md): every object name gets the film prefix PFX; HUD text = direct child of a camera with
# identity rotation and scale-only animation; world labels have no parent and face -Y; animate transforms only.
import bpy, bmesh, math, random, os
from mathutils import Vector, Matrix, Euler

FPS = 30
ASPECT = 16 / 9
PFX = "XX"                       # set by start_film()
EYE_SHIFT = (0.2034, -0.016819)  # film 01's eye-trace lens shift: subject on the left third, text on the right
DEG = math.pi / 180


def sec(t, f0=1):
    return f0 + int(round(t * FPS))


def N(name):
    return "%s %s" % (PFX, name)


def win():
    return bpy.context.window_manager.windows[0]


def use_scene(name):
    global scene
    sc = bpy.data.scenes[name]
    win().scene = sc
    scene = sc
    return sc


def C(name):
    """Collection of the current film (unique name across the file), linked under the current scene."""
    full = N(name)
    c = bpy.data.collections.get(full)
    if c is None:
        c = bpy.data.collections.new(full)
    if c.name not in scene.collection.children:
        scene.collection.children.link(c)
    return c


def put(ob, cname):
    for c in list(ob.users_collection):
        c.objects.unlink(ob)
    C(cname).objects.link(ob)
    return ob


def _remove_tree(colls):
    for c in colls:
        for o in list(c.objects):
            if all(cc in colls for cc in o.users_collection):
                d = o.data
                bpy.data.objects.remove(o, do_unlink=True)
                if d is not None and d.users == 0:
                    for blk in (bpy.data.meshes, bpy.data.curves, bpy.data.cameras, bpy.data.lights):
                        if d.name in blk and blk[d.name] == d:
                            blk.remove(d)
                            break
    for c in colls:
        try:
            bpy.data.collections.remove(c)
        except ReferenceError:
            pass


def clear_film_objects():
    """Remove every object/collection of the current prefix (used by acts inside an existing scene)."""
    colls = [c for c in bpy.data.collections if c.name.startswith(PFX + " ")]
    _remove_tree(colls)
    for o in [o for o in bpy.data.objects if o.name.startswith(PFX + " ")]:
        bpy.data.objects.remove(o, do_unlink=True)
    for a in [a for a in bpy.data.actions if a.users == 0]:
        bpy.data.actions.remove(a)


def start_film(pfx, scene_name, seconds, bg=(0.0045, 0.0055, 0.0095)):
    """(Re)create topic scene `scene_name` from nothing. Returns the scene."""
    global PFX, scene
    PFX = pfx
    old = bpy.data.scenes.get(scene_name)
    if old:
        if win().scene == old:
            win().scene = bpy.data.scenes["Scene"]
        colls = list(old.collection.children_recursive)
        loose = list(old.collection.objects)
        for o in loose:
            bpy.data.objects.remove(o, do_unlink=True)
        bpy.data.scenes.remove(old)
        _remove_tree(colls)
    clear_film_objects()
    for a in [a for a in bpy.data.actions if a.users == 0]:
        bpy.data.actions.remove(a)
    sc = bpy.data.scenes.new(scene_name)
    win().scene = sc
    scene = sc
    sc.frame_start, sc.frame_end = 1, int(round(seconds * FPS))
    r = sc.render
    r.fps = FPS
    r.resolution_x, r.resolution_y, r.resolution_percentage = 1920, 1080, 100
    for eng in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
        try:
            r.engine = eng
            break
        except TypeError:
            continue
    ee = sc.eevee
    ee.taa_render_samples = 32
    ee.taa_samples = 8
    try:
        ee.use_raytracing = False
        ee.use_shadows = True
    except AttributeError:
        pass
    sc.sync_mode = 'FRAME_DROP'
    vs = sc.view_settings
    vs.view_transform = 'AgX'
    try:
        vs.look = 'AgX - Medium High Contrast'
    except Exception:
        pass
    sc.world = studio_world(bg)
    _compositor(sc)
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_mode = 'RGB'
    r.filepath = "//renders/films/%s/frame_" % pfx
    r.use_overwrite = False
    r.use_placeholder = True
    sc["film_id"] = pfx
    for n in ("Cameras", "Labels", "Models"):
        C(n)
    return sc


def studio_world(bg):
    """Copy of the film-01 world (HDRI for light and reflections) with a dark studio colour for camera rays."""
    w = bpy.data.worlds.get("Studio World")
    if w:
        return w
    src = bpy.data.worlds.get("World")
    w = src.copy() if src else bpy.data.worlds.new("Studio World")
    w.name = "Studio World"
    w.use_nodes = True
    nt = w.node_tree
    bgs = [n for n in nt.nodes if n.type == 'BACKGROUND']
    cam_bg = [n for n in bgs if not n.inputs["Color"].is_linked]
    if src and cam_bg:
        for n in cam_bg:
            n.inputs["Color"].default_value = (*bg, 1)
            n.inputs["Strength"].default_value = 1.0
    elif not bgs:
        b = nt.nodes.new("ShaderNodeBackground")
        b.inputs["Color"].default_value = (*bg, 1)
        nt.links.new(b.outputs[0], nt.nodes.new("ShaderNodeOutputWorld").inputs[0])
    return w


def _compositor(sc):
    sc.use_nodes = True
    ct = sc.node_tree
    ct.nodes.clear()
    rl = ct.nodes.new("CompositorNodeRLayers")
    glare = ct.nodes.new("CompositorNodeGlare")
    try:
        glare.glare_type = 'BLOOM'
    except Exception:
        glare.glare_type = 'FOG_GLOW'
    try:
        glare.quality = 'MEDIUM'
    except Exception:
        pass
    for sock, val in (("Threshold", 1.0), ("Strength", 0.35), ("Size", 0.6)):
        if sock in glare.inputs:
            glare.inputs[sock].default_value = val
    comp = ct.nodes.new("CompositorNodeComposite")
    ct.links.new(rl.outputs["Image"], glare.inputs["Image"])
    ct.links.new(glare.outputs["Image"], comp.inputs["Image"])


def finish_film(save=True):
    scene.frame_set(scene.frame_start)
    if save and bpy.data.filepath:
        bpy.ops.wm.save_mainfile()
    print("FILM OK", scene.name, scene.frame_end, "frames,", len(scene.objects), "objects")


# ---------------------------------------------------------------- materials
M = {}


def mats():
    """The shared palette (film-01 materials are reused by name)."""
    M["white"] = mat_emit("Label White", (1.0, 1.0, 1.0), 1.6)
    M["gold"] = mat_emit("Label Gold", (1.0, 0.72, 0.28), 3.0)
    M["green"] = mat_emit("Label Green", (0.3, 1.0, 0.5), 2.0)
    M["red"] = mat_emit("Label Red", (1.0, 0.25, 0.2), 2.2)
    M["cyan"] = mat_emit("Label Cyan", (0.35, 0.8, 1.0), 2.2)
    M["dim"] = mat_emit("Label Dim", (0.62, 0.66, 0.74), 1.0)
    M["line"] = mat_emit("Leader Line", (0.8, 0.85, 0.9), 1.2)
    M["shadow"] = mat_emit("Label Shadow Core", (0, 0, 0), 0.0, alpha=0.8)
    M["shadow_soft"] = mat_emit("Label Shadow Soft", (0, 0, 0), 0.0, alpha=0.4)
    M["panel"] = mat_emit("Panel Fill", (0.0, 0.0, 0.0), 0.0, alpha=0.72)
    M["panel_solid"] = mat_emit("Panel Solid", (0.012, 0.014, 0.02), 1.0)   # book tables: nothing shows through
    M["panel_edge"] = mat_emit("Panel Edge", (0.35, 0.6, 1.0), 1.4)
    M["gold_edge"] = mat_emit("Panel Edge Gold", (1.0, 0.72, 0.28), 1.6)
    M["proton"] = bpy.data.materials["Proton"]
    M["neutron"] = bpy.data.materials["Neutron"]
    M["electron"] = bpy.data.materials["Electron"]
    M["orbit"] = bpy.data.materials["Orbit Line"]
    M["orbit_dim"] = mat_emit("Orbit Line Dim", (0.25, 0.42, 0.75), 0.7)
    M["flash"] = mat_emit("Flash White", (1.0, 0.9, 0.75), 30.0)
    M["ghost"] = mat_emit("Electron Ghost", (0.2, 0.55, 1.0), 2.0, alpha=0.35)
    M["trail"] = mat_emit("Electron Trail", (0.25, 0.6, 1.0), 1.6, alpha=0.3)
    return M


def mat_color_emit(name, color, strength=2.0, alpha=1.0):
    return mat_emit(name, color, strength, alpha)


def mat_emit_image(name, img, strength=1.5):
    """Principled: black base, emission from an image texture (exports as glTF emissiveTexture)."""
    m = bpy.data.materials.get(name)
    if m:
        bpy.data.materials.remove(m)
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0, 0, 0, 1)
    b.inputs["Roughness"].default_value = 1.0
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = img
    t.interpolation = 'Linear'
    nt.links.new(t.outputs["Color"], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = strength
    return m


def image_from_rgb(name, rows):
    """rows: list (bottom to top) of lists of (r,g,b) in 0..1 sRGB. Packed into the .blend."""
    import numpy as np
    h, w = len(rows), len(rows[0])
    img = bpy.data.images.get(name)
    if img:
        bpy.data.images.remove(img)
    img = bpy.data.images.new(name, w, h, alpha=False)
    px = np.ones((h, w, 4), dtype=np.float32)
    px[:, :, :3] = np.asarray(rows, dtype=np.float32)
    img.pixels.foreach_set(px.ravel())
    img.pack()
    return img


def wavelength_rgb(nm):
    """Approximate sRGB colour of visible light (380-700 nm)."""
    if nm < 380 or nm > 700:
        return (0, 0, 0)
    if nm < 440:
        r, g, b = -(nm - 440) / 60, 0.0, 1.0
    elif nm < 490:
        r, g, b = 0.0, (nm - 440) / 50, 1.0
    elif nm < 510:
        r, g, b = 0.0, 1.0, -(nm - 510) / 20
    elif nm < 580:
        r, g, b = (nm - 510) / 70, 1.0, 0.0
    elif nm < 645:
        r, g, b = 1.0, -(nm - 645) / 65, 0.0
    else:
        r, g, b = 1.0, 0.0, 0.0
    f = 0.3 + 0.7 * (nm - 380) / 40 if nm < 420 else (0.3 + 0.7 * (700 - nm) / 50 if nm > 650 else 1.0)
    return (r * f, g * f, b * f)


def pcurve(name, pts, mat, depth=0.01, cname="Labels", mapping='SEGMENTS', parent=None, full_name=False):
    cu = bpy.data.curves.new(name if full_name else N(name), 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = depth
    cu.bevel_resolution = 2
    cu.use_fill_caps = True
    cu.bevel_factor_mapping_start = mapping
    cu.bevel_factor_mapping_end = mapping
    sp = cu.splines.new('POLY')
    sp.points.add(len(pts) - 1)
    for p, co in zip(sp.points, pts):
        p.co = (co[0], co[1], co[2], 1)
    ob = bpy.data.objects.new(cu.name, cu)
    put(ob, cname)
    cu.materials.append(mat)
    if parent:
        ob.parent = parent
    return ob


# ---------------------------------------------------------------- text, labels, HUD
FONT_FILES = {"regular": "C:/Windows/Fonts/segoeui.ttf", "semibold": "C:/Windows/Fonts/seguisb.ttf",
              "symbol": "C:/Windows/Fonts/seguisym.ttf"}
SYMBOLS = "✓✗"          # not in Segoe UI: drawn with Segoe UI Symbol through the text's "bold" font slot


def font(kind):
    """Part 2 text uses Segoe UI (Blender's built-in font draws π wrongly and its 1 looks like I).
    Film 01 (prefix D5) keeps the built-in font so it matches acts 1-4."""
    if PFX == "D5":
        return None
    path = FONT_FILES[kind]
    for f in bpy.data.fonts:
        if os.path.normcase(bpy.path.abspath(f.filepath)) == os.path.normcase(path):
            return f
    return bpy.data.fonts.load(path)


def _text(name, body, loc, size, mat, align='CENTER', rot=(90 * DEG, 0, 0), cname="Labels", valign='CENTER',
          weight="regular"):
    cu = bpy.data.curves.new(N(name), 'FONT')
    cu.body = body
    f = font(weight)
    if f:
        cu.font = f
        if any(ch in body for ch in SYMBOLS):
            cu.font_bold = font("symbol")
            for i, ch in enumerate(body):
                if ch in SYMBOLS:
                    cu.body_format[i].use_bold = True
    cu.size = size
    cu.align_x = align
    cu.align_y = valign
    cu.space_line = 1.12
    ob = bpy.data.objects.new(N(name), cu)
    ob.location = loc
    ob.rotation_euler = rot
    put(ob, cname)
    cu.materials.append(mat)
    overlay_only(ob)
    return ob


def shadow(t):
    """Soft drop shadow (two dark thickened copies, children of the text; the web export merges them)."""
    size = t.data.size
    for tag, mat, grow, off in (("Shadow", M["shadow"], 0.05, 0.08), ("Shadow Soft", M["shadow_soft"], 0.13, 0.10)):
        cu = t.data.copy()
        cu.materials.clear()
        cu.materials.append(mat)
        cu.offset = size * grow
        sh = bpy.data.objects.new(t.name + " " + tag, cu)
        for c in t.users_collection:
            c.objects.link(sh)
        sh.parent = t
        sh.location = (size * off, -size * off, -size * (0.02 if tag == "Shadow" else 0.035))
        overlay_only(sh)
    return t


def appear(ob, f_in, f_out=None, dur=8, s=(1, 1, 1)):
    if f_in is not None:
        ob.scale = s
        pop_in(ob, f_in, dur, target=s)
    if f_out is not None:
        pop_out(ob, f_out, 6, s)
    return ob


def label(name, body, loc, size, f_in, f_out=None, mat=None, anchor=None, align='CENTER', weight="regular"):
    """World-space label facing -Y (billboards in the app), optional leader line to `anchor`."""
    t = shadow(_text(name, body, loc, size, mat or M["white"], align=align, weight=weight))
    appear(t, f_in, f_out)
    if anchor:
        start = Vector(loc) + (Vector(anchor) - Vector(loc)).normalized() * size * 0.9
        ln = pcurve(t.name + " Line", [start, Vector(anchor)], M["line"], depth=0.006 * size / 0.25,
                    mapping='RESOLUTION', full_name=True)
        overlay_only(ln)
        draw_on(ln, f_in + 4, 10)
        if f_out is not None:
            kf(ln.data, "bevel_factor_end", f_out, 1.0, 'BEZIER')
            kf(ln.data, "bevel_factor_end", f_out + 6, 0.0, 'CONSTANT')
    return t


def frame_size(cam, depth):
    w = depth * cam.data.sensor_width / cam.data.lens
    return w, w / ASPECT


def hud_xy(cam, u, v, depth):
    """Screen point (u, v in 0..1 of the 16:9 film frame, origin bottom-left) -> camera-local position."""
    w, h = frame_size(cam, depth)
    return Vector(((u - 0.5 + cam.data.shift_x) * w, (v - 0.5) * h + cam.data.shift_y * w, -depth))


HUD_DEPTH = 3.0


def hud(name, body, cam, u, v, size, f_in, f_out=None, mat=None, align='LEFT', depth=None, valign='CENTER',
        weight=None):
    """Screen-space caption: `size` is a fraction of the frame height (body ~0.034, title ~0.06)."""
    d = depth or HUD_DEPTH
    _, h = frame_size(cam, d)
    weight = weight or ("semibold" if size >= 0.05 else "regular")
    t = shadow(_text(name, body, hud_xy(cam, u, v, d), size * h, mat or M["white"], align=align, rot=(0, 0, 0),
                     valign=valign, weight=weight))
    t.parent = cam
    appear(t, f_in, f_out)
    return t


def hud_group(name, cam, u, v, f_in, f_out=None, depth=None):
    """Empty in screen space; build text/panels as its children in local XY units of `hud_unit(cam)`."""
    d = depth or HUD_DEPTH
    g = bpy.data.objects.new(N(name), None)
    put(g, "Labels")
    g.parent = cam
    g.location = hud_xy(cam, u, v, d)
    appear(g, f_in, f_out)
    return g


def hud_unit(cam, depth=None):
    """Length of 1.0 frame-height in camera space at the HUD depth."""
    return frame_size(cam, depth or HUD_DEPTH)[1]


def child_text(name, body, parent, x, y, size, mat=None, align='LEFT', valign='CENTER', z=0.0, f_in=None, f_out=None,
               weight="regular"):
    """Text in a group's local XY plane (x, y, size in the parent's units)."""
    t = shadow(_text(name, body, (x, y, z), size, mat or M["white"], align=align, rot=(0, 0, 0), valign=valign,
                     weight=weight))
    t.parent = parent
    if f_in is not None or f_out is not None:
        appear(t, f_in, f_out)
    return t


def rounded_rect(name, w, h, r, cname="Labels", segs=6):
    bm = bmesh.new()
    pts = []
    for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180),
                       (w / 2 - r, -h / 2 + r, 270)):
        for k in range(segs + 1):
            a = (a0 + 90 * k / segs) * DEG
            pts.append(bm.verts.new((cx + r * math.cos(a), cy + r * math.sin(a), 0)))
    bm.faces.new(pts)
    me = bpy.data.meshes.new(N(name))
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(N(name), me)
    put(ob, cname)
    return ob, pts


def panel(name, parent, x, y, w, h, z=-0.004, edge=None, r=None, fill=None):
    """Dark translucent card (and optional glowing outline) in the parent's local XY plane."""
    r = r if r is not None else min(w, h) * 0.08
    ob, _ = rounded_rect(name, w, h, r)
    ob.data.materials.append(fill or M["panel"])
    ob.parent = parent
    ob.location = (x, y, z)
    overlay_only(ob)
    if edge:
        pts = []
        for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180),
                           (w / 2 - r, -h / 2 + r, 270)):
            for k in range(7):
                a = (a0 + 15 * k) * DEG
                pts.append((cx + r * math.cos(a), cy + r * math.sin(a), 0))
        pts.append(pts[0])
        ln = pcurve(name + " Edge", pts, edge, depth=min(w, h) * 0.006, parent=parent)
        ln.location = (x, y, z + 0.0005)
        overlay_only(ln)
    return ob


def table(name, parent, x, y, cols, rows, size, row_h, f_in=None, stagger=0, head_mat=None, mat=None,
          f_out=None, line=True):
    """Text grid in the parent's local XY plane. cols: [(width, align)], rows: [[cell,...]] (row 0 = header).
    Cells are centred in their column unless the column says 'LEFT'. Returns list of row objects (empties)."""
    width = sum(c[0] for c in cols)
    out = []
    for ri, row in enumerate(rows):
        re = bpy.data.objects.new(N("%s Row %d" % (name, ri)), None)
        put(re, "Labels")
        re.parent = parent
        re.location = (x, y - ri * row_h, 0)
        cx = 0.0
        for ci, (cw, al) in enumerate(cols):
            cell = row[ci] if ci < len(row) else ""
            if cell:
                tx = cx + (0.04 * cw if al == 'LEFT' else cw / 2)
                child_text("%s R%dC%d" % (name, ri, ci), cell, re, tx, 0, size,
                           (head_mat or M["gold"]) if ri == 0 else (mat or M["white"]), align=al)
            cx += cw
        if f_in is not None:
            appear(re, f_in + ri * stagger, f_out)
        out.append(re)
        if line and ri == 0:
            hl = pcurve("%s Rule" % name, [(x, y - row_h * 0.55, 0), (x + width, y - row_h * 0.55, 0)],
                        M["line"], depth=size * 0.03, parent=parent)
            overlay_only(hl)
            if f_in is not None:
                appear(hl, f_in, f_out)
    return out


def nuclide(name, sym, A, Z, parent, x, y, size, mat=None, small_mat=None, align_left=True):
    """Stacked nuclide symbol: mass number A over atomic number Z, left of the element symbol."""
    g = bpy.data.objects.new(N(name), None)
    put(g, "Labels")
    g.parent = parent
    g.location = (x, y, 0)
    s2 = size * 0.5
    child_text(name + " Sym", sym, g, 0, 0, size, mat or M["white"], align='LEFT')
    child_text(name + " A", str(A), g, -size * 0.04, size * 0.33, s2, small_mat or mat or M["white"], align='RIGHT')
    child_text(name + " Z", str(Z), g, -size * 0.04, -size * 0.33, s2, small_mat or mat or M["white"], align='RIGHT')
    return g


# ---------------------------------------------------------------- cameras
def camera(name, lens, start, end, target, f0, f1, shift=EYE_SHIFT, interp='LINEAR'):
    cd = bpy.data.cameras.new(N(name))
    cd.lens = lens
    cd.clip_start = 0.1
    cd.clip_end = 400
    cd.shift_x, cd.shift_y = shift
    cam = bpy.data.objects.new(N(name), cd)
    put(cam, "Cameras")
    tgt = bpy.data.objects.new(N(name) + " Target", None)
    tgt.location = target
    put(tgt, "Cameras")
    c = cam.constraints.new('TRACK_TO')
    c.target = tgt
    c.track_axis = 'TRACK_NEGATIVE_Z'
    c.up_axis = 'UP_Y'
    kf(cam, "location", f0, Vector(start), interp)
    kf(cam, "location", f1, Vector(end), interp)
    cam.location = Vector(start)
    # Track-To has to be evaluated for the HUD maths (camera-space positions don't need it, but the preview does)
    return cam


def cut(frame, cam):
    mk = scene.timeline_markers.new(cam.name, frame=frame)
    mk.camera = cam
    if scene.camera is None or frame <= scene.frame_start:
        scene.camera = cam
    return mk


def act(name, frame):
    """Act boundary marker (no camera): the web app shows one button per act."""
    return scene.timeline_markers.new("ACT " + name, frame=frame)


# ---------------------------------------------------------------- geometry helpers
def empty(name, loc=(0, 0, 0), parent=None, cname="Models", rot=(0, 0, 0)):
    e = bpy.data.objects.new(N(name), None)
    put(e, cname)
    e.location = loc
    e.rotation_euler = rot
    if parent:
        e.parent = parent
    return e


def mesh_from_bm(name, bm, mat=None, cname="Models", parent=None, loc=(0, 0, 0)):
    me = bpy.data.meshes.new(N(name))
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(N(name), me)
    put(ob, cname)
    if mat:
        me.materials.append(mat)
    if parent:
        ob.parent = parent
    ob.location = loc
    return ob


def sphere(name, r, mat, loc=(0, 0, 0), parent=None, segs=32, rings=16, cname="Models"):
    me = sphere_mesh("Sphere %d %d" % (segs, rings), 1.0, segs, rings)
    if not me.materials:
        me.materials.append(mat)
    ob = bpy.data.objects.new(N(name), me)
    put(ob, cname)
    ob.location = loc
    ob.scale = (r, r, r)
    if parent:
        ob.parent = parent
    ob.material_slots[0].link = 'OBJECT'
    ob.material_slots[0].material = mat
    return ob


def ring_curve(name, radius, mat, parent=None, depth=0.014, n=160, cname="Models", loc=(0, 0, 0)):
    pts = [(radius * math.cos(2 * math.pi * k / n), radius * math.sin(2 * math.pi * k / n), 0) for k in range(n)]
    cu = bpy.data.curves.new(N(name), 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = depth
    cu.bevel_resolution = 2
    sp = cu.splines.new('POLY')
    sp.points.add(n - 1)
    for p, co in zip(sp.points, pts):
        p.co = (*co, 1)
    sp.use_cyclic_u = True
    ob = bpy.data.objects.new(N(name), cu)
    put(ob, cname)
    cu.materials.append(mat)
    if parent:
        ob.parent = parent
    ob.location = loc
    return ob


def line(name, pts, mat, depth=0.012, parent=None, cname="Models"):
    return pcurve(name, pts, mat, depth, cname, parent=parent)


def arrow(name, length, mat, parent=None, loc=(0, 0, 0), rot=(0, 0, 0), r=0.035, head=0.16, cname="Models"):
    """Arrow along local +X from the origin."""
    bm = bmesh.new()
    shaft = max(length - head, 0.01)
    m = Matrix.Translation((shaft / 2, 0, 0)) @ Matrix.Rotation(math.pi / 2, 4, 'Y')
    bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=r, radius2=r, depth=shaft, matrix=m)
    m2 = Matrix.Translation((shaft + head / 2, 0, 0)) @ Matrix.Rotation(math.pi / 2, 4, 'Y')
    bmesh.ops.create_cone(bm, cap_ends=True, segments=20, radius1=r * 2.8, radius2=0.0, depth=head, matrix=m2)
    ob = mesh_from_bm(name, bm, mat, cname, parent, loc)
    ob.rotation_euler = rot
    smooth(ob)
    return ob


def squiggle(name, mat, length=1.2, waves=3, amp=0.12, r=0.022, parent=None, cname="Models"):
    """Photon: sine-wave tube along local +X, centred on the origin."""
    n = 18 * waves
    pts = [(-length / 2 + length * k / n, amp * math.sin(2 * math.pi * waves * k / n), 0) for k in range(n + 1)]
    cu = bpy.data.curves.new(N(name), 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = r
    cu.bevel_resolution = 1
    cu.use_fill_caps = True
    sp = cu.splines.new('POLY')
    sp.points.add(n)
    for p, co in zip(sp.points, pts):
        p.co = (*co, 1)
    ob = bpy.data.objects.new(N(name), cu)
    put(ob, cname)
    cu.materials.append(mat)
    if parent:
        ob.parent = parent
    return ob


# ---------------------------------------------------------------- atoms
def nucleon_positions(n, r=0.26, seed=7):
    """Close-packed ball of n spheres (FCC lattice points nearest the centre, randomly turned + jittered),
    ordered from the centre outward (so a growing nucleus fills naturally)."""
    rnd = random.Random(seed)
    d = 2 * r * 0.98
    k = int(math.ceil((n * 1.0) ** (1 / 3))) + 3
    pts = []
    for i in range(-k, k + 1):
        for j in range(-k, k + 1):
            for l in range(-k, k + 1):
                if (i + j + l) % 2 == 0:
                    pts.append(Vector((i, j, l)) * (d / math.sqrt(2)))
    rot = Euler((rnd.uniform(0, 6.3), rnd.uniform(0, 6.3), rnd.uniform(0, 6.3))).to_matrix()
    off = Vector((rnd.uniform(-.3, .3), rnd.uniform(-.3, .3), rnd.uniform(-.3, .3))) * d
    pts = [rot @ (p + off) for p in pts]
    pts.sort(key=lambda p: p.length)
    pts = pts[:n]
    c = sum(pts, Vector()) / max(n, 1)
    out = [p - c + Vector((rnd.gauss(0, .04), rnd.gauss(0, .04), rnd.gauss(0, .04))) * r for p in pts]
    out.sort(key=lambda p: p.length)
    return out


def nucleus_radius(n, r=0.26):
    return r * (n / 0.74) ** (1 / 3) if n > 1 else r


def nucleus(name, Z, Nn, parent=None, loc=(0, 0, 0), r=0.26, seed=7, lo=None, order=None, cname="Models"):
    """Protons (red) + neutrons (grey) packed into a ball under an empty. Returns (empty, [nucleon objects]).
    order: optional list of 'p'/'n' per position (centre outward); default spreads protons evenly."""
    n = Z + Nn
    lo = (n > 60) if lo is None else lo
    me = sphere_mesh("NucleonSphereLo" if lo else "NucleonSphere", 0.26, 16 if lo else 32, 8 if lo else 16)
    root = empty(name, loc, parent, cname)
    pos = nucleon_positions(n, r, seed)
    if order is None:
        rnd = random.Random(seed + 1)
        order = ['p'] * Z + ['n'] * Nn
        rnd.shuffle(order)
    obs = []
    for k, (p, kind) in enumerate(zip(pos, order)):
        ob = bpy.data.objects.new(N("%s %s%03d" % (name, kind, k)), me)
        put(ob, cname)
        if not me.materials:
            me.materials.append(M["proton"])
        ob.material_slots[0].link = 'OBJECT'
        ob.material_slots[0].material = M["proton"] if kind == 'p' else M["neutron"]
        ob.parent = root
        ob.location = p
        ob.scale = (r / 0.26,) * 3
        obs.append(ob)
    return root, obs



def nucleus_mesh(name, Z, Nn, parent=None, loc=(0, 0, 0), r=0.2, seed=7, cname="Models"):
    """Big nuclei (uranium …) as ONE mesh with two materials: hundreds of nucleon objects would slow the iPad."""
    n = Z + Nn
    rnd = random.Random(seed + 1)
    order = ['p'] * Z + ['n'] * Nn
    rnd.shuffle(order)
    bm = bmesh.new()
    for p, kind in zip(nucleon_positions(n, r, seed), order):
        nf = len(bm.faces)
        bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=6, radius=r, matrix=Matrix.Translation(p))
        bm.faces.ensure_lookup_table()
        for f in bm.faces[nf:]:
            f.material_index = 0 if kind == 'p' else 1
            f.smooth = True
    ob = mesh_from_bm(name, bm, M["proton"], cname=cname, parent=parent, loc=loc)
    ob.data.materials.append(M["neutron"])
    return ob

def electron(name, parent=None, loc=(0, 0, 0), r=0.13, cname="Models", mat=None):
    me = sphere_mesh("ElectronSphere", 0.11, 16, 8)
    ob = bpy.data.objects.new(N(name), me)
    put(ob, cname)
    if not me.materials:
        me.materials.append(M["electron"])
    if mat:
        ob.material_slots[0].link = 'OBJECT'
        ob.material_slots[0].material = mat
    ob.parent = parent
    ob.location = loc
    ob.scale = (r / 0.11,) * 3
    return ob


def trail(e, R, span=0.85, sign=1, segs=14):
    """Comet tail behind an orbiting electron: a tapered glowing arc, child of the electron (so it pops with it).
    R = orbit radius, span = arc length in radians, sign = +1 for counter-clockwise motion."""
    s = e.scale.x
    key = "Trail %.3f %.2f %.3f %d" % (R, span, s, sign)
    me = bpy.data.meshes.get(key)
    if me is None:
        me = bpy.data.meshes.new(key)
        bm = bmesh.new()
        rings = []
        for i in range(segs + 1):
            th = -sign * span * i / segs
            c = Vector((R * math.cos(th) - R, R * math.sin(th), 0)) / s
            nrm, bz = Vector((math.cos(th), math.sin(th), 0)), Vector((0, 0, 1))
            rad = 0.085 * (1 - i / segs) ** 1.25 + 0.004
            rings.append([bm.verts.new(c + (nrm * math.cos(a) + bz * math.sin(a)) * rad)
                          for a in (k * math.pi / 3 for k in range(6))])
        for r0, r1 in zip(rings, rings[1:]):
            for k in range(6):
                bm.faces.new((r0[k], r0[(k + 1) % 6], r1[(k + 1) % 6], r1[k]))
        for f in bm.faces:
            f.smooth = True
        bm.to_mesh(me)
        bm.free()
        me.materials.append(M["trail"])
    ob = bpy.data.objects.new(N(e.name[len(PFX) + 1:] + " Trail") if e.name.startswith(PFX + " ") else e.name + " Trail", me)
    for c in e.users_collection:
        c.objects.link(ob)
    ob.parent = e
    ob.rotation_euler = (0, 0, math.atan2(e.location.y, e.location.x))
    return ob


def spin(ob, f0, f1, turns, axis=2, phase=0.0):
    """Constant-speed rotation about a local axis (LINEAR keys)."""
    r = list(ob.rotation_euler)
    r[axis] = phase
    kf(ob, "rotation_euler", f0, Euler(r), 'LINEAR')
    r[axis] = phase + 2 * math.pi * turns
    kf(ob, "rotation_euler", f1, Euler(r), 'LINEAR')


SHELL_NAMES = "KLMNOPQ"


def bohr_atom(name, Z, Nn, shells, loc=(0, 0, 0), radii=None, f0=1, f1=None, period=4.0, tilt=14,
              e_r=0.13, nuc_r=0.26, ring_mat=None, parent=None, show_nucleus=True, seed=7, spin_dirs=None,
              e_mats=None, trails=True):
    """Bohr-style atom: nucleus + concentric rings (in the plane facing the camera, tilted `tilt` degrees),
    electrons evenly spaced on each ring, each ring's electrons turning with a pivot.
    Returns dict(root, nucleus, nucleons, rings, pivots, electrons=[[...] per shell])."""
    f1 = f1 or scene.frame_end
    root = empty(name, loc, parent, rot=((90 - tilt) * DEG, 0, 0))
    out = {"root": root, "rings": [], "pivots": [], "electrons": [], "nucleus": None, "nucleons": []}
    if show_nucleus:
        nroot, nobs = nucleus(name + " Nucleus", Z, Nn, root, r=nuc_r, seed=seed)
        out["nucleus"], out["nucleons"] = nroot, nobs
    rn = nucleus_radius(Z + Nn, nuc_r) if show_nucleus else 0.3
    radii = radii or [rn + 1.0 + 0.95 * i for i in range(len(shells))]
    for i, cnt in enumerate(shells):
        ring = ring_curve("%s Ring %s" % (name, SHELL_NAMES[i]), radii[i], ring_mat or M["orbit"], root)
        piv = empty("%s Pivot %s" % (name, SHELL_NAMES[i]), (0, 0, 0), root)
        d = (spin_dirs[i] if spin_dirs else 1)
        turns = d * (f1 - f0) / FPS / (period * (1 + 0.45 * i))
        spin(piv, f0, f1, turns, phase=0.4 * i)
        es = []
        for k in range(cnt):
            a = 2 * math.pi * k / max(cnt, 1)
            e = electron("%s e %s%02d" % (name, SHELL_NAMES[i], k), piv,
                         (radii[i] * math.cos(a), radii[i] * math.sin(a), 0), e_r,
                         mat=(e_mats[i][k] if e_mats else None))
            if trails:
                trail(e, radii[i], span=min(0.85, 2.2 / max(cnt, 1)), sign=1 if d > 0 else -1)
            es.append(e)
        out["rings"].append(ring)
        out["pivots"].append(piv)
        out["electrons"].append(es)
    out["radii"] = radii
    return out


def flash(name, loc, frame, size=1.0, parent=None, dur=10):
    f = sphere(name, 1.0, M["flash"], loc, parent, 16, 8)
    kf(f, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(f, "scale", frame, (0, 0, 0), 'BEZIER')
    kf(f, "scale", frame + 3, (size,) * 3, 'BEZIER')
    kf(f, "scale", frame + dur, (0, 0, 0), 'CONSTANT')
    return f


def move(ob, f0, f1, a, b, interp='BEZIER'):
    kf(ob, "location", f0, Vector(a), interp)
    kf(ob, "location", f1, Vector(b), interp)


def scale_to(ob, f0, f1, a, b, interp='BEZIER'):
    kf(ob, "scale", f0, Vector(a), interp)
    kf(ob, "scale", f1, Vector(b), interp)


def hide_until(ob, frame):
    """Scale 0 before `frame` (instant), current scale from then on."""
    s = tuple(ob.scale)
    kf(ob, "scale", 0, (0, 0, 0), 'CONSTANT')
    kf(ob, "scale", frame, s, 'CONSTANT')


def hide_from(ob, frame, s=None):
    s = tuple(s or ob.scale)
    kf(ob, "scale", frame - 1, s, 'CONSTANT')
    kf(ob, "scale", frame, (0, 0, 0), 'CONSTANT')


# ---- shape and motion helpers (first used in film 10) ----
from mathutils import noise
def glow(name, rgb, k=3.5, alpha=1.0):
    return mat_emit(name, rgb, k, alpha)


def blob(name, r3, mat, loc=(0, 0, 0), parent=None, bump=0.0, seed=0, rot=(0, 0, 0), segs=24, rings=12):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=rings, radius=1.0)
    off = Vector((seed * 3.1, seed * 1.7, seed * 2.3))
    for v in bm.verts:
        k = 1.0 + bump * noise.noise(v.co * 2.2 + off)
        v.co = Vector((v.co.x * r3[0] * k, v.co.y * r3[1] * k, v.co.z * r3[2] * k))
    for f in bm.faces:
        f.smooth = True
    ob = mesh_from_bm(name, bm, mat, "Models", parent, loc)
    ob.rotation_euler = rot
    return ob


def cyl(name, r1, r2, h, mat, loc=(0, 0, 0), parent=None, rot=(0, 0, 0), base=False, segs=32):
    """Cylinder/cone along local Z, centred (or starting at the origin if base=True)."""
    bm = bmesh.new()
    m = Matrix.Translation((0, 0, h / 2)) if base else Matrix()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r1, radius2=r2, depth=h, matrix=m)
    ob = mesh_from_bm(name, bm, mat, "Models", parent, loc)
    ob.rotation_euler = rot
    return ob


def box(name, d3, mat, loc=(0, 0, 0), parent=None):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * d3[0], v.co.y * d3[1], v.co.z * d3[2]))
    return mesh_from_bm(name, bm, mat, "Models", parent, loc)


def dot(name, r, mat, parent, loc=(0, 0, 0)):
    return sphere(name, r, mat, loc, parent, 12, 6)


def along(ob, poly, f0, speed, stop=None):
    """Keyframe ob along a polyline at `speed` units/frame, stopping after distance `stop`. Returns the end frame."""
    pts = [Vector(p) for p in poly]
    stop = 1e9 if stop is None else stop
    kf(ob, "location", f0, pts[0], 'LINEAR')
    d = 0.0
    for a, b in zip(pts, pts[1:]):
        L = (b - a).length
        if d + L >= stop:
            f = f0 + round(stop / speed)
            kf(ob, "location", f, a + (b - a) * ((stop - d) / L), 'LINEAR')
            return f
        d += L
        kf(ob, "location", f0 + round(d / speed), b, 'LINEAR')
    return f0 + round(d / speed)


def pulses(name, loc, parent, times, r=0.6, mat=None):
    g = empty(name, loc, parent, rot=(90 * DEG, 0, 0))
    for k, t in enumerate(times):
        rg = ring_curve("%s %d" % (name, k), r, mat or M["gold"], g, depth=0.03)
        f = sec(t)
        kf(rg, "scale", 0, (0, 0, 0), 'CONSTANT')
        kf(rg, "scale", f, (0.2, 0.2, 0.2), 'LINEAR')
        kf(rg, "scale", f + 15, (1.6, 1.6, 1.6), 'LINEAR')
        kf(rg, "scale", f + 16, (0, 0, 0), 'CONSTANT')
    return g


def nsym(key, el, A, Z, loc, t0, t1, size=0.55):
    g = empty("Sym %s" % key, loc + Vector((-0.45 * size, 0, 0)), rot=(90 * DEG, 0, 0), cname="Labels")
    nuclide("Nuc %s" % key, el, A, Z, g, 0.0, 0.0, size)
    appear(g, sec(t0), t1)
    return g


def stations(T, gap=30.0, dist=23.0):
    """One camera + root empty per time span T[i]..T[i+1] (seconds), placed gap apart along X.
    The root is hidden outside its span (keeps AR ranges clean). Returns (P, R, CAM)."""
    from mathutils import noise  # noqa: F401  (blob() needs it)
    P, R, CAM = [], [], []
    n = len(T) - 1
    for i in range(n):
        p = Vector((gap * i, 0, 0))
        f0, f1 = (1 if i == 0 else sec(T[i])), (scene.frame_end if i == n - 1 else sec(T[i + 1]))
        cam = camera("Cam %d" % i, 40, p + Vector((-0.6, -dist, 0.6)), p + Vector((0.6, -dist + 1.5, 0.5)),
                     p + Vector((0, 0, 0.3)), f0, f1, shift=(0.0, 0.0))
        cut(f0, cam)
        r = empty("Station %d" % i, p)
        if i:
            hide_until(r, f0)
        if i < n - 1:
            hide_from(r, f1)
        P.append(p), R.append(r), CAM.append(cam)
    return P, R, CAM


def flat_atom(name, parent, loc, radii, counts, Z, Nn, f_in, f_end, nuc_r=0.16, e_r=0.12, ring_mat=None, turns=1.5,
              dur=12):
    """Atom drawn in the picture plane (faces the camera): nucleus mesh, rings, spinning electrons."""
    g = empty(name, loc, parent, rot=(90 * DEG, 0, 0))
    if Z or Nn:
        nucleus_mesh(name + " Nucleus", Z, Nn, g, r=nuc_r, seed=Z + Nn)
    for k, (rad, n) in enumerate(zip(radii, counts)):
        ring_curve("%s Ring %d" % (name, k), rad, ring_mat or M["orbit"], g, depth=0.018)
        piv = empty("%s Piv %d" % (name, k), (0, 0, 0), g)
        spin(piv, f_in, f_end, turns / (1 + 0.6 * k), phase=k)
        for j in range(n):
            a = 2 * math.pi * j / n
            trail(electron("%s e%d %d" % (name, k, j), piv, (rad * math.cos(a), rad * math.sin(a), 0), e_r), rad,
                  span=min(0.85, 2.2 / n), sign=1 if turns >= 0 else -1)
    if f_in is not None:
        appear(g, f_in, dur=dur)
    return g


def text_width(ob):
    """Width of a (not yet animated) text object in its parent's units."""
    bpy.context.view_layer.update()
    return ob.dimensions.x


mats()
print("lib ok")


# ---- focus: one thing moves at a time (the user found several moving things at once distracting) ----
def focus_spin(ob, spans, rate, axis=2, phase=0.0):
    """Turn `ob` about a local axis only inside the (f0, f1) frame spans, `rate` radians per frame; it stays
    still between spans. Replaces its earlier rotation keys. Returns angle(frame) for things that follow it."""
    for fc in _fcurves(ob):
        if fc.data_path == "rotation_euler":
            fc.keyframe_points.clear()
    r = list(ob.rotation_euler)
    ang, marks = phase, []
    for f0, f1 in sorted(spans):
        r[axis] = ang
        kf(ob, "rotation_euler", f0, Euler(r), 'LINEAR')
        marks.append((f0, ang))
        ang += rate * (f1 - f0)
        r[axis] = ang
        kf(ob, "rotation_euler", f1, Euler(r), 'LINEAR')
        marks.append((f1, ang))

    def angle(f):
        if not marks or f <= marks[0][0]:
            return phase
        for (fa, a), (fb, b) in zip(marks, marks[1:]):
            if fa <= f <= fb:
                return a + (b - a) * (f - fa) / max(fb - fa, 1e-6)
        return marks[-1][1]
    return angle


def refocus(root, spans):
    """Every spin() under `root` (2 LINEAR rotation keys) turns only inside `spans`, at its old speed."""
    obs = [root] + list(root.children_recursive)
    for ob in obs:
        for fc in _fcurves(ob):
            if fc.data_path != "rotation_euler" or len(fc.keyframe_points) != 2:
                continue
            k0, k1 = fc.keyframe_points
            if k0.interpolation != 'LINEAR' or abs(k1.co.y - k0.co.y) < 1e-6:
                continue
            rate = (k1.co.y - k0.co.y) / (k1.co.x - k0.co.x)
            focus_spin(ob, spans, rate, axis=fc.array_index, phase=k0.co.y)
            break


# ---------------------------------------------------------------- MCQ card (films 12, 313, 415, 515, 617, 719)
def _wrap(text, n, indent=""):
    import textwrap
    return "\n".join(textwrap.wrap(text.replace("\n", " "), n, subsequent_indent=indent))


def mcq_card(i, cam, num, qt, opts, ans, why, q0, qa, f1, fill, qdraw=None):
    """Question card in the left 60 % of the picture: big text, long lines wrapped, stacked top to bottom (question,
    options, answer, reason); shrinks a little only if a long question would not fit. `qdraw(g, y_top, size)` draws a
    special question itself (2 lines)."""
    U = hud_unit(cam)
    PQ = 1.22                                           # line pitch / font size
    for k in (1.0, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64, 0.58):
        QS, OS, AS, WS = 0.062 * k, 0.056 * k, 0.052 * k, 0.047 * k
        qb = "%s. %s" % (num, qt) if qt else ""
        qtxt = _wrap(qb, int(50 / k), "     ") if qt else ""
        nq = qtxt.count("\n") + 1 if qt else 2
        bodies = [_wrap("(%s)  %s" % ("abcd"[j], o), int(54 / k), "       ") for j, o in enumerate(opts)]
        wtxt = _wrap(why, int(58 / k))
        top = 0.865
        y = top - nq * PQ * QS - 0.03 * k
        tops = []
        for b in bodies:
            tops.append(y)
            y -= (b.count("\n") + 1) * PQ * OS + 0.028 * k
        ans_v = y - 0.6 * AS
        why_top = ans_v - 0.75 * AS
        if why_top - (wtxt.count("\n") + 1) * PQ * WS >= 0.025:
            break
    g = hud_group("Card %d" % i, cam, 0.045, 0.5, sec(q0 + 0.2), f1)
    L = lambda v: (v - 0.5) * U                         # picture height (0..1) -> card-local y
    if qt:
        child_text("Q%d" % i, qtxt, g, 0.0, L(top), QS * U, M["white"], valign='TOP', weight="semibold")
    else:
        qdraw(g, L(top), QS * U)
    for j, b in enumerate(bodies):
        child_text("Opt %d %d" % (i, j), b, g, 0.0, L(tops[j]), OS * U, M["white"], valign='TOP',
                   f_in=sec(q0 + 0.8 + 0.35 * j), f_out=sec(qa) if j == ans else None)
        if j == ans:                 # the answer: white text swaps to green on a green card
            nl = b.count("\n") + 1
            hg = empty("Hi %d" % i, (0, 0, 0), g, cname="Labels")
            h = nl * PQ * OS + 0.022 * k
            panel("Hi %d Card" % i, hg, 0.48 * U, L(tops[j] + 0.011 * k - h / 2 + 0.006 * k), 1.04 * U, h * U,
                  edge=M["green"], r=0.012 * U, fill=fill)
            child_text("Opt %d %d G" % (i, j), b, hg, 0.0, L(tops[j]), OS * U, M["green"], valign='TOP',
                       weight="semibold")
            child_text("Tick %d" % i, "✓", hg, -0.03 * U, L(tops[j] - 0.55 * OS), 1.2 * OS * U, M["green"],
                       align='CENTER', weight="semibold")
            appear(hg, sec(qa))
    hud("Ans %d" % i, "Answer: (%s)" % "abcd"[ans], cam, 0.045, ans_v, AS, sec(qa + 0.3), f1, M["green"],
        weight="semibold")
    hud("Why %d" % i, wtxt, cam, 0.045, why_top, WS, sec(qa + 0.8), f1, M["gold"], valign='TOP')
