export default {
  // called by Vue.use(FirstPlugin)
  install(Vue) {
    Vue.prototype.$formateDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    };
  },
};
