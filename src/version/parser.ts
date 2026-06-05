import type { Nullable } from '../index';
import type { SoftwareVersion, SoftwareVersionDef, SoftwareVersionRaw } from './types';

export function parseSoftwareVersion(input: Nullable<string>): SoftwareVersionDef | undefined {
    let match: Nullable<RegExpExecArray>;

    if (input?.length && (match = RE_VER.exec(input))) {
        const suffix = match.at(4);
        const result: SoftwareVersionDef = {
            raw: match.at(0) as SoftwareVersionRaw,
            value: match.at(1) as SoftwareVersion,
        };

        if (suffix) {
            const sign = suffix.at(0);
            result.suffix = suffix.slice(1);

            if (sign === '+') {
                result.build = Number(suffix);
            }
        }

        return result;
    }

    return undefined;
}

const RE_VER = /^(\d+(\.\d+)?(\.?\d+)?)((-[a-zA-Z][a-zA-Z0-9+._-]+)|(\+\d+))?$/;
