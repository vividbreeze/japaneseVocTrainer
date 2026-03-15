import type { VocabEntry, TopicId } from "./types";

import { directions } from "./topics/directions";
import { restaurant } from "./topics/restaurant";
import { shop } from "./topics/shop";
import { meetingPeople } from "./topics/meeting-people";
import { museum } from "./topics/museum";
import { hotel } from "./topics/hotel";
import { airport } from "./topics/airport";
import { trainStation } from "./topics/train-station";
import { clothing } from "./topics/clothing";
import { doctorHospital } from "./topics/doctor-hospital";
import { smallTalk } from "./topics/small-talk";
import { numbersCounters } from "./topics/numbers-counters";
import { timeDate } from "./topics/time-date";
import { family } from "./topics/family";
import { emotions } from "./topics/emotions";
import { weather } from "./topics/weather";

export const ALL_VOCAB: VocabEntry[] = [
  ...directions,
  ...restaurant,
  ...shop,
  ...meetingPeople,
  ...museum,
  ...hotel,
  ...airport,
  ...trainStation,
  ...clothing,
  ...doctorHospital,
  ...smallTalk,
  ...numbersCounters,
  ...timeDate,
  ...family,
  ...emotions,
  ...weather,
];

export const VOCAB_BY_TOPIC: Record<TopicId, VocabEntry[]> = {
  directions,
  restaurant,
  shop,
  "meeting-people": meetingPeople,
  museum,
  hotel,
  airport,
  "train-station": trainStation,
  clothing,
  "doctor-hospital": doctorHospital,
  "small-talk": smallTalk,
  "numbers-counters": numbersCounters,
  "time-date": timeDate,
  family,
  emotions,
  weather,
};

export type { VocabEntry, TopicId } from "./types";
