"""
XOXLOFF FARM — Logo SVG Generator
"""

import math
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

FONT_DIR = "/mnt/skills/examples/canvas-design/canvas-fonts/"
OUTPUT   = "/home/user/salechik/xoxloff_farm_logo.svg"
W = H    = 1400
cx = cy  = 700

BG     = "#FAF5EB"
TERRA  = "#B5542E"
TERRA_D= "#943E21"
GOLD   = "#C79838"
GOLD_D = "#A87A28"
MOSS   = "#425A38"
DARK   = "#241B11"
CREAM  = "#F4E8D2"
RED    = "#C73226"

def pl(pts, ox, oy, s):
    return [(ox + x*s, oy + y*s) for x, y in pts]

def catmull_svg(points, closed=True):
    p = list(points)
    if closed: p = [p[-1]] + p + [p[0], p[1]]
    else:      p = [p[0]]  + p + [p[-1]]
    segs = []
    for i in range(len(p)-3):
        p0,p1,p2,p3 = p[i],p[i+1],p[i+2],p[i+3]
        cp1 = (p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6)
        cp2 = (p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6)
        segs.append((p1, cp1, cp2, p2))
    if not segs: return ""
    d = f"M{segs[0][0][0]:.2f},{segs[0][0][1]:.2f}"
    for _, cp1, cp2, end in segs:
        d += f" C{cp1[0]:.2f},{cp1[1]:.2f} {cp2[0]:.2f},{cp2[1]:.2f} {end[0]:.2f},{end[1]:.2f}"
    if closed: d += "Z"
    return d

def fea_svg(bx, by, tx, ty, w, ox, oy, s):
    dx,dy = tx-bx, ty-by
    L = math.hypot(dx,dy) or 1
    nx,ny = -dy/L, dx/L
    m1x,m1y = bx+dx*.4, by+dy*.4
    m2x,m2y = bx+dx*.72, by+dy*.72
    pts = [(bx,by), (m1x+nx*w,m1y+ny*w), (m2x+nx*w*.6,m2y+ny*w*.6),
           (tx,ty), (m2x-nx*w*.6,m2y-ny*w*.6), (m1x-nx*w,m1y-ny*w)]
    return catmull_svg(pl(pts, ox, oy, s))

def ep(d, f):  return f'<path d="{d}" fill="{f}"/>'
def ec(x,y,r,f,s="none",sw=1):
    st = f' stroke="{s}" stroke-width="{sw}"' if s != "none" else ""
    return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" fill="{f}"{st}/>'
def el(x1,y1,x2,y2,c,sw,cap="round"):
    return (f'<line x1="{x1:.2f}" y1="{y1:.2f}" '
            f'x2="{x2:.2f}" y2="{y2:.2f}" '
            f'stroke="{c}" stroke-width="{sw:.2f}" stroke-linecap="{cap}"/>')

def glyph_svg(tt, gname, tx_, ty_, rot_deg, scale, adv):
    r    = math.radians(rot_deg)
    c_   = math.cos(r);  s_ = math.sin(r)
    xoff = -adv / 2.0
    xx = scale*c_;  yx = scale*s_;  dx = tx_ + scale*c_*xoff
    xy = scale*s_;  yy = -scale*c_; dy = ty_ + scale*s_*xoff
    t = Transform(xx, xy, yx, yy, dx, dy)
    svg_pen = SVGPathPen(tt.getGlyphSet())
    try:
        tt.getGlyphSet()[gname].draw(TransformPen(svg_pen, t))
    except:
        return ""
    return svg_pen.getCommands()

def load_font(font_file):
    tt    = TTFont(FONT_DIR + font_file)
    cmap  = tt.getBestCmap()
    hmtx  = tt['hmtx'].metrics
    units = tt['head'].unitsPerEm
    return tt, cmap, hmtx, units

