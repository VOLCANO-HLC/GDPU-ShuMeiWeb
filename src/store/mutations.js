export default{
  //对指定路由缓存,先要判断是否已经添加了改组件
  isKeepAlive(state,component){
    !state.catchArr.includes(component) && state.catchArr.push(component);
  },
  //移除指定路由的缓存
  noKeepAlive(state,component){
    let index = state.catchArr.indexOf(component);
    if(index>-1){
      state.catchArr.splice(index,1);
    }
  },
  //更新用户信息
  updateUserInfo(state,userObj){
    state.userInfo = userObj;
  },
  //更新作者信息
  updateAuthorInfo(state,author){
    state.authorInfo = author;
  },
  //更新作者粉丝数
  updateAuthorFans(state,flag){
    if(flag){
      state.authorInfo.fansCount++;
      state.authorInfo.followed = true;
    } else {
      state.authorInfo.fansCount--;
      state.authorInfo.followed = false;
    }
  },
  //更新单个作品信息
  updateWorkInfo(state,workObj){
    state.workDetail = workObj;
  },
  //更新未读消息数量
  updateNoReadMessageCount(state,_obj){
    // console.log(_obj)
    state.noReadMessage[_obj.index] = _obj;
  },
  //更改用户中心颜色
  updateSpaceColor(state,colorValue){
    state.spaceColor = colorValue;
  },
  //更改字体颜色
  updateSpaceTextColor(state,colorValue){
    state.textColor = colorValue;
  }
}