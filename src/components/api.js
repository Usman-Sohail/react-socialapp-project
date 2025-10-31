export const FETCH_POSTS_API = "https://jsonplaceholder.typicode.com/posts";
export const FETCH_COMMENTS_API = (postId) =>
  `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
export const FETCH_USERS_API = "https://jsonplaceholder.typicode.com/users";