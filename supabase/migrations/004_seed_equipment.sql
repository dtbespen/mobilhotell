-- Seed expanded equipment items with stats
-- Run after 003_character_system.sql

-- Update existing avatar_items to add stats

-- BODY COLORS (no stats)
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats) VALUES
  ('body_light',    'body_color', 'Lys',       1, 'common', NULL, false, 'body/light.png', NULL),
  ('body_olive',    'body_color', 'Oliven',    1, 'common', NULL, false, 'body/olive.png', NULL),
  ('body_bronze',   'body_color', 'Bronse',    1, 'common', NULL, false, 'body/bronze.png', NULL),
  ('body_brown',    'body_color', 'Brun',      1, 'common', NULL, false, 'body/brown.png', NULL),
  ('body_lavender', 'body_color', 'Lavendel',  1, 'common', NULL, false, 'body/lavender.png', NULL),
  ('body_blue',     'body_color', 'Bla',       1, 'common', NULL, false, 'body/blue.png', NULL),
  ('body_green',    'body_color', 'Gronn',     1, 'common', NULL, false, 'body/green.png', NULL),
  ('body_pink',     'body_color', 'Rosa',      1, 'common', NULL, false, 'body/pink.png', NULL)
ON CONFLICT (slug) DO NOTHING;

-- WIZARD HATS (5 tiers)
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('wiz_hat_t1', 'hat', 'Laerlinghatt',    1, 'common',    'wizard', false, 'hat/wizard/t1.png', '{"manaBonus":3}', 'wizard_set'),
  ('wiz_hat_t2', 'hat', 'Trollmannshatt',  5, 'uncommon',  'wizard', false, 'hat/wizard/t2.png', '{"manaBonus":6,"damageBonus":3}', 'wizard_set'),
  ('wiz_hat_t3', 'hat', 'Mystisk tiara',   12, 'rare',     'wizard', false, 'hat/wizard/t3.png', '{"manaBonus":10,"damageBonus":5}', 'wizard_set'),
  ('wiz_hat_t4', 'hat', 'Arkan krone',     25, 'epic',     'wizard', false, 'hat/wizard/t4.png', '{"manaBonus":15,"damageBonus":10,"lootBonus":3}', 'wizard_set'),
  ('wiz_hat_t5', 'hat', 'Stormesterens diadem', 40, 'legendary', 'wizard', false, 'hat/wizard/t5.png', '{"manaBonus":25,"damageBonus":15,"lootBonus":8}', 'wizard_set')
ON CONFLICT (slug) DO NOTHING;

-- WIZARD ARMOR
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('wiz_armor_t1', 'armor', 'Enkel kappe',        1, 'common',    'wizard', false, 'armor/wizard/t1.png', '{"streakShield":3}', 'wizard_set'),
  ('wiz_armor_t2', 'armor', 'Magisk kappe',       6, 'uncommon',  'wizard', false, 'armor/wizard/t2.png', '{"streakShield":5,"manaBonus":3}', 'wizard_set'),
  ('wiz_armor_t3', 'armor', 'Runekappe',          14, 'rare',     'wizard', false, 'armor/wizard/t3.png', '{"streakShield":8,"manaBonus":6}', 'wizard_set'),
  ('wiz_armor_t4', 'armor', 'Arkan rustning',     26, 'epic',     'wizard', false, 'armor/wizard/t4.png', '{"streakShield":12,"manaBonus":10,"guildBoost":3}', 'wizard_set'),
  ('wiz_armor_t5', 'armor', 'Stormesterens drakt', 42, 'legendary', 'wizard', false, 'armor/wizard/t5.png', '{"streakShield":18,"manaBonus":15,"guildBoost":8}', 'wizard_set')
ON CONFLICT (slug) DO NOTHING;

-- WIZARD WEAPONS
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('wiz_staff_t1', 'weapon', 'Trestav',           1, 'common',    'wizard', false, 'weapon/wizard/t1.png', '{"damageBonus":5}', 'wizard_set'),
  ('wiz_staff_t2', 'weapon', 'Jernstav',           7, 'uncommon',  'wizard', false, 'weapon/wizard/t2.png', '{"damageBonus":10,"manaBonus":3}', 'wizard_set'),
  ('wiz_staff_t3', 'weapon', 'Runestav',           15, 'rare',     'wizard', false, 'weapon/wizard/t3.png', '{"damageBonus":18,"manaBonus":5}', 'wizard_set'),
  ('wiz_staff_t4', 'weapon', 'Arkan scepter',     28, 'epic',     'wizard', false, 'weapon/wizard/t4.png', '{"damageBonus":28,"manaBonus":10,"lootBonus":3}', 'wizard_set'),
  ('wiz_staff_t5', 'weapon', 'Stormesterens stav', 43, 'legendary', 'wizard', false, 'weapon/wizard/t5.png', '{"damageBonus":40,"manaBonus":15,"lootBonus":8}', 'wizard_set')
