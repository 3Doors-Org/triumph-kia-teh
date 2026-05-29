export type EducationHonorItem = {
  title: string;
  description: string;
};

export type EducationLeadershipItem = {
  title: string;
  description: string;
};

export const EDUCATION_PROFILE = {
  institution: "Dartmouth College",
  degree: "Bachelor of Arts - BA, Computer Science",
  period: "Aug 2022 – Jun 2026",
  location: "Hanover, NH",
  focusAreas: [
    "Student Success Strategy",
    "Higher Education",
    "Computational Social Science",
    "Leadership Development",
  ],
  honors: [
    {
      title: "King Scholar",
      description:
        "7 incoming students out of 30,000+ Applicants to Dartmouth. Dartmouth's highest merit scholarship (~$400,000 over 4 years) | Full-ride scholarship for academic excellence and leadership potential",
    },
    {
      title: "Rufus Choate Scholar",
      description:
        "Dartmouth's highest academic excellence honor. Academic distinction for full year 2022-23 4.00 CGPA in the top 5% of all 4000+ Dartmouth Students",
    },
    {
      title: "Davis Projects for Peace Scholar",
      description: "$10,000 grant, sole recipient from 4000+ Dartmouth Students",
    },
    {
      title: "3 Academic Citations For Meritorious Performance",
      description:
        "Academic excellence recognition for earning A* grades with special faculty notes on academic transcript (2023, 2024, 2025)",
    },
  ] satisfies EducationHonorItem[],
  leadership: [
    {
      title: "10+ Concurrent Campus Roles",
      description:
        "Building Manager (Zimmerman Fitness Center), Assistant Supervisor (Baker-Berry Library), Senior Resident Assistant, Building Ambassador (Irving Institute), etc",
    },
  ] satisfies EducationLeadershipItem[],
};
