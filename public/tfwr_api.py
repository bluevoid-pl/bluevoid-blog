"""
TFWR API stubs for The Farmer Was Replaced base game
Tracks ticks and drone state, animations
"""

# Global state
import json
import builtins
_ticks = 0
_animations = []
_animation_count = 0
_drone_pos_x = 0
_drone_pos_y = 0
_world_size = 32
_board_size = 32
_board = None
_water_level = 0.5
_inventory = {}
_unlocked = {}
_power_level = 0

def _add_ticks(cost, success=True):
    global _ticks
    if success:
        _ticks += cost
    else:
        _ticks += 1

def _add_animation(name):
    global _animation_count
    _animations.append(name)
    _animation_count += 1

# Direction singletons
class _Dir:
    pass
class North: pass
class East: pass
class South: pass
class West: pass

# Constants
class Entities:
    Grass = 'Grass'
    Bush = 'Bush'
    Tree = 'Tree'
    Carrots = 'Carrots'
    Carrot = 'Carrots'  # alias for compatibility with examples
    Pumpkin = 'Pumpkin'
    Sunflower = 'Sunflower'
    Cactus = 'Cactus'
    Hedge = 'Hedge'
    Treasure = 'Treasure'
    Dinosaur = 'Dinosaur'
    Dead_Pumpkin = 'Dead_Pumpkin'
    Apple = 'Apple'

class Items:
    Hay = 'Hay'
    Wood = 'Wood'
    Carrot = 'Carrot'
    Pumpkin = 'Pumpkin'
    Power = 'Power'
    Cactus = 'Cactus'
    Bone = 'Bone'
    Gold = 'Gold'
    Water = 'Water'
    Fertilizer = 'Fertilizer'
    Weird_Substance = 'Weird_Substance'
    Piggy = 'Piggy'
    Cactus_Seed = 'Cactus_Seed'

class Grounds:
    Grassland = 'Grassland'
    Soil = 'Soil'

class Unlocks:
    Trees = 'Trees'
    Speed = 'Speed'
    Plant = 'Plant'
    Loops = 'Loops'
    Senses = 'Senses'
    Expand = 'Expand'
    Operators = 'Operators'
    Pumpkins = 'Pumpkins'
    Variables = 'Variables'
    Functions = 'Functions'
    Watering = 'Watering'
    Carrots = 'Carrots'
    Lists = 'Lists'
    Costs = 'Costs'
    Fertilizer = 'Fertilizer'
    Mazes = 'Mazes'
    Debug = 'Debug'
    Debug_2 = 'Debug_2'
    Benchmark = 'Benchmark'
    Grass = 'Grass'
    Multi_Trade = 'Multi_Trade'
    Auto_Unlock = 'Auto_Unlock'
    Polyculture = 'Polyculture'
    Sunflowers = 'Sunflowers'
    Leaderboard = 'Leaderboard'
    Dictionaries = 'Dictionaries'
    Utilities = 'Utilities'
    Cactus = 'Cactus'
    Dinosaurs = 'Dinosaurs'

# Direction instances
North = North()
East = East()
South = South()
West = West()

# A pristine, untiled board. Uses builtins.range so board creation never
# charges the tick wrappers defined below.
def _fresh_board():
    return [[{'ground': Grounds.Grassland, 'entity': None, 'water_level': 0.0,
              'fertiliser_level': 0.0, 'growth': 0.0} for _ in builtins.range(_board_size)]
            for _ in builtins.range(_board_size)]

# Initialize board
_board = _fresh_board()

# API Functions

def move(direction):
    global _drone_pos_x, _drone_pos_y
    success = True
    new_x = _drone_pos_x
    new_y = _drone_pos_y
    if direction == North:
        new_y += 1
    elif direction == South:
        new_y -= 1
    elif direction == East:
        new_x += 1
    elif direction == West:
        new_x -= 1
    else:
        success = False
    if success:
        # World wraps
        _drone_pos_x = new_x % _board_size
        _drone_pos_y = new_y % _board_size
    _add_ticks(200, success)
    return success

def can_move(direction):
    _add_ticks(1)
    return True

def get_pos_x():
    _add_ticks(1)
    return _drone_pos_x

def get_pos_y():
    _add_ticks(1)
    return _drone_pos_y

def get_world_size():
    _add_ticks(1)
    return _world_size

def get_entity_type():
    _add_ticks(1)
    return _board[_drone_pos_y][_drone_pos_x]['entity']

def get_ground_type():
    _add_ticks(1)
    return _board[_drone_pos_y][_drone_pos_x]['ground']

def get_water():
    _add_ticks(1)
    return _water_level

def measure(direction=None):
    _add_ticks(1)
    return None

# What each entity yields when harvested, added to the simulation inventory
_HARVEST_ITEMS = {
    Entities.Grass: Items.Hay,
    Entities.Carrots: Items.Carrot,
    Entities.Pumpkin: Items.Pumpkin,
    Entities.Cactus: Items.Cactus,
}

def harvest():
    cell = _board[_drone_pos_y][_drone_pos_x]
    success = cell['entity'] is not None
    _add_ticks(200, success)
    if success:
        item = _HARVEST_ITEMS.get(cell['entity'])
        if item:
            _inventory[item] = _inventory.get(item, 0) + 1
        cell['entity'] = None
    return success

def can_harvest():
    _add_ticks(1)
    return _board[_drone_pos_y][_drone_pos_x]['entity'] is not None

