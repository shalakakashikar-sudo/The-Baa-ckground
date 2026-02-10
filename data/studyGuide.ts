
import { LearningModule } from '../types';
import { foundation } from './modules/foundation';
import { phrase } from './modules/phrase';
import { place } from './modules/place';
import { atVsIn } from './modules/atVsIn';
import { time } from './modules/time';
import { sinceVsFor } from './modules/sinceVsFor';
import { movement } from './modules/movement';
import { dynamic } from './modules/dynamic';
import { manner } from './modules/manner';
import { purpose } from './modules/purpose';
import { beside } from './modules/beside';
import { phrasalVerbs } from './modules/phrasalVerbs';
import { collocations } from './modules/collocations';
import { zero } from './modules/zero';
import { regional } from './modules/regional';
import { nuances } from './modules/nuances';
import { mistakes } from './modules/mistakes';
import { logic } from './modules/logic';

// The Exhaustive 18-Part Curriculum
export const studyGuide: LearningModule[] = [
  foundation,     // Part 1
  phrase,         // Part 2
  place,          // Part 3
  atVsIn,         // Part 4
  time,           // Part 5
  sinceVsFor,     // Part 6
  movement,       // Part 7
  dynamic,        // Part 8
  manner,         // Part 9
  purpose,        // Part 10
  beside,         // Part 11
  phrasalVerbs,   // Part 12
  collocations,   // Part 13
  zero,           // Part 14
  regional,       // Part 15
  nuances,        // Part 16
  mistakes,       // Part 17
  logic           // Part 18
];
