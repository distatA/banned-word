 <template>
  <div style="font-family: Source Han Sans CN">
    <!--查询类型 -->
    <div class="menuBox">
      <h2 class="menuBox_title">常用行业分类查询</h2>
      <div class="menuBox_typeBox">
        <a-button
          type="default"
          v-for="(item, index) in typeArr"
          :key="index"
          :class="item.isChoose ? 'active' : 'button'"
          @click="chooseType(index)"
        >
          <a-icon type="check-circle" class="choose" v-if="item.isChoose" />
          <a-icon :type="item.icon" />
          {{ item.value }}
        </a-button>
      </div>
      <div class="menuBox_tips">
        <a-icon type="exclamation-circle"  style="font-size:12px;"/>
        《风险提示&免责声明》︰本产品提供的审核结果及相关建议仅供您参考，不构成任何法律意见或对广告合规性的保证，不能作为法律依据。请自行对您的广告合规性承担责任。
      </div>
      <div class="menuBox_attention" style="font-size:16px;">
        <div>
          为了查询准确，建议您使用"通用词库"+""行业类型"进行检测。如:“祛除"在美妆个护行业中属于提示性禁用词，但不属于通用禁用词
        </div>
      </div>
    </div>
    <!-- 查询内容 -->
    <div class="searchBox">
      <a-tabs v-model="showModel">
        <a-tab-pane key="1">
          <span slot="tab"> <a-icon type="read" /> 查文字 </span>
          <div class="searchBox_content">
            <a-input
              placeholder="请输入需要检测的内容,不超过10000个字符"
              class="searchBox_importContent"
              type="textarea"
              v-model="textContent"
              :maxLength="maxLength"
            />
            <div class="searchBox_callBackContent" v-html="richText"></div>
            <div class="importNum">{{ textContent.length }}/10000</div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="picture" />
            查图片
          </span>
          <div class="searchPhotoBox">
            <div class="clearfix">
              <a-upload
                action="/api/upload/uploadFile?"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                :headers="headers"
                @change="handleChange"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text"></div>
                </div>
              </a-upload>
              <a-modal
                :visible="previewVisible"
                :footer="null"
                @cancel="handleCancel"
              >
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
            <div>
              <p>
                <a-icon type="exclamation-circle" />
                图片字数不超过2万字,大小不超过4M
              </p>
              <p>
                <a-icon type="exclamation-circle" />
                最短边至少15px最长边最大4096px
              </p>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab">
            <a-icon type="global" />
            查网址
          </span>
          <div class="searchUrlBox">
            <a-input
              placeholder="1.请输入需要检测的网址,必须以http://或https://开头,每行一条网址。2.暂不支持检测:网页中的图片,1688详情页及整站"
              class="searchBox_importContent"
              type="textarea"
              v-model="urlContent"
              @change="changeSearchUrl"
              :disabled="searchUrlDisabled"
            />
            <div class="importNum">{{ linesCount }}/5</div>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div class="searchButtonBox">
        <div class="searchButBox">
          <a-button
            type="default"
            style="margin-right: 20px"
            @click="resetContent"
          >
            <a-icon type="rest" />
            重新输入
          </a-button>
          <a-button type="primary" @click="stopWordSearch" :loading="loading">
            <a-icon type="search" v-if="!loading" />
            违禁词查询
          </a-button>
        </div>
        <div class="residueNum">
          当前可用查询次数： [ 文字数<span class="heightLine">{{
            userInfo.textNumber ? userInfo.textNumber : 0
          }}</span>
          / 图片数<span class="heightLine">{{
            userInfo.imgNumber ? userInfo.imgNumber : 0
          }}</span>
          / 网址数<span class="heightLine">{{
            userInfo.urlNumber ? userInfo.urlNumber : 0
          }}</span
          > ]
        </div>
      </div>
    </div>
    <!-- 查询结果 -->
    <!-- <div class="title">查询结果</div> -->
    <a-tabs
      type="card"
      style="margin-top: 30px; background: white"
      v-if="resultTab"
      @change="changeTab"
    >
      <a-tab-pane
        v-for="(item, index) in resultTab"
        :tab="item.data.name"
        :key="index"
      >
        <!-- 标签 -->
        <div class="serachResultBox">
          <div class="tagBox">
            <div
              class="tagBox_item"
              v-for="(item, index) in tagArr"
              :key="index"
            >
              <div
                class="tagBox_item_level"
                :style="`background:${item.color}`"
              >
                {{ item.level }}
              </div>
              <div class="tagBox_item_tips">{{ item.value }}</div>
            </div>
          </div>
          <!-- tab栏 -->
          <div class="card-container" v-if="item.data.word_list">
            <a-tabs type="card">
              <a-tab-pane
                v-for="(item2, index2) in item.data.wordTypeList"
                :tab="item2.name"
                :key="index2"
              >
                <div class="cardBox">
                  <a-button
                    class="cardBtn"
                    v-for="(item3, index3) in item2.list"
                    :key="index3"
                    >{{ item3.word }}</a-button
                  >
                </div>
              </a-tab-pane>
            </a-tabs>
            <!-- 按钮操作 -->
            <a-divider
              orientation="right"
              style="margin: 15px 0"
              v-if="item.data.word_list.length > 0"
            >
              <a-button
                type="primary"
                class="handleButton"
                @click="downLoadRes(item)"
              >
                <a-icon type="download" />
                结果下载
              </a-button>
              <a-button
                type="primary"
                class="handleButton"
                @click="copyResult(item.data.text)"
              >
                <a-icon type="copy" />
                复制内容
              </a-button>
              <a-button
                type="danger"
                class="handleButton"
                @click="deleteAllWord()"
              >
                <a-icon type="delete" />
                删除所有禁用词
              </a-button>
              <a-button
                type="defult"
                class="handleButton"
                @click="deleteLevel(item.level)"
                v-for="(item, index) in item.data.wordTypeList"
                :key="index"
                ><a-icon type="delete" />删除{{ item.name }}</a-button
              >
            </a-divider>
            <!-- 禁用词解释 -->
            <div class="explainBox" v-if="item.data.word_list.length > 0">
              <div class="explainTitle">
                禁用词解释
                <span class="explainHeightLine">{{
                  item.data.word_list.length
                }}</span>
              </div>
              <div class="explainHandle">
                <!-- 全部展开 -->
                <!-- <a-icon type="down" /> -->
                <a-button
                  type="primary"
                  icon="search"
                  @click="handleSearchMask"
                >
                  查看原文
                </a-button>
              </div>
            </div>
            <!-- 禁用词内容 -->
            <div class="explainContent">
              <a-collapse
                default-active-key="1"
                :bordered="false"
                style="background: white"
              >
                <a-collapse-panel
                  :header="item.word"
                  v-for="(item, index) in item.data.word_list"
                  :key="index"
                >
                  <p>风险评级 :{{ item.level }}级</p>
                  <!-- <p>
                  违规参考:<span class="heightLine"
                    >《中华人民共和国广告法》第3条第9条第10条
                  </span>
                </p> -->
                  <p>词库释义 :{{ item.remark }}</p>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!-- 查看禁用词弹框 -->
    <a-drawer
      title="查看原文"
      placement="top"
      :closable="false"
      :visible="isShowWordMask"
      @close="isShowWordMask = false"
    >
      <div v-html="searchMaskStr"></div>
    </a-drawer>
  </div>
