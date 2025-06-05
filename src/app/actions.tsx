"use server";

import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import {
  PortfolioData,
  Project,
  Resume,
  CV,
  UUID,
  UserProfile,
  LandingPage,
  Settings,
  CallToAction,
  Education,
  WorkExperience,
  Publication,
  Award,
  ResumeSection,
} from "@/types/types";

// ========================================
// Helper Functions
// ========================================

const DATA_FILE_PATH = path.join(process.cwd(), "data", "data.json");

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

async function ensureUniqueSlug(
  baseSlug: string,
  existingProjects: Project[]
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (existingProjects.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

async function readPortfolioData(): Promise<PortfolioData> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(fileContent) as PortfolioData;
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    throw new Error("Failed to read portfolio data");
  }
}

async function writePortfolioData(data: PortfolioData): Promise<void> {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_FILE_PATH, jsonContent, "utf-8");
  } catch (error) {
    console.error("Error writing portfolio data:", error);
    throw new Error("Failed to write portfolio data");
  }
}

// ========================================
// Fetch Functions
// ========================================

export async function fetchAllData(): Promise<PortfolioData> {
  return await readPortfolioData();
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const data = await readPortfolioData();
  return data.userProfile;
}

export async function fetchSettings(): Promise<Settings> {
  const data = await readPortfolioData();
  return data.settings;
}

export async function fetchLandingPage(): Promise<LandingPage> {
  const data = await readPortfolioData();
  return data.landingPage;
}

export async function fetchPortfolio(): Promise<Project[]> {
  const data = await readPortfolioData();
  return data.portfolio.projects;
}

export async function fetchProject(
  projectSlug: string
): Promise<Project | null> {
  const data = await readPortfolioData();
  return data.portfolio.projects.find((p) => p.slug === projectSlug) || null;
}

export async function fetchCV(): Promise<CV> {
  const data = await readPortfolioData();
  return data.cv;
}

export async function fetchResumes(): Promise<Resume[]> {
  const data = await readPortfolioData();
  return data.resumes;
}

export async function fetchResume(resumeId: UUID): Promise<Resume | null> {
  const data = await readPortfolioData();
  return data.resumes.find((r) => r.id === resumeId) || null;
}

export async function fetchPublicResume(): Promise<Resume | null> {
  const data = await readPortfolioData();
  if (!data.settings.publicResumeId) return null;
  return (
    data.resumes.find((r) => r.id === data.settings.publicResumeId) || null
  );
}

// ========================================
// Create Functions
// ========================================

export async function createProject(
  projectData: Omit<Project, "slug">
): Promise<string> {
  const data = await readPortfolioData();

  // Generate unique slug from title
  const baseSlug = generateSlug(projectData.title);
  const uniqueSlug = await ensureUniqueSlug(baseSlug, data.portfolio.projects);

  // Create project with auto-generated slug
  const newProject: Project = {
    ...projectData,
    slug: uniqueSlug,
  };

  data.portfolio.projects.push(newProject);
  await writePortfolioData(data);
  return uniqueSlug;
}

export async function createResume(
  resumeData: Omit<Resume, "id">
): Promise<UUID> {
  const data = await readPortfolioData();
  const newResume: Resume = {
    ...resumeData,
    id: uuidv4(),
    sections: resumeData.sections.map((section) => ({
      ...section,
      id: section.id || uuidv4(),
    })),
  };

  data.resumes.push(newResume);
  await writePortfolioData(data);
  return newResume.id;
}

export async function createEducation(
  educationData: Omit<Education, "id">
): Promise<UUID> {
  const data = await readPortfolioData();
  const newEducation: Education = {
    ...educationData,
    id: uuidv4(),
  };

  data.cv.education.push(newEducation);
  await writePortfolioData(data);
  return newEducation.id;
}

export async function createWorkExperience(
  workData: Omit<WorkExperience, "id">
): Promise<UUID> {
  const data = await readPortfolioData();
  const newWork: WorkExperience = {
    ...workData,
    id: uuidv4(),
  };

  data.cv.workExperience.push(newWork);
  await writePortfolioData(data);
  return newWork.id;
}

export async function createPublication(
  publicationData: Omit<Publication, "id">
): Promise<UUID> {
  const data = await readPortfolioData();
  const newPublication: Publication = {
    ...publicationData,
    id: uuidv4(),
  };

  if (!data.cv.publications) {
    data.cv.publications = [];
  }
  data.cv.publications.push(newPublication);
  await writePortfolioData(data);
  return newPublication.id;
}

