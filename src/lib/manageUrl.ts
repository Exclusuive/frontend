import { NavigateFunction } from "react-router-dom";

// Define a type for the path object
interface Path {
  name: string;
  value: string;
}

// Define a type for the location parameter
interface Location {
  pathname?: string;
  search?: string;
}

// Update the function to accept an array of Path objects
export function updateUrlQuery(
  paths: Path[],
  searchParams: URLSearchParams,
  location: Location,
  navigate: NavigateFunction
): void {
  const newParams = new URLSearchParams(searchParams);

  // Iterate over the array of paths and set the new parameters
  paths.forEach(({ name, value }) => {
    newParams.set(name, value);
  });

  // Early return if no changes are made
  if (newParams.toString() === searchParams.toString()) return;

  navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
}

// URL generation functions
export const navigateWithQuery = (basePath: string, location: Location) => {
  const searchParams = new URLSearchParams(location.search);
  return `${basePath}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
};
