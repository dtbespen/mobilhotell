/**
 * Procedural 32x32 Pixel Art Engine (CryptoPunks-style detail)
 */

import type { CharacterClass, AvatarConfig } from "./database.types";

export const GRID = 32;
export type PixelData = (string | null)[][];

function canvas(): PixelData {
  return Array.from({ length: GRID }, () => new Array<string | null>(GRID).fill(null));
}

function fill(c: PixelData, x: number, y: number, w: number, h: number, color: string) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++) {
      const py = y + dy, px = x + dx;
      if (py >= 0 && py < GRID && px >= 0 && px < GRID) c[py][px] = color;
    }
}

function dot(c: PixelData, x: number, y: number, color: string) {
  if (y >= 0 && y < GRID && x >= 0 && x < GRID) c[y][x] = color;
}

function outline(c: PixelData, x: number, y: number, w: number, h: number, color: string) {
  fill(c, x, y, w, 1, color);
  fill(c, x, y + h - 1, w, 1, color);
  fill(c, x, y, 1, h, color);
  fill(c, x + w - 1, y, 1, h, color);
}

// ─── COLOR PALETTES ───

export const SKIN_PALETTE: Record<string, { main: string; shadow: string; hi: string; outline: string }> = {
  light:    { main: "#f5d6b8", shadow: "#d4b494", hi: "#ffeedd", outline: "#b89878" },
  olive:    { main: "#c4a882", shadow: "#a08860", hi: "#dcc8a8", outline: "#886840" },
  bronze:   { main: "#a0784a", shadow: "#806030", hi: "#c09868", outline: "#604020" },
  brown:    { main: "#7a5232", shadow: "#5a3820", hi: "#9a7252", outline: "#3a2010" },
  dark:     { main: "#5a3820", shadow: "#3a2010", hi: "#7a5840", outline: "#2a1008" },
  lavender: { main: "#c8b0ff", shadow: "#a890dd", hi: "#e0d0ff", outline: "#8870bb" },
  blue:     { main: "#6aa0ff", shadow: "#4a80dd", hi: "#90c0ff", outline: "#2a60bb" },
  green:    { main: "#6aff8a", shadow: "#4add6a", hi: "#a0ffb0", outline: "#2abb4a" },
  pink:     { main: "#ff8aaa", shadow: "#dd6888", hi: "#ffb0cc", outline: "#bb4868" },
  frost:    { main: "#a0d8ff", shadow: "#80b8dd", hi: "#c0e8ff", outline: "#6098bb" },
};

export const HAIR_PALETTE: Record<string, { main: string; shadow: string; hi: string }> = {
  blonde: { main: "#e8d06a", shadow: "#c8b04a", hi: "#fff0a0" },
  brown:  { main: "#8a5a2a", shadow: "#6a4018", hi: "#aa7a4a" },
  black:  { main: "#3a3a3a", shadow: "#1a1a1a", hi: "#5a5a5a" },
  red:    { main: "#cc4422", shadow: "#aa2200", hi: "#ee6644" },
  blue:   { main: "#4488ff", shadow: "#2266dd", hi: "#66aaff" },
  green:  { main: "#44cc44", shadow: "#22aa22", hi: "#66ee66" },
  purple: { main: "#9944ff", shadow: "#7722dd", hi: "#bb66ff" },
  pink:   { main: "#ff66aa", shadow: "#dd4488", hi: "#ff88cc" },
  silver: { main: "#c0c0c0", shadow: "#909090", hi: "#e0e0e0" },
  white:  { main: "#e8e8e8", shadow: "#c0c0c0", hi: "#ffffff" },
};

export const EYE_COLORS: Record<string, string> = {
  dark: "#1a1a2e", blue: "#3366cc", green: "#2e8b57", brown: "#6b4226",
  purple: "#7733aa", red: "#cc2222", gold: "#cc9900", silver: "#8899aa",
};

export const CLASS_PALETTE: Record<CharacterClass, { pri: string; sec: string; acc: string; metal: string }> = {
  wizard: { pri: "#7b61ff", sec: "#4d36c4", acc: "#bfb0ff", metal: "#c0c0d0" },
  knight: { pri: "#cc3333", sec: "#991919", acc: "#ff8080", metal: "#c8c8d0" },
  druid:  { pri: "#22aa44", sec: "#117733", acc: "#66dd88", metal: "#8a9a6a" },
  rogue:  { pri: "#aa7722", sec: "#775511", acc: "#ddaa44", metal: "#a0a0a0" },
};

// ─── BODY SHAPE SYSTEM ───

export type BodyShape = "normal" | "small" | "tall" | "wide";

