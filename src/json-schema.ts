import type { ARec } from './index';

export type JSONSchemaLike = {
    $ref: string;
    $schema: string;
    definitions?: ARec;
};
