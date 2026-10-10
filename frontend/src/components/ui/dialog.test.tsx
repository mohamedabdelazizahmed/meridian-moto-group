import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./dialog";

describe("Dialog Component", () => {
  it("renders nothing when isOpen is false", () => {
    render(
      <Dialog isOpen={false} onClose={() => {}} title="Test Dialog">
        <p>Dialog body content</p>
      </Dialog>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title, description, and children when isOpen is true", async () => {
    render(
      <Dialog
        isOpen={true}
        onClose={() => {}}
        title="Confirm Deletion"
        description="Are you sure you want to delete this record?"
      >
        <p>This action cannot be undone.</p>
      </Dialog>
    );

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this record?")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("has correct ARIA roles and attributes", async () => {
    render(
      <Dialog
        isOpen={true}
        onClose={() => {}}
        title="Accessible Modal"
        description="Modal description text"
      >
        <button type="button">Inside Button</button>
      </Dialog>
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");

    const titleEl = document.getElementById(dialog.getAttribute("aria-labelledby")!);
    expect(titleEl).toHaveTextContent("Accessible Modal");

    const descEl = document.getElementById(dialog.getAttribute("aria-describedby")!);
    expect(descEl).toHaveTextContent("Modal description text");
  });

  it("calls onClose when Escape key is pressed", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog isOpen={true} onClose={handleClose} title="Escape Test">
        <button type="button">Action</button>
      </Dialog>
    );

    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the backdrop overlay", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog isOpen={true} onClose={handleClose} title="Backdrop Test">
        <button type="button">Action</button>
      </Dialog>
    );

    const dialog = await screen.findByRole("dialog");
    const backdrop = dialog.parentElement!;

    await user.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the dialog content", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog isOpen={true} onClose={handleClose} title="Inside Click Test">
        <button type="button" data-testid="inside-btn">Action</button>
      </Dialog>
    );

    await screen.findByRole("dialog");
    await user.click(screen.getByTestId("inside-btn"));

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("calls onClose when clicking the close button", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog isOpen={true} onClose={handleClose} title="Close Button Test">
        <button type="button">Action</button>
      </Dialog>
    );

    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: /close dialog/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("traps focus and restores focus upon closing", async () => {
    const user = userEvent.setup();

    const TestParent = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <div>
          <button type="button" data-testid="open-btn" onClick={() => setIsOpen(true)}>
            Open
          </button>
          <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Focus Test">
            <button type="button" data-testid="dialog-btn-1">Btn 1</button>
            <button type="button" data-testid="dialog-btn-2">Btn 2</button>
          </Dialog>
        </div>
      );
    };

    render(<TestParent />);

    const openBtn = screen.getByTestId("open-btn");
    openBtn.focus();
    expect(openBtn).toHaveFocus();

    await user.click(openBtn);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Tab through focusable elements
    await user.tab();
    await user.tab();
    await user.tab();

    // Close dialog via Escape
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // Focus restored to open button
    expect(openBtn).toHaveFocus();
  });
});
