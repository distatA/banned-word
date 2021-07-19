<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <!-- <img alt="logo" class="logo" src="@/assets/img/logo.png" /> -->
        <span class="title">上海学纬智能科技有限公司</span>
      </div>
      <div class="desc"><img src="../../assets/img/xunfei.png" alt="" /></div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs
          size="large"
          :tabBarStyle="{ textAlign: 'center' }"
          style="padding: 0 2px; color: white"
          v-model="activeKey"
        >
          <a-tab-pane tab="账户密码登录" key="1">
            <a-alert
              type="error"
              :closable="true"
              v-show="error"
              :message="error"
              showIcon
              style="margin-bottom: 24px"
            />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入账户名"
                v-decorator="[
                  'account',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入账户名',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="手机号登录" key="2">
            <a-form-item>
              <a-input
                :maxNumber="maxNumber"
                size="large"
                placeholder="请输入手机号"
                v-decorator="[
                  'mobile',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input
                    size="large"
                    placeholder="请输入验证码"
                    v-decorator="[
                      'code',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入验证码',
                            whitespace: true,
                          },
                        ],
                      },
                    ]"
                  >
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button
                    style="width: 100%"
                    class="captcha-button"
                    size="large"
                    @click="verifyCode(1)"
                    :disabled="isDisabled"
                    >{{ verifyState }}</a-button
                  >
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a @click="registerVisible = true">注册账户</a>
          <a style="float: right" @click="changePsdVisible = true">忘记密码</a>
        </div>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
    <div>
      <!-- 注册用户 -->
      <a-modal
        v-model="registerVisible"
        title="注册账户  "
        @ok="handleRegister"
        centered
      >
        <a-form
          :form="registerForm"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          @submit="handleRegister"
        >
          <a-form-item label="账号">
            <a-input
              v-decorator="[
                'account',
                {
                  rules: [{ required: true, message: '请输入账号!' }],
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
                  rules: [{ required: true, message: '请输入账号密码!' }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="手机号">
            <a-input
              :maxNumber="maxNumber"
              v-decorator="[
                'mobile',
                {
                  rules: [{ required: true, message: '请输入手机号!' }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="手机验证码">
            <a-row :gutter="8" style="margin: 0 -4px">
              <a-col :span="16">
                <a-input
                  size="large"
                  v-decorator="[
                    'code',
                    {
                      rules: [{ required: true, message: '请输入手机验证码!' }],
                    },
                  ]"
                >
                </a-input>
              </a-col>
              <a-col :span="8" style="padding-left: 4px">
                <a-button
                  style="width: 100%"
                  class="captcha-button"
                  size="large"
                  @click="verifyCode(2)"
                  :disabled="isDisabled2"
                  >{{ verifyState2 }}</a-button
                >
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="公司名称">
            <a-input
              v-decorator="[
                'company',
                {
                  rules: [{ required: true, message: '请输入公司名称!' }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="行业">
            <a-select
              v-decorator="[
                'industry',
                {
                  rules: [{ required: true, message: '请输入所在行业!' }],
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
      <!-- 修改密码 -->
      <a-modal
        v-model="changePsdVisible"
        title="修改密码  "
        @ok="handleChangePassword"
        centered
      >
        <a-form
          :form="psdForm"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          @submit="handleChangePassword"
        >
          <a-form-item label="手机号">
            <a-input
              :maxNumber="maxNumber"
              v-decorator="[
                'mobile',
                {
                  rules: [{ required: true, message: '请输入手机号!' }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="手机验证码">
            <a-row :gutter="8" style="margin: 0 -4px">
              <a-col :span="16">
                <a-input
                  size="large"
                  v-decorator="[
                    'code',
                    {
                      rules: [{ required: true, message: '请输入验证码!' }],
                    },
                  ]"
                >
                </a-input>
              </a-col>
              <a-col :span="8" style="padding-left: 4px">
                <a-button
                  style="width: 100%"
                  class="captcha-button"
                  size="large"
                  @click="verifyCode(3)"
                  :disabled="isDisabled3"
                  >{{ verifyState3 }}</a-button
                >
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="新密码">
            <a-input
              type="password"
              v-decorator="[
                'newPwd',
                {
                  rules: [{ required: true, message: '请输入新密码!' }],
                },
              ]"
            />
          </a-form-item>

          <a-form-item label="确认密码">
            <a-input
              type="password"
              v-decorator="[
                'comFirmPwd',
                {
                  rules: [{ required: true, message: '确认密码!' }],
                },
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import {
  login,
  // getRoutesConfig,
  registerUser,
  getCode,
  changePwd,
} from "@/services/user";
import { setAuthorization } from "@/utils/request";
// import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";
export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      activeKey: "1",
      maxNumber: 11,
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      psdForm: this.$form.createForm(this),
      registerForm: this.$form.createForm(this),
      visible: false,
      registerVisible: false,
      changePsdVisible: false,
      isDisabled: false,
      isDisabled2: false,
      isDisabled3: false,
      verifyState: "获取验证码",
      verifyState2: "获取验证码",
      verifyState3: "获取验证码",
    };
  },
  watch: {
    activeKey(newValue) {
      console.log(newValue);
    },
  },
  mounted() {
    if (this.$route.query.isShowPwd) {
      this.changePsdVisible = true;
    }
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    //倒计时
    verifyCode(type) {
      switch (type) {
        case 1:
          if (this.form.getFieldsValue().mobile) {
            this.waitCode(type);
            this.sendCode(type);
            setTimeout(() => {
              this.isDisabled = true;
            }, 1000);
          } else {
            this.$message.error("手机号码为空");
          }

          break;
        case 2:
          if (this.registerForm.getFieldsValue().mobile) {
            this.waitCode(type);
            this.sendCode(type);
            setTimeout(() => {
              this.isDisabled2 = true;
            }, 1000);
          } else {
            this.$message.error("手机号码为空");
          }
          break;
        case 3:
          if (this.psdForm.getFieldsValue().mobile) {
            this.waitCode(type);
            this.sendCode(type);
            setTimeout(() => {
              this.isDisabled3 = true;
            }, 1000);
          } else {
            this.$message.error("手机号码为空");
          }
          break;
        default:
          break;
      }
    },
    // 验证码定时器
    waitCode(type) {
      let interval;
      let currentTime = 60;
      switch (type) {
        case 1:
          interval = setInterval(() => {
            currentTime--;
            this.verifyState = currentTime + "s";
            if (currentTime <= 0) {
              clearInterval(interval);
              this.verifyState = "获取验证码";
              currentTime = 60;
              this.isDisabled = false;
            }
          }, 1000);
          break;
        case 2:
          interval = setInterval(() => {
            currentTime--;
            this.verifyState2 = currentTime + "s";
            if (currentTime <= 0) {
              clearInterval(interval);
              this.verifyState2 = "获取验证码";
              currentTime = 60;
              this.isDisabled2 = false;
            }
          }, 1000);
          break;
        case 3:
          interval = setInterval(() => {
            currentTime--;
            this.verifyState3 = currentTime + "s";
            if (currentTime <= 0) {
              clearInterval(interval);
              this.verifyState3 = "获取验证码";
              currentTime = 60;
              this.isDisabled3 = false;
            }
          }, 1000);
          break;
        default:
          break;
      }
    },
    // 注册用户提交
    handleRegister(e) {
      e.preventDefault();
      this.registerForm.validateFields((err, values) => {
        if (!err) {
          this.register(values);
        }
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
    // 注册
    register(values) {
      registerUser(values).then((res) => {
        this.tips(res);
        this.registerVisible = false;
      });
    },
    // 发送验证码
    sendCode(type) {
      switch (type) {
        case 1:
          getCode(this.form.getFieldsValue().mobile, "login").then((res) => {
            this.tips(res);
          });
          break;
        case 2:
          getCode(this.registerForm.getFieldsValue().mobile, "register").then(
            (res) => {
              this.tips(res);
            }
          );
          break;
        case 3:
          getCode(this.psdForm.getFieldsValue().mobile, "edit").then((res) => {
            this.tips(res);
          });
          break;
        default:
          break;
      }
    },
    // 修改密码
    handleChangePassword(e) {
      console.log(e);
      this.psdForm.validateFields((err) => {
        if (!err) {
          this.psdForm.getFieldValue("code");
          if (
            this.psdForm.getFieldValue("newPwd") ===
            this.psdForm.getFieldValue("comFirmPwd")
          ) {
            let params = {
              mobile: this.psdForm.getFieldValue("mobile"),
              code: this.psdForm.getFieldValue("code"),
              newPwd: this.psdForm.getFieldValue("newPwd"),
            };
            changePwd(params).then((res) => {
              this.tips(res);
            });
          } else {
            this.$message.error("两次输入的密码不一致", 3);
          }
        }
      });
    },
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    onSubmit(e) {
      let params;
      e.preventDefault();
      this.form.validateFields((err) => {
        switch (this.activeKey) {
          case "1":
            params = {
              type: "pwd",
              account: this.form.getFieldValue("account"),
              password: this.form.getFieldValue("password"),
            };
            break;
          case "2":
            params = {
              type: "code",
              code: this.form.getFieldValue("code"),
              mobile: this.form.getFieldValue("mobile"),
            };
            break;
          default:
            break;
        }
        if (!err) {
          this.logging = true;
          login(params).then(this.afterLogin);
        } else if (
          this.form.getFieldValue("code") &&
          this.form.getFieldValue("mobile")
        ) {
          login(params).then(this.afterLogin);
        } else {
          this.logging = true;
          login(params).then(this.afterLogin);
        }
      });
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code === 200) {
        setAuthorization({
          token: loginRes.data.accessToken,
        });
        localStorage.setItem("user", JSON.stringify(loginRes.data));
        this.$message.success("登录成功", 3);
        // window.close();
        // window.open("/index#/index");
        // location.href = '/index#/index'
        this.$router.push("/index");
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    //选择行业
    handleSelectChange(value) {
      console.log(value);
      this.registerForm.setFieldsValue({
        industry: `${value}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: white;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
