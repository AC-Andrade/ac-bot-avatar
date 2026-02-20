import type { EyeType } from '@ac-andrade/ac-bot-avatar-core';
import React from 'react';
import { BlinkEye } from './blink';
import { ChordsEye } from './chords';
import { ClosedEye } from './closed';
import { CryLaughEye } from './cry_laugh';
import { GlassesEye } from './glasses';
import { GlowEye } from './glow';
import { HeartEye } from './heart';
import { LaughEye } from './laugh';
import { LoveEye } from './love';
import { MischiefEye } from './mischief';
import { MusicEye } from './music';
import { NormalEye } from './normal';
import { SquintEye } from './squint';
import { StarEye } from './star';
import { SunglassesEye } from './sunglasses';
import { SurprisedEye } from './surprised';
import { TalkingEye } from './talking';

export const eyesMap: Record<EyeType, React.ComponentType<React.SVGProps<SVGGElement>>> = {
  'blink': BlinkEye,
  'chords': ChordsEye,
  'closed': ClosedEye,
  'cry_laugh': CryLaughEye,
  'glasses': GlassesEye,
  'glow': GlowEye,
  'heart': HeartEye,
  'laugh': LaughEye,
  'love': LoveEye,
  'mischief': MischiefEye,
  'music': MusicEye,
  'normal': NormalEye,
  'squint': SquintEye,
  'star': StarEye,
  'sunglasses': SunglassesEye,
  'surprised': SurprisedEye,
  'talking': TalkingEye,
};
