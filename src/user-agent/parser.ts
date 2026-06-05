import type { Nullable } from '../index';
import { parseSoftwareVersion } from '../version/parser';
import type { ScopedPackageName, SoftwareVersionDef } from '../version/types';
import type {
    UserAgentSoftware,
    UserAgentSoftwareDef,
    UserAgentSoftwarePackage,
    UserAgentSoftwarePackages,
} from './types';

export function parseUserAgentString(source: Nullable<string>): UserAgentSoftware {
    const result = new Map() as UserAgentSoftware;

    Object.defineProperties(result, {
        toString: {
            value: serializeUserAgentSoftware,
            enumerable: false,
        },
        find: {
            value: findUserAgentSoftwareDef,
            enumerable: false,
        },
    });

    if (source) {
        for (const [, name, sVersion, sAttributes] of source.matchAll(RE_UA_BLOCKS)) {
            const item: UserAgentSoftwareDef = { name };
            const attributes = sAttributes?.split('; ');

            if (sVersion) {
                const version = parseSoftwareVersion(sVersion);
                if (version) item.version = version;
            }

            if (attributes?.length) {
                const packages: UserAgentSoftwarePackages = new Map();

                for (const attribute of attributes) {
                    const info = parsePackageInfo(attribute);
                    if (info) {
                        packages.set(info.name, info.data);
                    }
                }

                if (packages.size) item.packages = packages;
                item.attributes = attributes;
            }

            result.set(name, item);
        }
    }

    return result;
}

function serializeUserAgentSoftware(this: UserAgentSoftware) {
    return JSON.stringify(
        this,
        (_, value): any => {
            if (value instanceof Map) return Object.fromEntries(value.entries());
            if (value instanceof Set) return Array.from(value);
            return value;
        },
        2,
    );
}

function findUserAgentSoftwareDef(
    this: UserAgentSoftware,
    predicate: (item: UserAgentSoftwareDef) => boolean,
): boolean {
    for (const item of this.values()) {
        if (predicate(item)) return true;
    }
    return false;
}

function parsePackageInfo(attribute: string): PackageVersionInfo | undefined {
    let sep: number | undefined;

    if (attribute.startsWith('@') && (sep = attribute.indexOf(' ') ?? attribute.lastIndexOf('/'))) {
        const name = attribute.slice(0, sep);
        const sVersion = attribute.slice(sep + 1);
        let version: SoftwareVersionDef | undefined;

        if (name && sVersion && (version = parseSoftwareVersion(sVersion))) {
            return {
                name: name as ScopedPackageName,
                data: { version },
            };
        }
    }

    return undefined;
}

type PackageVersionInfo = {
    name: ScopedPackageName;
    data: UserAgentSoftwarePackage;
};

const RE_UA_BLOCKS = /(\S+)\/(\S+)(?:\s*\(([^)]*)\))?/g;
