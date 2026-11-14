"""
TFWR API stubs for The Farmer Was Replaced base game
Tracks ticks and drone state, animations
"""

# Global state
import json
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

# Initialize board
_board = [[{'ground': Grounds.Grassland, 'entity': None, 'water_level': 0.0, 'fertiliser_level': 0.0, 'growth': 0.0} for _ in range(_board_size)] for _ in range(_board_size)]

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

def harvest():
    success = _board[_drone_pos_y][_drone_pos_x]['entity'] is not None
    _add_ticks(200, success)
    if success:
        _board[_drone_pos_y][_drone_pos_x]['entity'] = None
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
    _add_ticks(200, True)
    return True

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
    return None

def quick_print(*args):
    _add_ticks(0)
    return None

def random():
    _add_ticks(1)
    import random as r
    return r.random()

# Built-in wrappers with tick costs
def len(x):
    _add_ticks(1)
    return __builtins__['len'](x)

def range(start, stop=None, step=None):
    _add_ticks(1)
    if stop is None:
        return __builtins__['range'](start)
    if step is None:
        return __builtins__['range'](start, stop)
    return __builtins__['range'](start, stop, step)

def str(obj):
    _add_ticks(1)
    return __builtins__['str'](obj)

def abs(x):
    _add_ticks(1)
    return __builtins__['abs'](x)

def min(*args):
    _add_ticks(len(args))
    return __builtins__['min'](*args)

def max(*args):
    _add_ticks(len(args))
    return __builtins__['max'](*args)

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
    _board = [[{'ground': Grounds.Grassland, 'entity': None, 'water_level': 0.0, 'fertiliser_level': 0.0, 'growth': 0.0} for _ in range(_board_size)] for _ in range(_board_size)]
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
