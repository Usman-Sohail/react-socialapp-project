export const FETCH_POSTS_API = "https://jsonplaceholder.typicode.com/posts";
export const FETCH_COMMENTS_API = (postId) =>
  `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
