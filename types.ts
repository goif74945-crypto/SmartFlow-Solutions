
export enum AuthLayer {
  LOGIN = 1,
  PASSPHRASE = 2,
  SESSION_KEY = 3,
  MANUAL_GATE = 4,
  AUTHORIZED = 5
}

export enum AIRole {
  META_BRAIN_CONTROLLER = 'META_BRAIN_CONTROLLER',
  SWARM_GENERATOR = 'SWARM_GENERATOR',
  DEBATE_ENGINE_A = 'DEBATE_ENGINE_A',
  DEBATE_ENGINE_B = 'DEBATE_ENGINE_B',
  ERROR_INTELLIGENCE_AUDIT = 'ERROR_INTELLIGENCE_AUDIT',
  INTENT_FILTER_REFINER = 'INTENT_FILTER_REFINER',
  OUTPUT_FORGE_EMITTER = 'OUTPUT_FORGE_EMITTER',
  
  // Pluggable Specialists
  CODE_ARCHITECT = 'CODE_ARCHITECT',
  MEDIA_FORGE = 'MEDIA_FORGE',
  AUDIO_ENGINEER = 'AUDIO_ENGINEER',
  FILE_SYSTEM_MAESTRO = 'FILE_SYSTEM_MAESTRO'
}

export enum Modality {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  CODE = 'CODE'
}

export enum PipelineStatus {
  IDLE = 'IDLE',
  CONTROLLING = 'CONTROLLING',
  SWARMING = 'SWARMING',
  DEBATING = 'DEBATING',
  AUDITING = 'AUDITING',
  REFINING = 'REFINING',
  EMITTING = 'EMITTING',
  ESCALATED = 'ESCALATED',
  HALTED = 'HALTED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  RETRYING = 'RETRYING'
}

export interface AIMessage {
  role: AIRole;
  content: string;
  status: 'success' | 'failure' | 'warning';
  timestamp: string;
}

export interface Task {
  id: string;
  modality: Modality;
  prompt: string;
  status: 'queued' | 'active' | 'completed' | 'failed' | 'paused' | 'escalated';
  priority: number;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinalArtifact {
  id: string;
  modality: Modality;
  originalInput: string;
  finalOutput: string;
  sourceChain: AIRole[];
  verificationScore: number; 
  fileData?: {
    name: string;
    type: string;
    blob: string; // Base64
  };
  recheckPasses: number;
  logs: string[];
  specs: string;
  createdAt: string;
  safeUsageScope: string;
  limitations: string[];
  emissionSpecs: string;
  rejectedAlternatives: string[];
  humanActionRequired: string | null;
}