type BP = {
  // Head
  hx: number; hy: number; hw: number; hh: number;
  // Eyes (left eye x, right eye x, y, width per eye)
  eyY: number; eyLx: number; eyRx: number; eyW: number;
  // Nose & mouth
  noseX: number; noseY: number; mouthY: number; mouthW: number;
  // Neck
  nkY: number; nkX: number; nkW: number; nkH: number;
  // Shoulders
  shY: number; shX: number; shW: number;
  // Torso
  tX: number; tY: number; tW: number; tH: number;
  // Arms
  aLx: number; aRx: number; aY: number; aW: number; aH: number;
  // Legs
  lLx: number; lRx: number; lY: number; lW: number; lH: number;
  // Feet
  fLx: number; fRx: number; fY: number; fW: number;
};

const BP_MAP: Record<BodyShape, BP> = {
  normal: {
    hx: 10, hy: 2, hw: 12, hh: 10,
    eyY: 7, eyLx: 12, eyRx: 18, eyW: 2,
    noseX: 16, noseY: 9, mouthY: 10, mouthW: 4,
    nkY: 12, nkX: 14, nkW: 4, nkH: 1,
    shY: 13, shX: 8, shW: 16,
    tX: 10, tY: 14, tW: 12, tH: 7,
    aLx: 6, aRx: 23, aY: 13, aW: 3, aH: 9,
    lLx: 11, lRx: 18, lY: 21, lW: 4, lH: 7,
    fLx: 10, fRx: 18, fY: 28, fW: 5,
  },
  small: {
    hx: 8, hy: 5, hw: 16, hh: 12,
    eyY: 11, eyLx: 11, eyRx: 19, eyW: 2,
    noseX: 16, noseY: 13, mouthY: 14, mouthW: 4,
    nkY: 17, nkX: 14, nkW: 4, nkH: 1,
    shY: 18, shX: 10, shW: 12,
    tX: 11, tY: 19, tW: 10, tH: 4,
    aLx: 8, aRx: 21, aY: 18, aW: 3, aH: 5,
    lLx: 12, lRx: 18, lY: 23, lW: 3, lH: 5,
    fLx: 11, fRx: 18, fY: 28, fW: 4,
  },
  tall: {
    hx: 11, hy: 0, hw: 10, hh: 9,
    eyY: 4, eyLx: 13, eyRx: 18, eyW: 2,
    noseX: 16, noseY: 6, mouthY: 7, mouthW: 3,
    nkY: 9, nkX: 14, nkW: 4, nkH: 1,
    shY: 10, shX: 9, shW: 14,
    tX: 11, tY: 11, tW: 10, tH: 9,
    aLx: 7, aRx: 22, aY: 10, aW: 3, aH: 10,
    lLx: 12, lRx: 17, lY: 20, lW: 4, lH: 9,
    fLx: 11, fRx: 17, fY: 29, fW: 5,
  },
  wide: {
    hx: 10, hy: 2, hw: 12, hh: 10,
    eyY: 7, eyLx: 12, eyRx: 18, eyW: 2,
    noseX: 16, noseY: 9, mouthY: 10, mouthW: 4,
    nkY: 12, nkX: 13, nkW: 6, nkH: 1,
    shY: 13, shX: 6, shW: 20,
    tX: 8, tY: 14, tW: 16, tH: 7,
    aLx: 4, aRx: 24, aY: 13, aW: 4, aH: 9,
    lLx: 10, lRx: 19, lY: 21, lW: 4, lH: 7,
    fLx: 9, fRx: 19, fY: 28, fW: 5,
  },
};

