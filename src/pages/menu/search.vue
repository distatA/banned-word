<template>
  <div>
    <a-form>
      <a-row>
        <a-col :md="14" :sm="24">
          <a-select
            v-model="searchType"
            default-value=""
            style="width: 150px"
            @change="handleChange"
          >
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="text"> 查文字 </a-select-option>
            <a-select-option value="pic"> 查图片 </a-select-option>
            <a-select-option value="url"> 查网址 </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24">
          当前可用查询次数： [ 文字数<span class="num">{{
            userInfo.textNumber ? userInfo.textNumber : 0
          }}</span>
          / 图片数<span class="num">{{
            userInfo.imgNumber ? userInfo.imgNumber : 0
          }}</span
          > / 网址数<span class="num">{{
            userInfo.urlNumber ? userInfo.urlNumber : 0
          }}</span
          > ]
        </a-col>
        <a-col :md="2" :sm="24">
          <a-button
            type="primary"
            style="margin-left: 20px"
            :disabled="!deleteArr"
            @click="deleteSearch('multitude')"
            >批量删除</a-button
          >
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :row-selection="rowSelection"
      rowKey="id"
      :columns="columns"
      :data-source="data"
      style="background: white; margin-top: 30px"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span
        slot="content"
        v-if="searchType == 'pic' || record.type == 'pic'"
        slot-scope="text, record"
        @click="showPreview(record.content)"
      >
        <a href="#">点击预览</a></span
      >
    
      <span slot="content" v-else slot-scope="text, record">
        {{ record.content }}</span
      >
      <span slot="textNumber" slot-scope="text, record"
        >{{ record.textNumber ? record.textNumber : "---" }}
      </span>
      <span slot="picNumber" slot-scope="text, record"
        >{{ record.picNumber ? record.picNumber : "0" }}
      </span>
      <span slot="type" slot-scope="text, record">
        <a v-if="record.type === 'text'">文字</a>
        <a v-if="record.type === 'pic'">图片</a>
        <a v-if="record.type === 'url'">网址</a>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="copy(record)">复制内容</a>
        <a-divider type="vertical" />
        <a @click="deleteSearch(record)">删除</a>
        <a-divider type="vertical" />
        <a @click="showDrawer(record)"> 查看内容</a>
      </span>
    </a-table>
    <a-drawer
      title="查询内容"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="visible = false"
    >
      {{ handleInfo.content }}
    </a-drawer>
    <!-- 预览图片 -->
    <div>
      <a-modal v-model="isPreview" title="预览图片">
        <img :src="previewImg" alt="" class="preview" />
      </a-modal>
    </div>
  </div>
</template>

<script >
import { getSearchList, deleteSearch } from "@/services/user";

const columns = [
  {
    title: "查询内容",
    dataIndex: "content",
    ellipsis: true,
    width: 500,
    align: "center",
    scopedSlots: { customRender: "content" },
  },
  {
    title: "文字数",
    dataIndex: "textNumber",
    scopedSlots: { customRender: "textNumber" },
    align: "center",
  },
  {
    title: "图片数",
    dataIndex: "picNumber",
    scopedSlots: { customRender: "picNumber" },
    align: "center",
  },
  {
    title: "查询类型",
    dataIndex: "type",
    scopedSlots: { customRender: "type" },
    align: "center",
  },
  {
    title: "查询时间",
    dataIndex: "createTime",
    align: "center",
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];

export default {
  data() {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        showTotal: (total) => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50"],
      },
      loading: false,
      size: 100,
      data: [],
      columns,
      visible: false,
      searchType: "", // 查询类型
      userInfo: "",
      account: "", //账户
      handleInfo: "", //正在操作的信息
      deleteArr: "", //删除的数组
      isPreview: false,
      previewImg: "", //正在预览的图排尿
      checkContent: "",
    };
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("user")) || "";
    this.getList(this.$route.query.account ? this.$route.query.account : "");
  },
  methods: {
    // 提示
    tips(res) {
      if (res.data.code === 200) {
        this.$message.success("操作成功", 3);
      } else {
        this.$message.error("操作失败", 3);
      }
    },
    handleChange(value) {
      this.searchType = value;
      this.pagination.current = 1;
      this.getList();
    },
    getList(account = "") {
      this.loading = true;
      let param = {
        account,
        accessToken: this.userInfo.accessToken,
        type: this.searchType,
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      getSearchList(param).then((res) => {
        const { data } = res.data;
        this.data = data.list;
        this.pagination.total = data.total;
        this.loading = false;
      });
    },
    // 分页
    handleTableChange(pagination) {
      this.pagination = pagination;
      this.pageIndex = pagination.current;
      this.getList();
    },
    // 查看
    showDrawer(e) {
      if (this.searchType === "pic" || e.type == 'pic') {
        this.previewImg = e.content;
        this.isPreview = true;
      } else {
        this.handleInfo = e;
        this.visible = true;
      }
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
    // 复制
    copy(e) {
      this.handleInfo = e;
      this.copyToClip(e.content);
    },
    deleteSearch(e) {
      console.log(e);
      let that = this;
      this.handleInfo = e;
      switch (e) {
        case "multitude":
          this.$confirm({
            title: "是否确认删除?",
            okText: "确认",
            cancelText: "取消",
            onOk() {
              let param = {
                accessToken: that.userInfo.accessToken,
                ids: that.deleteArr,
              };
              deleteSearch(param).then((res) => {
                that.tips(res);
                that.getList();
              });
            },
            onCancel() {},
          });
          break;

        default:
          this.$confirm({
            title: "是否确认删除?",
            okText: "确认",
            cancelText: "取消",
            onOk() {
              let param = {
                accessToken: that.userInfo.accessToken,
                ids: e.id + "",
              };
              deleteSearch(param).then((res) => {
                that.tips(res);
                that.getList();
              });
            },
            onCancel() {},
          });
          break;
      }
    },
    //查看图片
    showPreview(e) {
      this.isPreview = true;
      this.previewImg = e;
    },
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          let arr = [...selectedRowKeys].join(",");
          this.deleteArr = arr;
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },
};
</script>

<style scoped lang="less">
.num {
  color: red;
  margin-left: 10px;
}
/deep/.ant-table-pagination.ant-pagination {
  margin: 16px !important;
}
.preview {
  width: 100%;
  height: 50vh;
}
</style>