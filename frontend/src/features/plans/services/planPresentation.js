// Frontend access rule requested for all plans. Raw catalog stays unchanged.
export function getPlanBenefits(plan) {
  const allHours = 'Acesso em todos os horários de funcionamento';
  const benefits = (plan.benefits || []).map((benefit) =>
    /(?:acesso|hor[aá]rios).*(?:10h|10:00|todos os hor[aá]rios)|todos os hor[aá]rios de funcionamento/i.test(
      benefit,
    )
      ? allHours
      : benefit,
  );
  if (!benefits.includes(allHours)) benefits.splice(1, 0, allHours);
  return [...new Set(benefits)];
}
