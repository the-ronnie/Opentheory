// Mock data for the consultant platform

export type JobSeeker = {
  id: number;
  name: string;
  skills: string[];
};

export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  salary: string;
};

export const jobSeekers: JobSeeker[] = [
  {
    id: 1,
    name: "Alice Johnson",
    skills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: 2,
    name: "Bob Smith",
    skills: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: 3,
    name: "Carol Williams",
    skills: ["Java", "Spring Boot", "Kubernetes"],
  },
  {
    id: 4,
    name: "David Brown",
    skills: ["Angular", "C#", ".NET"],
  },
  {
    id: 5,
    name: "Eva Martinez",
    skills: ["Vue.js", "Firebase", "GraphQL"],
  },
];

export const jobs: Job[] = [
  {
    id: 101,
    title: "Senior React Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    skills: ["React", "TypeScript", "Redux", "GraphQL"],
    salary: "$120k - $150k",
  },
  {
    id: 102,
    title: "Backend Engineer",
    company: "DataSystems",
    location: "New York, NY",
    type: "Full-time",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    salary: "$110k - $140k",
  },
  {
    id: 103,
    title: "DevOps Specialist",
    company: "CloudTech",
    location: "Remote",
    type: "Contract",
    skills: ["Kubernetes", "AWS", "CI/CD", "Terraform"],
    salary: "$130k - $160k",
  },
  {
    id: 104,
    title: "Mobile Developer",
    company: "AppWorks",
    location: "San Francisco, CA",
    type: "Full-time",
    skills: ["React Native", "iOS", "Android", "Redux"],
    salary: "$100k - $130k",
  },
  {
    id: 105,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Chicago, IL",
    type: "Part-time",
    skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
    salary: "$80k - $110k",
  },
];
