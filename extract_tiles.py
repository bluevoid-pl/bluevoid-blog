#!/usr/bin/env python3
"""
Extract block-like components from vector_tiles_items.svg into per-tile SVGs.
Grid is 8 rows x 18 columns.
"""
import xml.etree.ElementTree as ET
from pathlib import Path
from svg.path import parse_path

SRC = Path('/home/tyfon/Programming/Vue/bluevoid-blog/textures/voxel-pack-updated/Vector/vector_tiles_items.svg')
DST_DIR = Path('/home/tyfon/Programming/Vue/bluevoid-blog/public')
DST_DIR.mkdir(parents=True, exist_ok=True)

NS = {'svg': 'http://www.w3.org/2000/svg'}
NSMAP = {None: 'http://www.w3.org/2000/svg'}

tree = ET.parse(SRC)
root = tree.getroot()

# Collect paths
paths = []
for p in root.findall('.//svg:path', NS):
    # Keep original element
    d = p.get('d')
    if not d:
        continue
    # Compute bbox for assignment
    try:
        path_obj = parse_path(d)
        bbox = path_obj.boundingbox()
        cx = (bbox[0] + bbox[2]) / 2
        cy = (bbox[1] + bbox[3]) / 2
    except Exception:
        cx = cy = 0
    paths.append((p, cx, cy))

# Determine grid bounds from centers
centers = [(cx, cy) for _, cx, cy in paths]
xs = [c[0] for c in centers]
ys = [c[1] for c in centers]
min_x = min(xs)
max_x = max(xs)
min_y = min(ys)
max_y = max(ys)

ROWS = 8
COLS = 18
cell_w = (max_x - min_x) / COLS
cell_h = (max_y - min_y) / ROWS

# Assign paths to cells
grid = [[[] for _ in range(COLS)] for _ in range(ROWS)]
for elem, cx, cy in paths:
    col = int((cx - min_x) / cell_w)
    row = int((cy - min_y) / cell_h)
    if row >= ROWS:
        row = ROWS - 1
    if col >= COLS:
        col = COLS - 1
    if row < 0 or col < 0:
        continue
    grid[row][col].append(elem)

# Write per-tile SVGs
written = 0
for r in range(ROWS):
    for c in range(COLS):
        elems = grid[r][c]
        if not elems:
            continue
        # Compute bounding box for this cell
        min_x_cell = float('inf')
        min_y_cell = float('inf')
        max_x_cell = float('-inf')
        max_y_cell = float('-inf')
        for elem in elems:
            d = elem.get('d')
            try:
                pobj = parse_path(d)
                bbox = pobj.boundingbox()
                min_x_cell = min(min_x_cell, bbox[0])
                min_y_cell = min(min_y_cell, bbox[1])
                max_x_cell = max(max_x_cell, bbox[2])
                max_y_cell = max(max_y_cell, bbox[3])
            except Exception:
                pass
        if min_x_cell == float('inf'):
            continue
        # Add small padding
        pad = 2.0
        view_min_x = max(0, min_x_cell - pad)
        view_min_y = max(0, min_y_cell - pad)
        view_width = max_x_cell - min_x_cell + 2*pad
        view_height = max_y_cell - min_y_cell + 2*pad

        # Build SVG
        svg_elem = ET.Element('svg', xmlns='http://www.w3.org/2000/svg')
        svg_elem.set('viewBox', f'{view_min_x} {view_min_y} {view_width} {view_height}')
        # Optional width/height
        # Add a group
        g = ET.SubElement(svg_elem, 'g')
        for elem in elems:
            # Deep copy element
            # ElementTree doesn't have deepcopy easily, so we recreate
            path_copy = ET.Element('path')
            for k, v in elem.attrib.items():
                # Strip namespace from tag? Keep as is
                path_copy.set(k, v)
            # Preserve tag name
            # Actually elem.tag is '{http://...}path'
            # Create new element with same tag
            new_elem = ET.Element(elem.tag)
            for k, v in elem.attrib.items():
                new_elem.set(k, v)
            g.append(new_elem)

        # Write file
        out_path = DST_DIR / f'tile_{r+1}_{c+1}.svg'
        # Pretty print
        ET.indent(svg_elem, space='  ')
        with open(out_path, 'wb') as f:
            tree_out = ET.ElementTree(svg_elem)
            tree_out.write(f, encoding='utf-8', xml_declaration=True)
        written += 1

print(f'Wrote {written} tiles to {DST_DIR}')
