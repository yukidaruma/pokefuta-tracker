import data from "@/data/data.json";

export const DATA_VERSION = data.list.length; // TODO: Add a version-like field in data.json
export const REPO_URL = "https://github.com/yukidaruma/pokefuta-tracker";

export const SPRITE_SHEET_PATH = `/images/pokefuta/sprite.png?v=${DATA_VERSION}`;
export const SPRITE_SHEET_WIDTH = 4032;
export const SPRITE_SIZE = 96;
export const SPRITES_PER_ROW = SPRITE_SHEET_WIDTH / SPRITE_SIZE;