def plant(entity):
    success = True
    _add_ticks(200, success)
    _board[_drone_pos_y][_drone_pos_x]['entity'] = entity
    return success

def till():
    _add_ticks(200)
    cell = _board[_drone_pos_y][_drone_pos_x]
    if cell['ground'] == Grounds.Grassland:
        cell['ground'] = Grounds.Soil
    else:
        cell['ground'] = Grounds.Grassland
    return None

def swap(direction):
    _add_ticks(200, True)
    return True

def use_item(item, n=1):
    have = _inventory.get(item, 0)
    success = have >= n and n > 0
    _add_ticks(200, success)
    if success:
        _inventory[item] = have - n
    return success

def get_companion():
    _add_ticks(1)
    return None

def num_items(item):
    _add_ticks(1)
    return _inventory.get(item, 0)

def get_cost(thing):
    _add_ticks(1)
    return {}

def unlock(unlock):
    _add_ticks(200, True)
    return True

def num_unlocked(thing):
    _add_ticks(1)
    return 1

def leaderboard_run(leaderboard, file_name, speedup):
    _add_ticks(200)
    return None

def simulate(filename, sim_unlocks, sim_items, sim_globals, seed, speedup):
    _add_ticks(200)
    return 0.0

def get_time():
    _add_ticks(0)
    return 0.0

def get_tick_count():
    _add_ticks(0)
    return _ticks

def print(*args):
    _add_animation('print')
    return builtins.print(*args)

def quick_print(*args):
    _add_ticks(0)
    return builtins.print(*args)

def random():
    _add_ticks(1)
    import random as r
    return r.random()

# Built-in wrappers with tick costs. These names shadow the real builtins, so
# they delegate through the `builtins` module rather than the `__builtins__`
# global, which CPython exposes as a dict but Pyodide exposes as a module.
def len(x):
    _add_ticks(1)
    return builtins.len(x)

def range(start, stop=None, step=None):
    _add_ticks(1)
    if stop is None:
        return builtins.range(start)
    if step is None:
        return builtins.range(start, stop)
    return builtins.range(start, stop, step)

def str(obj):
    _add_ticks(1)
    return builtins.str(obj)

def abs(x):
    _add_ticks(1)
    return builtins.abs(x)

def min(*args):
    _add_ticks(builtins.len(args))
    return builtins.min(*args)

def max(*args):
    _add_ticks(builtins.len(args))
    return builtins.max(*args)

def set_execution_speed(speed):
    _add_ticks(200)
    return None

def set_world_size(size):
    _add_ticks(200)
    global _world_size
    _world_size = size
    return None

def clear():
    _add_ticks(200)
    global _drone_pos_x, _drone_pos_y, _board
    _drone_pos_x = 0
    _drone_pos_y = 0
    _board = _fresh_board()
    return None

def change_hat(hat):
    _add_ticks(200)
    return None

def do_a_flip():
    _add_animation('flip')
    return None

def pet_the_piggy():
    _add_animation('pet')
    return None

def get_animation_count():
    return _animation_count

def get_animation_log():
    return _animations

def get_board_snapshot():
    _add_ticks(0)
    # Return serializable snapshot
    return [[{'ground': cell['ground'], 'entity': cell['entity'], 'water_level': cell['water_level'], 'fertiliser_level': cell['fertiliser_level'], 'growth': cell['growth']} for cell in row] for row in _board]

def get_board_json():
    _add_ticks(0)
    return json.dumps([ [ {'ground': cell['ground'], 'entity': cell['entity'], 'water_level': cell['water_level'], 'fertiliser_level': cell['fertiliser_level'], 'growth': cell['growth']} for cell in row ] for row in _board ])

def get_board_size():
    _add_ticks(0)
    return _board_size

def get_drone_position():
    _add_ticks(0)
    return (_drone_pos_x, _drone_pos_y)

def get_inventory_json():
    _add_ticks(0)
    return json.dumps(_inventory)

# Host-only helpers (not part of the game API). Prefill items are the player's
# starting inventory and are not charged in ticks.

_prefill_items = {}

def __set_prefill_items__(items):
    """Prefill the simulation inventory from a {item: amount} dict.
    Item names are matched case-insensitively against Items. Raises
    ValueError for unknown items or bad amounts. Free of tick cost.
    Returns the resolved {canonical_item: amount} mapping."""
    global _prefill_items, _inventory
    valid = {k.lower(): v for k, v in Items.__dict__.items() if not k.startswith('_')}
    resolved = {}
    for key, amount in items.items():
        canonical = valid.get(builtins.str(key).lower())
        if canonical is None:
            raise ValueError('Unknown item "%s" in prefill comment' % key)
        if isinstance(amount, bool) or not isinstance(amount, int) or amount < 0:
            raise ValueError('Bad amount for item "%s": %r' % (key, amount))
        resolved[canonical] = resolved.get(canonical, 0) + amount
    _prefill_items = resolved
    _inventory = dict(resolved)
    return dict(resolved)

def __reset__():
    """Reset all simulation state to a fresh run, keeping prefill items."""
    global _ticks, _animations, _animation_count, _drone_pos_x, _drone_pos_y
    global _board, _water_level, _inventory, _unlocked, _power_level
    _ticks = 0
    _animations = []
    _animation_count = 0
    _drone_pos_x = 0
    _drone_pos_y = 0
    _board = _fresh_board()
    _water_level = 0.5
    _inventory = dict(_prefill_items)
    _unlocked = {}
    _power_level = 0
    return None
