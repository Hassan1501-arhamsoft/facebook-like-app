import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import MyNetwork from "../../features/follows/components/MyNetwork";
import {
  getFriendsApi,
} from "../../features/follows/services/follow.service";

vi.mock("../../features/follows/services/follow.service", () => ({
  getFriendsApi: vi.fn(),
  removeFriendApi: vi.fn(),
}));

describe("MyNetwork", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
// test case 1
  it("should display friends", async () => {
    getFriendsApi.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Ali",
          email: "ali@example.com",
          profileImage: null,
        },
        {
          id: 2,
          name: "Ahmed",
          email: "ahmed@example.com",
          profileImage: null,
        },
      ],
    });

    render(<MyNetwork setActiveChatFriend={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Ali")).toBeInTheDocument();
    });

    expect(screen.getByText("Ahmed")).toBeInTheDocument();
    expect(getFriendsApi).toHaveBeenCalledTimes(1);
  });

  it("should search friends", async () => {
    getFriendsApi.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Ali",
          email: "ali@example.com",
          profileImage: null,
        },
        {
          id: 2,
          name: "Ahmed",
          email: "ahmed@example.com",
          profileImage: null,
        },
      ],
    });

    render(<MyNetwork setActiveChatFriend={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Ali")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search friends...");

    fireEvent.change(searchInput, {
      target: { value: "Ali" },
    });

    expect(screen.getByText("Ali")).toBeInTheDocument();
    expect(screen.queryByText("Ahmed")).not.toBeInTheDocument();
  });

});