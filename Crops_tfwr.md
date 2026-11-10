# The Farmer Was Replaced — crop checklist

Checklist of the plantable and special entities to account for in the visualizer. The game calls these entities; visual stages such as growing, ready to harvest, or dead should be treated as states of an entity where applicable.

## Plantable crops and plants

- [ ] Grass (`Grass`) — grows automatically on grassland; harvest yields hay.
- [ ] Bush (`Bush`) — grows on grassland or soil; harvest yields wood.
- [ ] Tree (`Tree`) — grows on grassland or soil; harvest yields wood.
- [ ] Carrot (`Carrot`) — grows on soil; harvest yields carrots.
- [ ] Pumpkin (`Pumpkin`) — grows on soil; adjacent mature pumpkins can fuse into a mega-pumpkin.
- [ ] Dead pumpkin (`Dead_Pumpkin`) — failed pumpkin growth state; blocks pumpkin fusion until cleared.
- [ ] Sunflower (`Sunflower`) — grows on soil; harvest yields power; petal count affects bonus yield.
- [ ] Cactus (`Cactus`) — grows on soil; has ten size values and can chain-harvest adjacent cacti when sorted.

## Special farm entities

These are not ordinary plant-and-harvest crops, but can occupy or appear on farm tiles and may need visual assets if the renderer covers the full game state.

- [ ] Apple (`Apple`) — appears under the drone while using the dinosaur hat.
- [ ] Dinosaur (`Dinosaur`) — the tail segment entity created by the dinosaur-hat mechanic.
- [ ] Hedge (`Hedge`) — maze wall entity created from a bush using weird substance.
- [ ] Treasure (`Treasure`) — maze goal; harvesting it yields gold.

## Ground types (not crops)

- [ ] Grassland (`Grassland`) — default ground; grass grows automatically here.
- [ ] Soil (`Soil`) — ground produced by tilling; required for carrots, pumpkins, sunflowers, and cacti.

## Naming note for the visualizer

Use `grass` for the game entity `Grass` in crop metadata. Its current visual asset is `grain.svg`; that filename describes the artwork, while the metadata key matches the game entity.

## Sources

- [Official wiki: Entities](https://thefarmerwasreplaced.wiki.gg/wiki/Entities) — entity descriptions, including crops and special entities.
- [Official wiki: Grounds](https://thefarmerwasreplaced.wiki.gg/wiki/Grounds) — ground types.
- [The Farmer Was Replaced Lab: Crops & Economy](https://lucascerattors.github.io/the-farmer-was-replaced-lab/mechanics/crops/) — plantable entity list and crop mechanics.
