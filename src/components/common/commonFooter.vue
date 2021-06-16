<template>
  <div class="commonFooter">
    <div class="concat-we">
      <div class="concat-text">联系我们</div>
      <p class="footer-sign">—————————————— 为前途而战 ——————————————</p>
      <div class="concat-information">
        <div class="information">
          <div class="information-icon">
            <i class="iconfont icon-shouji"></i>
          </div>
          <p class="information-info">12312313</p>
        </div>
        <div class="information">
          <div class="information-icon">
            <i class="iconfont icon-duanxin"></i>
          </div>
          <p class="information-info">12312313</p>
        </div>
        <div class="information">
          <div class="information-icon">
            <i class="iconfont icon-weixin"></i>
          </div>
          <p class="information-info">12312313</p>
        </div>
        <div class="information">
          <div class="information-icon">
            <i class="iconfont icon-qq"></i>
          </div>
          <p class="information-info">12312313</p>
        </div>
      </div>
      <div class="copyright">
        @广东药科大学数字媒体技术-数媒工作室
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    name:'commonFooter',
    data(){
      return{

      }
    }
  }
</script>

<style scoped>
  .commonFooter{
    width: 100%;
    height: 3rem;
    background-color: rgba(0, 0, 0, 0.842);
  }
  .concat-we{
    width: 100%;
  }
  .concat-text{
    font-size: .2rem;
    color: #fff;
    text-align: center;
    padding: .2rem 0 .1rem 0;
  }
  .footer-sign{
    font-size: .1rem;
    text-align: center;
    color: #fff;
  }
  .concat-information{
    margin-top:.4rem;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .information{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 1.5rem;
    height: .8rem;
    border: 1px solid rgb(255, 255, 255);
    /* background-color: #fff; */
    margin-right: .2rem;
  }
  .information-icon{
    font-size: .3rem;
    color: #fff;
    text-align: center;
    line-height: .4rem;
  }
  .information-icon i{
    font-size: .25rem;
  }
  .information-info{
    font-size: .1rem;
    color: #fff;
    text-align: center;
    margin: .1rem 0 0 0;
  }
  .copyright{
    position: absolute;
    bottom: .25rem;
    left: 50%;
    transform: translateX(-50%);
    text-decoration: underline;
    font-size: .05rem;
    color: #fff;
    text-align: center;
  }
</style>