ON CONFLICT (slug) DO NOTHING;

-- WIZARD CAPES
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('wiz_cape_t2', 'cape', 'Silkekappe',      8, 'uncommon',  'wizard', false, 'cape/wizard/t2.png', '{"guildBoost":3}', 'wizard_set'),
  ('wiz_cape_t3', 'cape', 'Stjernkappe',     18, 'rare',     'wizard', false, 'cape/wizard/t3.png', '{"guildBoost":6,"manaBonus":3}', 'wizard_set'),
  ('wiz_cape_t4', 'cape', 'Dimensjonskappe', 30, 'epic',     'wizard', false, 'cape/wizard/t4.png', '{"guildBoost":10,"manaBonus":5}', 'wizard_set')
ON CONFLICT (slug) DO NOTHING;

-- KNIGHT HATS
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('kni_hat_t1', 'hat', 'Larhjelm',          1, 'common',    'knight', false, 'hat/knight/t1.png', '{"streakShield":5}', 'knight_set'),
  ('kni_hat_t2', 'hat', 'Jernhjelm',         5, 'uncommon',  'knight', false, 'hat/knight/t2.png', '{"streakShield":8,"damageBonus":3}', 'knight_set'),
  ('kni_hat_t3', 'hat', 'Stalhjelm',         12, 'rare',     'knight', false, 'hat/knight/t3.png', '{"streakShield":12,"damageBonus":6}', 'knight_set'),
  ('kni_hat_t4', 'hat', 'Dragehjelm',        25, 'epic',     'knight', false, 'hat/knight/t4.png', '{"streakShield":18,"damageBonus":10,"guildBoost":3}', 'knight_set'),
  ('kni_hat_t5', 'hat', 'Kongens krone',     40, 'legendary', 'knight', false, 'hat/knight/t5.png', '{"streakShield":25,"damageBonus":15,"guildBoost":8}', 'knight_set')
ON CONFLICT (slug) DO NOTHING;

-- KNIGHT ARMOR
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('kni_armor_t1', 'armor', 'Larbrystplate',   1, 'common',    'knight', false, 'armor/knight/t1.png', '{"damageBonus":5,"streakShield":3}', 'knight_set'),
  ('kni_armor_t2', 'armor', 'Jernbrystplate',   6, 'uncommon',  'knight', false, 'armor/knight/t2.png', '{"damageBonus":8,"streakShield":5}', 'knight_set'),
  ('kni_armor_t3', 'armor', 'Stalrustning',    14, 'rare',     'knight', false, 'armor/knight/t3.png', '{"damageBonus":12,"streakShield":8}', 'knight_set'),
  ('kni_armor_t4', 'armor', 'Dragerustning',   26, 'epic',     'knight', false, 'armor/knight/t4.png', '{"damageBonus":18,"streakShield":12,"guildBoost":5}', 'knight_set'),
  ('kni_armor_t5', 'armor', 'Kongens rustning', 42, 'legendary', 'knight', false, 'armor/knight/t5.png', '{"damageBonus":30,"streakShield":20,"guildBoost":10}', 'knight_set')
ON CONFLICT (slug) DO NOTHING;

-- KNIGHT WEAPONS
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('kni_sword_t1', 'weapon', 'Tresverd',       1, 'common',    'knight', false, 'weapon/knight/t1.png', '{"damageBonus":8}', 'knight_set'),
  ('kni_sword_t2', 'weapon', 'Jernsverd',       7, 'uncommon',  'knight', false, 'weapon/knight/t2.png', '{"damageBonus":15}', 'knight_set'),
  ('kni_sword_t3', 'weapon', 'Stalklinge',     15, 'rare',     'knight', false, 'weapon/knight/t3.png', '{"damageBonus":25,"streakShield":3}', 'knight_set'),
  ('kni_sword_t4', 'weapon', 'Dragesverd',     28, 'epic',     'knight', false, 'weapon/knight/t4.png', '{"damageBonus":38,"streakShield":5}', 'knight_set'),
  ('kni_sword_t5', 'weapon', 'Kongens klinge', 43, 'legendary', 'knight', false, 'weapon/knight/t5.png', '{"damageBonus":55,"streakShield":8,"guildBoost":5}', 'knight_set')
