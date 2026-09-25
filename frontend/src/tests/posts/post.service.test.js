import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createPostApi,
  getMyPostsApi,
  deletePostApi,
  getGlobalFeedApi,
  toggleLikeApi,
  getFriendsFeedApi,
  toggleSavePostApi,
  getSavedPostsApi,
} from "../../features/posts/services/post.service";

import api from "../../api/axios";

// Mock axios instance
vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Post Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-FE-POST-001
  test("should create a post", async () => {
    const formData = new FormData();

    formData.append("description", "My first post");

    api.post.mockResolvedValue({
      data: {
        success: true,
        message: "Post created successfully",
        data: {
          id: 1,
          description: "My first post",
        },
      },
    });

    const result = await createPostApi(formData);


    expect(api.post).toHaveBeenCalledWith(
      "/posts",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    expect(result.success).toBe(true);
    expect(result.data.description).toBe("My first post");
  });

  // TC-FE-POST-002
  test("should get my posts", async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 1,
            description: "My post",
          },
        ],
      },
    });

    const result = await getMyPostsApi();

    expect(api.get).toHaveBeenCalledTimes(1);

    expect(api.get).toHaveBeenCalledWith(
      "/posts/my-posts?page=1&limit=5"
    );

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });


  // TC-FE-POST-004
  test("should delete a post", async () => {
    api.delete.mockResolvedValue({
      data: {
        success: true,
        message: "Post deleted successfully",
      },
    });

    const result = await deletePostApi(10);

    expect(api.delete).toHaveBeenCalledTimes(1);

    expect(api.delete).toHaveBeenCalledWith("/posts/10");

    expect(result.success).toBe(true);
  });

  // TC-FE-POST-005
  test("should get global feed", async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 1,
            description: "Global post",
          },
        ],
      },
    });

    const result = await getGlobalFeedApi();

    expect(api.get).toHaveBeenCalledTimes(1);

    expect(api.get).toHaveBeenCalledWith(
      "/posts/feed?page=1&limit=5"
    );

    expect(result.success).toBe(true);
  });

  // TC-FE-POST-006
  test("should toggle like on a post", async () => {
    api.post.mockResolvedValue({
      data: {
        success: true,
        liked: true,
      },
    });

    const result = await toggleLikeApi(25);

    expect(api.post).toHaveBeenCalledTimes(1);

    expect(api.post).toHaveBeenCalledWith(
      "/likes/25/toggle"
    );

    expect(result.success).toBe(true);
    expect(result.liked).toBe(true);
  });

  // TC-FE-POST-007
  test("should get friends feed", async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 2,
            description: "Friend post",
          },
        ],
      },
    });

    const result = await getFriendsFeedApi();

    expect(api.get).toHaveBeenCalledTimes(1);

    expect(api.get).toHaveBeenCalledWith(
      "/posts/friends-feed?page=1&limit=5"
    );

    expect(result.success).toBe(true);
  });

  // TC-FE-POST-008
  test("should save a post", async () => {
    api.post.mockResolvedValue({
      data: {
        success: true,
        message: "Post saved successfully",
      },
    });

    const result = await toggleSavePostApi(30);

    expect(api.post).toHaveBeenCalledTimes(1);

    expect(api.post).toHaveBeenCalledWith(
      "/posts/30/save"
    );

    expect(result.success).toBe(true);
  });

  // TC-FE-POST-009
  test("should get saved posts", async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 30,
            description: "Saved post",
          },
        ],
      },
    });

    const result = await getSavedPostsApi();

    expect(api.get).toHaveBeenCalledTimes(1);

    expect(api.get).toHaveBeenCalledWith(
      "/posts/saved?page=1&limit=5"
    );

    expect(result.success).toBe(true);
  });

});