function drawBody(c: PixelData, bp: BP, sk: string, sh: string, hi: string, ol: string, eye: string) {
  const { hx, hy, hw, hh } = bp;

  // Head shape (rounded rectangle via insets)
  fill(c, hx + 2, hy, hw - 4, 1, ol);         // top edge
  fill(c, hx + 1, hy + 1, 1, 1, ol);           // top-left corner
  fill(c, hx + hw - 2, hy + 1, 1, 1, ol);      // top-right corner
  fill(c, hx, hy + 2, 1, hh - 4, ol);          // left edge
  fill(c, hx + hw - 1, hy + 2, 1, hh - 4, ol); // right edge
  fill(c, hx + 1, hy + hh - 2, 1, 1, ol);      // bottom-left
  fill(c, hx + hw - 2, hy + hh - 2, 1, 1, ol); // bottom-right
  fill(c, hx + 2, hy + hh - 1, hw - 4, 1, ol); // bottom edge

  // Head fill
  fill(c, hx + 2, hy + 1, hw - 4, 1, hi);      // forehead highlight
  fill(c, hx + 1, hy + 2, hw - 2, hh - 4, sk); // main face
  fill(c, hx + 2, hy + hh - 2, hw - 4, 1, sk); // chin
  // Cheek shadow
  fill(c, hx + 1, hy + Math.floor(hh * 0.6), 1, 2, sh);
  fill(c, hx + hw - 2, hy + Math.floor(hh * 0.6), 1, 2, sh);
  // Under-chin shadow
  fill(c, hx + 3, hy + hh - 1, hw - 6, 1, sh);

  // Eyes (2 wide x 2 tall with pupil + highlight)
  const ew = bp.eyW;
  // Left eye
  fill(c, bp.eyLx, bp.eyY, ew, 2, "#ffffff");
  dot(c, bp.eyLx, bp.eyY + 1, eye);
  dot(c, bp.eyLx + ew - 1, bp.eyY, "#ffffff"); // highlight stays white
  // Right eye
  fill(c, bp.eyRx, bp.eyY, ew, 2, "#ffffff");
  dot(c, bp.eyRx, bp.eyY + 1, eye);
  dot(c, bp.eyRx + ew - 1, bp.eyY, "#ffffff");

  // Eyebrows
  fill(c, bp.eyLx - 1, bp.eyY - 1, ew + 1, 1, ol);
  fill(c, bp.eyRx, bp.eyY - 1, ew + 1, 1, ol);

  // Nose (small triangle)
  dot(c, bp.noseX, bp.noseY, sh);
  dot(c, bp.noseX - 1, bp.noseY + 1, sh);

  // Mouth
  fill(c, bp.noseX - Math.floor(bp.mouthW / 2), bp.mouthY, bp.mouthW, 1, sh);
  dot(c, bp.noseX - Math.floor(bp.mouthW / 2) + 1, bp.mouthY, "#c06060"); // lip color

  // Neck
  fill(c, bp.nkX, bp.nkY, bp.nkW, bp.nkH, sh);

  // Shoulders
  fill(c, bp.shX, bp.shY, bp.shW, 1, sk);
  fill(c, bp.shX, bp.shY, 2, 1, sh);
  fill(c, bp.shX + bp.shW - 2, bp.shY, 2, 1, sh);

  // Torso
  fill(c, bp.tX, bp.tY, bp.tW, bp.tH, sk);
  fill(c, bp.tX, bp.tY, 1, bp.tH, sh);
  fill(c, bp.tX + bp.tW - 1, bp.tY, 1, bp.tH, sh);
  // Belly highlight
  fill(c, bp.tX + Math.floor(bp.tW / 2) - 1, bp.tY + 1, 2, 2, hi);

  // Arms
  fill(c, bp.aLx, bp.aY, bp.aW, bp.aH, sk);
  fill(c, bp.aLx, bp.aY, 1, bp.aH, sh);
  fill(c, bp.aRx, bp.aY, bp.aW, bp.aH, sk);
  fill(c, bp.aRx + bp.aW - 1, bp.aY, 1, bp.aH, sh);
  // Hands
  fill(c, bp.aLx, bp.aY + bp.aH, bp.aW, 1, sh);
  fill(c, bp.aRx, bp.aY + bp.aH, bp.aW, 1, sh);

  // Legs
  fill(c, bp.lLx, bp.lY, bp.lW, bp.lH, sk);
  fill(c, bp.lLx, bp.lY, 1, bp.lH, sh);
  fill(c, bp.lRx, bp.lY, bp.lW, bp.lH, sk);
  fill(c, bp.lRx + bp.lW - 1, bp.lY, 1, bp.lH, sh);

  // Feet
  fill(c, bp.fLx, bp.fY, bp.fW, 2, sh);
  fill(c, bp.fLx + 1, bp.fY, bp.fW - 1, 1, sk);
  fill(c, bp.fRx, bp.fY, bp.fW, 2, sh);
  fill(c, bp.fRx + 1, bp.fY, bp.fW - 1, 1, sk);
}

// ─── HAIR STYLES ───