ON CONFLICT (slug) DO NOTHING;

-- KNIGHT SHIELDS
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('kni_shield_t1', 'shield', 'Treskjold',        1, 'common',    'knight', false, 'shield/knight/t1.png', '{"streakShield":8}', 'knight_set'),
  ('kni_shield_t2', 'shield', 'Jernskjold',       8, 'uncommon',  'knight', false, 'shield/knight/t2.png', '{"streakShield":12,"guildBoost":3}', 'knight_set'),
  ('kni_shield_t3', 'shield', 'Stalskjold',       18, 'rare',     'knight', false, 'shield/knight/t3.png', '{"streakShield":18,"guildBoost":5}', 'knight_set'),
  ('kni_shield_t4', 'shield', 'Drageskjold',      30, 'epic',     'knight', false, 'shield/knight/t4.png', '{"streakShield":25,"guildBoost":8}', 'knight_set'),
  ('kni_shield_t5', 'shield', 'Kongens aegide',   44, 'legendary', 'knight', false, 'shield/knight/t5.png', '{"streakShield":35,"guildBoost":12}', 'knight_set')
ON CONFLICT (slug) DO NOTHING;

-- KNIGHT CAPES
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('kni_cape_t2', 'cape', 'Ridderkappe',     8, 'uncommon',  'knight', false, 'cape/knight/t2.png', '{"guildBoost":5}', 'knight_set'),
  ('kni_cape_t3', 'cape', 'Heltekappe',      18, 'rare',     'knight', false, 'cape/knight/t3.png', '{"guildBoost":8,"damageBonus":3}', 'knight_set'),
  ('kni_cape_t4', 'cape', 'Dragevingekappe', 30, 'epic',     'knight', false, 'cape/knight/t4.png', '{"guildBoost":12,"damageBonus":5}', 'knight_set')
ON CONFLICT (slug) DO NOTHING;

-- DRUID HATS
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('dru_hat_t1', 'hat', 'Bladkrans',            1, 'common',    'druid', false, 'hat/druid/t1.png', '{"guildBoost":3,"manaBonus":2}', 'druid_set'),
  ('dru_hat_t2', 'hat', 'Eikekrans',            5, 'uncommon',  'druid', false, 'hat/druid/t2.png', '{"guildBoost":5,"manaBonus":4}', 'druid_set'),
  ('dru_hat_t3', 'hat', 'Druidekrone',          12, 'rare',     'druid', false, 'hat/druid/t3.png', '{"guildBoost":8,"manaBonus":8}', 'druid_set'),
  ('dru_hat_t4', 'hat', 'Naturens krone',       25, 'epic',     'druid', false, 'hat/druid/t4.png', '{"guildBoost":12,"manaBonus":12,"lootBonus":3}', 'druid_set'),
  ('dru_hat_t5', 'hat', 'Verdenstrekrone',      40, 'legendary', 'druid', false, 'hat/druid/t5.png', '{"guildBoost":20,"manaBonus":18,"lootBonus":8}', 'druid_set')
ON CONFLICT (slug) DO NOTHING;

-- DRUID ARMOR
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('dru_armor_t1', 'armor', 'Bladdrakt',          1, 'common',    'druid', false, 'armor/druid/t1.png', '{"manaBonus":5}', 'druid_set'),
  ('dru_armor_t2', 'armor', 'Barkrustning',       6, 'uncommon',  'druid', false, 'armor/druid/t2.png', '{"manaBonus":8,"guildBoost":3}', 'druid_set'),
  ('dru_armor_t3', 'armor', 'Skogsrustning',      14, 'rare',     'druid', false, 'armor/druid/t3.png', '{"manaBonus":12,"guildBoost":5}', 'druid_set'),
  ('dru_armor_t4', 'armor', 'Naturens rustning',   26, 'epic',     'druid', false, 'armor/druid/t4.png', '{"manaBonus":18,"guildBoost":8,"streakShield":5}', 'druid_set'),
  ('dru_armor_t5', 'armor', 'Verdenstrets bark',   42, 'legendary', 'druid', false, 'armor/druid/t5.png', '{"manaBonus":25,"guildBoost":15,"streakShield":10}', 'druid_set')
