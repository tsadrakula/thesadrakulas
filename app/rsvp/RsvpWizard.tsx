"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Monogram } from "@/components/Monogram";
import { SITE } from "@/content/site";
import type { Party } from "@/lib/rsvp/schema";
import { lookupParties, submitRsvp } from "./actions";

type Answer = {
  rowIndex: number;
  firstName: string;
  lastName: string;
  relationship: Party["members"][number]["relationship"];
  attending: "yes" | "no" | null;
  meal: "chicken" | "pork" | "vegetarian" | null;
  dietary: string;
};

const MEAL_OPTIONS = [
  { key: "chicken" as const, label: "Chicken", sub: "" },
  { key: "pork" as const, label: "Pork", sub: "" },
  { key: "vegetarian" as const, label: "Vegetarian", sub: "" },
];

const TOTAL_STEPS = 5;
const ease = [0.16, 1, 0.3, 1] as const;

function fadeKey(reduce: boolean | null) {
  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 },
    };
  }
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.45, ease },
  };
}

export function RsvpWizard() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Party[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [note, setNote] = useState("");
  const [partyDietary, setPartyDietary] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setMatches([]);
      setSearchError(null);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      lookupParties(q)
        .then((results) => {
          setMatches(results);
          setSearchError(null);
        })
        .catch(() => setSearchError("Search is unavailable. Please try again in a moment."))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const anyAttending = useMemo(
    () => answers.some((a) => a.attending === "yes"),
    [answers],
  );

  const selectParty = (p: Party) => {
    setParty(p);
    setAnswers(
      p.members.map((m) => ({
        rowIndex: m.rowIndex,
        firstName: m.firstName,
        lastName: m.lastName,
        relationship: m.relationship,
        attending: null,
        meal: null,
        dietary: "",
      })),
    );
    setStep(1);
  };

  const updateAnswer = (i: number, patch: Partial<Answer>) => {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  };

  const canAdvance = () => {
    if (step === 0) return party !== null;
    if (step === 1) return true;
    if (step === 2) return answers.length > 0 && answers.every((a) => a.attending !== null);
    if (step === 3) return answers.filter((a) => a.attending === "yes").every((a) => a.meal !== null);
    return true;
  };

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = () => {
    if (!party) return;
    setSubmitError(null);
    startTransition(async () => {
      const res = await submitRsvp({
        partyId: party.partyId,
        noteToCouple: note || null,
        answers: answers.map((a) => ({
          rowIndex: a.rowIndex,
          attending: a.attending!,
          meal: a.attending === "yes" ? a.meal : null,
          dietary: a.attending === "yes" ? a.dietary || partyDietary || null : null,
        })),
      });
      if (res.ok) {
        setSubmitted(true);
        setStep(TOTAL_STEPS);
      } else {
        setSubmitError(res.error);
      }
    });
  };

  return (
    <div className="rsvp-wrap">
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="eyebrow" style={{ color: "var(--muted)", marginBottom: 16 }}>
          Kindly Respond
        </div>
        <h1
          className="display"
          style={{
            fontSize: "clamp(56px, 9vw, 120px)",
            lineHeight: 0.9,
            marginBottom: 16,
          }}
        >
          Search for your{" "}
          <span className="script" style={{ fontSize: "1.4em" }}>
            invitation.
          </span>
        </h1>
        <p
          className="italic"
          style={{
            color: "var(--muted)",
            fontSize: 18,
            maxWidth: 540,
            margin: "0 auto",
          }}
        >
          The favour of your reply is requested by {SITE.rsvpDeadlineDisplay}.
        </p>
      </div>

      <div className="rsvp-card">
        {step < TOTAL_STEPS && (
          <div className="rsvp-step-label">
            Step {String(Math.min(step + 1, TOTAL_STEPS)).padStart(2, "0")} of{" "}
            {String(TOTAL_STEPS).padStart(2, "0")}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="search" {...fadeKey(reduce)}>
              <h2 className="rsvp-title">
                Find your{" "}
                <span className="script" style={{ fontSize: "1.5em" }}>
                  name.
                </span>
              </h2>
              <div className="field">
                <label htmlFor="rsvp-search">Type your first or last name</label>
                <input
                  id="rsvp-search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="E.g. Sadrakula, or Sydney"
                  autoComplete="off"
                />
              </div>
              <div style={{ marginTop: 8 }}>
                {searchError ? (
                  <p
                    className="italic"
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      fontSize: 15,
                      padding: "20px 0",
                    }}
                  >
                    {searchError}
                  </p>
                ) : query.trim().length < 2 ? (
                  <div
                    style={{
                      marginTop: 16,
                      fontFamily: "var(--ff-serif)",
                      fontStyle: "italic",
                      color: "var(--muted)",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    Begin typing to find your invitation.
                  </div>
                ) : searching ? (
                  <div
                    style={{
                      padding: "20px 0",
                      fontFamily: "var(--ff-serif)",
                      fontStyle: "italic",
                      color: "var(--muted)",
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    Searching…
                  </div>
                ) : matches.length > 0 ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    {matches.map((m) => {
                      const names = m.members
                        .map((g) => `${g.firstName} ${g.lastName}`)
                        .join(" & ");
                      if (m.submitted) {
                        return (
                          <div
                            key={m.partyId}
                            className="invite-result is-responded"
                            aria-disabled="true"
                            title="This party has already responded."
                          >
                            <div>
                              <div className="invite-result-name">{names}</div>
                              <div className="invite-result-sub">Already responded</div>
                            </div>
                            <span className="invite-result-arrow">✓</span>
                          </div>
                        );
                      }
                      return (
                        <button
                          key={m.partyId}
                          type="button"
                          onClick={() => selectParty(m)}
                          className="invite-result"
                        >
                          <div>
                            <div className="invite-result-name">{names}</div>
                            <div className="invite-result-sub">
                              {m.members.length === 1
                                ? "One guest"
                                : `${m.members.length} guests`}
                            </div>
                          </div>
                          <span className="invite-result-arrow">→</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "20px 0",
                      fontFamily: "var(--ff-serif)",
                      fontStyle: "italic",
                      color: "var(--muted)",
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    No invitation found. Please check the spelling, or contact the couple directly.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 1 && party && (
            <motion.div key="confirm" {...fadeKey(reduce)}>
              <h2 className="rsvp-title">
                Is this{" "}
                <span className="script" style={{ fontSize: "1.5em" }}>
                  you?
                </span>
              </h2>
              <div
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--hairline)",
                  padding: 32,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                <div
                  className="eyebrow"
                  style={{ color: "var(--muted)", marginBottom: 16 }}
                >
                  The Invitation
                </div>
                {answers.map((a) => (
                  <div
                    key={a.rowIndex}
                    style={{
                      fontFamily: "var(--ff-script)",
                      fontSize: 56,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {a.firstName} {a.lastName}
                    {a.relationship === "plus-one" && (
                      <span
                        className="eyebrow"
                        style={{
                          display: "block",
                          marginTop: 4,
                          color: "var(--muted)",
                          fontSize: 9,
                        }}
                      >
                        Plus-one
                      </span>
                    )}
                  </div>
                ))}
                <div
                  className="eyebrow"
                  style={{ color: "var(--muted)", marginTop: 20 }}
                >
                  Reserved for {answers.length === 1 ? "one" : answers.length}
                </div>
              </div>
              <p
                className="italic"
                style={{
                  textAlign: "center",
                  color: "var(--muted)",
                  fontSize: 15,
                  marginTop: 20,
                }}
              >
                Not you?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setParty(null);
                    setAnswers([]);
                    setStep(0);
                    setQuery("");
                  }}
                  style={{
                    color: "var(--ink)",
                    textDecoration: "underline",
                    font: "inherit",
                  }}
                >
                  Search again
                </button>
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="attending" {...fadeKey(reduce)}>
              <h2 className="rsvp-title">
                Will you be{" "}
                <span className="script" style={{ fontSize: "1.5em" }}>
                  joining
                </span>{" "}
                us?
              </h2>
              <div style={{ display: "grid", gap: 28 }}>
                {answers.map((g, i) => (
                  <div key={g.rowIndex}>
                    {answers.length > 1 && (
                      <div
                        className="eyebrow"
                        style={{
                          color: "var(--muted)",
                          marginBottom: 12,
                          textAlign: "center",
                        }}
                      >
                        For {g.firstName}
                        {g.relationship === "plus-one" && " (plus-one)"}
                      </div>
                    )}
                    <div className="choice-row">
                      <button
                        type="button"
                        className={"choice" + (g.attending === "yes" ? " selected" : "")}
                        onClick={() => updateAnswer(i, { attending: "yes" })}
                      >
                        <span className="italic">Joyfully</span> accepts
                        <span className="sub">Will attend</span>
                      </button>
                      <button
                        type="button"
                        className={"choice" + (g.attending === "no" ? " selected" : "")}
                        onClick={() =>
                          updateAnswer(i, { attending: "no", meal: null, dietary: "" })
                        }
                      >
                        <span className="italic">Regretfully</span> declines
                        <span className="sub">With love, from afar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="meals" {...fadeKey(reduce)}>
              <h2 className="rsvp-title">
                Choice of{" "}
                <span className="script" style={{ fontSize: "1.5em" }}>
                  dinner.
                </span>
              </h2>
              {!anyAttending ? (
                <p
                  className="italic"
                  style={{ textAlign: "center", color: "var(--muted)", fontSize: 17 }}
                >
                  No meals to select — we'll miss you. Please continue.
                </p>
              ) : (
                <div style={{ display: "grid", gap: 32 }}>
                  {answers.map(
                    (g, i) =>
                      g.attending === "yes" && (
                        <div key={g.rowIndex}>
                          {answers.filter((x) => x.attending === "yes").length > 1 && (
                            <div
                              className="eyebrow"
                              style={{
                                color: "var(--muted)",
                                marginBottom: 12,
                                textAlign: "center",
                              }}
                            >
                              For {g.firstName}
                            </div>
                          )}
                          <div
                            className="choice-row"
                            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                          >
                            {MEAL_OPTIONS.map((m) => (
                              <button
                                key={m.key}
                                type="button"
                                className={"choice" + (g.meal === m.key ? " selected" : "")}
                                onClick={() => updateAnswer(i, { meal: m.key })}
                              >
                                <span className="italic">{m.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ),
                  )}
                  <div className="field" style={{ marginTop: 8, marginBottom: 0 }}>
                    <label htmlFor="rsvp-dietary">Dietary notes (optional)</label>
                    <input
                      id="rsvp-dietary"
                      value={partyDietary}
                      onChange={(e) => setPartyDietary(e.target.value)}
                      placeholder="Allergies, restrictions, etc."
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="note" {...fadeKey(reduce)}>
              <h2 className="rsvp-title">
                One last{" "}
                <span className="script" style={{ fontSize: "1.5em" }}>
                  thing.
                </span>
              </h2>
              <div className="field">
                <label htmlFor="rsvp-note">A note to the couple (optional)</label>
                <textarea
                  id="rsvp-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="A well-wish, a toast, an inside joke…"
                />
              </div>
              {submitError && (
                <p
                  className="italic"
                  style={{
                    color: "#7c2d12",
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  {submitError}
                </p>
              )}
            </motion.div>
          )}

          {step === TOTAL_STEPS && submitted && (
            <motion.div key="success" {...fadeKey(reduce)}>
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  className="eyebrow"
                  style={{ color: "var(--muted)", marginBottom: 24 }}
                >
                  Reply Received
                </div>
                <h2
                  style={{
                    fontFamily: "var(--ff-script)",
                    fontSize: 96,
                    lineHeight: 0.9,
                    marginBottom: 20,
                  }}
                >
                  Thank you.
                </h2>
                <p
                  className="italic"
                  style={{
                    color: "var(--muted)",
                    fontSize: 18,
                    maxWidth: 440,
                    margin: "0 auto 8px",
                  }}
                >
                  {anyAttending
                    ? "We can't wait to celebrate with you."
                    : "You will be missed — thank you for letting us know."}
                </p>
                <div style={{ marginTop: 32 }}>
                  <Monogram size={36} color="var(--muted)" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < TOTAL_STEPS && (
          <div className="rsvp-dots" style={{ marginTop: 36 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span key={i} className={i === step ? "on" : ""} />
            ))}
          </div>
        )}

        {step > 0 && step < TOTAL_STEPS && (
          <div className="rsvp-nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={back}
              disabled={isPending}
            >
              ← Back
            </button>
            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                className="btn btn-solid"
                onClick={next}
                disabled={!canAdvance()}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-solid"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? "Sending…" : "Send Reply"}
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <Monogram size={44} color="var(--muted)" />
      </div>
    </div>
  );
}