export async function createAward(awardData: Omit<Award, "id">): Promise<UUID> {
  const data = await readPortfolioData();
  const newAward: Award = {
    ...awardData,
    id: uuidv4(),
  };

  if (!data.cv.awardsAndHonors) {
    data.cv.awardsAndHonors = [];
  }
  data.cv.awardsAndHonors.push(newAward);
  await writePortfolioData(data);
  return newAward.id;
}

export async function createCallToAction(
  ctaData: Omit<CallToAction, "id">
): Promise<UUID> {
  const data = await readPortfolioData();
  const newCTA: CallToAction = {
    ...ctaData,
    id: uuidv4(),
  };

  data.landingPage.callToActions.push(newCTA);
  await writePortfolioData(data);
  return newCTA.id;
}

export async function createResumeSection(
  resumeId: UUID,
  sectionData: Omit<ResumeSection, "id">
): Promise<UUID> {
  const data = await readPortfolioData();
  const resume = data.resumes.find((r) => r.id === resumeId);

  if (!resume) {
    throw new Error(`Resume with ID ${resumeId} not found`);
  }

  const newSection: ResumeSection = {
    ...sectionData,
    id: uuidv4(),
  };

  resume.sections.push(newSection);
  await writePortfolioData(data);
  return newSection.id;
}

// ========================================
// Update Functions
// ========================================

export async function updateUserProfile(
  profileData: UserProfile
): Promise<void> {
  const data = await readPortfolioData();
  data.userProfile = profileData;
  await writePortfolioData(data);
}

export async function updateSettings(settingsData: Settings): Promise<void> {
  const data = await readPortfolioData();
  data.settings = settingsData;
  await writePortfolioData(data);
}

export async function updateLandingPage(
  landingPageData: LandingPage
): Promise<void> {
  const data = await readPortfolioData();
  data.landingPage = landingPageData;
  await writePortfolioData(data);
}

export async function updateProject(
  projectSlug: string,
  projectData: Partial<Project>
): Promise<void> {
  const data = await readPortfolioData();
  const projectIndex = data.portfolio.projects.findIndex(
    (p) => p.slug === projectSlug
  );

  if (projectIndex === -1) {
    throw new Error(`Project with slug ${projectSlug} not found`);
  }

  data.portfolio.projects[projectIndex] = {
    ...data.portfolio.projects[projectIndex],
    ...projectData,
  };

  await writePortfolioData(data);
}

export async function updateCV(cvData: Partial<CV>): Promise<void> {
  const data = await readPortfolioData();
  data.cv = {
    ...data.cv,
    ...cvData,
  };
  await writePortfolioData(data);
}

export async function updateResume(
  resumeId: UUID,
  resumeData: Partial<Omit<Resume, "id">>
): Promise<void> {
  const data = await readPortfolioData();
  const resumeIndex = data.resumes.findIndex((r) => r.id === resumeId);

  if (resumeIndex === -1) {
    throw new Error(`Resume with ID ${resumeId} not found`);
  }

  data.resumes[resumeIndex] = {
    ...data.resumes[resumeIndex],
    ...resumeData,
  };

  await writePortfolioData(data);
}

export async function updateEducation(
  educationId: UUID,
  educationData: Partial<Omit<Education, "id">>
): Promise<void> {
  const data = await readPortfolioData();
  const educationIndex = data.cv.education.findIndex(
    (e) => e.id === educationId
  );

  if (educationIndex === -1) {
    throw new Error(`Education with ID ${educationId} not found`);
  }

  data.cv.education[educationIndex] = {
    ...data.cv.education[educationIndex],
    ...educationData,
  };

  await writePortfolioData(data);
}

export async function updateWorkExperience(
  workId: UUID,
  workData: Partial<Omit<WorkExperience, "id">>
): Promise<void> {
  const data = await readPortfolioData();
  const workIndex = data.cv.workExperience.findIndex((w) => w.id === workId);

  if (workIndex === -1) {
    throw new Error(`Work experience with ID ${workId} not found`);
  }

  data.cv.workExperience[workIndex] = {
    ...data.cv.workExperience[workIndex],
    ...workData,
  };

  await writePortfolioData(data);
}

