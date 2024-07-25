export default function bestInfo(discrepancy) {
  if (discrepancy.student_info !== null) {
    return discrepancy.student_info
  }
  return discrepancy.wc_info
}
