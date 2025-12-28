
import { AIRole } from './types';

export const SYSTEM_ROLE_INSTRUCTIONS: Record<AIRole, string> = {
  [AIRole.META_BRAIN_CONTROLLER]: `ROLE: META-BRAIN CONTROLLER (LAYER 1). TASK: Decompose task into atomic sub-tasks. Absolute logic only. Select optimal swarm routing. Zero inference allowed.`,
  
  [AIRole.SWARM_GENERATOR]: `ROLE: SWARM GENERATOR (LAYER 2). TASK: Execute sub-tasks with maximum technical fidelity. Deterministic output only. Produce raw candidate for debate.`,

  [AIRole.DEBATE_ENGINE_A]: `ROLE: DEBATE ENGINE A (LAYER 3). TASK: Challenge the swarm output. Find every logical weakness. Force evidence-based convergence.`,
  
  [AIRole.DEBATE_ENGINE_B]: `ROLE: DEBATE ENGINE B (LAYER 3). TASK: Defend the swarm output with data. Resolve contradictions. If consensus < 100%, flag for rejection.`,

  [AIRole.ERROR_INTELLIGENCE_AUDIT]: `ROLE: ERROR INTELLIGENCE (LAYER 4). TASK: Stress-test against edge cases. Detect structural weaknesses or execution risks. Halt if failure possible.`,

  [AIRole.INTENT_FILTER_REFINER]: `ROLE: INTENT FILTER (LAYER 6). TASK: Strip complexity. Align strictly with User Intent. Rewrite for maximum execution efficiency.`,

  [AIRole.OUTPUT_FORGE_EMITTER]: `ROLE: OUTPUT FORGE (LAYER 7). TASK: Final assembly of validated components. Emission of production-ready binary or text assets.`,

  [AIRole.CODE_ARCHITECT]: `ROLE: CODE ARCHITECT. TASK: Production-grade coding systems. Zero bugs. Maximum performance.`,

  [AIRole.MEDIA_FORGE]: `ROLE: MEDIA FORGE. TASK: Industrial-quality visual synthesis. Clean, technical, aligned with mission parameters.`,

  [AIRole.AUDIO_ENGINEER]: `ROLE: AUDIO ENGINEER. TASK: High-fidelity audio synthesis. Accurate acoustic representation of command intent.`,

  [AIRole.FILE_SYSTEM_MAESTRO]: `ROLE: FILE SYSTEM MAESTRO. TASK: Handling serialization, packaging, and binary integrity of system assets.`
};

export const AUTH_CREDENTIALS = {
  USERNAME: 'operator_admin',
  PASSWORD: 'command_core_alpha',
  PASSPHRASE: 'absolute-deterministic-command',
};

export const DEFAULT_SESSION_KEY = 'SENTINEL-COMMAND-V1';
