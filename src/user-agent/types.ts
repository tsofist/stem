import type { ScopedPackageName, SoftwareVersionDef } from '../version/types';

export type UserAgentSoftwareDef = {
    name: string;
    version?: SoftwareVersionDef;
    attributes?: string[];
    packages?: UserAgentSoftwarePackages;
};

export type UserAgentSoftwarePackages = Map<ScopedPackageName, UserAgentSoftwarePackage>;

export type UserAgentSoftwarePackage = {
    version: SoftwareVersionDef;
};

export type UserAgentSoftware = Map<string, UserAgentSoftwareDef> & {
    toString: () => string;
    find: (
        predicate: (item: UserAgentSoftwareDef) => boolean | undefined,
    ) => UserAgentSoftwareDef | undefined;
};