ON CONFLICT (slug) DO NOTHING;

-- DRUID WEAPONS
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('dru_staff_t1', 'weapon', 'Kvistav',          1, 'common',    'druid', false, 'weapon/druid/t1.png', '{"manaBonus":5,"guildBoost":2}', 'druid_set'),
  ('dru_staff_t2', 'weapon', 'Eikestav',         7, 'uncommon',  'druid', false, 'weapon/druid/t2.png', '{"manaBonus":8,"guildBoost":4}', 'druid_set'),
  ('dru_staff_t3', 'weapon', 'Livsstav',         15, 'rare',     'druid', false, 'weapon/druid/t3.png', '{"manaBonus":12,"guildBoost":6,"damageBonus":5}', 'druid_set'),
  ('dru_staff_t4', 'weapon', 'Naturens scepter', 28, 'epic',     'druid', false, 'weapon/druid/t4.png', '{"manaBonus":18,"guildBoost":10,"damageBonus":8}', 'druid_set'),
  ('dru_staff_t5', 'weapon', 'Verdenstrets rot', 43, 'legendary', 'druid', false, 'weapon/druid/t5.png', '{"manaBonus":25,"guildBoost":15,"damageBonus":12}', 'druid_set')
ON CONFLICT (slug) DO NOTHING;

-- DRUID CAPES
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('dru_cape_t2', 'cape', 'Bladkappe',         8, 'uncommon',  'druid', false, 'cape/druid/t2.png', '{"guildBoost":5,"manaBonus":2}', 'druid_set'),
  ('dru_cape_t3', 'cape', 'Skogskappe',        18, 'rare',     'druid', false, 'cape/druid/t3.png', '{"guildBoost":8,"manaBonus":5}', 'druid_set'),
  ('dru_cape_t4', 'cape', 'Naturens mantel',   30, 'epic',     'druid', false, 'cape/druid/t4.png', '{"guildBoost":12,"manaBonus":8}', 'druid_set')
ON CONFLICT (slug) DO NOTHING;

-- ROGUE HATS
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('rog_hat_t1', 'hat', 'Enkel hette',        1, 'common',    'rogue', false, 'hat/rogue/t1.png', '{"lootBonus":3}', 'rogue_set'),
  ('rog_hat_t2', 'hat', 'Tyvhette',           5, 'uncommon',  'rogue', false, 'hat/rogue/t2.png', '{"lootBonus":6,"damageBonus":3}', 'rogue_set'),
  ('rog_hat_t3', 'hat', 'Skyggehette',        12, 'rare',     'rogue', false, 'hat/rogue/t3.png', '{"lootBonus":10,"damageBonus":5}', 'rogue_set'),
  ('rog_hat_t4', 'hat', 'Mesterhette',        25, 'epic',     'rogue', false, 'hat/rogue/t4.png', '{"lootBonus":15,"damageBonus":10,"manaBonus":5}', 'rogue_set'),
  ('rog_hat_t5', 'hat', 'Skyggedodens maske', 40, 'legendary', 'rogue', false, 'hat/rogue/t5.png', '{"lootBonus":25,"damageBonus":15,"manaBonus":10}', 'rogue_set')
ON CONFLICT (slug) DO NOTHING;

-- ROGUE ARMOR
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('rog_armor_t1', 'armor', 'Larbestning',          1, 'common',    'rogue', false, 'armor/rogue/t1.png', '{"damageBonus":3,"lootBonus":2}', 'rogue_set'),
  ('rog_armor_t2', 'armor', 'Skinnrustning',        6, 'uncommon',  'rogue', false, 'armor/rogue/t2.png', '{"damageBonus":6,"lootBonus":4}', 'rogue_set'),
  ('rog_armor_t3', 'armor', 'Skyggerustning',       14, 'rare',     'rogue', false, 'armor/rogue/t3.png', '{"damageBonus":10,"lootBonus":6}', 'rogue_set'),
  ('rog_armor_t4', 'armor', 'Mesterens drakt',      26, 'epic',     'rogue', false, 'armor/rogue/t4.png', '{"damageBonus":15,"lootBonus":10,"streakShield":5}', 'rogue_set'),
  ('rog_armor_t5', 'armor', 'Skyggedodens rustning', 42, 'legendary', 'rogue', false, 'armor/rogue/t5.png', '{"damageBonus":22,"lootBonus":15,"streakShield":10}', 'rogue_set')
