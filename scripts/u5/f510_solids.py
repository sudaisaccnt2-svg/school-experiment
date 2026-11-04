# ---- Film 510: The solid state (textbook pp.141-142: solid state, 5.4 i volume and shape, ii melting point,  (v4 captions)
# iii rigidity, iv density, comparison table of solids, liquids and gases) ----
import random as _r
start_film("510", "510 Solid State", 88.5)
END = scene.frame_end
SA, SB, SC, SD, SE = (Vector((40 * k, 0, 0)) for k in range(5))

shot("Cam Solid", 0, 14, SA + Vector((0, 0, -0.5)), dist=14, pitch=0.12)
shot("Cam Melt", 14, 32, SB + Vector((0.6, 0, -1.2)), dist=13.5, pitch=0.1)
shot("Cam Rigid", 32, 42, SC + Vector((0, 0, -0.3)), dist=14, pitch=0.1)
shot("Cam Dense", 42, 52, SD + Vector((0, 0, -0.5)), dist=16, pitch=0.1)
shot("Cam Table", 52, None, SE + Vector((0, 0, -0.2)), dist=16)
for name, t in (("Solid state", 0), ("Melting point", 14), ("Rigidity", 32), ("Density", 42), ("Comparison", 52)):
    act(name, sec(t))

say('A1', 'Solid: packed tight, vibrating', 0.1, 7)
say('A2', 'Fixed shape, fixed volume', 7, 14)
say('B1', 'Heat: they shake harder', 14, 21)
say('B2', 'They break free: melting point', 21, 27)
say('B3', 'Melting: temperature stays the same', 27, 32)
say('C', 'Rigid: keeps its shape', 32, 42)
say('D', 'Solids are the densest', 42, 52)
say('E1', 'Mass, shape, volume', 52, 64)
say('E2', 'Squeeze, flow, rigidity', 64, 76)
say('E3', 'Diffusion, spacing, forces', 76, 88)