function drawHair(c: PixelData, style: string, bp: BP, m: string, sh: string, hi: string) {
  const { hx, hy, hw, hh } = bp;
  const cx = hx + Math.floor(hw / 2);
  const headTop = hy;
  const headR = hx + hw;

  switch (style) {
    case "plain": {
      fill(c, hx + 1, headTop - 1, hw - 2, 3, m);
      fill(c, hx + 2, headTop - 1, hw - 4, 1, hi);
      fill(c, hx, headTop + 1, 2, 2, m);
      fill(c, headR - 2, headTop + 1, 2, 2, m);
      dot(c, hx, headTop + 2, sh);
      dot(c, headR - 1, headTop + 2, sh);
      break;
    }
    case "long": {
      fill(c, hx + 1, headTop - 1, hw - 2, 3, m);
      fill(c, hx + 2, headTop - 1, hw - 4, 1, hi);
      // Sides flowing down
      fill(c, hx - 1, headTop + 1, 2, hh + 4, m);
      fill(c, headR - 1, headTop + 1, 2, hh + 4, m);
      fill(c, hx - 1, headTop + 1, 1, hh + 4, sh);
      fill(c, headR, headTop + hh, 1, 3, sh);
      // Bottom wave
      dot(c, hx - 1, headTop + hh + 4, sh);
      dot(c, headR, headTop + hh + 4, sh);
      break;
    }
    case "mohawk": {
      // Tall spike
      fill(c, cx - 1, headTop - 6, 3, 6, m);
      fill(c, cx, headTop - 6, 1, 2, hi);
      fill(c, cx - 1, headTop - 6, 1, 4, sh);
      fill(c, hx + 2, headTop - 1, hw - 4, 2, m);
      // Side shave (darker skin showing)
      fill(c, hx + 1, headTop + 1, 2, 2, sh);
      fill(c, headR - 3, headTop + 1, 2, 2, sh);
      break;
    }
    case "messy": {
      fill(c, hx, headTop - 1, hw, 3, m);
      fill(c, hx + 2, headTop - 1, hw - 4, 1, hi);
      // Random spikes
      dot(c, hx + 1, headTop - 2, m);
      dot(c, hx + 4, headTop - 3, m);
      dot(c, cx, headTop - 2, m);
      dot(c, cx + 2, headTop - 3, m);
      dot(c, headR - 3, headTop - 2, m);
      // Side tufts
      dot(c, hx - 1, headTop + 1, m);
      dot(c, hx - 1, headTop + 3, sh);
      dot(c, headR, headTop + 1, m);
      dot(c, headR, headTop + 3, sh);
      // Shadow on spikes
      dot(c, hx + 3, headTop - 3, sh);
      dot(c, cx + 1, headTop - 3, sh);
      break;
    }
    case "ponytail": {
      fill(c, hx + 1, headTop - 1, hw - 2, 3, m);
      fill(c, hx + 2, headTop - 1, hw - 4, 1, hi);
      fill(c, hx, headTop + 1, 2, 2, m);
      // Ponytail extending right
      fill(c, headR, headTop + 1, 2, 2, m);
      fill(c, headR + 1, headTop + 3, 2, 5, m);
      fill(c, headR + 2, headTop + 3, 1, 5, sh);
      dot(c, headR + 1, headTop + 8, sh);
      // Hair tie
      dot(c, headR, headTop + 2, sh);
      break;
    }
    case "braids": {
      fill(c, hx + 1, headTop - 1, hw - 2, 3, m);
      fill(c, hx + 2, headTop - 1, hw - 4, 1, hi);
      // Left braid
      for (let i = 0; i < 8; i++) {
        dot(c, hx - 1, headTop + 2 + i, i % 2 === 0 ? m : sh);
        dot(c, hx, headTop + 2 + i, i % 2 === 0 ? sh : m);
      }
      // Right braid
      for (let i = 0; i < 8; i++) {
        dot(c, headR - 1, headTop + 2 + i, i % 2 === 0 ? m : sh);
        dot(c, headR, headTop + 2 + i, i % 2 === 0 ? sh : m);
      }
      break;
    }
    case "curly": {
      // Big rounded afro/curly
      fill(c, hx - 2, headTop - 2, hw + 4, 4, m);
      fill(c, hx - 3, headTop, 2, hh - 2, m);
      fill(c, headR + 1, headTop, 2, hh - 2, m);
      fill(c, hx - 2, headTop - 2, hw + 4, 1, hi);
      // Curl texture
      dot(c, hx - 1, headTop + 1, sh);
      dot(c, hx + 2, headTop - 1, sh);
      dot(c, headR, headTop + 1, sh);
      dot(c, headR - 3, headTop - 1, sh);
      dot(c, hx - 2, headTop + 3, sh);
      dot(c, headR + 1, headTop + 3, sh);
      // Bottom round
      fill(c, hx - 2, headTop + hh - 3, 2, 2, m);
      fill(c, headR, headTop + hh - 3, 2, 2, m);
      dot(c, hx - 2, headTop + hh - 2, sh);
      dot(c, headR + 1, headTop + hh - 2, sh);
      break;
    }
    case "bob": {
      fill(c, hx, headTop - 1, hw, 3, m);
      fill(c, hx + 2, headTop - 1, hw - 4, 1, hi);
      // Sides framing face
      fill(c, hx - 1, headTop + 1, 2, hh - 2, m);
      fill(c, headR - 1, headTop + 1, 2, hh - 2, m);
      // Rounded bottom
      fill(c, hx - 1, headTop + hh - 2, 3, 2, m);
      fill(c, headR - 2, headTop + hh - 2, 3, 2, m);
      fill(c, hx - 1, headTop + hh - 1, 1, 1, sh);
      fill(c, headR, headTop + hh - 1, 1, 1, sh);
      break;
    }
  }
}

