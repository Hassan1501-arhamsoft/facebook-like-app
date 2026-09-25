
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportModal from "../../features/reports/components/ReportModal";
import { submitReportApi } from "../../features/reports/services/report.service";

vi.mock("../../features/reports/services/report.service", () => ({
  submitReportApi: vi.fn(),
}));

describe("ReportModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-REPORT-01
  it("should display report modal", () => {
    render(
      <ReportModal
        reportedUserId={2}
        reportedUserName="Ali"
        onClose={onClose}
      />
    );

    expect(screen.getByText("Report User")).toBeInTheDocument();
    expect(screen.getByText(/You are reporting/)).toBeInTheDocument();
    expect(screen.getByText("Ali")).toBeInTheDocument();
  });

  // TC-REPORT-02
  it("should close the modal when Cancel is clicked", () => {
    render(
      <ReportModal
        reportedUserId={2}
        reportedUserName="Ali"
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // TC-REPORT-03
  it("should submit report successfully", async () => {
    submitReportApi.mockResolvedValue({
      success: true,
    });

    render(
      <ReportModal
        reportedUserId={2}
        reportedUserName="Ali"
        onClose={onClose}
      />
    );

    // Select report reason
    fireEvent.change(screen.getByRole("combobox"), {
      target: {
        value: "Spam or misleading",
      },
    });

    // Enter description
    fireEvent.change(
      screen.getByPlaceholderText(
        "Provide any extra context to help our team investigate..."
      ),
      {
        target: {
          value: "This account is posting spam.",
        },
      }
    );

    // Submit report
    fireEvent.click(screen.getByText("Submit Report"));

    await waitFor(() => {
      expect(submitReportApi).toHaveBeenCalledTimes(1);
    });

    expect(submitReportApi).toHaveBeenCalledWith(
      2,
      "Spam or misleading",
      "This account is posting spam."
    );

    expect(screen.getByText("Report Submitted")).toBeInTheDocument();
  });

  // TC-REPORT-04
  it("should not submit report without selecting a reason", () => {
    render(
      <ReportModal
        reportedUserId={2}
        reportedUserName="Ali"
        onClose={onClose}
      />
    );

    const submitButton = screen.getByText("Submit Report");

    expect(submitButton).toBeDisabled();

    expect(submitReportApi).not.toHaveBeenCalled();
  });
});