export async function updatePublication(
  publicationId: UUID,
  publicationData: Partial<Omit<Publication, "id">>
): Promise<void> {
  const data = await readPortfolioData();

  if (!data.cv.publications) {
    throw new Error("No publications found");
  }

  const publicationIndex = data.cv.publications.findIndex(
    (p) => p.id === publicationId
  );

  if (publicationIndex === -1) {
    throw new Error(`Publication with ID ${publicationId} not found`);
  }

  data.cv.publications[publicationIndex] = {
    ...data.cv.publications[publicationIndex],
    ...publicationData,
  };

  await writePortfolioData(data);
}

export async function updateAward(
  awardId: UUID,
  awardData: Partial<Omit<Award, "id">>
): Promise<void> {
  const data = await readPortfolioData();

  if (!data.cv.awardsAndHonors) {
    throw new Error("No awards found");
  }

  const awardIndex = data.cv.awardsAndHonors.findIndex((a) => a.id === awardId);

  if (awardIndex === -1) {
    throw new Error(`Award with ID ${awardId} not found`);
  }

  data.cv.awardsAndHonors[awardIndex] = {
    ...data.cv.awardsAndHonors[awardIndex],
    ...awardData,
  };

  await writePortfolioData(data);
}

export async function updateResumeSection(
  resumeId: UUID,
  sectionId: UUID,
  sectionData: Partial<Omit<ResumeSection, "id">>
): Promise<void> {
  const data = await readPortfolioData();
  const resume = data.resumes.find((r) => r.id === resumeId);

  if (!resume) {
    throw new Error(`Resume with ID ${resumeId} not found`);
  }

  const sectionIndex = resume.sections.findIndex((s) => s.id === sectionId);

  if (sectionIndex === -1) {
    throw new Error(
      `Section with ID ${sectionId} not found in resume ${resumeId}`
    );
  }

  resume.sections[sectionIndex] = {
    ...resume.sections[sectionIndex],
    ...sectionData,
  };

  await writePortfolioData(data);
}

export async function setPublicResume(resumeId: UUID | null): Promise<void> {
  const data = await readPortfolioData();

  if (resumeId && !data.resumes.find((r) => r.id === resumeId)) {
    throw new Error(`Resume with ID ${resumeId} not found`);
  }

  data.settings.publicResumeId = resumeId || undefined;
  await writePortfolioData(data);
}

// ========================================
// Delete Functions
// ========================================

export async function deleteProject(projectSlug: string): Promise<void> {
  const data = await readPortfolioData();
  const projectIndex = data.portfolio.projects.findIndex(
    (p) => p.slug === projectSlug
  );

  if (projectIndex === -1) {
    throw new Error(`Project with slug ${projectSlug} not found`);
  }

  // Remove project from portfolio
  data.portfolio.projects.splice(projectIndex, 1);

  // Remove project from featured projects in landing page
  data.landingPage.featuredProjectIds =
    data.landingPage.featuredProjectIds.filter((slug) => slug !== projectSlug);

  // Remove project references from resume sections
  data.resumes.forEach((resume) => {
    resume.sections.forEach((section) => {
      if (section.type === "projects") {
        section.items = section.items.filter((item) =>
          typeof item === "object" && "portfolioProjectId" in item
            ? item.portfolioProjectId !== projectSlug
            : true
        );
      } else if (section.type === "experience") {
        section.items.forEach((item) => {
          if (
            typeof item === "object" &&
            "relatedPortfolioProjectIds" in item &&
            item.relatedPortfolioProjectIds
          ) {
            item.relatedPortfolioProjectIds =
              item.relatedPortfolioProjectIds.filter(
                (slug) => slug !== projectSlug
              );
          }
        });
      }
    });
  });

  await writePortfolioData(data);
}

export async function deleteResume(resumeId: UUID): Promise<void> {
  const data = await readPortfolioData();
  const resumeIndex = data.resumes.findIndex((r) => r.id === resumeId);

  if (resumeIndex === -1) {
    throw new Error(`Resume with ID ${resumeId} not found`);
  }

  // Clear public resume setting if this was the public resume
  if (data.settings.publicResumeId === resumeId) {
    data.settings.publicResumeId = undefined;
  }

  // Remove resume
  data.resumes.splice(resumeIndex, 1);

  await writePortfolioData(data);
}

export async function deleteEducation(educationId: UUID): Promise<void> {
  const data = await readPortfolioData();
  const educationIndex = data.cv.education.findIndex(
    (e) => e.id === educationId
  );

  if (educationIndex === -1) {
    throw new Error(`Education with ID ${educationId} not found`);
  }

  data.cv.education.splice(educationIndex, 1);
  await writePortfolioData(data);
}

