import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Skill, DraftSkill } from "@/lib/skill-schema"
import { createEmptySkill } from "@/lib/skill-schema"

interface SkillStore {
  skills: Skill[]
  activeSkillId: string | null
  draftSkill: DraftSkill

  // CRUD
  saveSkill: (skill: Skill) => void
  deleteSkill: (id: string) => void
  duplicateSkill: (id: string) => void

  // Draft management
  setDraft: (draft: DraftSkill) => void
  updateDraft: (updates: Partial<DraftSkill>) => void
  resetDraft: () => void
  loadSkillIntoDraft: (id: string) => void

  // Active skill
  setActiveSkill: (id: string | null) => void
}

export const useSkillStore = create<SkillStore>()(
  persist(
    (set, get) => ({
      skills: [],
      activeSkillId: null,
      draftSkill: createEmptySkill(),

      saveSkill: (skill) => {
        const { skills } = get()
        const existingIndex = skills.findIndex((s) => s.id === skill.id)
        const updatedSkill = { ...skill, updatedAt: new Date().toISOString() }
        if (existingIndex >= 0) {
          const updated = [...skills]
          updated[existingIndex] = updatedSkill
          set({ skills: updated })
        } else {
          set({ skills: [...skills, updatedSkill] })
        }
      },

      deleteSkill: (id) => {
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
          activeSkillId: state.activeSkillId === id ? null : state.activeSkillId,
        }))
      },

      duplicateSkill: (id) => {
        const { skills } = get()
        const original = skills.find((s) => s.id === id)
        if (!original) return
        const duplicate: Skill = {
          ...original,
          id: crypto.randomUUID(),
          name: `${original.name}-copy`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set({ skills: [...skills, duplicate] })
      },

      setDraft: (draft) => set({ draftSkill: draft }),

      updateDraft: (updates) =>
        set((state) => ({
          draftSkill: { ...state.draftSkill, ...updates },
        })),

      resetDraft: () => set({ draftSkill: createEmptySkill() }),

      loadSkillIntoDraft: (id) => {
        const skill = get().skills.find((s) => s.id === id)
        if (skill) {
          set({ draftSkill: { ...skill }, activeSkillId: id })
        }
      },

      setActiveSkill: (id) => set({ activeSkillId: id }),
    }),
    {
      name: "skillboiler-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ skills: state.skills }),
    }
  )
)
