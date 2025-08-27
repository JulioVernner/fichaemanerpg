import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic Info
  name: text("name").notNull().default(""),
  age: integer("age").default(0),
  height: text("height").default(""),
  weight: text("weight").default(""),
  experience: integer("experience").default(0),
  level: integer("level").default(1),
  race: text("race").default(""),
  characterClass: text("character_class").default(""),
  vocation: text("vocation").default(""),
  pact: text("pact").default(""),
  
  // Primary Attributes
  currentHealth: integer("current_health").default(0),
  maxHealth: integer("max_health").default(0),
  currentMana: integer("current_mana").default(0),
  maxMana: integer("max_mana").default(0),
  currentMacula: integer("current_macula").default(0),
  maxMacula: integer("max_macula").default(0),
  currentEnergy: integer("current_energy").default(0),
  maxEnergy: integer("max_energy").default(0),
  
  // Secondary Attributes
  luck: integer("luck").default(0),
  sanity: integer("sanity").default(0),
  deathTest1: boolean("death_test_1").default(false),
  deathTest2: boolean("death_test_2").default(false),
  deathTest3: boolean("death_test_3").default(false),
  resurrection1: boolean("resurrection_1").default(false),
  resurrection2: boolean("resurrection_2").default(false),
  movementBase: integer("movement_base").default(0),
  movementBonus: integer("movement_bonus").default(0),
  initiativeBase: integer("initiative_base").default(0),
  initiativeBonus: integer("initiative_bonus").default(0),
  blessing: text("blessing").default(""),
  
  // Physical Skills
  forceBase: integer("force_base").default(0),
  forceBonus: integer("force_bonus").default(0),
  aimBase: integer("aim_base").default(0),
  aimBonus: integer("aim_bonus").default(0),
  combatBase: integer("combat_base").default(0),
  combatBonus: integer("combat_bonus").default(0),
  dodgeBase: integer("dodge_base").default(0),
  dodgeBonus: integer("dodge_bonus").default(0),
  defenseBase: integer("defense_base").default(0),
  defenseBonus: integer("defense_bonus").default(0),
  athleticsBase: integer("athletics_base").default(0),
  athleticsBonus: integer("athletics_bonus").default(0),
  ridingBase: integer("riding_base").default(0),
  ridingBonus: integer("riding_bonus").default(0),
  stealthBase: integer("stealth_base").default(0),
  stealthBonus: integer("stealth_bonus").default(0),
  reflexBase: integer("reflex_base").default(0),
  reflexBonus: integer("reflex_bonus").default(0),
  theftBase: integer("theft_base").default(0),
  theftBonus: integer("theft_bonus").default(0),
  lockpickingBase: integer("lockpicking_base").default(0),
  lockpickingBonus: integer("lockpicking_bonus").default(0),
  
  // Mental Skills
  willpowerBase: integer("willpower_base").default(0),
  willpowerBonus: integer("willpower_bonus").default(0),
  socializationBase: integer("socialization_base").default(0),
  socializationBonus: integer("socialization_bonus").default(0),
  scientificBase: integer("scientific_base").default(0),
  scientificBonus: integer("scientific_bonus").default(0),
  linguisticBase: integer("linguistic_base").default(0),
  linguisticBonus: integer("linguistic_bonus").default(0),
  medicalBase: integer("medical_base").default(0),
  medicalBonus: integer("medical_bonus").default(0),
  emanationBase: integer("emanation_base").default(0),
  emanationBonus: integer("emanation_bonus").default(0),
  magicControlBase: integer("magic_control_base").default(0),
  magicControlBonus: integer("magic_control_bonus").default(0),
  metallurgyBase: integer("metallurgy_base").default(0),
  metallurgyBonus: integer("metallurgy_bonus").default(0),
  writingBase: integer("writing_base").default(0),
  writingBonus: integer("writing_bonus").default(0),
  magicSensitivityBase: integer("magic_sensitivity_base").default(0),
  magicSensitivityBonus: integer("magic_sensitivity_bonus").default(0),
  perceptionBase: integer("perception_base").default(0),
  perceptionBonus: integer("perception_bonus").default(0),
  
  // Equipment
  primaryWeaponName: text("primary_weapon_name").default(""),
  primaryWeaponDamage: text("primary_weapon_damage").default(""),
  primaryWeaponDuration: text("primary_weapon_duration").default(""),
  secondaryWeaponName: text("secondary_weapon_name").default(""),
  secondaryWeaponDamage: text("secondary_weapon_damage").default(""),
  secondaryWeaponDuration: text("secondary_weapon_duration").default(""),
  armorName: text("armor_name").default(""),
  armorProtection: text("armor_protection").default(""),
  armorDuration: text("armor_duration").default(""),
  negativeEffectName: text("negative_effect_name").default(""),
  negativeEffectDescription: text("negative_effect_description").default(""),
  negativeEffectDuration: text("negative_effect_duration").default(""),
  
  // Character Features
  advantages: text("advantages").default(""),
  disadvantages: text("disadvantages").default(""),
  classTests: text("class_tests").default(""),
  abilities: text("abilities").default(""),
  spells: text("spells").default(""),
  
  // Inventory & Relations
  backpack: text("backpack").default(""),
  gold: integer("gold").default(0),
  otherResources: text("other_resources").default(""),
  relations: text("relations").default(""),
  narrative: text("narrative").default(""),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;
