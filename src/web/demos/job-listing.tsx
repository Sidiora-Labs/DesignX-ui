import { Briefcase, Code2, Palette } from "lucide-react";

import JobListing from "@/components/elements/job-listing";

export default function JobListingDemo() {
  return (
    <JobListing
      className="w-full max-w-lg"
      jobs={[
        { company: "DesignX", title: "Design Engineer", logo: <Palette className="size-5" />, location: "Lisbon", remote: "Hybrid", salary: "$120k–$150k", job_time: "Full-time", job_description: "Build components and prototypes that ship to thousands of teams." },
        { company: "DesignX", title: "Staff Frontend Engineer", logo: <Code2 className="size-5" />, location: "Remote", remote: "Yes", salary: "$170k–$210k", job_time: "Full-time", job_description: "Own the registry, the CLI and the docs platform." },
        { company: "DesignX", title: "Developer Advocate", logo: <Briefcase className="size-5" />, location: "Berlin", remote: "No", salary: "$110k–$135k", job_time: "Full-time", job_description: "Write guides, talks and examples for the DX community." },
      ]}
    />
  );
}
