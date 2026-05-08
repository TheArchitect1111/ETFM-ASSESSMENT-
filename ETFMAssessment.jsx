import { useState, useEffect, useRef } from "react";

const LOGO_URL = "https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png";

const C = {
  bg: "#f7f4ef",
  dark: "#1a1a2e",
  gold: "#c9973a",
  goldLight: "#f0c97a",
  goldSoft: "#c9973a18",
  text: "#1a1a2e",
  muted: "#7a7a8a",
  border: "#e8e3da",
  white: "#ffffff",
  amber: "#b45309",
};

const QUESTIONS = [
  {
    id: "emotional_state",
    bot: "How would you describe your current relationship with money right now?",
    subtext: "There's no right or wrong answer here — just be honest with yourself.",
    options: [
      { label: "Stressed and overwhelmed", value: "stressed", tone: "high_stress" },
      { label: "Stuck — I know something needs to change but I don't know where to start", value: "stuck", tone: "stuck" },
      { label: "Avoidant — I try not to think about it too much", value: "avoidant", tone: "avoidant" },
      { label: "Uncertain — I'm doing okay but I'm not confident", value: "uncertain", tone: "uncertain" },
      { label: "Motivated but lost — I want to do better but I'm unclear on how", value: "motivated_lost", tone: "motivated" },
      { label: "In control and building — I have structure and I'm growing", value: "in_control", tone: "growth" },
    ],
  },
  {
    id: "money_flow",
    bot: "When money comes in, what typically happens next?",
    subtext: "Think about your actual patterns, not what you wish would happen.",
    options: [
      { label: "It goes to bills and I deal with what's left", value: "reactive_bills", tone: "reactive" },
      { label: "It disappears faster than I expect", value: "disappears", tone: "reactive" },
      { label: "I have a rough idea of where it goes but no real system", value: "rough_idea", tone: "awareness" },
      { label: "I follow a loose budget or plan most of the time", value: "loose_plan", tone: "structure" },
      { label: "I have a clear system — savings, bills, and goals are organized", value: "clear_system", tone: "structured" },
    ],
  },
  {
    id: "habits",
    bot: "How would you describe your financial habits and consistency?",
    subtext: "Habits are patterns — not character flaws. Honesty here creates clarity.",
    options: [
      { label: "I often make decisions in the moment without a plan", value: "impulsive", tone: "impulsive" },
      { label: "I start strong but struggle to maintain consistency", value: "inconsistent", tone: "inconsistent" },
      { label: "I avoid dealing with finances until I have to", value: "avoidant_habits", tone: "avoidant" },
      { label: "I'm somewhat consistent but have gaps I haven't addressed", value: "partial", tone: "partial" },
      { label: "I'm fairly disciplined and consistent with my financial routines", value: "disciplined", tone: "disciplined" },
    ],
  },
  {
    id: "mindset",
    bot: "When you think about building financial stability, what comes up for you most?",
    subtext: "Our beliefs about money often shape our behavior more than our income does.",
    options: [
      { label: "It feels out of reach — like it's not really possible for someone like me", value: "hopeless", tone: "scarcity" },
      { label: "Fear of failing or making the wrong move keeps me stuck", value: "fear", tone: "fear" },
      { label: "I didn't grow up learning this — I'm still figuring it out", value: "learned", tone: "learning" },
      { label: "I believe it's possible but I'm not sure I have what it takes", value: "uncertain_belief", tone: "uncertain" },
      { label: "I'm confident it's possible — I just need the right system and direction", value: "confident", tone: "confident" },
    ],
  },
  {
    id: "obstacle",
    bot: "What feels like your biggest obstacle to financial progress right now?",
    subtext: "Sometimes naming it clearly is the first step to moving past it.",
    options: [
      { label: "Not enough income to work with", value: "income", tone: "income" },
      { label: "Debt that feels impossible to get ahead of", value: "debt", tone: "debt" },
      { label: "Disorganization — I don't have a clear system", value: "disorganized", tone: "structure" },
      { label: "Stress and overwhelm that makes it hard to think clearly", value: "stress", tone: "stress" },
      { label: "Lack of knowledge — I don't know enough about how it all works", value: "knowledge", tone: "education" },
      { label: "Inconsistency — I start but don't follow through", value: "inconsistency", tone: "behavior" },
      { label: "External pressure — family, emergencies, or circumstances outside my control", value: "external", tone: "external" },
    ],
  },
  {
    id: "strengths",
    bot: "Before we look at your results — what's one thing you know you have going for you?",
    subtext: "Every financial journey has assets. Let's identify yours.",
    options: [
      { label: "I'm resilient — I've survived and kept going through hard times", value: "resilient", tone: "resilient" },
      { label: "I'm resourceful — I figure things out even with limited resources", value: "resourceful", tone: "resourceful" },
      { label: "I'm motivated — I genuinely want to change and I'm willing to put in the work", value: "motivated", tone: "motivated" },
      { label: "I'm disciplined in other areas of my life — I can apply that here", value: "disciplined", tone: "disciplined" },
      { label: "I have people around me who support my growth", value: "support", tone: "support" },
      { label: "I'm already taking steps — I'm not starting from zero<span class="ml-2" /><span class="inline-block w-3 h-3 rounded-full bg-neutral-a12 align-middle mb-[0.1rem]" />
