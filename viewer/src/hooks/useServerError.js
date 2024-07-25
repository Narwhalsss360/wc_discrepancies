import { useContext } from "react";
import { ServerErrorContext } from "../App";

export default function useServerError() {
  return useContext(ServerErrorContext)
}
