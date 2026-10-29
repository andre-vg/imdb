"use client";

import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "@heroui/react";
import { cn } from "@heroui/styles";

import {
  DECADE_OPTIONS,
  GENRE_OPTIONS,
  MAX_SELECTED_GENRES,
  PACE_OPTIONS,
  REALITY_OPTIONS,
  RUNTIME_OPTIONS,
  TONE_OPTIONS,
  type BaseQuizOption,
  type DecadeId,
  type PaceId,
  type QuizDraft,
  type QuizStepId,
  type RealityId,
  type RuntimeId,
  type ToneId,
} from "@/utils/recommendation";

import QuizIcon from "./quiz-icons";

const OPTION_CARD_CLASSES =
  "flex w-full items-start gap-3 rounded-2xl border border-separator bg-surface p-4 text-left transition-colors hover:border-accent/50 data-[selected=true]:border-accent data-[selected=true]:bg-accent-soft/40 group-data-[selected=true]:border-accent group-data-[selected=true]:bg-accent-soft/40";

interface QuizOptionsProps {
  step: QuizStepId;
  draft: QuizDraft;
  onChange: (patch: Partial<QuizDraft>) => void;
}

interface RadioOptionProps<TValue extends string> {
  option: BaseQuizOption<TValue>;
}

function RadioOption<TValue extends string>({
  option,
}: RadioOptionProps<TValue>) {
  return (
    <Radio className="group w-full" value={option.value}>
      <Radio.Content className={OPTION_CARD_CLASSES}>
        <Radio.Control className="mt-0.5">
          <Radio.Indicator />
        </Radio.Control>

        <span className="min-w-0 flex-1">
          <span className="text-foreground flex items-center gap-2 text-sm font-semibold">
            <QuizIcon
              className="text-accent size-4 shrink-0"
              icon={option.icon}
            />
            {option.label}
          </span>

          {option.description && (
            <span className="text-muted mt-1 block text-xs leading-relaxed">
              {option.description}
            </span>
          )}
        </span>
      </Radio.Content>
    </Radio>
  );
}

interface CheckboxOptionProps {
  option: BaseQuizOption<number>;
  isDisabled: boolean;
}

function CheckboxOption({ option, isDisabled }: CheckboxOptionProps) {
  return (
    <Checkbox
      className="group w-full"
      isDisabled={isDisabled}
      value={String(option.value)}
    >
      <Checkbox.Content
        className={cn(OPTION_CARD_CLASSES, isDisabled && "opacity-45")}
      >
        <Checkbox.Control className="mt-0.5">
          <Checkbox.Indicator />
        </Checkbox.Control>

        <span className="text-foreground flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold">
          <QuizIcon
            className="text-accent size-4 shrink-0"
            icon={option.icon}
          />
          {option.label}
        </span>
      </Checkbox.Content>
    </Checkbox>
  );
}

export default function QuizOptions({
  step,
  draft,
  onChange,
}: QuizOptionsProps) {
  switch (step) {
    case "genres":
      return (
        <CheckboxGroup
          aria-label="Gêneros preferidos"
          className="grid gap-3 sm:grid-cols-2"
          onChange={(values) => onChange({ genres: values.map(Number) })}
          value={draft.genres.map(String)}
        >
          {GENRE_OPTIONS.map((option) => (
            <CheckboxOption
              isDisabled={
                draft.genres.length >= MAX_SELECTED_GENRES &&
                !draft.genres.includes(option.value)
              }
              key={option.value}
              option={option}
            />
          ))}
        </CheckboxGroup>
      );

    case "tone":
      return (
        <RadioGroup
          aria-label="Tom do filme"
          className="grid gap-3 sm:grid-cols-2"
          onChange={(value) => onChange({ tone: value as ToneId })}
          value={draft.tone ?? null}
        >
          {TONE_OPTIONS.map((option) => (
            <RadioOption key={option.value} option={option} />
          ))}
        </RadioGroup>
      );

    case "pace":
      return (
        <RadioGroup
          aria-label="Ritmo do filme"
          className="grid gap-3 sm:grid-cols-2"
          onChange={(value) => onChange({ pace: value as PaceId })}
          value={draft.pace ?? null}
        >
          {PACE_OPTIONS.map((option) => (
            <RadioOption key={option.value} option={option} />
          ))}
        </RadioGroup>
      );

    case "decade":
      return (
        <RadioGroup
          aria-label="Época do filme"
          className="grid gap-3 sm:grid-cols-2"
          onChange={(value) => onChange({ decade: value as DecadeId })}
          value={draft.decade ?? null}
        >
          {DECADE_OPTIONS.map((option) => (
            <RadioOption key={option.value} option={option} />
          ))}
        </RadioGroup>
      );

    case "runtime":
      return (
        <RadioGroup
          aria-label="Duração do filme"
          className="grid gap-3 sm:grid-cols-2"
          onChange={(value) => onChange({ runtime: value as RuntimeId })}
          value={draft.runtime ?? null}
        >
          {RUNTIME_OPTIONS.map((option) => (
            <RadioOption key={option.value} option={option} />
          ))}
        </RadioGroup>
      );

    case "reality":
      return (
        <RadioGroup
          aria-label="História real ou ficção"
          className="grid gap-3 sm:grid-cols-2"
          onChange={(value) => onChange({ reality: value as RealityId })}
          value={draft.reality ?? null}
        >
          {REALITY_OPTIONS.map((option) => (
            <RadioOption key={option.value} option={option} />
          ))}
        </RadioGroup>
      );
  }
}
