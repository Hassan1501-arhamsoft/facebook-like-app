import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

import SignupForm from "../../features/auth/components/SignupForm";
import useAuth from "../../features/auth/hooks/useAuth";
import { registerUser } from "../../features/auth/services/auth.service";

// Mock useAuth
vi.mock("../../features/auth/hooks/useAuth", () => ({
  default: vi.fn(),
}));

// Mock register API
vi.mock("../../features/auth/services/auth.service", () => ({
  registerUser: vi.fn(),
}));

describe("SignupForm", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLogin,
    });

    // Mock browser image preview function
    globalThis.URL.createObjectURL = vi.fn(() => "mock-image-url");
  });

  const renderSignupForm = () => {
    return render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
  };

  // TC-FE-AUTH-009
  test("should display signup form", () => {
    renderSignupForm();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  // TC-FE-AUTH-010
  test("should allow user to enter name, email and password", () => {
    renderSignupForm();

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, {
      target: {
        value: "Test User",
      },
    });

    fireEvent.change(emailInput, {
      target: {
        value: "test@gmail.com",
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        value: "1234",
      },
    });

    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@gmail.com");
    expect(passwordInput).toHaveValue("1234");
  });

  // TC-FE-AUTH-011
  test("should upload profile image and display preview", () => {
    renderSignupForm();

    const file = new File(
      ["profile-image"],
      "profile.png",
      { type: "image/png" }
    );

    const fileInput = screen.getByLabelText(/profile picture/i);

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(fileInput.files[0]).toBe(file);

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);

    expect(
      screen.getByAltText("Profile Preview")
    ).toBeInTheDocument();
  });

  // TC-FE-AUTH-012
  test("should register successfully with valid data", async () => {
    registerUser.mockResolvedValue({
      data: {
        user: {
          id: 1,
          name: "Test User",
          email: "test@gmail.com",
          role: "user",
        },
        token: "test-token",
      },
    });

    renderSignupForm();

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: {
        value: "Test User",
      },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: {
        value: "test@gmail.com",
      },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {
        value: "1234",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
    });

    const formData = registerUser.mock.calls[0][0];

    expect(formData).toBeInstanceOf(FormData);

    expect(formData.get("name")).toBe("Test User");
    expect(formData.get("email")).toBe("test@gmail.com");
    expect(formData.get("password")).toBe("1234");
  });

  // TC-FE-AUTH-013
  test("should display error message when registration fails", async () => {
    registerUser.mockRejectedValue({
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    renderSignupForm();

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: {
        value: "Test User",
      },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: {
        value: "existing@gmail.com",
      },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {
        value: "1234",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    expect(
      await screen.findByText("Email already exists")
    ).toBeInTheDocument();
  });

  // TC-FE-AUTH-014
  test("should require name", () => {
    renderSignupForm();

    const nameInput = screen.getByLabelText(/full name/i);

    expect(nameInput).toBeRequired();
  });

  // TC-FE-AUTH-015
  test("should require email", () => {
    renderSignupForm();

    const emailInput = screen.getByLabelText(/email address/i);

    expect(emailInput).toBeRequired();
  });

  // TC-FE-AUTH-016
  test("should require password", () => {
    renderSignupForm();

    const passwordInput = screen.getByLabelText(/password/i);

    expect(passwordInput).toBeRequired();
  });

  
});