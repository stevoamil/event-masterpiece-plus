export function budgetMidpoint(range?: string | null): number {
  if (!range) return 0;
  const nums = range.match(/(\d+(?:\.\d+)?)/g)?.map(Number) ?? [];
  if (nums.length === 0) return 0;
  if (range.includes("+")) return nums[0] * 1000;
  if (nums.length === 1) return nums[0] * 1000;
  return ((nums[0] + nums[1]) / 2) * 1000;
}