// ─── CLASS OUTFITS ───

type CP = { pri: string; sec: string; acc: string; metal: string };

function drawOutfit(c: PixelData, cls: CharacterClass, bp: BP, cp: CP) {
  const { tX, tY, tW, tH, shX, shY, shW } = bp;
  const midX = tX + Math.floor(tW / 2);

  switch (cls) {
    case "wizard": {
      fill(c, tX, tY, tW, tH, cp.pri);
      fill(c, tX, tY, 1, tH, cp.sec);
      fill(c, tX + tW - 1, tY, 1, tH, cp.sec);
      // V-neck collar
      dot(c, midX - 1, tY, cp.acc); dot(c, midX, tY, cp.acc);
      dot(c, midX - 2, tY + 1, cp.acc); dot(c, midX + 1, tY + 1, cp.acc);
      // Center seam with stars
      for (let i = 2; i < tH; i++) dot(c, midX, tY + i, cp.sec);
      dot(c, midX, tY + 3, cp.acc);
      dot(c, midX, tY + tH - 2, cp.acc);
      // Belt
      fill(c, tX, tY + tH - 2, tW, 1, cp.acc);
      dot(c, midX, tY + tH - 2, cp.metal);
      // Robe skirt
      fill(c, tX - 1, tY + tH, tW + 2, 3, cp.pri);
      fill(c, tX - 1, tY + tH + 2, 1, 1, cp.sec);
      fill(c, tX + tW, tY + tH + 2, 1, 1, cp.sec);
      fill(c, midX, tY + tH, 1, 3, cp.sec);
      // Boots
      fill(c, bp.fLx, bp.fY, bp.fW, 2, cp.sec);
      fill(c, bp.fRx, bp.fY, bp.fW, 2, cp.sec);
      break;
    }
    case "knight": {
      // Chest plate with metallic border
      fill(c, tX, tY, tW, tH, cp.pri);
      outline(c, tX, tY, tW, tH, cp.metal);
      // Inner plate
      fill(c, tX + 2, tY + 2, tW - 4, tH - 4, cp.pri);
      // Chest cross emblem
      fill(c, midX - 1, tY + 1, 2, tH - 2, cp.acc);
      fill(c, tX + 2, tY + Math.floor(tH / 2), tW - 4, 1, cp.acc);
      // Shoulder pads
      fill(c, shX, shY, 3, 2, cp.metal);
      fill(c, shX + 1, shY, 1, 1, cp.acc);
      fill(c, shX + shW - 3, shY, 3, 2, cp.metal);
      fill(c, shX + shW - 2, shY, 1, 1, cp.acc);
      // Belt
      fill(c, tX, tY + tH - 1, tW, 1, cp.sec);
      dot(c, midX, tY + tH - 1, cp.metal);
      // Leg armor
      fill(c, bp.lLx, bp.lY, bp.lW, bp.lH, cp.sec);
      fill(c, bp.lLx + 1, bp.lY, bp.lW - 2, bp.lH, cp.pri);
      fill(c, bp.lRx, bp.lY, bp.lW, bp.lH, cp.sec);
      fill(c, bp.lRx + 1, bp.lY, bp.lW - 2, bp.lH, cp.pri);
      // Metal boots
      fill(c, bp.fLx, bp.fY, bp.fW, 2, cp.metal);
      fill(c, bp.fRx, bp.fY, bp.fW, 2, cp.metal);
      break;
    }
    case "druid": {
      fill(c, tX, tY, tW, tH, cp.pri);
      fill(c, tX, tY, 1, tH, cp.sec);
      fill(c, tX + tW - 1, tY, 1, tH, cp.sec);
      // Leaf collar
      dot(c, midX - 2, tY, cp.acc); dot(c, midX - 1, tY, cp.acc);
      dot(c, midX, tY, cp.acc); dot(c, midX + 1, tY, cp.acc);
      // Leaf pattern scattered
      dot(c, tX + 2, tY + 2, cp.acc);
      dot(c, tX + tW - 3, tY + 3, cp.acc);
      dot(c, tX + 3, tY + 4, cp.acc);
      dot(c, tX + tW - 4, tY + 1, cp.acc);
      // Vine belt
      fill(c, tX, tY + tH - 2, tW, 1, cp.sec);
      for (let i = 0; i < tW; i += 3) dot(c, tX + i, tY + tH - 2, cp.acc);
      // Sandals
      fill(c, bp.fLx, bp.fY, bp.fW, 1, cp.sec);
      fill(c, bp.fRx, bp.fY, bp.fW, 1, cp.sec);
      break;
    }
    case "rogue": {
      fill(c, tX, tY, tW, tH, cp.pri);
      fill(c, tX, tY, 1, tH, cp.sec);
      fill(c, tX + tW - 1, tY, 1, tH, cp.sec);
      // Leather collar
      fill(c, tX + 1, tY, tW - 2, 1, cp.sec);
      // Cross straps
      for (let i = 0; i < Math.min(tH - 1, tW - 2); i++) {
        dot(c, tX + 1 + i, tY + 1 + i, cp.sec);
        if (tX + tW - 2 - i > tX) dot(c, tX + tW - 2 - i, tY + 1 + i, cp.sec);
      }
      // Belt with multiple pouches
      fill(c, tX, tY + tH - 2, tW, 1, cp.sec);
      dot(c, tX + 2, tY + tH - 1, cp.acc);
      dot(c, midX, tY + tH - 1, cp.acc);
      dot(c, tX + tW - 3, tY + tH - 1, cp.acc);
      // Leg wraps
      for (let i = 0; i < bp.lH; i += 2) {
        fill(c, bp.lLx, bp.lY + i, bp.lW, 1, cp.sec);
        fill(c, bp.lRx, bp.lY + i, bp.lW, 1, cp.sec);
      }
      // Dark boots
      fill(c, bp.fLx, bp.fY, bp.fW, 2, cp.sec);
      fill(c, bp.fRx, bp.fY, bp.fW, 2, cp.sec);
      break;
    }
  }
}

