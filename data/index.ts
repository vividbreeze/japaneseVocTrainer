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
import { coreN5 } from "./topics/core-n5";
import { coreN5Part2 } from "./topics/core-n5-2";

/** All vocabulary entries across all topics */
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
  // Core N5 words distributed across topics
  ...coreN5,
  ...coreN5Part2,
];

/** Vocabulary grouped by topic — computed from ALL_VOCAB so extra entries
 *  in core-n5.ts automatically appear in the correct topic's pool. */
export const VOCAB_BY_TOPIC: Record<TopicId, VocabEntry[]> = {
  directions: ALL_VOCAB.filter((e) => e.topicId === "directions"),
  restaurant: ALL_VOCAB.filter((e) => e.topicId === "restaurant"),
  shop: ALL_VOCAB.filter((e) => e.topicId === "shop"),
  "meeting-people": ALL_VOCAB.filter((e) => e.topicId === "meeting-people"),
  museum: ALL_VOCAB.filter((e) => e.topicId === "museum"),
  hotel: ALL_VOCAB.filter((e) => e.topicId === "hotel"),
  airport: ALL_VOCAB.filter((e) => e.topicId === "airport"),
  "train-station": ALL_VOCAB.filter((e) => e.topicId === "train-station"),
  clothing: ALL_VOCAB.filter((e) => e.topicId === "clothing"),
  "doctor-hospital": ALL_VOCAB.filter((e) => e.topicId === "doctor-hospital"),
  "small-talk": ALL_VOCAB.filter((e) => e.topicId === "small-talk"),
  "numbers-counters": ALL_VOCAB.filter((e) => e.topicId === "numbers-counters"),
  "time-date": ALL_VOCAB.filter((e) => e.topicId === "time-date"),
  family: ALL_VOCAB.filter((e) => e.topicId === "family"),
  emotions: ALL_VOCAB.filter((e) => e.topicId === "emotions"),
  weather: ALL_VOCAB.filter((e) => e.topicId === "weather"),
};

export type { VocabEntry, TopicId } from "./types";
