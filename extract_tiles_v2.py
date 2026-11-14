#!/usr/bin/env python3
"""
Extract tiles with normalized coordinates and no margin.
Uses tile 5_16 as reference for tile size.
"""
import xml.etree.ElementTree as ET
from pathlib import Path
from svg.path import parse_path

SRC = Path('/home/tyfon/Programming/Vue/bluevoid-blog/textures/voxel-pack-updated/Vector/vector_tiles_items.svg')
DST_DIR = Path('/home/tyfon/Programming/Vue/bluevoid-blog/public')
DST_DIR.mkdir(parents=True, exist_ok=True)

NS = {'svg': 'http://www.w3.org/2000/svg'}

tree = ET.parse(SRC)
root = tree.getroot()

# Collect paths with bbox and center
paths_data = []
for p in root.findall('.//svg:path', NS):
    d = p.get('d')
    if not d:
        continue
    try:
        path_obj = parse_path(d)
        bbox = path_obj.boundingbox()
        cx = (bbox[0] + bbox[2]) / 2
        cy = (bbox[1] + bbox[3]) / 2
    except Exception:
        cx = cy = 0
    paths_data.append((p, cx, cy, bbox))

# Determine grid bounds
xs = [p[1] for p in paths_data]
ys = [p[2] for p in paths_data]
min_cx = min(xs)
max_cx = max(xs)
min_cy = min(ys)
max_cy = max(ys)

ROWS = 8
COLS = 18
cell_w = (max_cx - min_cx) / COLS
cell_h = (max_cy - min_cy) / ROWS

# Assign paths to grid
grid = [[[] for _ in range(COLS)] for _ in range(ROWS)]
for elem, cx, cy, bbox in paths_data:
    col = int((cx - min_cx) / cell_w)
    row = int((cy - min_cy) / cell_h)
    if row >= ROWS:
        row = ROWS - 1
    if col >= COLS:
        col = COLS - 1
    if row < 0 or col < 0:
        continue
    grid[row][col].append(elem)

# Determine tile size from tile 5_16 (row 5, col 16, 1-based)
ref_r = 4  # 0-based
ref_c = 15
ref_elems = grid[ref_r][ref_c]
if not ref_elems:
    raise RuntimeError('Reference tile 5_16 is empty')
min_x_ref = float('inf')
min_y_ref = float('inf')
max_x_ref = float('-inf')
max_y_ref = float('-inf')
for elem in ref_elems:
    d = elem.get('d')
    pobj = parse_path(d)
    b = pobj.boundingbox()
    min_x_ref = min(min_x_ref, b[0])
    min_y_ref = min(min_y_ref, b[1])
    max_x_ref = max(max_x_ref, b[2])
    max_y_ref = max(max_y_ref, b[3])
tile_w = max_x_ref - min_x_ref
tile_h = max_y_ref - min_y_ref
print(f'Reference tile 5_16 size: {tile_w} x {tile_h}')

# Write tiles
written = 0
for r in range(ROWS):
    for c in range(COLS):
        elems = grid[r][c]
        if not elems:
            continue
        # Compute min/max for this tile to get transform
        min_x = float('inf')
        min_y = float('inf')
        for elem in elems:
            d = elem.get('d')
            pobj = parse_path(d)
            b = pobj.boundingbox()
            min_x = min(min_x, b[0])
            min_y = min(min_y, b[1])
        # Build SVG
        svg_elem = ET.Element('svg', xmlns='http://www.w3.org/2000/svg')
        svg_elem.set('viewBox', f'0 0 {tile_w} {tile_h}')
        # Optional width/height
        g = ET.SubElement(svg_elem, 'g')
        g.set('transform', f'translate(-{min_x} -{min_y})')
        for elem in elems:
            new_elem = ET.Element(elem.tag)
            for k, v in elem.attrib.items():
                new_elem.set(k, v)
            g.append(new_elem)
        out_path = DST_DIR / f'tile_{r+1}_{c+1}.svg'
        ET.indent(svg_elem, space='  ')
        with open(out_path, 'wb') as f:
            tree_out = ET.ElementTree(svg_elem)
            tree_out.write(f, encoding='utf-8', xml_declaration=True)
        written += 1

print(f'Wrote {written} tiles with normalized size {tile_w}x{tile_h} to {DST_DIR}')