// ─── EQUIPMENT OVERLAYS (wardrobe items) ───

export function drawEquipmentHat(c: PixelData, cls: CharacterClass, bp: BP, cp: CP) {
  const { hx, hy, hw } = bp;
  const cx = hx + Math.floor(hw / 2);

  switch (cls) {
    case "wizard":
      dot(c, cx, hy - 7, cp.acc);
      fill(c, cx - 1, hy - 6, 3, 2, cp.pri);
      fill(c, cx - 2, hy - 4, 5, 2, cp.pri);
      fill(c, cx - 3, hy - 2, 7, 1, cp.sec);
      fill(c, hx - 1, hy - 1, hw + 2, 1, cp.pri);
      dot(c, cx, hy - 7, cp.acc); // star tip
      break;
    case "knight":
      fill(c, hx, hy - 2, hw, 3, cp.metal);
      fill(c, hx + 1, hy - 2, hw - 2, 1, cp.acc);
      fill(c, cx - 1, hy - 3, 2, 2, cp.pri); // plume
      fill(c, hx, hy + 1, hw, 1, cp.metal); // visor
      break;
    case "druid":
      // Antler crown
      dot(c, hx + 2, hy - 3, cp.acc);
      dot(c, hx + 1, hy - 2, cp.acc);
      dot(c, hx + hw - 3, hy - 3, cp.acc);
      dot(c, hx + hw - 2, hy - 2, cp.acc);
      fill(c, hx, hy - 1, hw, 1, cp.pri);
      dot(c, cx, hy - 2, cp.acc);
      break;
    case "rogue":
      fill(c, hx + 1, hy - 2, hw - 2, 2, cp.pri);
      fill(c, hx, hy - 1, hw, 1, cp.sec);
      dot(c, hx + hw - 2, hy - 2, cp.acc); // feather
      dot(c, hx + hw - 1, hy - 3, cp.acc);
      break;
  }
}

