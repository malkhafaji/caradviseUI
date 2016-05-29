export const LOAD_STATE = 'LOAD_STATE';
export function loadState(state) {
  return { type: LOAD_STATE, state };
}
