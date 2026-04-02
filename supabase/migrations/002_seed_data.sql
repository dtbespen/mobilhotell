-- Wizard World MVP: Seed data
-- Run after 001_wizard_world.sql

-- Class abilities (2 per class)
INSERT INTO class_abilities (slug, name, description, character_class, unlock_level, effect_type, effect_value, cooldown_hours) VALUES
  ('arcane_blast',    'Arcane Blast',    '+50% damage på neste boss-bidrag',          'wizard', 5,  'damage_boost',  1.5,  24),
  ('mana_surge',     'Mana Surge',      '2x mana på neste quest',                   'wizard', 12, 'mana_boost',    2.0,  24),
  ('shield_wall',    'Shield Wall',     'Beskytter streaken din 1 gang',             'knight', 5,  'streak_shield', 1.0,  168),
  ('power_strike',   'Power Strike',    '300 bonus damage til boss (koster 100 mana)', 'knight', 12, 'damage_flat',  300,  24),
  ('natures_gift',   'Nature''s Gift',  'Guild får +1.5x mana i 1 time',            'druid',  5,  'guild_boost',   1.5,  24),
  ('regrowth',       'Regrowth',        'Gjenopprett tapt streak',                   'druid',  12, 'streak_restore',1.0,  168),
  ('lucky_strike',   'Lucky Strike',    '30% sjanse for 3x damage',                 'rogue',  5,  'crit_chance',   3.0,  24),
  ('treasure_hunter','Treasure Hunter', '+50% sjanse for sjeldnere loot',            'rogue',  12, 'loot_bonus',    1.5,  168);

-- Body colors (available to all, level 1)
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, pixel_asset) VALUES
  ('body_blue',   'body_color', 'Blå',   1, 'common', 'body_blue'),
  ('body_green',  'body_color', 'Grønn', 1, 'common', 'body_green'),
  ('body_purple', 'body_color', 'Lilla', 1, 'common', 'body_purple'),
  ('body_red',    'body_color', 'Rød',   1, 'common', 'body_red'),
  ('body_yellow', 'body_color', 'Gul',   1, 'common', 'body_yellow'),
  ('body_pink',   'body_color', 'Rosa',  1, 'common', 'body_pink');

-- Familiars (shared across classes)
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, pixel_asset) VALUES
  ('cat',         'familiar', 'Katt',        3,  'uncommon', 'familiar_cat'),
  ('owl',         'familiar', 'Ugle',        10, 'rare',     'familiar_owl'),
  ('baby_dragon', 'familiar', 'Babydrage',   20, 'epic',     'familiar_dragon'),
  ('phoenix',     'familiar', 'Føniks',      35, 'legendary','familiar_phoenix');

-- Wizard items
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, pixel_asset) VALUES
  ('pointy_hat',      'hat',  'Spiss hatt',       1,  'common',   'wizard', 'wizard_hat_1'),
  ('star_hat',        'hat',  'Stjernehatt',       5,  'uncommon', 'wizard', 'wizard_hat_2'),
  ('archmage_hat',    'hat',  'Erkehatt',          10, 'rare',     'wizard', 'wizard_hat_3'),
  ('cosmic_crown',    'hat',  'Kosmisk krone',     20, 'epic',     'wizard', 'wizard_hat_4'),
  ('apprentice_robe', 'robe', 'Lærlingkappe',      1,  'common',   'wizard', 'wizard_robe_1'),
  ('mystic_robe',     'robe', 'Mystisk kappe',     8,  'uncommon', 'wizard', 'wizard_robe_2'),
  ('shadow_robe',     'robe', 'Skyggekappe',       15, 'rare',     'wizard', 'wizard_robe_3'),
  ('golden_robe',     'robe', 'Gullkappe',         25, 'epic',     'wizard', 'wizard_robe_4'),
  ('wooden_staff',    'staff','Trestav',            1,  'common',   'wizard', 'wizard_staff_1'),
  ('crystal_staff',   'staff','Krystallstav',       6,  'uncommon', 'wizard', 'wizard_staff_2'),
  ('fire_staff',      'staff','Ildstav',            12, 'rare',     'wizard', 'wizard_staff_3'),
  ('lightning_staff', 'staff','Lynstav',            18, 'epic',     'wizard', 'wizard_staff_4');

-- Knight items
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, pixel_asset) VALUES
  ('iron_helm',      'hat',  'Jernhjelm',         1,  'common',   'knight', 'knight_hat_1'),
  ('steel_helm',     'hat',  'Stålhjelm',         5,  'uncommon', 'knight', 'knight_hat_2'),
  ('dragon_helm',    'hat',  'Dragehjelm',        10, 'rare',     'knight', 'knight_hat_3'),
  ('knight_crown',   'hat',  'Ridderkrone',        20, 'epic',     'knight', 'knight_hat_4'),
  ('iron_armor',     'robe', 'Jernrustning',       1,  'common',   'knight', 'knight_robe_1'),
  ('steel_armor',    'robe', 'Stålrustning',       8,  'uncommon', 'knight', 'knight_robe_2'),
  ('dragon_armor',   'robe', 'Dragerustning',      15, 'rare',     'knight', 'knight_robe_3'),
  ('golden_armor',   'robe', 'Gullrustning',       25, 'epic',     'knight', 'knight_robe_4'),
  ('iron_sword',     'staff','Jernsverd',           1,  'common',   'knight', 'knight_staff_1'),
  ('steel_sword',    'staff','Stålsverd',           6,  'uncommon', 'knight', 'knight_staff_2'),
  ('fire_sword',     'staff','Ildsverd',            12, 'rare',     'knight', 'knight_staff_3'),
  ('dragon_sword',   'staff','Dragesverd',          18, 'epic',     'knight', 'knight_staff_4');

