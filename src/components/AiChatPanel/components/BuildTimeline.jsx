import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  Sparkles,
} from "lucide-react";
import { StepIcon } from "../lib/stepIcons";
import cls from "../styles.module.scss";

/** Small status glyph shown on the right of each step row. */
const StatusGlyph = ({ status }) => {
  if (status === "started")
    return <Loader2 size={14} className={cls.spin} aria-label="in progress" />;
  if (status === "done")
    return <CheckCircle2 size={14} className={cls.statusDone} />;
  if (status === "skipped")
    return <MinusCircle size={14} className={cls.statusSkipped} />;
  if (status === "failed")
    return <AlertTriangle size={14} className={cls.statusFailed} />;
  return null;
};

const StepRow = ({ step }) => {
  if (step.kind === "reasoning") {
    return (
      <div className={cls.reasoningRow}>
        <StepIcon icon={step.icon || "brain"} size={15} />
        <span className={cls.reasoningText}>{step.message}</span>
      </div>
    );
  }

  const nested = ["field", "relation", "items", "schema"].includes(step.action);

  return (
    <div className={`${cls.stepRow} ${nested ? cls.stepNested : ""}`}>
      <span className={cls.stepIcon}>
        <StepIcon icon={step.icon} size={15} />
      </span>
      <span className={cls.stepMessage}>{step.message}</span>
      {step.value && <span className={cls.stepValue}>{step.value}</span>}
      <span className={cls.stepStatus}>
        <StatusGlyph status={step.status} />
      </span>
    </div>
  );
};

const summaryCount = (summary) =>
  summary
    ? (summary.tables || 0) +
      (summary.fields || 0) +
      (summary.relations || 0) +
      (summary.menus || 0) +
      (summary.items || 0)
    : 0;

const SummaryCard = ({ summary, duration }) => {
  const parts = [
    summary.tables ? `${summary.tables} табл.` : null,
    summary.fields ? `${summary.fields} полей` : null,
    summary.relations ? `${summary.relations} связей` : null,
    summary.menus ? `${summary.menus} меню` : null,
    summary.items ? `${summary.items} записей` : null,
  ].filter(Boolean);
  if (typeof duration === "number") parts.push(`${duration} c`);
  return <div className={cls.summaryCard}>{parts.join(" · ")}</div>;
};

/** Renders the step timeline for one assistant turn (live or persisted). */
export const BuildTimeline = ({ run }) => {
  if (!run) return null;
  const { steps = [], error, summary, duration, active, provider } = run;

  // The timeline card is for *build work*. A plain conversational reply produces
  // only a provider line + a reasoning step + a zero-count summary — that should
  // show no card at all, just the message bubble.
  const hasActionStep = steps.some((s) => s.kind === "step");
  const hasCounts = summaryCount(summary) > 0;
  const hasBuild = hasActionStep || hasCounts || !!error;

  if (!active && !hasBuild) return null;

  const providerLabel =
    provider &&
    [provider.provider, provider.coder_model].filter(Boolean).join(" · ");

  return (
    <div className={cls.timeline}>
      {providerLabel && (
        <div className={cls.providerRow}>
          <StepIcon icon="cpu" size={14} />
          <span>{providerLabel}</span>
        </div>
      )}
      {steps.length === 0 && active && (
        <div className={cls.loadingRow}>
          <Sparkles size={15} className={cls.spin} />
          <span>Анализирую запрос…</span>
        </div>
      )}
      {steps.map((step) => (
        <StepRow key={step.id} step={step} />
      ))}
      {error && (
        <div className={cls.errorRow}>
          <StepIcon icon="alert-circle" size={15} />
          <span>{error}</span>
        </div>
      )}
      {hasCounts && <SummaryCard summary={summary} duration={duration} />}
    </div>
  );
};

export default BuildTimeline;
