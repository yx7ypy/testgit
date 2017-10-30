
const BgValidation =
{
  mobile(val) {
    return /^[0-9]{11}$/.test(val)
  },
  //数字和字母构成,密码长度为5到10位
  password(val){
    return /^[A-Za-z0-9]{5,10}$/.test(val);
  },
  //验证中国人姓名，仅为汉字，长度为1到10位
  name(val){
    return /^[\u4e00-\u9fa5]{1,10}$/.test(val)
  }
};

export default BgValidation;
