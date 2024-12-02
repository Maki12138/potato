Component({
  externalClasses: ['title-class', 'icon-class', 'number-class'],
  options: {
    multipleSlots: true,
  },
  properties: {
    orderTagInfos: {
      type: Array,
      value: [],
    },
    title: {
      type: String,
      value: '账户余额：',
    },
    // desc: {
    //   type: String,
    //   value: '250元',
    // },
    isTop: {
      type: Boolean,
      value: true,
    },
    classPrefix: {
      type: String,
      value: 'wr',
    },
  },
  methods: {
    onClickItem(e) {
      this.triggerEvent('onClickItem', e.currentTarget.dataset.item);
    },

    onClickTop() {
      this.triggerEvent('onClickTop', {});
    },
  },
});
