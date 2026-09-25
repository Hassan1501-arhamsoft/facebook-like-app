import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import CreatePostForm from "../../features/posts/components/CreatePostForm";
import { createPostApi } from "../../features/posts/services/post.service";

// Mock create post API
vi.mock("../../features/posts/services/post.service", () => ({
  createPostApi: vi.fn(),
}));

describe("CreatePostForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock browser APIs used by the component
    window.URL.createObjectURL = vi.fn(() => "mock-preview-url");

    // Mock alert
    window.alert = vi.fn();
  });

  // TC-FE-POST-001
  test("should display create post form", () => {
    render(<CreatePostForm />);

    expect(
      screen.getByPlaceholderText(
        /what do you want to share with your network/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /add photo/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /publish post/i })
    ).toBeInTheDocument();
  });

  // TC-FE-POST-002
  test("should allow user to enter post description", () => {
    render(<CreatePostForm />);

    const description = screen.getByPlaceholderText(
      /what do you want to share with your network/i
    );

    fireEvent.change(description, {
      target: {
        value: "This is my first post",
      },
    });

    expect(description).toHaveValue("This is my first post");
  });

  // TC-FE-POST-003
  test("should upload image and display preview", () => {
    render(<CreatePostForm />);

    const fileInput = document.querySelector('input[type="file"]');

    const file = new File(
      ["image content"],
      "test-image.jpg",
      { type: "image/jpeg" }
    );

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(file);

    expect(screen.getByAltText("Preview")).toBeInTheDocument();
  });

  // TC-FE-POST-004
  test("should create post successfully", async () => {
  createPostApi.mockResolvedValue({
    success: true,
  });

  render(<CreatePostForm />);

  // Enter description
  const textarea = screen.getByPlaceholderText(
    /what do you want to share with your network/i
  );

  fireEvent.change(textarea, {
    target: {
      value: "My new post",
    },
  });

  // Select image
  const fileInput = document.querySelector('input[type="file"]');

  const file = new File(
    ["image content"],
    "test-image.jpg",
    {
      type: "image/jpeg",
    }
  );

  fireEvent.change(fileInput, {
    target: {
      files: [file],
    },
  });

  // Make sure image was actually selected
  expect(screen.getByAltText("Preview")).toBeInTheDocument();

  // Get the form
  const form = document.querySelector("form");

  // Submit form directly
  fireEvent.submit(form);

  await waitFor(() => {
    expect(createPostApi).toHaveBeenCalledTimes(1);
  });
});
  // TC-FE-POST-005
  test("should not create post without image", () => {
    render(<CreatePostForm />);

    const publishButton = screen.getByRole("button", {
      name: /publish post/i,
    });

    // Button should be disabled because no image is selected
    expect(publishButton).toBeDisabled();

    expect(createPostApi).not.toHaveBeenCalled();
  });


});