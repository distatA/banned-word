<template>
  <div>
    <a-form layout="horizontal" :form="form">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="账户"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input placeholder="请输入" v-decorator="['account']" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="手机号码"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input placeholder="请输入" v-decorator="['mobile']" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="公司名称"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              style="width: 100%"
              placeholder="请输入"
              v-decorator="['company']"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="审核状态"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select placeholder="请选择" v-decorator="['verify']">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="not">待审核</a-select-option>
              <a-select-option value="finish">审核通过</a-select-option>
              <a-select-option value="fail">审核不通过</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item
            label="启用状态"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select placeholder="请选择" v-decorator="['status']">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="normal">启用</a-select-option>
              <a-select-option value="freeze">禁用</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <span style="float: right; margin-top: 3px">
        <a-button type="primary" @click="getSearchList()">查询</a-button>
      </span>
    </a-form>
    <a-space class="operator">
      <a-button @click="addUser = true" type="primary">新增账户</a-button>
    </a-space>
    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="data"
      style="background: white; margin-top: 30px"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <a
        slot="account"
        slot-scope="text, record"
        @click="toSearchList(record)"
        >{{ text }}</a
      >
      <span slot="state" slot-scope="text, record">
        <a-switch
          :checked="record.status === 'normal' ? true : false"
          @change="onChange($event, record.id)"
      /></span>
      <span slot="tags" slot-scope="text, record">
        <a-tag color="green" v-if="record.verify === 'finish'"> 通过</a-tag>
        <a-tag color="red" v-if="record.verify === 'fail'"> 不通过 </a-tag>
        <a-tag color="orange" v-if="record.verify === 'not'"> 未审核 </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-divider type="vertical" />
        <a @click="showModal(record)" v-if="record.verify !== 'not'">设置</a>
        <a v-else @click="showModal(record)">审核</a>
        <a-divider type="vertical" />
        <a @click="handleDelete(record.id)">删除</a>
      </span>
    </a-table>
    <!--  -->
    <!-- 审核 -->
    <a-modal
      v-model="visible"
      title="违禁词查询"
      @ok="handleChange"
      :width="1000"
    >
      <a-form layout="horizontal">
        <a-row>
          <div class="title">{{ changeSet.company }}</div>
        </a-row>
        <a-row>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="账户"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <span>{{ changeSet.account }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="手机号码"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <span>{{ changeSet.mobile }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="行业"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <span>{{ changeSet.industry }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="注册时间"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <span>{{ changeSet.createTime }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24" v-if="isVerify === true">
            <a-form-item
              label="审核"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-tag color="green" v-if="changeSet.verify === 'finish'">
                通过</a-tag
              >
              <a-tag color="red" v-if="changeSet.verify === 'fail'">
                不通过
              </a-tag>
              <a-tag color="orange" v-if="changeSet.verify === 'not'">
                未审核
              </a-tag>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24" v-else>
            <a-form-item
              label="审核"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-radio-group v-model="verifyAttitude">
                <a-radio value="finish"> 通过 </a-radio>
                <a-radio value="fail"> 不通过 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item
              label="审核账户"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <span>diyifang</span>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="12" :sm="24">
            <a-form-item
              label="审核时间"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <span>{{ changeSet.createTime }}</span>
            </a-form-item>
          </a-col> -->
        </a-row>
        <a-row v-if="isVerify === true">
          <a-col :md="6" :sm="24">
            <a-form-item
              label="总数"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 15, offset: 1 }"
            >
              <a-input
                disabled
                :value="
                  Number(changeSet.textNumber) + Number(changeSet.imgNumber)
                "
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="文字数"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 15, offset: 1 }"
            >
              <a-input v-model="changeSet.textNumber" :maxNumber="maxNumber" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item
              label="图片数"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 15, offset: 1 }"
            >
              <a-input v-model="changeSet.imgNumber" :maxNumber="maxNumber" />
            </a-form-item>
          </a-col>
            <a-col :md="6" :sm="24">
            <a-form-item
              label="网址数"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 15, offset: 1 }"
            >
              <a-input v-model="changeSet.urlNumber" :maxNumber="maxNumber" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="isVerify === true">
          <div style="float: right">
            当前可用查询次数： [ 文字数<span class="num">{{
              Number(changeSet.textNumber)
            }}</span>
            / 图片数<span class="num">{{ Number(changeSet.imgNumber) }}</span> /
            网址数<span class="num">{{ Number(changeSet.urlNumber) }}</span
            >]
          </div>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 新增 -->
    <a-modal v-model="addUser" title="新增账户  " @ok="handleOk" centered>
      <a-form
        :form="addForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="账号">
          <a-input
            v-decorator="[
              'account',
              {
                rules: [{ required: true, message: '账号未填写!' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input
            type="password"
            v-decorator="[
              'password',
              {
                rules: [{ required: true, message: '密码未填写!' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input
            :maxLength="maxNumber"
            v-decorator="[
              'mobile',
              {
                rules: [{ required: true, message: '手机号未填写!' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="公司名称">
          <a-input
            v-decorator="[
              'company',
              {
                rules: [{ required: true, message: '公司名称未填写!' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="行业">
          <a-select
            v-decorator="[
              'industry',
              {
                rules: [{ required: true, message: '行业未填写!' }],
              },
            ]"
            @change="handleSelectChange"
          >
            <a-select-option value="房产置业"> 房产置业 </a-select-option>
            <a-select-option value="电子"> 电子 </a-select-option>
            <a-select-option value="汽车制造"> 汽车制造 </a-select-option>
            <a-select-option value="电子商务"> 电子商务 </a-select-option>
            <a-select-option value="设计"> 设计 </a-select-option>
            <a-select-option value="医药"> 医药 </a-select-option>
            <a-select-option value="现代物流"> 现代物流 </a-select-option>
            <a-select-option value="金融"> 金融 </a-select-option>
            <a-select-option value="建筑"> 建筑 </a-select-option>
            <a-select-option value="销售"> 销售 </a-select-option>
            <a-select-option value="IT"> IT </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getAccountList, addUser, changeUser } from "@/services/user";
const columns = [
  {
    title: "账户",
    dataIndex: "account",
    scopedSlots: { customRender: "account" },
    align: "center",
  },
  {
    title: "手机号码",
    dataIndex: "mobile",
    align: "center",
  },
  {
    title: "启用状态",
    scopedSlots: { customRender: "state" },
    align: "center",
  },
  {
    title: "公司名称",
    dataIndex: "company",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
  },
  {
    title: "审核状态",
    dataIndex: "tags",
    scopedSlots: { customRender: "tags" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  data() {
    return {
      data: [],
      columns,
      maxNumber: 11,
      pageIndex: 1,
      pageSize: 10,
      visible: false,
      isVerify: true, //是否已经审核
      addUser: false,
      addForm: this.$form.createForm(this),
      registerForm: this.$form.createForm(this),
      form: this.$form.createForm(this),
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        showTotal: (total) => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50"],
      },
      loading: false,
      changeSet: "", //设置弹框内容回显
      verifyAttitude: "finish",
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    toSearchList(e) {
      this.$router.push({
        path: "/menu/search",
        query: {
          account: e.account,
        },
      });
    },
    // 提示
    tips(res) {
      if (res.data.code === 200) {
        this.$message.success("操作成功", 3);
      } else {
        this.$message.error("操作失败", 3);
      }
    },
    // 查询
    getSearchList() {
      this.pageIndex = 1;
      this.pagination.current = 1;
      this.searchList();
    },
    // 获取列表
    searchList() {
      this.loading = true;
      let pageValue = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };
      let params = Object.assign(pageValue, this.form.getFieldsValue());
      getAccountList(params).then((res) => {
        const { data } = res.data;
        this.data = data.list;
        this.pagination.total = data.total;
        this.loading = false;
      });
    },
    //修改
    onChange(checked, id) {
      console.log(id);
      let params = { id, status: checked ? "normal" : "freeze" };
      changeUser(params).then((res) => {
        this.tips(res);
        this.searchList();
      });
    },
    showModal(e) {
      this.changeSet = e;
      this.changeSet.verify !== "not"
        ? (this.isVerify = true)
        : (this.isVerify = false);
      this.visible = true;
    },
    // 新增账户
    handleOk() {
      this.addForm.validateFields((err, values) => {
        if (!err) {
          addUser(values).then((res) => {
            this.tips(res);
            this.addUser = false;
            this.searchList();
          });
        }
      });
    },
    // 审核或设置修改
    handleChange() {
      let verifyParams = { id: this.changeSet.id, verify: this.verifyAttitude };
      let changeParams = {
        id: this.changeSet.id,
        textNumber: Number(this.changeSet.textNumber),
        imgNumber: Number(this.changeSet.imgNumber),
        urlNumber: Number(this.changeSet.urlNumber),

      };
      switch (this.isVerify) {
        case true:
          changeUser(changeParams).then((res) => {
            this.tips(res);
            this.searchList();
            this.visible = false;
          });
          break;
        case false:
          changeUser(verifyParams).then((res) => {
            this.tips(res);
            this.searchList();
            this.visible = false;
          });
          break;
        default:
          break;
      }
    },
    handleSelectChange(value) {
      console.log(value);
      this.addForm.setFieldsValue({
        industry: `${value}`,
      });
    },
    // 分页
    handleTableChange(pagination) {
      this.pagination = pagination;
      this.pageIndex = pagination.current;
      this.searchList();
    },
    // 删除
    handleDelete(id) {
      let that = this;
      this.$confirm({
        title: "是否确认删除?",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          let params = { id, isDelete: "y" };
          changeUser(params).then((res) => {
            that.tips(res);
            that.searchList();
            that.visible = false;
          });
        },
        onCancel() {},
      });
    },
  },
};
</script>

<style scoped lang="less">
.num {
  color: red;
  margin: 0 5px;
}
/deep/.ant-table-pagination.ant-pagination {
  margin: 16px !important;
}
.title {
  text-align: center;
  margin: 0 auto;
  font-size: 25px;
  margin-bottom: 30px;
}
</style>