export async function deleteWorkExperience(workId: UUID): Promise<void> {
  const data = await readPortfolioData();
  const workIndex = data.cv.workExperience.findIndex((w) => w.id === workId);

  if (workIndex === -1) {
    throw new Error(`Work experience with ID ${workId} not found`);
  }

  data.cv.workExperience.splice(workIndex, 1);
  await writePortfolioData(data);
}

export async function deletePublication(publicationId: UUID): Promise<void> {
  const data = await readPortfolioData();

  if (!data.cv.publications) {
    throw new Error("No publications found");
  }

  const publicationIndex = data.cv.publications.findIndex(
    (p) => p.id === publicationId
  );

  if (publicationIndex === -1) {
    throw new Error(`Publication with ID ${publicationId} not found`);
  }

  data.cv.publications.splice(publicationIndex, 1);
  await writePortfolioData(data);
}

export async function deleteAward(awardId: UUID): Promise<void> {
  const data = await readPortfolioData();

  if (!data.cv.awardsAndHonors) {
    throw new Error("No awards found");
  }

  const awardIndex = data.cv.awardsAndHonors.findIndex((a) => a.id === awardId);

  if (awardIndex === -1) {
    throw new Error(`Award with ID ${awardId} not found`);
  }

  data.cv.awardsAndHonors.splice(awardIndex, 1);
  await writePortfolioData(data);
}

export async function deleteCallToAction(ctaId: UUID): Promise<void> {
  const data = await readPortfolioData();
  const ctaIndex = data.landingPage.callToActions.findIndex(
    (cta) => cta.id === ctaId
  );

  if (ctaIndex === -1) {
    throw new Error(`Call to action with ID ${ctaId} not found`);
  }

  data.landingPage.callToActions.splice(ctaIndex, 1);
  await writePortfolioData(data);
}

export async function deleteResumeSection(
  resumeId: UUID,
  sectionId: UUID
): Promise<void> {
  const data = await readPortfolioData();
  const resume = data.resumes.find((r) => r.id === resumeId);

  if (!resume) {
    throw new Error(`Resume with ID ${resumeId} not found`);
  }

  const sectionIndex = resume.sections.findIndex((s) => s.id === sectionId);

  if (sectionIndex === -1) {
    throw new Error(
      `Section with ID ${sectionId} not found in resume ${resumeId}`
    );
  }

  resume.sections.splice(sectionIndex, 1);
  await writePortfolioData(data);
}

// ========================================
// Featured Projects Management
// ========================================

export async function addFeaturedProject(projectSlug: string): Promise<void> {
  const data = await readPortfolioData();

  // Check if project exists
  const project = data.portfolio.projects.find((p) => p.slug === projectSlug);
  if (!project) {
    throw new Error(`Project with slug ${projectSlug} not found`);
  }

  // Check if already featured
  if (data.landingPage.featuredProjectIds.includes(projectSlug)) {
    throw new Error(`Project ${projectSlug} is already featured`);
  }

  data.landingPage.featuredProjectIds.push(projectSlug);
  await writePortfolioData(data);
}

export async function removeFeaturedProject(
  projectSlug: string
): Promise<void> {
  const data = await readPortfolioData();

  data.landingPage.featuredProjectIds =
    data.landingPage.featuredProjectIds.filter((slug) => slug !== projectSlug);

  await writePortfolioData(data);
}

export async function reorderFeaturedProjects(
  projectSlugs: string[]
): Promise<void> {
  const data = await readPortfolioData();

  // Validate that all slugs exist as projects
  for (const slug of projectSlugs) {
    const project = data.portfolio.projects.find((p) => p.slug === slug);
    if (!project) {
      throw new Error(`Project with slug ${slug} not found`);
    }
  }

  data.landingPage.featuredProjectIds = projectSlugs;
  await writePortfolioData(data);
}

// ========================================
// Technology and Role Management
// ========================================

export async function fetchAvailableTechnologies(): Promise<string[]> {
  const data = await readPortfolioData();
  return data.settings.availableTechnologies || [];
}

export async function fetchAvailableRoles(): Promise<string[]> {
  const data = await readPortfolioData();
  return data.settings.availableRoles || [];
}

export async function addTechnology(technology: string): Promise<void> {
  const data = await readPortfolioData();

  // Check if technology already exists (case-insensitive)
  const exists = data.settings.availableTechnologies.some(
    (tech) => tech.toLowerCase() === technology.toLowerCase()
  );

  if (exists) {
    throw new Error(`Technology "${technology}" already exists`);
  }

  data.settings.availableTechnologies.push(technology);
  data.settings.availableTechnologies.sort(); // Keep alphabetically sorted
  await writePortfolioData(data);
}

