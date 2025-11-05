// TanStack Query 之前叫做 React Query，用于管理异步数据的状态和缓存
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from 'react-router';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

import {toast} from 'sonner';
import type {UserInfo, UserToken} from '#/entity';
import {StorageEnum} from '#/enum';
import userService, {type SignInReq} from '@/api/services/userService';

const {VITE_APP_HOMEPAGE: HOMEPAGE} = import.meta.env;

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  // 使用actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: Partial<UserInfo>) => void;
    setUserToken: (token: UserToken) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>()(
  // persist 持久化存储
  persist(
    (set) => ({
      userInfo: {},
      userToken: {},
      actions: {
        setUserInfo: (userInfo: Partial<UserInfo>) => {
          set({userInfo});
        },
        setUserToken: (token: UserToken) => {
          set({userToken: token});
        },
        clearUserInfoAndToken: () => {
          set({userInfo: {}, userToken: {}});
        },
      },
    }),
    {
      name: StorageEnum.UserInfo,
      // 存储方式为 localStorage
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        [StorageEnum.UserInfo]: state.userInfo,
        [StorageEnum.UserToken]: state.userToken,
      }),
    }
  )
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () =>
  useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);
export const useSignIn = () => {
  const navigate = useNavigate();
  const {setUserInfo, setUserToken} = useUserActions();
  //useMutation  用于创建/更新/删除数据或执行服务器端副作用
  const signInMutation = useMutation({
    mutationFn: userService.signin,
  });

  const signIn = async (data: SignInReq) => {
    try {
      const res = await signInMutation.mutateAsync(data);
      console.log('🚀 ~ signIn ~ res:', res);
      const {user, accessToken, refreshToken} = res;
      setUserInfo(user);
      setUserToken({accessToken, refreshToken});
      navigate(HOMEPAGE, {replace: true});
      toast.success('Sign in successfully');
    } catch (error: any) {
      toast.error(error.message, {
        position: 'top-center',
      });
    }
  };

  return signIn;
};

export default useUserStore;