ON CONFLICT (slug) DO NOTHING;

-- ROGUE WEAPONS
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('rog_dagger_t1', 'weapon', 'Rustdolk',           1, 'common',    'rogue', false, 'weapon/rogue/t1.png', '{"damageBonus":8,"lootBonus":2}', 'rogue_set'),
  ('rog_dagger_t2', 'weapon', 'Staldolk',           7, 'uncommon',  'rogue', false, 'weapon/rogue/t2.png', '{"damageBonus":14,"lootBonus":4}', 'rogue_set'),
  ('rog_dagger_t3', 'weapon', 'Skyggeklinge',       15, 'rare',     'rogue', false, 'weapon/rogue/t3.png', '{"damageBonus":22,"lootBonus":6}', 'rogue_set'),
  ('rog_dagger_t4', 'weapon', 'Giftklinge',         28, 'epic',     'rogue', false, 'weapon/rogue/t4.png', '{"damageBonus":35,"lootBonus":10,"manaBonus":5}', 'rogue_set'),
  ('rog_dagger_t5', 'weapon', 'Skyggedodens klinge', 43, 'legendary', 'rogue', false, 'weapon/rogue/t5.png', '{"damageBonus":50,"lootBonus":15,"manaBonus":10}', 'rogue_set')
ON CONFLICT (slug) DO NOTHING;

-- ROGUE CAPES
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats, set_id) VALUES
  ('rog_cape_t2', 'cape', 'Tyvkappe',          8, 'uncommon',  'rogue', false, 'cape/rogue/t2.png', '{"lootBonus":5,"streakShield":3}', 'rogue_set'),
  ('rog_cape_t3', 'cape', 'Skyggekappe',       18, 'rare',     'rogue', false, 'cape/rogue/t3.png', '{"lootBonus":8,"streakShield":5}', 'rogue_set'),
  ('rog_cape_t4', 'cape', 'Mesterens mantel',  30, 'epic',     'rogue', false, 'cape/rogue/t4.png', '{"lootBonus":12,"streakShield":8}', 'rogue_set')
ON CONFLICT (slug) DO NOTHING;

-- SHARED FAMILIARS (all classes)
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats) VALUES
  ('familiar_cat',          'familiar', 'Katt',         3,  'common',    NULL, false, 'familiar/cat.png', '{"manaBonus":3}'),
  ('familiar_owl',          'familiar', 'Ugle',         10, 'uncommon',  NULL, false, 'familiar/owl.png', '{"lootBonus":6}'),
  ('familiar_baby_dragon',  'familiar', 'Babydrage',    20, 'rare',      NULL, false, 'familiar/baby_dragon.png', '{"damageBonus":10,"manaBonus":3}'),
  ('familiar_phoenix',      'familiar', 'Foniks',       35, 'epic',      NULL, false, 'familiar/phoenix.png', '{"damageBonus":15,"streakShield":8}'),
  ('familiar_ice_fox',      'familiar', 'Isrev',        1,  'epic',      NULL, false, 'familiar/ice_fox.png', '{"manaBonus":10,"lootBonus":5}')
ON CONFLICT (slug) DO NOTHING;

-- BOSS DROPS (legendary items)
INSERT INTO avatar_items (slug, type, name, unlock_level, rarity, class_restriction, is_boss_drop, pixel_asset, stats) VALUES
  ('boss_troll_hat',     'hat',     'Skjermtrollets horn',     1, 'legendary', NULL, true, 'hat/boss/troll.png', '{"damageBonus":20,"manaBonus":10,"lootBonus":5}'),
  ('boss_dragon_armor',  'armor',   'Dragens skjell',          1, 'legendary', NULL, true, 'armor/boss/dragon.png', '{"damageBonus":15,"streakShield":15,"guildBoost":10}'),
  ('boss_wolf_cape',     'cape',    'Varulvens pels',          1, 'legendary', NULL, true, 'cape/boss/wolf.png', '{"streakShield":20,"guildBoost":8,"lootBonus":5}'),
  ('boss_demon_weapon',  'weapon',  'Demonens flammeklinge',   1, 'legendary', NULL, true, 'weapon/boss/demon.png', '{"damageBonus":40,"lootBonus":10}')
ON CONFLICT (slug) DO NOTHING;
