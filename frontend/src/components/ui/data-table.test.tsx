import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, Column } from "./data-table";

interface TestItem {
  id: number;
  name: string;
  role: string;
}

const mockData: TestItem[] = [
  { id: 1, name: "Karim Al-Hassan", role: "Administrator" },
  { id: 2, name: "Tariq Al-Mansoor", role: "Data Entry" },
];

const mockColumns: Column<TestItem>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Role", accessorKey: "role" },
];

describe("DataTable Component", () => {
  it("renders table headers and rows correctly", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /role/i })).toBeInTheDocument();
    expect(screen.getByText("Karim Al-Hassan")).toBeInTheDocument();
    expect(screen.getByText("Data Entry")).toBeInTheDocument();
  });

  it("renders empty message when data is empty", () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        keyExtractor={(item) => item.id}
        emptyMessage="No users found."
      />
    );

    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  it("renders skeleton rows when isLoading is true", () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        keyExtractor={(item) => item.id}
        isLoading={true}
      />
    );

    const skeletons = screen.getAllByRole("generic");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("calls onRowClick when a row is clicked", async () => {
    const handleRowClick = vi.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
      />
    );

    await user.click(screen.getByText("Karim Al-Hassan"));
    expect(handleRowClick).toHaveBeenCalledTimes(1);
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
  });
});
