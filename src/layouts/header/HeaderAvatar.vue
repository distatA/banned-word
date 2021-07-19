<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar
        class="avatar"
        size="small"
        shape="circle"
        src="https://firsthouse.oss-cn-shanghai.aliyuncs.com/blog/2021-06-22/921de975d29244678a65d708fbd08ec8-Pn0twZ2wqufI0d55ed8bcf20e4cefa189a4e107b119a"
      />
      <span class="name">{{ user.company }}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item>
        <a-icon type="setting" />
        <span @click="toChangePassword">修改密码</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { toLoggout, logout } from "@/services/user";
export default {
  name: "HeaderAvatar",
  data() {
    return {
      user: "",
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user")) || "";
  },
  methods: {
    logout() {
      toLoggout(this.user.accessToken).then((res) => {
        if (res.data.code === 200) {
          logout();
          this.$router.replace("/login");

          // window.opener = null;
          // window.open(" ", "_self");
          // window.close();
          // window.open("/login");
        }
      });
    },
    toChangePassword() {
      this.$router.push({
        path: "/login",
        query: {
          isShowPwd: true,
        },
      });
    },
  },
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
  }
  .name {
    font-weight: 500;
  }
}
.avatar-menu {
  width: 150px;
}
</style>
