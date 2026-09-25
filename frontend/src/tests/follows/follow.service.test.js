import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../../api/axios";

import {
  getSuggestionsApi,
  sendFollowRequestApi,
  getPendingRequestsApi,
  respondToRequestApi,
  getFriendsApi,
  removeFriendApi,
} from "../../features/follows/services/follow.service";

vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Follow Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get follow suggestions", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: "Ali" },
          { id: 2, name: "Ahmed" },
        ],
      },
    });

    const result = await getSuggestionsApi(5);

    expect(api.get).toHaveBeenCalledWith(
      "/follows/suggestions?limit=5"
    );

    expect(result).toEqual({
      data: [
        { id: 1, name: "Ali" },
        { id: 2, name: "Ahmed" },
      ],
    });
  });

  it("should send follow request", async () => {
    api.post.mockResolvedValue({
      data: {
        message: "Follow request sent",
      },
    });

    const result = await sendFollowRequestApi(10);

    expect(api.post).toHaveBeenCalledWith(
      "/follows/10/request"
    );

    expect(result).toEqual({
      message: "Follow request sent",
    });
  });

  it("should get pending requests", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: "Ali" },
        ],
      },
    });

    const result = await getPendingRequestsApi();

    expect(api.get).toHaveBeenCalledWith(
      "/follows/requests"
    );

    expect(result).toEqual({
      data: [
        { id: 1, name: "Ali" },
      ],
    });
  });

  it("should respond to follow request", async () => {
    api.put.mockResolvedValue({
      data: {
        message: "Request accepted",
      },
    });

    const result = await respondToRequestApi(5, "accept");

    expect(api.put).toHaveBeenCalledWith(
      "/follows/requests/5/respond",
      { action: "accept" }
    );

    expect(result).toEqual({
      message: "Request accepted",
    });
  });

  it("should get friends", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: "Ali" },
          { id: 2, name: "Ahmed" },
        ],
      },
    });

    const result = await getFriendsApi();

    expect(api.get).toHaveBeenCalledWith(
      "/follows/friends"
    );

    expect(result).toEqual({
      data: [
        { id: 1, name: "Ali" },
        { id: 2, name: "Ahmed" },
      ],
    });
  });

  it("should remove a friend", async () => {
    api.delete.mockResolvedValue({
      data: {
        message: "Friend removed",
      },
    });

    const result = await removeFriendApi(10);

    expect(api.delete).toHaveBeenCalledWith(
      "/follows/friends/10"
    );

    expect(result).toEqual({
      message: "Friend removed",
    });
  });
});