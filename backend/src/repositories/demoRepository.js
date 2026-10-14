import { demoCatalog } from '../../../shared/siteCatalog.js';
export const demoRepository = {
  async getSiteData() {
    return structuredClone({
      plans: demoCatalog.plans,
      modalities: demoCatalog.modalities,
      schedules: demoCatalog.schedules,
    });
  },
  async modalityExists(name) {
    return demoCatalog.modalities.some((modality) => modality.name === name);
  },
  async health() {},
};
