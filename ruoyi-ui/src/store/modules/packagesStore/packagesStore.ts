import { defineStore } from 'pinia';

import { packagesList } from '@/packages/index';
import type { PackagesType } from '@/packages/index.d';
import type { PackagesStoreType } from './packagesStore.d';

export const usePackagesStore = defineStore({
  id: 'usePackagesStore',
  state: (): PackagesStoreType => ({
    packagesList: Object.freeze(packagesList),
  }),
  getters: {
    getPackagesList(): PackagesType {
      return this.packagesList;
    },
  },
});