def arc_text(text, font_file, font_size,
             arc_cx, arc_cy, arc_r,
             start_deg, end_deg, color, tracking=0):
    tt, cmap, hmtx, units = load_font(font_file)
    scale = font_size / units
    total_px = (sum(hmtx.get(cmap.get(ord(c)),(units//2,0))[0]
                    for c in text) * scale
                + tracking * (len(text)-1))
    mid_rad  = math.radians((start_deg+end_deg)/2)
    cur_ang  = mid_rad - (total_px/arc_r)/2
    out = []
    for ch in text:
        gname  = cmap.get(ord(ch))
        adv    = hmtx.get(gname,(units//2,0))[0] if gname else units//3
        adv_px = adv*scale + tracking
        angle  = cur_ang + adv_px/(2*arc_r)
        tx_ = arc_cx + arc_r*math.cos(angle)
        ty_ = arc_cy + arc_r*math.sin(angle)
        rot = math.degrees(angle)+90
        if gname:
            d = glyph_svg(tt, gname, tx_, ty_, rot, scale, adv)
            if d: out.append(f'<path d="{d}" fill="{color}"/>')
        cur_ang += adv_px/arc_r
    return "".join(out)

def circle_text(text, font_file, font_size,
                arc_cx, arc_cy, arc_r, start_deg, color):
    tt, cmap, hmtx, units = load_font(font_file)
    scale    = font_size / units
    total_px = sum(hmtx.get(cmap.get(ord(c)),(units//2,0))[0]
                   for c in text) * scale
    stretch  = (2*math.pi*arc_r) / total_px
    cur_ang  = math.radians(start_deg)
    out = []
    for ch in text:
        gname  = cmap.get(ord(ch))
        adv    = hmtx.get(gname,(units//2,0))[0] if gname else units//3
        adv_px = adv*scale*stretch
        angle  = cur_ang + adv_px/(2*arc_r)
        tx_ = arc_cx + arc_r*math.cos(angle)
        ty_ = arc_cy + arc_r*math.sin(angle)
        rot = math.degrees(angle)+90
        if gname:
            d = glyph_svg(tt, gname, tx_, ty_, rot, scale, adv)
            if d: out.append(f'<path d="{d}" fill="{color}"/>')
        cur_ang += adv_px/arc_r
    return "".join(out)

def build():
    els = []
    ox, oy = cx-14, cy+80
    S = 1.75

    R_out, R_in = 520, 492
    for i in range(96):
        a0 = math.radians(i*3.75); a1 = math.radians(i*3.75+2.3)
        pts = [(cx+R_out*math.cos(a0), cy+R_out*math.sin(a0)),
               (cx+R_in *math.cos(a0), cy+R_in *math.sin(a0)),
               (cx+R_in *math.cos(a1), cy+R_in *math.sin(a1)),
               (cx+R_out*math.cos(a1), cy+R_out*math.sin(a1))]
        ps = " ".join(f"{x:.2f},{y:.2f}" for x,y in pts)
        els.append(f'<polygon points="{ps}" fill="{MOSS}" id="tick-{i}"/>')

    els.append(ec(cx, cy, R_in, CREAM))
    for r in [478, 420, 414]:
        els.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{MOSS}" stroke-width="1"/>')
    for i in range(48):
        a = math.radians(i*7.5); r = 418
        els.append(ec(cx+r*math.cos(a), cy+r*math.sin(a), 3, GOLD))

    tail_parts = []
    for bx,by,tx,ty,w,col in [
        (-48,10,-158,-34,19,MOSS), (-50,-8,-160,-96,20,TERRA_D),
        (-46,-28,-136,-156,19,MOSS), (-38,-46,-96,-188,16,TERRA_D)]:
        tail_parts.append(ep(fea_svg(bx,by,tx,ty,w,ox,oy,S), col))
    tail_parts.append(ep(fea_svg(-40,-44,-120,-198,7,ox,oy,S), GOLD))
    els.append(f'<g id="tail">{"".join(tail_parts)}</g>')

    body_parts = []
    for pts_loc, col in [
        ([(54,-56),(88,-12),(80,48),(42,84),(-20,78),(-68,42),(-64,-24),(-12,-56)], TERRA),
        ([(28,-30),(2,-26),(-30,-8),(-40,28),(-14,40),(20,24),(34,-4)],             TERRA_D),
        ([(30,-50),(42,-92),(58,-122),(72,-118),(64,-86),(50,-48),(36,-38)],         TERRA),
        ([(54,-128),(72,-140),(88,-132),(90,-114),(76,-104),(58,-108),(50,-118)],    TERRA),
    ]:
        body_parts.append(ep(catmull_svg(pl(pts_loc, ox, oy, S)), col))
    for tx2,ty2 in [(-34,18),(-30,30),(-18,38)]:
        body_parts.append(el(ox+tx2*S, oy+ty2*S, ox+(tx2+12)*S, oy+(ty2-6)*S, TERRA, 3*S))
    els.append(f'<g id="body">{"".join(body_parts)}</g>')

    crest_parts = []
    for bx,by,tx,ty,w,col in [
        (70,-138,62,-202,9,RED), (74,-136,98,-196,8,TERRA),
        (66,-136,30,-196,7,RED), (76,-134,118,-186,6,TERRA_D),
        (64,-134,8,-186,5,TERRA_D)]:
        crest_parts.append(ep(fea_svg(bx,by,tx,ty,w,ox,oy,S), col))
    crest_parts.append(ep(catmull_svg(pl([(76,-108),(88,-102),(90,-86),(80,-82),(72,-94)], ox,oy,S)), RED))
    crest_parts.append(ep(catmull_svg(pl([(88,-126),(116,-119),(120,-112),(88,-110)], ox,oy,S)), GOLD))
    crest_parts.append(el(ox+90*S, oy-117*S, ox+116*S, oy-115*S, GOLD_D, 2*S, "butt"))
    ex, ey, er = ox+74*S, oy-124*S, 8.5*S
    crest_parts.append(ec(ex, ey, er, CREAM))
    crest_parts.append(ec(ex, ey, er*0.55, DARK))
    els.append(f'<g id="head">{"".join(crest_parts)}</g>')

    leg_parts = []
    for xt in [6, 28]:
        leg_parts.append(ep(catmull_svg(pl(
            [(xt,72),(xt+3,112),(xt+1,140),(xt-7,140),(xt-5,112),(xt-6,72)], ox,oy,S)), GOLD))
        for toe in (-15, 0, 15):
            leg_parts.append(el(ox+(xt-2)*S, oy+140*S, ox+(xt-2+toe)*S, oy+156*S, GOLD, 5*S))
        leg_parts.append(el(ox+(xt-2)*S, oy+140*S, ox+(xt-13)*S, oy+145*S, GOLD, 4*S))
    els.append(f'<g id="legs">{"".join(leg_parts)}</g>')

    wheat_parts = []
    gy_w = cy + 322
    for xx, ang, sz in [(cx-238,-20,.88),(cx-196,-12,.93),(cx-156,-5,.86),
                         (cx+150,5,.86),(cx+192,12,.93),(cx+234,20,.88)]:
        a = math.radians(ang); L = 105*sz
        wheat_parts.append(el(xx, gy_w, xx+L*math.sin(a), gy_w-L*math.cos(a), GOLD, 3*sz))
        for k in range(3, 9):
            t = k/9; px2, py2 = xx+L*t*math.sin(a), gy_w-L*t*math.cos(a)
            for side in (-1, 1):
                la = a+side*math.radians(36); gl = 15*sz*(1-t*.25)
                wheat_parts.append(el(px2, py2, px2+gl*math.sin(la), py2-gl*math.cos(la), GOLD, 2.4*sz))
    els.append(f'<g id="wheat">{"".join(wheat_parts)}</g>')

    print("Generating XOXLOFF FARM text...")
    text_top = arc_text("XOXLOFF FARM", "Lora-Regular.ttf", 72,
                         cx, cy, 378, -150, -30, GOLD, tracking=8)
    els.append(f'<g id="text-top">{text_top}</g>')

    print("Generating slogan...")
    slogan = "ЗДОРОВАЯ  ·  ЖИВАЯ  ·  ДОМАШНЯЯ  ПТИЦА  ·  " * 2
    text_ring = circle_text(slogan, "Lora-Regular.ttf", 66,
                            cx, cy, 453, -90, MOSS)
    els.append(f'<g id="text-ring">{text_ring}</g>')

    svg = (f'<?xml version="1.0" encoding="UTF-8"?>'
           f'<svg xmlns="http://www.w3.org/2000/svg" '
           f'viewBox="-40 -40 {W+80} {H+80}" '
           f'width="{W+80}" height="{H+80}">'
           + "".join(els) + "</svg>")

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"Saved: {OUTPUT}  ({len(svg)//1024}KB)")

if __name__ == "__main__":
    build()
