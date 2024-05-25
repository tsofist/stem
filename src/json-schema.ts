import { ARec } from './index.js';

export interface JSONSchemaLike {
    $ref: string;
    $schema: string;
    definitions?: ARec;
}