-- Druid items
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, pixel_asset) VALUES
  ('leaf_crown',     'hat',  'Bladkrone',          1,  'common',   'druid', 'druid_hat_1'),
  ('antler_crown',   'hat',  'Gevirhjelm',         5,  'uncommon', 'druid', 'druid_hat_2'),
  ('flower_crown',   'hat',  'Blomsterkrone',       10, 'rare',     'druid', 'druid_hat_3'),
  ('nature_crown',   'hat',  'Naturkrone',          20, 'epic',     'druid', 'druid_hat_4'),
  ('green_robe',     'robe', 'Grønn drakt',        1,  'common',   'druid', 'druid_robe_1'),
  ('bark_robe',      'robe', 'Barkdrakt',           8,  'uncommon', 'druid', 'druid_robe_2'),
  ('moonlight_robe', 'robe', 'Månelysdrakt',        15, 'rare',     'druid', 'druid_robe_3'),
  ('elder_robe',     'robe', 'Eldredrakt',           25, 'epic',     'druid', 'druid_robe_4'),
  ('oak_staff',      'staff','Eikestav',             1,  'common',   'druid', 'druid_staff_1'),
  ('vine_staff',     'staff','Vinstav',              6,  'uncommon', 'druid', 'druid_staff_2'),
  ('moonstone_staff','staff','Månestenstav',         12, 'rare',     'druid', 'druid_staff_3'),
  ('elder_staff',    'staff','Eldrestav',             18, 'epic',     'druid', 'druid_staff_4');

-- Rogue items
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, pixel_asset) VALUES
  ('basic_hood',     'hat',  'Enkel hette',        1,  'common',   'rogue', 'rogue_hat_1'),
  ('shadow_hood',    'hat',  'Skyggehette',         5,  'uncommon', 'rogue', 'rogue_hat_2'),
  ('phantom_hood',   'hat',  'Fantomhette',         10, 'rare',     'rogue', 'rogue_hat_3'),
  ('master_hood',    'hat',  'Mesterhette',          20, 'epic',     'rogue', 'rogue_hat_4'),
  ('leather_vest',   'robe', 'Lærvest',             1,  'common',   'rogue', 'rogue_robe_1'),
  ('shadow_vest',    'robe', 'Skyggevest',           8,  'uncommon', 'rogue', 'rogue_robe_2'),
  ('phantom_vest',   'robe', 'Fantomvest',           15, 'rare',     'rogue', 'rogue_robe_3'),
  ('master_vest',    'robe', 'Mestervest',            25, 'epic',     'rogue', 'rogue_robe_4'),
  ('iron_daggers',   'staff','Jerndolker',           1,  'common',   'rogue', 'rogue_staff_1'),
  ('steel_daggers',  'staff','Ståldolker',           6,  'uncommon', 'rogue', 'rogue_staff_2'),
  ('venom_daggers',  'staff','Giftdolker',           12, 'rare',     'rogue', 'rogue_staff_3'),
  ('shadow_daggers', 'staff','Skyggedolker',         18, 'epic',     'rogue', 'rogue_staff_4');

-- Boss drop items (legendary, no class restriction)
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, is_boss_drop, pixel_asset) VALUES
  ('troll_crown',    'hat',  'Skjermtrollets krone',  1, 'legendary', true, 'boss_drop_hat_1'),
  ('dragon_wings',   'robe', 'Data-Dragens vinger',   1, 'legendary', true, 'boss_drop_robe_1'),
  ('wolf_claws',     'staff','Wifi-Varulvens klør',   1, 'legendary', true, 'boss_drop_staff_1'),
  ('demon_familiar', 'familiar','Digital demon',      1, 'legendary', true, 'boss_drop_familiar_1');

-- First dungeon boss (current week)
INSERT INTO dungeons (name, boss_name, boss_hp, boss_pixel_asset, week_start, week_end, difficulty, loot_table) VALUES
  (
    'Skjermtrollets hule',
    'Skjermtrollet',
    3000,
    'boss_skjermtrollet',
    date_trunc('week', CURRENT_DATE)::DATE,
    (date_trunc('week', CURRENT_DATE) + INTERVAL '6 days')::DATE,
    'easy',
    '[{"item_slug": "troll_crown", "drop_chance": 0.15}]'::JSONB
  );