export async function addRole(role: string): Promise<void> {
  const data = await readPortfolioData();

  // Check if role already exists (case-insensitive)
  const exists = data.settings.availableRoles.some(
    (r) => r.toLowerCase() === role.toLowerCase()
  );

  if (exists) {
    throw new Error(`Role "${role}" already exists`);
  }

  data.settings.availableRoles.push(role);
  data.settings.availableRoles.sort(); // Keep alphabetically sorted
  await writePortfolioData(data);
}

export async function renameTechnology(
  oldName: string,
  newName: string
): Promise<void> {
  const data = await readPortfolioData();

  // Check if old technology exists
  const oldIndex = data.settings.availableTechnologies.findIndex(
    (tech) => tech.toLowerCase() === oldName.toLowerCase()
  );

  if (oldIndex === -1) {
    throw new Error(`Technology "${oldName}" not found`);
  }

  // Check if new name already exists (and it's not the same as old name)
  const exists = data.settings.availableTechnologies.some(
    (tech) =>
      tech.toLowerCase() === newName.toLowerCase() &&
      tech.toLowerCase() !== oldName.toLowerCase()
  );

  if (exists) {
    throw new Error(`Technology "${newName}" already exists`);
  }

  // Update in settings
  data.settings.availableTechnologies[oldIndex] = newName;
  data.settings.availableTechnologies.sort();

  // Update all projects that use this technology
  data.portfolio.projects.forEach((project) => {
    const techIndex = project.technologies.findIndex(
      (tech) => tech.toLowerCase() === oldName.toLowerCase()
    );
    if (techIndex !== -1) {
      project.technologies[techIndex] = newName;
    }
  });

  await writePortfolioData(data);
}

export async function renameRole(
  oldName: string,
  newName: string
): Promise<void> {
  const data = await readPortfolioData();

  // Check if old role exists
  const oldIndex = data.settings.availableRoles.findIndex(
    (role) => role.toLowerCase() === oldName.toLowerCase()
  );

  if (oldIndex === -1) {
    throw new Error(`Role "${oldName}" not found`);
  }

  // Check if new name already exists (and it's not the same as old name)
  const exists = data.settings.availableRoles.some(
    (role) =>
      role.toLowerCase() === newName.toLowerCase() &&
      role.toLowerCase() !== oldName.toLowerCase()
  );

  if (exists) {
    throw new Error(`Role "${newName}" already exists`);
  }

  // Update in settings
  data.settings.availableRoles[oldIndex] = newName;
  data.settings.availableRoles.sort();

  // Update all projects that use this role
  data.portfolio.projects.forEach((project) => {
    const roleIndex = project.roles.findIndex(
      (role) => role.toLowerCase() === oldName.toLowerCase()
    );
    if (roleIndex !== -1) {
      project.roles[roleIndex] = newName;
    }
  });

  await writePortfolioData(data);
}

export async function removeTechnology(technology: string): Promise<void> {
  const data = await readPortfolioData();

  // Remove from settings
  data.settings.availableTechnologies =
    data.settings.availableTechnologies.filter(
      (tech) => tech.toLowerCase() !== technology.toLowerCase()
    );

  // Remove from all projects
  data.portfolio.projects.forEach((project) => {
    project.technologies = project.technologies.filter(
      (tech) => tech.toLowerCase() !== technology.toLowerCase()
    );
  });

  await writePortfolioData(data);
}

export async function removeRole(role: string): Promise<void> {
  const data = await readPortfolioData();

  // Remove from settings
  data.settings.availableRoles = data.settings.availableRoles.filter(
    (r) => r.toLowerCase() !== role.toLowerCase()
  );

  // Remove from all projects
  data.portfolio.projects.forEach((project) => {
    project.roles = project.roles.filter(
      (r) => r.toLowerCase() !== role.toLowerCase()
    );
  });

  await writePortfolioData(data);
}

// export async function generateCVPDF(): Promise<Buffer> {
//   const [cv, userProfile, portfolioProjects] = await Promise.all([
//     fetchCV(),
//     fetchUserProfile(),
//     fetchPortfolio()
//   ]);

//   const pdfDocument = <CVPDFDocument cv={cv} userProfile={userProfile} portfolioProjects={portfolioProjects} />;
//   const buffer = await renderToBuffer(pdfDocument);

//   return buffer;
// }