</template>

<script>
import { search, getUserInfo } from "@/services/user";
import { typeArr, tagArr, colors, rgbColors } from "@/utils/customData";
import config from "../../router/config";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  data() {
    return {
      typeArr,
      tagArr,
      imageUrl: "",
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      number: 1, //已选类型数目
      showModel: "1", //显示哪个tab
      userInfo: "", //用户信息
      textContent: "", //文字内容
      maxLength: 10000,
      textWord: "级禁用词",
      richText: ``, //检测出来显示的富文本词语
      word_list: "", //敏感词数组
      wordTypeList: {},
      colors,
      rgbColors,
      downResultId: "", //下载结果的id
      baseUrl: "",
      previewVisible: false,
      previewImage: "",
      fileList: [], //图片上传数组
      headers: "",
      fileUrl: "",
      linesCount: 0, //文本行数
      linesContentStr: "", //查网址的内容
      searchUrlDisabled: false,
      urlContent: "", //查网址的输入框
      resultTab: "", //敏感词结果的tab栏
      isShowWordMask: false,
      searchedType: 0, //刚刚查找过的type
      searchMaskStr: "", //查看的富文本
      chooseTypeNum: 0, //当前选中的tab值
      loading: false, //搜索等待时间
    };
  },
  watch: {
    showModel() {
      this.textContent = "";
      this.fileList = [];
      this.linesCount = 0;
      this.linesContentStr = "";
      this.urlContent = "";
    },
  },
  mounted() {
    this.headers = {
      accessToken: this.userInfo.accessToken,
    };
    this.baseUrl = process.env.VUE_APP_API_BASE_URL;
    this.judegAdmin();
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("user")) || "";
  },
  methods: {
    // 判断是否是管理员
    judegAdmin() {
      this.userInfo.role == "admin"
        ? (config.routes[3].children[2].meta.invisible = false)
        : (config.routes[3].children[2].meta.invisible = true);
      console.info(
        "%c合肥第一房!!!",
        "color: #9a699a; font-size: 30px; font-family: sans-serif"
      );
    },
    // 选择tab栏
    changeTab(key) {
      this.chooseTypeNum = key;
    },
    // 选择类型
    chooseType(index) {
      this.typeArr.forEach((v, i) => {
        if (index === i && v.value !== "通用词汇") {
          // if (v.isChoose) {
          //   v.isChoose = false
          //   this.number--;
          // } else if (this.number <= 1) {

          //   v.isChoose = true;
          //   this.number++;
          // }
          if (this.number === 2 && !v.isChoose) {
            this.$message.warning("不可以选中超过两个行业");
            return;
          }
          v.isChoose ? this.number-- : this.number++;
          v.isChoose = !v.isChoose;
        }
      });
    },
    // 创建虚拟的tab栏对象
    createTabList() {
      let wordTypeList = {};
      for (let i = 1; i < 6; i++) {
        wordTypeList[i] = {
          list: [],
          name: `${i}级禁用词`,
          level: `${i}`,
        };
      }
      return wordTypeList;
    },
    // 删除多余的tab栏
    deleteTypeList() {
      this.resultTab.forEach((v) => {
        if (v.data.wordTypeList && v.data.word_list) {
          for (let keys in v.data.wordTypeList) {
            v.data.wordTypeList[keys].list == ""
              ? delete v.data.wordTypeList[keys]
              : "";
          }
        }
      });
    },
    // 敏感词分类
    wordTypeClassify(data) {
      // //先循环总共五级禁用词的一个数组
      // //对禁用词数组进行遍历,把对应等级的敏感词推到对应的等级的数组
      // //把空的敏感词等级数组去除,然后遍历出来的tab栏
      let wordTypeList;
      this.resultTab = data.map((i, index) => {
        wordTypeList = this.createTabList();
        i.data.name = `查询结果${index + 1}`;
        // 有违禁词才操作
        if (i.data.word_list.length > 0) {
          i.data.wordTypeList = wordTypeList;
          i.data.text = this.heightLineWord(i);
          i.data.word_list.forEach((v) => {
            for (const key in i.data.wordTypeList) {
              if (v.level == key) {
                i.data.wordTypeList[key].list.push(v);
              }
            }
          });
        }
        return i;
      });
    },
    // 获取当前用户信息
    changeUserInfo() {
      getUserInfo(this.userInfo.accessToken).then((res) => {
        let { textNumber, imgNumber, urlNumber } = res.data.data;
        let userInfo = JSON.parse(localStorage.getItem("user"));
        userInfo.textNumber = textNumber;
        userInfo.imgNumber = imgNumber;
        userInfo.urlNumber = urlNumber;
        this.userInfo = userInfo;
        localStorage.setItem("user", JSON.stringify(userInfo));
      });
    },
    // 判断选中的类型
    judgeSelected() {
      let newArr = [];
      this.typeArr.filter((v) => {
        if (v.isChoose) {
          newArr.push(v.id);
        }
      });
      return newArr.join(",");
    },
    heightLineWord(IFM) {
      const Regx = /^[0-9]*$/;
      //这里的replace的返回值有毛病(不知道为什么,用一个新的值去接收,会接收到未替换的文本,而赋值给原先的值却可以替换成功)
      IFM.data.word_list.forEach((cur) => {
        if (Regx.test(cur.word)) return;
        IFM.data.text = IFM.data.text.replaceAll(
          cur.word,
          `<span style='color:${this.colors[cur.level]}'>${cur.word}</span>`
        );
      });
      return IFM.data.text;
    },
    //判断是否检测出有违禁词
    judgeIllegal() {
      return this.resultTab.every((v) => {
        return v.data.word_list.length > 0;
      });
    },
    // 查询禁用词
    stopWordSearch() {
      let types = {
        1: "text",
        2: "pic",
        3: "url",
      };
      let content = {
        1: this.textContent,
        2: this.fileUrl,
        3: this.linesContentStr,
      }[this.showModel];
      let params = {
        type: Reflect.get(types, this.showModel),
        accessToken: this.userInfo.accessToken,
        businessIds: this.judgeSelected(),
        content,
      };
      if (
        (!this.textContent && !this.fileList.length && !this.urlContent) ||
        this.linesCount > 5
      ) {
        this.$message.warning("查询内容为空或搜索内容超过限制");
      } else {
        this.loading = true;
        search(params).then((res) => {
          const { data, code } = res.data;
          if (code === 500) {
            this.$message.error(res.data.message);
          } else {
            this.loading = false;
            this.$message.success("查询成功");
            this.changeUserInfo();
            this.wordTypeClassify(data);
            this.deleteTypeList();
            this.searchedType = this.showModel;
            this.showModel == 1
              ? (this.richText = this.heightLineWord(this.resultTab[0]))
              : "";
            this.judgeIllegal() ? "" : this.openNotification();
          }
        });
      }
    },

    // 提示
    openNotification() {
      this.$notification.open({
        message: "温馨提示",
        description: "没有检测到违禁词",
        icon: <a-icon type="smile" style="color: #108ee9" />,
      });
    },
    //重新输入
    resetContent() {
      switch (this.showModel) {
        case "1":
          this.textContent = "";
          this.richText = "";
          break;
        case "2":
          this.fileList = [];
          break;
        case "3":
          this.linesContentStr = "";
          this.linesCount = 0;
          this.urlContent = "";
          break;
      }
    },
    //删除指定等级
    deleteLevel(level) {
      this.removeElement(Reflect.get(this.rgbColors, level));
      //     // this.richText = this.richText.replace(
      //     //   /(?<=style=')[\s*color:\s*#c1cace\s*]*?(?=')/gi,
      //     //   "display:none"
      //     // );
    },
    // 删除全部禁用词
    deleteAllWord() {
      const dom = new DOMParser().parseFromString(
        this.resultTab[this.chooseTypeNum].data.text,
        "text/html"
      );
      Array.from(dom.querySelectorAll("*")).forEach((node) => {
        if (node.tagName == "SPAN") {
          node.remove();
        }
      });
      this.resultTab[this.chooseTypeNum].data.text = dom.body.innerHTML;
      if (this.searchedType == 1) {
        this.richText = dom.body.innerHTML;
      }
      this.$message.success("删除成功");
    },
    //下载结果
    downLoadRes(item) {
      location.href = `${this.baseUrl}/home/download_result?id=${item.code}`;
    },
    // 复制结果
    copyToClip(content) {
      var aux = document.createElement("input");
      aux.setAttribute("value", content);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
      this.$message.success("复制成功");
    },
    // 删除元素
    removeElement(color) {
      // dom节点会把十六进制解析成rgb格式
      const dom = new DOMParser().parseFromString(
        this.resultTab[this.chooseTypeNum].data.text,
        "text/html"
      );
      Array.from(dom.querySelectorAll("*")).forEach((node) => {
        if (node.style.color == color) {
          node.remove();
        }
      });
      this.resultTab[this.chooseTypeNum].data.text = dom.body.innerHTML;
      if (this.searchedType == 1) {
        this.richText = dom.body.innerHTML;
      }
      this.$message.success("删除成功");
    },
    //复制结果事件
    copyResult(res) {
      const reg2 = /(<\/?span.*?>)/gi;
      this.copyToClip(res.replace(reg2, ""));
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      // https://firsthouse.oss-cn-shanghai.aliyuncs.com/
      this.fileList = fileList;
      setTimeout(() => {
        let res = this.fileList[0].response;
        this.fileUrl =
          "https://firsthouse.oss-cn-shanghai.aliyuncs.com/" + res.data;
      }, 500);
    },
    // 检测当前文本行数
    judgeLineCount(value) {
      const lines = value.split(/\r*\n/);
      this.linesContentStr = lines.join(",");
      this.linesCount =
        lines.length - (navigator.userAgent.indexOf("MSIE") !== -1);
      if (this.linesCount > 5) {
        this.$message.warning("每一次查询不可超过五条");
      }
    },
    // 查网址change事件
    changeSearchUrl() {
      this.judgeLineCount(this.urlContent);
    },
    // 查看禁用词
    handleSearchMask() {
      this.isShowWordMask = true;
      let textArr = {
        1: this.resultTab[0].data.text,
        2: this.resultTab[0].data.text,
        3: this.resultTab[this.chooseTypeNum].data.text,
      };
      this.searchMaskStr = Reflect.get(textArr, this.searchedType);
    },
  },
};
</script>
<style scoped>
/* tile uploaded pictures */
.upload-list-inline >>> .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline >>> .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline >>> .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
}
</style>
<style scoped lang="less">
.menuBox {
  margin-top: 20px;
  box-sizing: border-box;
  padding: 40px 50px;
  width: 100%;
  min-height: 350px;
  background: #ffffff;
  box-shadow: 0px 0px 13px 0px rgba(5, 78, 117, 0.17);
  &_title {
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #595a5a;
  }

  &_typeBox {
    margin: 30px 0 20px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 110px);
    grid-gap: 25px;
    .active {
      background-color: #36b5ff;
      color: #ffffff;
      position: relative;
      width: 120px;
      height: 38px;
    }
    .button {
      position: relative;
      width: 120px;
      height: 38px;
    }
    .choose {
      color: #44a8df;
      position: absolute;
      top: -11px;
      right: -11px;
      z-index: 9999;
    }
  }

  &_tips {
    font-size: 15px;
    font-weight: 300;
    color: #595a5a;
    line-height: 20px;
  }

  &_attention {
    border-top: 3px solid #389cd8;
    margin-top: 20px;
    width: 100%;
    min-height: 62px;
    background: #ceeeff;
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    font-size: 18px;
    line-height: 20px;
  }
}

