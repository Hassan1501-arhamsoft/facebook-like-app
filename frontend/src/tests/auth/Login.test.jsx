
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

import LoginForm from "../../features/auth/components/LoginForm";
import useAuth from "../../features/auth/hooks/useAuth";
import { loginUser } from "../../features/auth/services/auth.service";

// Mock useAuth
vi.mock("../../features/auth/hooks/useAuth", () => ({
  default: vi.fn(),
}));

// Mock login API
vi.mock("../../features/auth/services/auth.service", () => ({
  loginUser: vi.fn(),
}));

describe("LoginForm", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLogin,
    });
  });

  const renderLoginForm = () => {
    return render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  };

  // TC-FE-AUTH-001
  test("should display login form", () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  // TC-FE-AUTH-002
  test("should allow user to enter email and password", () => {
    renderLoginForm();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

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

    expect(emailInput).toHaveValue("test@gmail.com");
    expect(passwordInput).toHaveValue("1234");
  });

  // TC-FE-AUTH-003
  test("should login successfully with valid credentials", async () => {
    loginUser.mockResolvedValue({
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

    renderLoginForm();

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
      screen.getByRole("button", { name: /sign in/i })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "1234",
      });
    });

  });

  // TC-FE-AUTH-004
  test("should display error message with invalid credentials", async () => {
    loginUser.mockRejectedValue({
      response: {
        data: {
          message: "Invalid email or password",
        },
      },
    });

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: {
        value: "wrong@gmail.com",
      },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {
        value: "wrong123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /sign in/i })
    );

    expect(
      await screen.findByText("Invalid email or password")
    ).toBeInTheDocument();
  });

  // TC-FE-AUTH-005
  test("should require email", () => {
    renderLoginForm();

    const emailInput = screen.getByLabelText(/email address/i);

    expect(emailInput).toBeRequired();
  });

  // TC-FE-AUTH-006
  test("should require password", () => {
    renderLoginForm();

    const passwordInput = screen.getByLabelText(/password/i);

    expect(passwordInput).toBeRequired();
  });


});

