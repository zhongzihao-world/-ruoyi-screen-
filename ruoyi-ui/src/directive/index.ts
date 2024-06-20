import { App } from 'vue';

import clickOutside from './common/clickOutside';

export default function installDirective(app: App<Element>) {
  app.directive('clickOutside', clickOutside);
}
