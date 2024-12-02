import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
  [ 
    {
      title: '我的订单',
      tit: '',
      url: '',
      type: 'orderList',
    },
    {
      title: '我的战绩',
      tit: '',
      url: '',
      type: '',
    },
    {
      title: '优惠券',
      tit: '',
      url: '',
      type: 'coupon',
    },
    // {
    //   title: '积分',
    //   tit: '',
    //   url: '',
    //   type: 'point',
    // },
  ],
  [
    // {
    //   title: '帮助中心',
    //   tit: '',
    //   url: '',
    //   type: 'help-center',
    // },
    // {
    //   title: '客服热线',
    //   tit: '',
    //   url: '',
    //   type: 'service',
    //   icon: 'service',
    // },
    {
      title: '退出',
      tit: '',
      url: '',
      type: 'help-center',
    },
    {
      title: '关于',
      tit: '',
      url: '',
      type: 'service',
      icon: '',
    },
    {
      title: '其他',
      tit: '',
      url: '',
      type: 'service',
      icon: '',
    },
  ],
];

const orderTagInfos = [
  {
    title: '交易明细',
    iconName: 'wallet',
    type: 1,
    
  },
  {
    title: '充值',
    iconName: 'deliver',
    type: 2,

  },
  {
    title: '提现',
    iconName: 'package',
    type: 3
  },
];

const getDefaultData = () => ({
  showMakePhone: false,
  userInfo: {
    avatarUrl: '',
    nickName: '正在登录...',
    phoneNumber: '',
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {},
  currAuthStep: 1,
  showKefu: true,
  versionNo: '',
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
    this.getTabBar().init();
    this.init();
  },
  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(
      ({
        userInfo,
        countsData,
        orderTagInfos: orderInfo,
        customerServiceInfo,
      }) => {
        // eslint-disable-next-line no-unused-expressions
        menuData?.[0].forEach((v) => {
          countsData.forEach((counts) => {
            if (counts.type === v.type) {
              // eslint-disable-next-line no-param-reassign
              v.tit = counts.num;
            }
          });
        });
        const info = orderTagInfos.map((v, index) => ({
          ...v,
          ...orderInfo[index],
        }));
        this.setData({
          userInfo,
          menuData,
          orderTagInfos: info,
          customerServiceInfo,
          currAuthStep: 2,
        });
        wx.stopPullDownRefresh();
      },
    );
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'orderList':{
        wx.navigateTo({ url: '/pages/order/order-list/index' });
        break;

      }
      case 'address': {
        wx.navigateTo({ url: '/pages/usercenter/address/list/index' });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({ url: '/pages/coupon/coupon-list/index' });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.type;
    console.log(status)
    if (status === 1) {
      wx.navigateTo({ url: '/pages/trade/trade-detail/index' });
    } else if (status === 2){
      wx.navigateTo({ url: "/pages/trade/recharge/index" });
    } else{
      wx.navigateTo({ url: "/pages/trade/cash-out/index" });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({ url: '/pages/order/order-list/index' });
  },

  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage() {
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/usercenter/person-info/index' });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