# ---- A. a 3D block of particles, vibrating; the whole block turns but keeps its shape ----
blk = empty("A Block", SA + Vector((0, 0, -0.3)))
shake("A P", grid_pts(6, 5, 0.46, (0, 0, 0), ny=3), 0.0, 14.0, amp=0.035, r=0.17, parent=blk, seed=1)
for k, o in enumerate([c for c in blk.children]):
    appear(o, sec(0.3) + k // 3, s=(0.17,) * 3)
kf(blk, "rotation_euler", sec(7.0), (0, 0, 0))
kf(blk, "rotation_euler", sec(12.0), (0, 0, math.radians(35)))
move(blk, sec(7.0), sec(12.0), SA + Vector((0, 0, -0.3)), SA + Vector((0.8, 0, -0.1)))
big("Lbl A", "vibrate in place", SA + Vector((0, -0.6, 1.9)), 2.0, 14.0, mat=M["cyan"], size=0.5)

# ---- B. heating: shake harder → break free; the thermometer stops at the melting point ----
cB = SB + Vector((0, 0, -2.2))
appear(box_edges("B Dish", (4.4, 1.6, 2.4), cB + Vector((0, 0, 1.2)), top=False), sec(14.2), dur=10)
grid = grid_pts(6, 4, 0.46, cB + Vector((0, 0, 0.9)))
sol = shake("B Sol", grid, 14.0, 23.0, r=0.17, seed=5, amp_f=lambda t: 0.03 if t < 15 else min(0.16, 0.03 + 0.02 * (t - 15)))
for k, o in enumerate(sol):
    appear(o, sec(14.3) + k, s=(0.17,) * 3)
liq = gas("B Liq", len(grid), cB + Vector((-2.2, -0.35, 0)), cB + Vector((2.2, 0.35, 1.2)), 23.0, 32.0, speed=1.0, r=0.17,
          pos=[pos_at(o, 23.0) for o in sol], seed=6)
swap(sol, liq, 23.0)
flame("B Flame", cB + Vector((0, 0, -0.9)), 15.0, None, s=0.8)
col = thermo("B Thermo", cB + Vector((3.2, -0.2, 0)), h=3.4)
appear(col.parent, sec(14.4), dur=10)
level(col, 14, 0.2)
level(col, 21, 0.55, 'LINEAR')
level(col, 30, 0.55)
big("Lbl B MP", "melting point", cB + Vector((3.8, -0.6, 2.0)), 21.4, None, mat=M["gold"], size=0.48, align='LEFT')

# ---- C. push a solid: it does not change shape ----
blkC = empty("C Block", SC + Vector((0, 0, -0.4)))
shake("C P", grid_pts(5, 5, 0.46, (0, 0, 0), ny=2), 32.0, 42.0, amp=0.03, r=0.17, parent=blkC, seed=8)
for k, o in enumerate([c for c in blkC.children]):
    appear(o, sec(32.2) + k // 3, s=(0.17,) * 3)
ar = arrow("C Push", 1.6, M["red"], None, SC + Vector((-4.2, -0.3, -0.4)), r=0.07, head=0.35)
appear(ar, sec(34.0), dur=8)
move(ar, sec(35.0), sec(36.0), SC + Vector((-4.2, -0.3, -0.4)), SC + Vector((-3.0, -0.3, -0.4)))
move(blkC, sec(35.8), sec(37.0), SC + Vector((0, 0, -0.4)), SC + Vector((0.9, 0, -0.4)))
big("Lbl C", "same shape", SC + Vector((0.9, -0.6, 1.6)), 37.2, None, mat=M["green"], size=0.5)

# ---- D. the same box with gas, liquid and solid ----
for k, (x, nm) in enumerate(((-5.0, "gas"), (0.0, "liquid"), (5.0, "solid"))):
    c = SD + Vector((x, 0, -0.6))
    appear(box_edges("D Box %d" % k, (3.0, 1.2, 3.0), c), sec(42.3 + 0.3 * k), dur=10)
    lo, hi = c - Vector((1.5, 0.6, 1.5)), c + Vector((1.5, 0.6, 1.5))
    if k == 0:
        gas("D Gas", 4, lo, hi, 42.0, 52.0, speed=2.4, r=0.16, seed=31, f_in=sec(42.8))
    elif k == 1:
        gas("D Liq", 24, lo, Vector((hi[0], hi[1], lo[2] + 1.8)), 42.0, 52.0, speed=0.7, r=0.16, seed=32, f_in=sec(43.3))
    else:
        for i, m in enumerate(shake("D Sol", grid_pts(6, 6, 0.46, c), 42.0, 52.0, r=0.17, seed=33)):
            appear(m, sec(43.8) + i // 3, s=(0.17,) * 3)
    big("Lbl D %d" % k, nm, c + Vector((0, -0.6, 2.2)), 43.0 + 0.5 * k, None, mat=(M["dim"], M["cyan"], M["gold"])[k],
        size=0.5)

# ---- E. the comparison table, three rows at a time, under three little moving pictures ----
cE = SE + Vector((0, 0, 2.3))
for k, (x, kind) in enumerate(((-1.6, "s"), (1.6, "l"), (4.8, "g"))):
    c = cE + Vector((x, 0, 0))
    appear(box_edges("E Icon %d" % k, (1.6, 0.6, 1.0), c), sec(52.3 + 0.3 * k), dur=10)
    lo, hi = c - Vector((0.8, 0.3, 0.5)), c + Vector((0.8, 0.3, 0.5))
    if kind == "s":
        for i, m in enumerate(shake("E S", grid_pts(5, 3, 0.26, c), 52.0, 92.0, amp=0.02, r=0.1, seed=41)):
            appear(m, sec(52.6), s=(0.1,) * 3)
    elif kind == "l":
        gas("E L", 12, lo, Vector((hi[0], hi[1], lo[2] + 0.6)), 52.0, 92.0, speed=0.6, r=0.1, seed=42, f_in=sec(52.9))
    else:
        gas("E G", 4, lo, hi, 52.0, 92.0, speed=1.8, r=0.1, seed=43, f_in=sec(53.2))
holder = empty("E Table", SE + Vector((-6.6, -0.2, 1.3)), rot=(math.pi / 2, 0, 0))
ROWS = [["Mass", "definite", "definite", "definite"], ["Shape", "definite", "takes the container's", "takes the container's"],
        ["Volume", "definite", "definite", "indefinite"], ["Compressibility", "not possible", "almost none", "highly"],
        ["Fluidity", "cannot flow", "can flow", "can flow"], ["Rigidity", "highly rigid", "less rigid", "not rigid"],
        ["Diffusion", "slow", "fast", "very fast"], ["Space between", "most closely packed", "less closely", "least closely"],
        ["Forces", "strongest", "slightly weaker", "negligible"]]
COLS = [(3.4, 'LEFT'), (3.2, 'CENTER'), (3.2, 'CENTER'), (3.2, 'CENTER')]
for g, (r0, r1, t0) in enumerate(((0, 3, 52.6), (3, 6, 64.6), (6, 9, 76.6))):
    rows = table("E Rows %d" % g, holder, 0, 0, COLS, ROWS[r0:r1], 0.46, 1.15, f_in=sec(t0), stagger=sec(1.6) - 1,
                 head_mat=M["white"], line=False)
    for re in rows:
        kf(re, "scale", sec(t0 + 11.2), (1, 1, 1))
        kf(re, "scale", sec(t0 + 11.4), (0, 0, 0), 'CONSTANT')
finish_film()
