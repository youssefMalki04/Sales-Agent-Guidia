import { Sparkles } from "lucide-react";

import {
  SkillCard,
  SkillDetailsDialog,
  SkillMetric,
  SkillsToolbar,
} from "./skill-library-components";
import { CreateSkillWizard } from "./skill-wizard";
import { useSkills } from "./use-skills";

export function SkillsView() {
  const {
    canContinue,
    closeDetails,
    closeWizard,
    createSkill,
    customCount,
    deleteSkill,
    detailLanguage,
    filter,
    filteredSkills,
    form,
    nextWizardStep,
    openDetails,
    openWizard,
    platformCount,
    previousWizardStep,
    query,
    selectedSkill,
    setDetailLanguage,
    setFilter,
    setForm,
    setQuery,
    wizardOpen,
    wizardStep,
  } = useSkills();

  return (
    <>
      <section className="soft-panel-enter mt-6 overflow-hidden rounded-3xl border border-[#e1e4f8] bg-gradient-to-br from-[#f5f6ff] via-white to-[#f1f2ff]/70 p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#626cd1]">
              <Sparkles className="size-3.5" /> Agent capabilities
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Skill library
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Combine reusable knowledge, behavior and execution packs for every
              agent.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <SkillMetric value={platformCount} label="Platform" />
            <SkillMetric value={customCount} label="Custom" />
          </div>
        </div>
      </section>

      <section className="soft-panel-enter mt-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
        <SkillsToolbar
          platformCount={platformCount}
          customCount={customCount}
          query={query}
          filter={filter}
          onQueryChange={setQuery}
          onFilterChange={setFilter}
          onCreate={openWizard}
        />

        {filteredSkills.length === 0 ? (
          <div className="mt-5 flex min-h-52 items-center justify-center rounded-3xl border border-dashed border-[#dfe2eb] bg-[#fafafd] text-sm font-medium text-slate-500">
            No skill pack matches your search.
          </div>
        ) : (
          <div className="soft-stagger mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onDetails={() => openDetails(skill)}
                onDelete={() => deleteSkill(skill.id)}
              />
            ))}
          </div>
        )}
      </section>

      <SkillDetailsDialog
        skill={selectedSkill}
        language={detailLanguage}
        onLanguageChange={setDetailLanguage}
        onClose={closeDetails}
      />

      <CreateSkillWizard
        open={wizardOpen}
        step={wizardStep}
        form={form}
        canContinue={canContinue}
        onOpenChange={(open) => {
          if (!open) closeWizard();
        }}
        onFormChange={setForm}
        onBack={previousWizardStep}
        onNext={nextWizardStep}
        onCancel={closeWizard}
        onCreate={createSkill}
      />
    </>
  );
}
