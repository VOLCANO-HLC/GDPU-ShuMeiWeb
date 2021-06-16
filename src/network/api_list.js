
const api_list = {
  //注册接口
  api_register: '/dm_work/customer/me/register',
  //登录接口
  api_login: '/dm_work/customer/me/login',
  //获取个人基本信息
  api_getUserInfo: '/dm_work/customer/me/get_base_info',
  //修改用户信息
  api_updateInfo: '/dm_work/customer/me/update_info',
  //修改用户主题颜色
  api_modifyThemeColor: '/dm_work/customer/me/modify_color',
  //修改用户密码
  api_modifyUserPassWord: '/dm_work/customer/me/update_pwd',
  //获取单个关注列表
  api_getFollowList: '/dm_work/customer/me/get_follow_list',
  //关注指定用户
  api_followCustomer: '/dm_work/customer/me/follow',
  //取消关注接口
  api_unFollow: '/dm_work/customer/me/unfollow',
  //获取用户关注分组名字
  api_getFollowGroups: '/dm_work/customer/follow_group/me/get_group_list',
  //新建关注分组接口
  api_createFollowGroup: '/dm_work/customer/follow_group/me/create_follow_group',
  //删除关注分组
  api_deletFollowGroup: '/dm_work/customer/follow_group/me/remove_follow_group',
  //获取粉丝列表
  api_getFansList: '/dm_work/customer/me/get_fans_list',
  //获取收藏分组
  api_getCollectGroups: '/dm_work/interaction/collect_group/me/get_group_list',
  //获取指定用户的收藏公开分组
  api_getOpenGroups: '/dm_work/interaction/collect_group/get_group_list',
  //获取指定收藏分组的列表数据
  api_getCollectGroupList: '/dm_work/work/get_collect_list',
  //新建收藏分组
  api_createCollectGroup: '/dm_work/interaction/collect_group/me/add_group',
  // 修改收藏分组名
  api_updateCollectGroupName: '/dm_work/interaction/collect_group/me/modify_group',
  //移动收藏作品分组
  api_moveCollect: '/dm_work/interaction/collect/me/move_batch_collect',
  //删除收藏分组
  api_delCollectGroup: '/dm_work/interaction/collect_group/me/remove_group',
  //添加收藏
  api_addCollect: '/dm_work/interaction/collect/me/add_batch_collect',
  //取消收藏
  api_removeCollection: '/dm_work/interaction/collect/me/remove_collect',
  //批量取消收藏
  api_removeCollections: '/dm_work/interaction/collect/me/remove_batch_from_collect',
  //上传图片接口
  api_uploadImage: '/dm_work/oss/file/me/upload',
  //上传视频接口
  api_upLoadVideo: '/dm_work/vod/me/upload',
  //删除上传的图片
  api_deleteLoadImage: '/dm_work/oss/file/me/remove',
  // 批量删除上传的图片
  api_delMoreUpLoadImages: '/dm_work/oss/file/me/batch_remove',
  //删除上传的视频接口
  api_removeVideo: '/dm_work/vod/me/remove',
  //获取个人作品列表
  api_getPersonalWorksSorts: '/dm_work/work/me/get_info_list',
  //获取指定用户的作品
  api_getAuthorWorks: '/dm_work/work/get_info_list',
  //获取单个作品详情
  api_getWorkInfo: '/dm_work/work/get_info',
  //发布个人作品
  api_addPersonalWork: '/dm_work/work/me/publish_work',
  //保存投稿作品草稿
  api_saveUpWork: '/dm_work/work/me/temp_storage_work',
  //获取保存的投稿作品草稿
  api_getSaveUpWork: '/dm_work/work/me/get_temp_storage_work',
  //删除已保存的投稿作品草稿
  api_delSaveUpWork: '/dm_work/work/me/remove_temp_storage_work',
  //删除个人作品
  api_delPersonalWork: '/dm_work/work/me/remove_work',
  //修改个人作品
  api_updateWork: '/dm_work/work/me/update_work',
  //删除作品的图片
  api_delWorkImg: '/dm_work/work/work_picture/me/remove',
  //批量删除图片信息
  api_delModeWorkImg: '/dm_work/work/work_picture/me/batch_remove',
  //获取作品图片信息列表
  api_getWorkImgsList: '/dm_work/work/work_picture/me/get_info_list',
  //添加新作品图片
  api_addWorkImgs: '/dm_work/work/work_picture/me/add_info',
  //获取作品的视频信息列表
  api_getWorkVideosList: '/dm_work/work/work_video/me/get_info_list',
  //添加新作品视频
  api_addWorkVideos: '/dm_work/work/work_video/me/add_info',
  //批量删除作品视频
  api_delWorkVideo: '/dm_work/work/work_video/me/batch_remove',
  //获取指定用户信息
  api_getCustomerInfo: '/dm_work/customer/get_info',
  //获取作品的全部分类
  api_getAllWorksSortName: '/dm_work/work/work_type/get_brief_list',
  //按条件获取相关作品(可获得全部作品)
  api_getRelatAllWork: '/dm_work/work/get_list',
  //按类型获取热门作品
  api_getRelevantHotWorks: '/dm_work/work/hot',
  //增加作品热度
  api_addWorkHot: '/dm_work/work/hot_up',
  //获取视频播放凭证
  api_getPlayAuth: '/dm_work/vod/get_play_auth',
  // 获取当前作品详情下的所有评论
  api_getCommentListh: '/dm_work/interaction/work_comment/get_comment_list',
  // 获取指定作品评论的多条回复
  api_getReplyList: '/dm_work/interaction/work_comment/get_reply_list',
  // 获取全部动态列表数据
  api_getAllFeedData: '/dm_work/interaction/feed/me/get_feed_list',
  // 获取个人动态列表
  api_getPersonalFeedList: '/dm_work/interaction/feed/me/get_own_feed_list',
  // 获取指定动态详情
  api_getFeedDetail: '/dm_work/interaction/feed/get_feed_detail',
  // 暂存动态草稿
  api_saveFeedData: '/dm_work/interaction/feed/me/temp_storage_feed',
  // 获取动态草稿
  api_getSaveFeedData: '/dm_work/interaction/feed/me/get_temp_storage_feed',
  // 发布动态
  api_sendFeed: '/dm_work/interaction/feed/me/publish_feed',
  // 删除动态
  api_delFeed: '/dm_work/interaction/feed/me/remove_feed',
  // 删除后台动态缓存
  api_delSaveFeed: '/dm_work/interaction/feed/me/remove_temp_storage_feed',
  // 获取动态下的评论
  api_getFeedComments: '/dm_work/interaction/feed_comment/get_comment_list',
  // 获取每条动态评论下的回复
  api_getCommentReply: '/dm_work/interaction/feed_comment/get_reply_list',
  // 获取动态评论的总数
  api_getFeedCommentCount: '/dm_work/interaction/feed_comment/get_feed_comment_count',
  // 获取未读评论总数
  api_getNoReadCommentCount: '/dm_work/message/comment_message/me/get_unread_comment_message_count',
  // 为评论点赞
  api_giveCommentLike: '/dm_work/interaction/feed_comment_like/me/like',
  // 删除自己的评论
  api_delComment: '/dm_work/interaction/feed_comment/me/remove_comment',
  // 为指定动态发表评论
  api_sendFeedComment: '/dm_work/interaction/feed_comment/me/publish_comment',
  // 为指定评论发表回复
  api_sendCommentReply: '/dm_work/interaction/feed_comment/me/publish_reply',
  // 发送短信
  api_sendShortMessage: '/dm_work/customer/sms/send_verification_code',
  // 验证短信的验证码
  api_checkShortMessageCode: '/dm_work/customer/sms/check_verification_code',
  // 获取未读动态数量
  api_getNoReadFeedCount: '/dm_work/message/feed_follow/me/get_unread_feed_count',
  //获取点赞消息
  api_getLikedMessage: '/dm_work/interaction/comment_like_message_info/me/get_comment_like_message_info_list',
  // 获取未读点赞总数
  api_getNoReadLikedCount: '/dm_work/message/comment_like_message/me/get_unread_comment_like_message_count',
  //获取回复消息
  api_geReplyMessage: '/dm_work/interaction/comment_message_info/me/get_comment_message_info_list',
  
  // 发送当前用户回复他人的评论
  api_postReplyToPerson: '/dm_work/interaction/work_comment/me/publish_reply',
  // 发送对作品直接发表的评论
  api_postReplyToWork: '/dm_work/interaction/work_comment/me/publish_comment',
  // 为指定评论点赞或取消点赞
  api_putCommentLiked: '/dm_work/interaction/work_comment_like/me/like',
  // 删除作品下面的评论
  api_deleteComment: '/dm_work/interaction/work_comment/me/remove_comment'
}
module.exports = api_list;