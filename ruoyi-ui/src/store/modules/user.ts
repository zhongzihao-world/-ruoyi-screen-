import { defineStore } from 'pinia';

import { login, logout, getInfo } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    userInfo: {} as any,
  }),
  actions: {
    // 登录
    login(userInfo: any) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise<void>((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res: any) => {
            setToken(res.token);
            this.token = res.token;
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res: any) => {
            const user = res.user;
            const avatar =
              user.avatar == '' || user.avatar == null
                ? ''
                : import.meta.env.VITE_APP_BASE_API + user.avatar;

            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles;
              this.permissions = res.permissions;
            } else {
              // @ts-ignore
              this.roles = ['ROLE_DEFAULT'];
            }
            this.name = user.userName;
            this.avatar = avatar;
            this.userInfo = user;
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 退出系统
    logOut() {
      return new Promise<void>((resolve, reject) => {
        logout()
          .then(() => {
            this.token = '';
            this.roles = [];
            this.permissions = [];
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
});

export default useUserStore;
