import { ARec } from './index';

export interface JSONSchemaLike {
    $ref: string;
    $schema: string;
    definitions?: ARec;
}
