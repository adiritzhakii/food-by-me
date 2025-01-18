import { emptySplitApi as api } from "./emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postAuthRegister: build.mutation<
      PostAuthRegisterApiResponse,
      PostAuthRegisterApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/register`,
        method: "POST",
        body: queryArg.user,
      }),
    }),
    postAuthLogin: build.mutation<
      PostAuthLoginApiResponse,
      PostAuthLoginApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/login`,
        method: "POST",
        body: queryArg.user,
      }),
    }),
    postAuthLogout: build.mutation<
      PostAuthLogoutApiResponse,
      PostAuthLogoutApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/logout`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    postAuthRefresh: build.mutation<
      PostAuthRefreshApiResponse,
      PostAuthRefreshApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/refresh`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    postAuthOauthRegister: build.mutation<
      PostAuthOauthRegisterApiResponse,
      PostAuthOauthRegisterApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/oauth-register`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    postAuthOauthLogin: build.mutation<
      PostAuthOauthLoginApiResponse,
      PostAuthOauthLoginApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/oauth-login`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getAuthGetProfile: build.query<
      GetAuthGetProfileApiResponse,
      GetAuthGetProfileApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/getProfile`,
        params: {
          provider: queryArg.provider,
        },
      }),
    }),
    postAuthSetAvatar: build.mutation<
      PostAuthSetAvatarApiResponse,
      PostAuthSetAvatarApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/setAvatar`,
        method: "POST",
        body: queryArg.body,
        params: {
          provider: queryArg.provider,
        },
      }),
    }),
    postAuthEditProfile: build.mutation<
      PostAuthEditProfileApiResponse,
      PostAuthEditProfileApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/editProfile`,
        method: "POST",
        body: queryArg.body,
        params: {
          provider: queryArg.provider,
        },
      }),
    }),
    getComments: build.query<GetCommentsApiResponse, GetCommentsApiArg>({
      query: () => ({ url: `/comments` }),
    }),
    postComments: build.mutation<PostCommentsApiResponse, PostCommentsApiArg>({
      query: (queryArg) => ({
        url: `/comments`,
        method: "POST",
        body: queryArg.comment,
      }),
    }),
    getCommentsById: build.query<
      GetCommentsByIdApiResponse,
      GetCommentsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/comments/${queryArg.id}` }),
    }),
    deleteCommentsById: build.mutation<
      DeleteCommentsByIdApiResponse,
      DeleteCommentsByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/comments/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    getPosts: build.query<GetPostsApiResponse, GetPostsApiArg>({
      query: (queryArg) => ({
        url: `/posts`,
        params: {
          owner: queryArg.owner,
        },
      }),
    }),
    postPosts: build.mutation<PostPostsApiResponse, PostPostsApiArg>({
      query: (queryArg) => ({
        url: `/posts`,
        method: "POST",
        body: queryArg.post,
      }),
    }),
    getPostsById: build.query<GetPostsByIdApiResponse, GetPostsByIdApiArg>({
      query: (queryArg) => ({ url: `/posts/${queryArg.id}` }),
    }),
    deletePostsById: build.mutation<
      DeletePostsByIdApiResponse,
      DeletePostsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/posts/${queryArg.id}`, method: "DELETE" }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as serverApi };
export type PostAuthRegisterApiResponse = /** status 200 The new user */ User;
export type PostAuthRegisterApiArg = {
  user: User;
};
export type PostAuthLoginApiResponse = /** status 200 Successful login */ {
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
};
export type PostAuthLoginApiArg = {
  user: User;
};
export type PostAuthLogoutApiResponse = unknown;
export type PostAuthLogoutApiArg = {
  body: {
    refreshToken?: string;
    provider?: string;
  };
};
export type PostAuthRefreshApiResponse =
  /** status 200 Tokens refreshed successfully */ {
    accessToken?: string;
    refreshToken?: string;
  };
export type PostAuthRefreshApiArg = {
  body: {
    refreshToken?: string;
  };
};
export type PostAuthOauthRegisterApiResponse =
  /** status 200 Successfully registered */ {
    message?: string;
  };
export type PostAuthOauthRegisterApiArg = {
  body: {
    credential?: string;
  };
};
export type PostAuthOauthLoginApiResponse =
  /** status 200 Successfully logged in */ {
    message?: string;
  };
export type PostAuthOauthLoginApiArg = {
  body: {
    crednitail?: string;
  };
};
export type GetAuthGetProfileApiResponse =
  /** status 200 Successfully retrieved profile */ UserDb;
export type GetAuthGetProfileApiArg = {
  provider: ProviderSchema;
};
export type PostAuthSetAvatarApiResponse =
  /** status 200 Successfully set the new avatar */ {
    message?: string;
  };
export type PostAuthSetAvatarApiArg = {
  provider: ProviderSchema;
  body: {
    /** The image file to set as the new avatar */
    image?: Blob;
  };
};
export type PostAuthEditProfileApiResponse =
  /** status 200 Successfully set properties for user */ {
    name?: string;
    email?: string;
    avatar?: string;
  };
export type PostAuthEditProfileApiArg = {
  provider: ProviderSchema;
  body: {
    /** Updated name for user */
    name?: string;
    /** URL for avatar image */
    avatar?: string;
  };
};
export type GetCommentsApiResponse =
  /** status 200 A list of comments */ Comment[];
export type GetCommentsApiArg = void;
export type PostCommentsApiResponse =
  /** status 201 The created comment */ Comment;
export type PostCommentsApiArg = {
  comment: Comment;
};
export type GetCommentsByIdApiResponse =
  /** status 200 A single comment */ Comment;
export type GetCommentsByIdApiArg = {
  /** The comment ID */
  id: string;
};
export type DeleteCommentsByIdApiResponse = unknown;
export type DeleteCommentsByIdApiArg = {
  /** The comment ID */
  id: string;
};
export type GetPostsApiResponse = /** status 200 A list of posts */ Post[];
export type GetPostsApiArg = {
  owner?: any;
};
export type PostPostsApiResponse = /** status 201 The created post */ Post;
export type PostPostsApiArg = {
  post: Post;
};
export type GetPostsByIdApiResponse = /** status 200 A single post */ Post;
export type GetPostsByIdApiArg = {
  /** The post ID */
  id: string;
};
export type DeletePostsByIdApiResponse = unknown;
export type DeletePostsByIdApiArg = {
  /** The post ID */
  id: string;
};
export type User = {
  /** The user name */
  name?: string;
  /** The user email */
  email: string;
  /** The user password */
  password: string;
};
export type UserDb = {
  /** The user name */
  name: string;
  /** The user email */
  email: string;
  /** The user picture, can be url or path in server */
  avatar: string;
  /** List of refreshTokens */
  refreshToken: string[];
};
export type ProviderSchema = "Local" | "Google";
export type Comment = {
  postId?: string;
  comment?: string;
};
export type Post = {
  title: string;
  content: string;
};
export const {
  usePostAuthRegisterMutation,
  usePostAuthLoginMutation,
  usePostAuthLogoutMutation,
  usePostAuthRefreshMutation,
  usePostAuthOauthRegisterMutation,
  usePostAuthOauthLoginMutation,
  useGetAuthGetProfileQuery,
  usePostAuthSetAvatarMutation,
  usePostAuthEditProfileMutation,
  useGetCommentsQuery,
  usePostCommentsMutation,
  useGetCommentsByIdQuery,
  useDeleteCommentsByIdMutation,
  useGetPostsQuery,
  usePostPostsMutation,
  useGetPostsByIdQuery,
  useDeletePostsByIdMutation,
} = injectedRtkApi;
