import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./pagination";

describe("Pagination Component", () => {
  it("renders nothing when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders page info and navigation buttons correctly", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByText(/page/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next page/i })).toBeInTheDocument();
  });

  it("disables Previous button on first page and Next button on last page", () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
    );
    expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next page/i })).not.toBeDisabled();

    rerender(
      <Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />
    );
    expect(screen.getByRole("button", { name: /previous page/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
  });

  it("calls onPageChange with correct page number when clicking Next and Previous", async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Pagination currentPage={2} totalPages={4} onPageChange={handlePageChange} />
    );

    await user.click(screen.getByRole("button", { name: /next page/i }));
    expect(handlePageChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole("button", { name: /previous page/i }));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });
});