textarea:focus {
  box-shadow: 0px 0px 10px 0px rgba(127, 127, 127, 0.1);
  border-color: #ffad01;
}
.searchBox {
  box-sizing: border-box;
  padding: 0 25px;
  margin-top: 30px;
  width: 100%;
  min-height: 462px;
  background: #ffffff;
  box-shadow: 0px 0px 13px 0px rgba(5, 78, 117, 0.17);
  border-radius: 30px;
  .searchBox_content {
    height: 328px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e0e6f1;
    .importNum {
      position: absolute;
      bottom: 0;
      right: calc(52%);
      font-size: 18px;
      color: #595a5a;
    }
    .searchBox_importContent {
      position: relative;
      height: 100%;
      flex: 1;
      outline: none;
      resize: none;
      border: 0px;
      padding: 0 5px 25px 0px;
    }
    .searchBox_callBackContent {
      padding-left: 10px;
      height: 100%;
      border-left: 1px solid #e0e6f1;
      flex: 1;
      overflow-y: auto;
    }
  }
  .searchButtonBox {
    padding-left: calc(10%);
    display: flex;
    align-items: center;
    width: 100%;
    height: 77px;
    position: relative;
    justify-content: space-between;
  }
  .searchButBox {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    margin-right: 20x;
  }
  .residueNum {
    font-weight: 300;
  }
  .heightLine {
    vertical-align: top;
    margin-left: 10px;
    color: red;
  }
}
.searchPhotoBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 328px;
  width: 100%;
  border-bottom: 1px solid #e0e6f1;
}
.serachResultBox {
  margin-top: -15px;
  padding: 0 40px 20px 40px;
  box-sizing: border-box;
  width: 100%;
  min-height: 170px;
  background: #ffffff;
  box-shadow: 0px 0px 13px 0px rgba(5, 78, 117, 0.17);
  // border-radius: 30px;
  .title {
    box-sizing: border-box;
    padding: 0 40px;
    margin: 0 -40px;
    height: 65px;
    background: #c3e1f3;
    display: flex;
    align-items: center;
    border-radius: 30px 30px 0px 0px;
    font-size: 20px;
    font-weight: 400;
  }

  .tagBox {
    display: flex;
    align-items: center;
    .tagBox_item {
      min-width: 197px;
      height: 34px;
      background: #f3f9fe;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 30px 10px 30px 0;
      .tagBox_item_level {
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 47px;
        height: 100%;
        background: #c1cace;
        border-radius: 5px 0px 0px 5px;
      }

      .tagBox_item_tips {
        margin-left: 11px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #828282;
        flex: 1;
      }
    }
  }
}
.handleButton {
  margin-right: 15px;
}
.explainBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .explainTitle {
    font-size: 25px;
    font-weight: 500;
    color: #323333;
    .explainHeightLine {
      font-size: 25px;
      color: #4eb9e2;
    }
  }

  .explainHandle {
  }
}
.explainContent {
  color: black;
  .heightLine {
    color: #4eb9e2;
    cursor: pointer;
  }
}
.cardBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  .cardBtn {
    display: inline;

    margin: 0px 20px 10px 0px;
  }
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
//茶网址
.searchUrlBox {
  height: 328px;
  width: 100%;
  border-bottom: 1px solid #e0e6f1;
  .searchBox_importContent {
    position: relative;
    height: 100%;
    flex: 1;
    outline: none;
    resize: none;
    border: 0px;
    padding: 0 5px 25px 0px;
  }
  .importNum {
    position: absolute;
    bottom: 0;
    right: calc(2%);
    font-size: 18px;
    color: #595a5a;
  }
}
</style>