"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function useListSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const brand_id = searchParams.get("brand_id") || "";
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page") || "1");

  const [searchValue, setSearchValue] = useState(search);

  const setSearch = useCallback(
    (val: string) => {
      setSearchValue(val);
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("search", val);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") {
        params.set("page", "1");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return {
    search: searchValue !== search ? searchValue : search,
    setSearch,
    brand_id,
    setBrandId: (val: string) => setParam("brand_id", val),
    status,
    setStatus: (val: string) => setParam("status", val),
    page,
    setPage: (val: number) => setParam("page", String(val)),
  };
}
