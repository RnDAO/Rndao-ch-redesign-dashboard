export default interface IModule {
  dynamicNFTModuleInfo: {
    isNFTModuleEnabled: boolean;
    metadata: Array<{
      transactionHash: string;
      platformId: string;
      tokenId: string;
    }> | null;
  } | null;
  createModule: (module: { name: string; community: string }) => Promise<void>;
  retrieveModules: (module: {
    name: string;
    community: string;
    limit: number;
    page: number;
    sortBy: string;
  }) => Promise<void>;
  retrieveModuleById: (moduleId: string) => Promise<void>;
  patchModule: (module: { moduleId: string; payload: any }) => Promise<void>;
}
