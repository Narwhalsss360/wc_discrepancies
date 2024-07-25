import { SelectedDiscrepancyContext } from "../App";
import { useContext } from "react";

export default function useSelectedDiscrepancy() {
  return useContext(SelectedDiscrepancyContext)
}
