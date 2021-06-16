export default {
  //得到简单的用户信息
  getCustomerBrief(state) {
    return {
      avatr: state.userInfo.avatr,
      name: state.userInfo.name,
      sex: state.userInfo.sex,
      sign: state.userInfo.sign,
      id: state.userInfo.id,
    }
  },
  //得到视频列表信息
  getVideoList(state) {
    return state.workDetail.workVideoInfoList;
  },
  //过滤图片列表，获得url集合
  getImgsUrl(state) {
    let urlArr = []
    if (state.workDetail.workPictureInfoList) {
      state.workDetail.workPictureInfoList.map(n => {
        urlArr.push(n.pictureUrl);
      });
      return urlArr;
    }
  },
  //获取未读信息数量
  getNoReadCount(state){
    return state.noReadMessage;
  }
}