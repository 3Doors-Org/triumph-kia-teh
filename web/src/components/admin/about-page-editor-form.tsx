"use client";

import { useState } from "react";

import type { AboutPageContent } from "@/lib/about/about-page-types";
import { PATH_OF_PURPOSE_ICON_VALUES } from "@/lib/about/about-page-types";

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function joinLines(values: string[]): string {
  return values.join("\n");
}

export function AboutPageEditorForm({ initialContent }: { initialContent: AboutPageContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="space-y-10"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSaved(false);
        try {
          const response = await fetch("/api/v1/about-page", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          });
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
            fields?: Record<string, string>;
          };
          if (!response.ok) {
            const message =
              body.fields && Object.keys(body.fields).length > 0
                ? Object.entries(body.fields)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join("; ")
                : body.error ?? "Save failed.";
            throw new Error(message);
          }
          setSaved(true);
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Save failed.");
        } finally {
          setSaving(false);
        }
      }}
    >
      <EditorSection title="Hero">
        <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(v) => setContent({ ...content, hero: { ...content.hero, eyebrow: v } })} />
        <Field label="Name" value={content.hero.name} onChange={(v) => setContent({ ...content, hero: { ...content.hero, name: v } })} />
        <TextArea label="Intro" value={content.hero.intro} rows={4} onChange={(v) => setContent({ ...content, hero: { ...content.hero, intro: v } })} />
      </EditorSection>

      <EditorSection title="Path of purpose">
        <Field label="Eyebrow" value={content.journey.eyebrow} onChange={(v) => setContent({ ...content, journey: { ...content.journey, eyebrow: v } })} />
        <Field label="Title" value={content.journey.title} onChange={(v) => setContent({ ...content, journey: { ...content.journey, title: v } })} />
        <TextArea label="Subtitle" value={content.journey.subtitle} rows={2} onChange={(v) => setContent({ ...content, journey: { ...content.journey, subtitle: v } })} />
        <div className="space-y-4">
          <p className="text-sm font-medium">Milestones</p>
          {content.journey.milestones.map((milestone, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-(--color-muted) p-4">
              <div className="flex justify-between gap-2">
                <span className="text-xs text-(--color-muted-fg)">Milestone {index + 1}</span>
                <button
                  type="button"
                  className="text-xs text-red-700"
                  onClick={() =>
                    setContent({
                      ...content,
                      journey: {
                        ...content.journey,
                        milestones: content.journey.milestones.filter((_, i) => i !== index),
                      },
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <Field label="Year" value={milestone.year} onChange={(v) => updateMilestone(content, setContent, index, { year: v })} />
                <Field label="Title" value={milestone.title} onChange={(v) => updateMilestone(content, setContent, index, { title: v })} />
                <label className="grid gap-1 text-sm">
                  <span className="font-medium">Icon</span>
                  <select
                    value={milestone.icon}
                    className="rounded-md border border-(--color-muted) px-3 py-2"
                    onChange={(event) =>
                      updateMilestone(content, setContent, index, {
                        icon: event.target.value as AboutPageContent["journey"]["milestones"][number]["icon"],
                      })
                    }
                  >
                    {PATH_OF_PURPOSE_ICON_VALUES.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <TextArea label="Description" value={milestone.description} rows={3} onChange={(v) => updateMilestone(content, setContent, index, { description: v })} />
            </div>
          ))}
          <button
            type="button"
            className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
            onClick={() =>
              setContent({
                ...content,
                journey: {
                  ...content.journey,
                  milestones: [
                    ...content.journey.milestones,
                    { year: "", title: "", description: "", icon: "graduation-cap" },
                  ],
                },
              })
            }
          >
            Add milestone
          </button>
        </div>
      </EditorSection>

      <EditorSection title="Education">
        <Field label="Section eyebrow" value={content.education.sectionEyebrow} onChange={(v) => setEducation(content, setContent, { sectionEyebrow: v })} />
        <Field label="Section title" value={content.education.sectionTitle} onChange={(v) => setEducation(content, setContent, { sectionTitle: v })} />
        <TextArea label="Section subtitle" value={content.education.sectionSubtitle} rows={2} onChange={(v) => setEducation(content, setContent, { sectionSubtitle: v })} />
        <Field label="Institution" value={content.education.institution} onChange={(v) => setEducation(content, setContent, { institution: v })} />
        <Field label="Degree" value={content.education.degree} onChange={(v) => setEducation(content, setContent, { degree: v })} />
        <Field label="Period" value={content.education.period} onChange={(v) => setEducation(content, setContent, { period: v })} />
        <Field label="Location" value={content.education.location} onChange={(v) => setEducation(content, setContent, { location: v })} />
        <TextArea
          label="Focus areas (one per line)"
          value={joinLines(content.education.focusAreas)}
          rows={4}
          onChange={(v) => setEducation(content, setContent, { focusAreas: splitLines(v) })}
        />
        <ItemListEditor
          title={content.education.honorsHeading}
          onTitleChange={(v) => setEducation(content, setContent, { honorsHeading: v })}
          items={content.education.honors}
          onChange={(honors) => setEducation(content, setContent, { honors })}
        />
        <ItemListEditor
          title={content.education.leadershipHeading}
          onTitleChange={(v) => setEducation(content, setContent, { leadershipHeading: v })}
          items={content.education.leadership}
          onChange={(leadership) => setEducation(content, setContent, { leadership })}
        />
      </EditorSection>

      <EditorSection title="Institutional focus">
        <Field label="Practice label" value={content.institutional.practiceLabel} onChange={(v) => setInstitutional(content, setContent, { practiceLabel: v })} />
        <TextArea label="Practice intro" value={content.institutional.practiceIntro} rows={3} onChange={(v) => setInstitutional(content, setContent, { practiceIntro: v })} />
        {content.institutional.sections.map((section, index) => (
          <div key={index} className="space-y-2 rounded-lg border border-(--color-muted) p-4">
            <div className="flex justify-between">
              <span className="text-xs text-(--color-muted-fg)">Section {index + 1}</span>
              <button
                type="button"
                className="text-xs text-red-700"
                onClick={() =>
                  setInstitutional(content, setContent, {
                    sections: content.institutional.sections.filter((_, i) => i !== index),
                  })
                }
              >
                Remove
              </button>
            </div>
            <Field label="Heading" value={section.heading} onChange={(v) => updateInstitutionalSection(content, setContent, index, { heading: v })} />
            <TextArea
              label="Paragraphs (blank line between paragraphs)"
              value={section.paragraphs.join("\n\n")}
              rows={5}
              onChange={(v) =>
                updateInstitutionalSection(content, setContent, index, {
                  paragraphs: v.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
                })
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="rounded-md border border-(--color-muted) px-3 py-2 text-sm"
          onClick={() =>
            setInstitutional(content, setContent, {
              sections: [...content.institutional.sections, { heading: "", paragraphs: [""] }],
            })
          }
        >
          Add section
        </button>
      </EditorSection>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {saved ? <p className="text-sm text-(--color-accent)">Saved. Public /about will update shortly.</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-fg) disabled:opacity-50"
      >
        {saving ? "Saving..." : "Publish about page"}
      </button>
    </form>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-(--color-muted) p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-(--color-muted) px-3 py-2"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-(--color-muted) px-3 py-2"
      />
    </label>
  );
}

function ItemListEditor({
  title,
  onTitleChange,
  items,
  onChange,
}: {
  title: string;
  onTitleChange: (value: string) => void;
  items: Array<{ title: string; description: string }>;
  onChange: (items: Array<{ title: string; description: string }>) => void;
}) {
  return (
    <div className="space-y-3">
      <Field label="Block heading" value={title} onChange={onTitleChange} />
      {items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-(--color-muted)/80 p-3">
          <div className="flex justify-end">
            <button type="button" className="text-xs text-red-700" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              Remove
            </button>
          </div>
          <Field label="Title" value={item.title} onChange={(v) => onChange(items.map((row, i) => (i === index ? { ...row, title: v } : row)))} />
          <TextArea label="Description" value={item.description} rows={3} onChange={(v) => onChange(items.map((row, i) => (i === index ? { ...row, description: v } : row)))} />
        </div>
      ))}
      <button
        type="button"
        className="text-sm underline"
        onClick={() => onChange([...items, { title: "", description: "" }])}
      >
        Add item
      </button>
    </div>
  );
}

function updateMilestone(
  content: AboutPageContent,
  setContent: (value: AboutPageContent) => void,
  index: number,
  patch: Partial<AboutPageContent["journey"]["milestones"][number]>,
) {
  setContent({
    ...content,
    journey: {
      ...content.journey,
      milestones: content.journey.milestones.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    },
  });
}

function setEducation(
  content: AboutPageContent,
  setContent: (value: AboutPageContent) => void,
  patch: Partial<AboutPageContent["education"]>,
) {
  setContent({ ...content, education: { ...content.education, ...patch } });
}

function setInstitutional(
  content: AboutPageContent,
  setContent: (value: AboutPageContent) => void,
  patch: Partial<AboutPageContent["institutional"]>,
) {
  setContent({ ...content, institutional: { ...content.institutional, ...patch } });
}

function updateInstitutionalSection(
  content: AboutPageContent,
  setContent: (value: AboutPageContent) => void,
  index: number,
  patch: Partial<AboutPageContent["institutional"]["sections"][number]>,
) {
  setInstitutional(content, setContent, {
    sections: content.institutional.sections.map((row, i) => (i === index ? { ...row, ...patch } : row)),
  });
}
