import * as components from '@element-plus/icons-vue';

export default {
  install: (app: any) => {
    for (const key in components) {
      // @ts-ignore
      const componentConfig = components[key];
      app.component(componentConfig.name, componentConfig);
    }
  },
};
