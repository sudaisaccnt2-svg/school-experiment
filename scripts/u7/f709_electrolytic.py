# ---- Film 709: Electrolytic cell (textbook pp.193-195: 7.5.2 electrolytic cell = non-spontaneous reaction driven by  (v4 captions)
# current (Downs cell, Nelson cell); (i) electrolysis = breaking down a molten or dissolved electrolyte by current;
# (ii) construction, Fig 7.4: anode on battery +, cathode on battery −; (iii) working: anions give electrons at the
# anode (oxidation), cations take them at the cathode (reduction); battery = electron pump; molten NaCl:
# 2Cl⁻ → Cl₂ + 2e⁻, 2Na⁺ + 2e⁻ → 2Na, overall 2Na⁺ + 2Cl⁻ → 2Na + Cl₂) ----
start_film("709", "709 Electrolytic Cell", 66.5)
END = scene.frame_end
S0 = Vector((0, 0, 0))

shot("Cam Wide", 0, 14, S0 + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
shot("Cam Parts", 14, 26, S0 + Vector((0, 0, -1.1)), dist=13, pitch=0.12)
shot("Cam Anode", 26, 37, S0 + Vector((-0.9, 0, -1.0)), dist=13, pitch=0.08)
shot("Cam Cathode", 37, 48, S0 + Vector((0.9, 0, -1.0)), dist=13, pitch=0.08)
shot("Cam Pump", 48, None, S0 + Vector((0, 0, -1.1)), dist=14, pitch=0.1)
for name, t in (("Electrolysis", 0), ("Construction", 14), ("At the anode", 26), ("At the cathode", 37),
                ("Electron pump", 48)):
    act(name, sec(t))

say('A1', 'Current forces a reaction', 0.1, 7)
say('A2', 'Splitting with current: electrolysis', 7, 14)
say('B1', 'Two electrodes in molten salt', 14, 20)
say('B2', 'Cl⁻ to anode, Na⁺ to cathode', 20, 26)
say('C1', 'Anode: Cl⁻ give electrons', 26, 31)
say('C2', 'Chlorine gas bubbles off', 31, 37)
say('D1', 'Cathode: Na⁺ take electrons', 37, 42)
say('D2', 'Liquid sodium forms', 42, 48)
say('E1', 'The battery pumps electrons', 48, 57)
say('E2', 'Lost = gained', 57, 66)

c0 = S0 + Vector((0, 0, -2.6))
cc = cell("A", c0, 0.4, w=4.4, h=2.4, liq=MELT, gap=1.5)
big("Lbl A", "molten NaCl", c0 + Vector((0, -1.0, 2.9)), 2.0, 14.0, mat=M["white"], size=0.42)
big("Lbl B A", "anode +", c0 + Vector((-0.8, -1.0, 2.9)), 15.0, None, mat=M["red"], size=0.42)
big("Lbl B C", "cathode −", c0 + Vector((0.8, -1.0, 2.9)), 15.6, None, mat=M["cyan"], size=0.42)

# ions wander, then walk to their electrodes (20–24)
an_end = [c0 + Vector((-1.12, -0.25, 0.5 + 0.55 * k)) for k in range(3)]
ca_end = [c0 + Vector((1.12, -0.25, 0.6 + 0.55 * k)) for k in range(3)]
for k in range(3):
    a0p = c0 + Vector((0.5 - 0.4 * k, -0.25, 0.7 + 0.5 * k))
    an = ion("A Cl %d" % k, ANI, a0p, 3.0 + 0.2 * k, r=0.2)
    move(an, sec(20.5 + 0.5 * k), sec(23.5 + 0.5 * k), a0p, an_end[k])
    hide_from(an, sec(28.0 + 0.8 * k), (0.2,) * 3)
    c0p = c0 + Vector((-0.4 + 0.4 * k, -0.25, 0.5 + 0.55 * k))
    ca = ion("A Na %d" % k, CAT, c0p, 3.1 + 0.2 * k, r=0.2)
    move(ca, sec(20.7 + 0.5 * k), sec(23.7 + 0.5 * k), c0p, ca_end[k])
    hide_from(ca, sec(39.0 + 0.8 * k), (0.2,) * 3)
    bead = sphere("A Na Bead %d" % k, 0.17, SODIUM, ca_end[k] + Vector((0.02, 0, 0)), None, 16, 8)
    appear(bead, sec(39.0 + 0.8 * k), s=(0.17,) * 3)
# electrons leave Cl⁻ into the anode; come out of the cathode into Na⁺
for k in range(3):
    travel("A eA %d" % k, an_end[k] + Vector((0.05, -0.2, 0)), an_end[k] + Vector((-0.38, -0.2, 0.2)), 27.5 + 0.8 * k,
           dur=0.9, r=0.1, mat=E_BLUE, lift=0.3)
    travel("A eC %d" % k, ca_end[k] + Vector((0.38, -0.2, 0.2)), ca_end[k] + Vector((0.05, -0.2, 0)), 38.0 + 0.8 * k,
           dur=0.9, r=0.1, mat=E_BLUE, lift=0.3)
bubbles("A Cl2", c0.x - 1.3, c0.x - 1.0, c0.z + 0.6, c0.z + 1.9, -0.25, 30.5, END / FPS, n=6, r=0.11, mat=CL_GAS)
big("Lbl C", "Cl₂", c0 + Vector((-2.6, -1.0, 2.2)), 32.0, None, mat=M["green"] if "green" in M else M["white"], size=0.5)
big("Lbl D", "Na", c0 + Vector((2.6, -1.0, 1.4)), 42.5, None, mat=M["white"], size=0.5)
# the pump: electrons round the outside wire
flow("A e L", cc["up_l"], 28.0, END / FPS, n=4, speed=1.0)
flow("A e R", cc["up_r"][::-1], 38.0, END / FPS, n=4, speed=1.0)
finish_film()
