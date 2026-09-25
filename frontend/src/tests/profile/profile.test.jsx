
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileCard from "../../features/profile/components/ProfileCard";
import { uploadProfileImage } from "../../features/profile/services/Profile.service";
import useAuth from "../../features/auth/hooks/useAuth";

vi.mock("../../features/profile/services/Profile.service", () => ({
  uploadProfileImage: vi.fn(),
}));

vi.mock("../../features/auth/hooks/useAuth", () => ({
  default: vi.fn(),
}));

describe("ProfileCard", () => {
  const logout = vi.fn();
  const updateUser = vi.fn();
  const setView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      user: {
        name: "Hassan",
        email: "hassan@gmail.com",
        profileImage: null,
      },
      logout,
      updateUser,
    });
  });

  // TC-PROFILE-01
  it("should display user profile information", () => {
    render(
      <ProfileCard
        setView={setView}
        currentView="feed"
      />
    );

    expect(screen.getByText("Hassan")).toBeInTheDocument();
    expect(screen.getByText("hassan@gmail.com")).toBeInTheDocument();
  });

  // TC-PROFILE-02
  it("should navigate to My Posts", () => {
    render(
      <ProfileCard
        setView={setView}
        currentView="feed"
      />
    );

    fireEvent.click(screen.getByText("My Posts"));

    expect(setView).toHaveBeenCalledWith("my-posts");
  });

  // TC-PROFILE-03
  it("should upload profile image successfully", async () => {
    uploadProfileImage.mockResolvedValue({
      data: {
        name: "Hassan",
        email: "hassan@gmail.com",
        profileImage: "uploads/profile.jpg",
      },
    });

    render(
      <ProfileCard
        setView={setView}
        currentView="feed"
      />
    );

    const file = new File(["image"], "profile.jpg", {
      type: "image/jpeg",
    });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(uploadProfileImage).toHaveBeenCalledTimes(1);
    });

    expect(updateUser).toHaveBeenCalledWith({
      name: "Hassan",
      email: "hassan@gmail.com",
      profileImage: "uploads/profile.jpg",
    });
  });

  // TC-PROFILE-04
  it("should logout user", () => {
    render(
      <ProfileCard
        setView={setView}
        currentView="feed"
      />
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(logout).toHaveBeenCalledTimes(1);
  });

  // TC-PROFILE-05
  it("should show alert when profile image upload fails", async () => {
    uploadProfileImage.mockRejectedValue(new Error("Upload failed"));

    const alertMock = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    render(
      <ProfileCard
        setView={setView}
        currentView="feed"
      />
    );

    const file = new File(["image"], "profile.jpg", {
      type: "image/jpeg",
    });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(uploadProfileImage).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Upload failed. Please try again."
      );
    });

    alertMock.mockRestore();
  });
});