export function drawEquipmentWeapon(c: PixelData, cls: CharacterClass, bp: BP, cp: CP) {
  const rx = bp.aRx + bp.aW;

  switch (cls) {
    case "wizard": // Staff with orb
      for (let i = 0; i < 14; i++) dot(c, rx + 1, bp.aY - 3 + i, cp.sec);
      fill(c, rx, bp.aY - 4, 3, 3, cp.acc);
      dot(c, rx + 1, bp.aY - 3, cp.pri);
      break;
    case "knight": // Broadsword
      for (let i = 0; i < 10; i++) {
        dot(c, rx + 1 + Math.floor(i / 2), bp.aY - 1 - i, cp.metal);
        dot(c, rx + Math.floor(i / 2), bp.aY - i, "#e0e0e8");
      }
      // Crossguard
      fill(c, rx - 1, bp.aY, 4, 1, cp.acc);
      dot(c, rx + 1, bp.aY + 1, cp.sec); // handle
      dot(c, rx + 1, bp.aY + 2, cp.sec);
      break;
    case "druid": // Nature staff with leaves
      for (let i = 0; i < 12; i++) dot(c, rx + 1, bp.aY - 2 + i, cp.sec);
      dot(c, rx, bp.aY - 2, cp.acc);
      dot(c, rx + 2, bp.aY - 2, cp.acc);
      dot(c, rx, bp.aY - 3, cp.acc);
      dot(c, rx + 2, bp.aY - 3, cp.acc);
      break;
    case "rogue": // Twin daggers
      for (let i = 0; i < 5; i++) dot(c, rx + 1 + i, bp.aY + 1 - i, cp.metal);
      dot(c, rx + 1, bp.aY + 2, cp.sec); // handle
      // Second dagger (left hand)
      const lx = bp.aLx - 1;
      for (let i = 0; i < 4; i++) dot(c, lx - i, bp.aY + 1 - i, cp.metal);
      dot(c, lx, bp.aY + 2, cp.sec);
      break;
  }
}

export function drawEquipmentShield(c: PixelData, bp: BP, cp: CP) {
  const sx = bp.aLx - 4;
  const sy = bp.aY + 1;
  fill(c, sx, sy, 4, 5, cp.pri);
  outline(c, sx, sy, 4, 5, cp.metal);
  fill(c, sx + 1, sy + 1, 2, 1, cp.acc); // emblem top
  dot(c, sx + 1, sy + 2, cp.acc);
  dot(c, sx + 2, sy + 2, cp.acc);
  dot(c, sx + 1, sy + 3, cp.sec);
  dot(c, sx + 2, sy + 3, cp.sec);
}

export function drawEquipmentCape(c: PixelData, bp: BP, cp: CP) {
  const lx = bp.tX - 2;
  const rx = bp.tX + bp.tW;
  const startY = bp.shY;
  const len = bp.tH + 5;
  for (let i = 0; i < len; i++) {
    fill(c, lx - (i > len - 3 ? 1 : 0), startY + i, 2, 1, i < len - 2 ? cp.pri : cp.sec);
    fill(c, rx + (i > len - 3 ? 0 : 0), startY + i, 2, 1, i < len - 2 ? cp.pri : cp.sec);
  }
  // Cape inner shimmer
  for (let i = 2; i < len - 2; i += 2) {
    dot(c, lx + 1, startY + i, cp.acc);
    dot(c, rx, startY + i, cp.acc);
  }
}

export function drawEquipmentArmor(c: PixelData, bp: BP, cp: CP) {
  const { tX, tY, tW, tH } = bp;
  const midX = tX + Math.floor(tW / 2);
  // Overlay shoulder plates
  fill(c, bp.shX, bp.shY, 3, 2, cp.metal);
  fill(c, bp.shX + bp.shW - 3, bp.shY, 3, 2, cp.metal);
  // Chest overlay
  fill(c, tX + 1, tY + 1, tW - 2, tH - 2, cp.pri);
  outline(c, tX + 1, tY + 1, tW - 2, tH - 2, cp.metal);
  // Emblem
  dot(c, midX - 1, tY + 2, cp.acc);
  dot(c, midX, tY + 2, cp.acc);
  dot(c, midX - 1, tY + 3, cp.acc);
  dot(c, midX, tY + 3, cp.acc);
}

