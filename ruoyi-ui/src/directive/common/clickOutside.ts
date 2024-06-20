export default {
  mounted(el: any, binding: any) {
    function clickHandler(e: any) {
      if (el.contains(e.target)) {
        return false;
      }
      // 执行绑定函数
      if (binding.value && typeof binding.value === 'function') {
        binding.value(e);
      }
    }
    el.__vueClickOutside__ = clickHandler;
    document.addEventListener('click', clickHandler);
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};