export function drawEquipmentFamiliar(c: PixelData, type: string, cp: CP) {
  const fx = 23, fy = 22;
  switch (type) {
    case "cat":
      dot(c, fx, fy, cp.pri); dot(c, fx + 3, fy, cp.pri);
      fill(c, fx, fy + 1, 4, 2, cp.pri);
      dot(c, fx + 1, fy + 1, "#111"); dot(c, fx + 2, fy + 1, "#111");
      fill(c, fx, fy + 3, 4, 2, cp.pri);
      dot(c, fx + 4, fy + 2, cp.sec); dot(c, fx + 5, fy + 1, cp.sec); // tail
      break;
    case "owl":
      fill(c, fx, fy, 4, 1, cp.sec);
      fill(c, fx, fy + 1, 4, 3, cp.pri);
      dot(c, fx + 1, fy + 1, cp.acc); dot(c, fx + 2, fy + 1, cp.acc);
      dot(c, fx + 1, fy + 2, "#111"); dot(c, fx + 2, fy + 2, "#111");
      fill(c, fx + 1, fy + 4, 2, 1, cp.sec);
      break;
    case "baby_dragon": case "phoenix":
      dot(c, fx, fy, cp.acc); dot(c, fx + 4, fy, cp.acc);
      fill(c, fx, fy + 1, 5, 3, cp.pri);
      dot(c, fx + 1, fy + 1, "#cc0"); dot(c, fx + 3, fy + 1, "#cc0");
      fill(c, fx + 1, fy + 4, 1, 1, cp.pri);
      fill(c, fx + 3, fy + 4, 1, 1, cp.pri);
      dot(c, fx + 5, fy + 2, cp.acc); // wing
      dot(c, fx + 5, fy + 3, cp.acc);
      break;
    default:
      dot(c, fx, fy, cp.acc); dot(c, fx + 3, fy, cp.acc);
      fill(c, fx, fy + 1, 4, 2, cp.pri);
      dot(c, fx + 1, fy + 1, "#111"); dot(c, fx + 2, fy + 1, "#111");
      fill(c, fx, fy + 3, 4, 1, cp.sec);
      dot(c, fx + 4, fy + 2, cp.sec);
      break;
  }
}

// ─── MAIN RENDER ───

export function renderCharacter(config: AvatarConfig, characterClass: CharacterClass): PixelData {
  const c = canvas();
  const shape = ((config as any).body_shape ?? "normal") as BodyShape;
  const eyeSlug = (config as any).eye_color ?? "dark";
  const skin = SKIN_PALETTE[config.body_color] ?? SKIN_PALETTE.light;
  const eye = EYE_COLORS[eyeSlug] ?? EYE_COLORS.dark;
  const hairCol = config.hair_color ? HAIR_PALETTE[config.hair_color] ?? HAIR_PALETTE.brown : null;
  const cp = CLASS_PALETTE[characterClass];
  const bp = BP_MAP[shape] ?? BP_MAP.normal;

  if (config.cape) drawEquipmentCape(c, bp, cp);
  drawBody(c, bp, skin.main, skin.shadow, skin.hi, skin.outline, eye);
  drawOutfit(c, characterClass, bp, cp);
  if (config.armor) drawEquipmentArmor(c, bp, cp);
  if (config.hair_style && hairCol) drawHair(c, config.hair_style, bp, hairCol.main, hairCol.shadow, hairCol.hi);
  if (config.hat) drawEquipmentHat(c, characterClass, bp, cp);
  if (config.shield && characterClass === "knight") drawEquipmentShield(c, bp, cp);
  if (config.weapon) drawEquipmentWeapon(c, characterClass, bp, cp);
  if (config.familiar) drawEquipmentFamiliar(c, config.familiar, cp);

  return c;
}

/** Render only the head area (for hair/face thumbnails) */
export function renderHead(config: AvatarConfig, characterClass: CharacterClass): PixelData {
  const full = renderCharacter(config, characterClass);
  const shape = ((config as any).body_shape ?? "normal") as BodyShape;
  const bp = BP_MAP[shape] ?? BP_MAP.normal;
  const startY = Math.max(0, bp.hy - 7);
  const headSize = 16;
  const head: PixelData = Array.from({ length: headSize }, (_, row) =>
    Array.from({ length: headSize }, (_, col) => {
      const srcX = bp.hx - 2 + col;
      const srcY = startY + row;
      return srcX >= 0 && srcX < GRID && srcY >= 0 && srcY < GRID ? full[srcY][srcX] : null;
    })
  );
  return head;
}

/** Render only the body silhouette (for shape thumbnails) */
export function renderSilhouette(shape: BodyShape): PixelData {
  const config: AvatarConfig = {
    body_color: "light", body_shape: shape, hair_style: null, hair_color: null,
    hat: null, armor: null, cape: null, weapon: null, shield: null, familiar: null,
  };
  return renderCharacter(config, "wizard");
}

// Backward compat
export { SKIN_PALETTE as SKIN_COLORS };
export const HAIR_HEX = Object.fromEntries(
  Object.entries(HAIR_PALETTE).map(([k, v]) => [k, { main: v.main, shadow: v.shadow }])
);
export const CLASS_PALETTES = Object.fromEntries(
  Object.entries(CLASS_PALETTE).map(([k, v]) => [k, { primary: v.pri, secondary: v.sec, accent: v.acc }])
) as Record<CharacterClass, { primary: string; secondary: string; accent: string }>;
