"use server";

import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import {
  PortfolioData,
  Project,
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
  CVSection,
  CVSectionItem,
  Certification,
  VolunteerExperience,
  Language,
  CustomCVItem,
  SkillCategory,
} from "@/types/types";

// ========================================
// Helper Functions
// ========================================

const DATA_FILE_PATH = path.join(process.cwd(), "data", "data.json");

function getCVItemId(item: CVSectionItem): string {
  if ('id' in item && item.id) {
    return item.id;
  }
  if ('slug' in item && item.slug) {
    return item.slug;
  }
  if ('category' in item && item.category) {
    return item.category; // For SkillCategory, use category as identifier
  }
  return uuidv4(); // Fallback for items without clear identifiers
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-")
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

// ========================================
// CV Section CRUD Functions
// ========================================

export async function createCVSection(
  sectionData: Omit<CVSection, "id" | "sortOrder">
): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if section type already exists (except for custom sections)
  if (sectionData.type !== "custom") {
    const existingSection = data.cv.sections.find(s => s.type === sectionData.type);
    if (existingSection) {
      throw new Error(`A ${sectionData.type} section already exists. Only one section of this type is allowed.`);
    }
  }
  
  // Calculate the next sort order
  const maxSortOrder = Math.max(
    ...data.cv.sections.map(s => s.sortOrder),
    -1
  );
  
  const newSection: CVSection = {
    ...sectionData,
    id: uuidv4(),
    sortOrder: maxSortOrder + 1,
  };

  data.cv.sections.push(newSection);
  await writePortfolioData(data);
  return newSection.id;
}

export async function updateCVSection(
  sectionId: UUID,
  sectionData: Partial<Omit<CVSection, "id">>
): Promise<void> {
  const data = await readPortfolioData();
  const sectionIndex = data.cv.sections.findIndex(s => s.id === sectionId);

  if (sectionIndex === -1) {
    throw new Error(`CV section with ID ${sectionId} not found`);
  }

  data.cv.sections[sectionIndex] = {
    ...data.cv.sections[sectionIndex],
    ...sectionData,
  };

  await writePortfolioData(data);
}

export async function deleteCVSection(sectionId: UUID): Promise<void> {
  const data = await readPortfolioData();
  const sectionIndex = data.cv.sections.findIndex(s => s.id === sectionId);

  if (sectionIndex === -1) {
    throw new Error(`CV section with ID ${sectionId} not found`);
  }

  data.cv.sections.splice(sectionIndex, 1);
  await writePortfolioData(data);
}

export async function reorderCVSections(sectionIds: UUID[]): Promise<void> {
  const data = await readPortfolioData();
  
  // Validate that all section IDs exist
  for (const sectionId of sectionIds) {
    const section = data.cv.sections.find(s => s.id === sectionId);
    if (!section) {
      throw new Error(`CV section with ID ${sectionId} not found`);
    }
  }

  // Update sort orders based on new order
  data.cv.sections.forEach(section => {
    const newIndex = sectionIds.indexOf(section.id);
    if (newIndex !== -1) {
      section.sortOrder = newIndex;
    }
  });

  // Sort sections by sortOrder
  data.cv.sections.sort((a, b) => a.sortOrder - b.sortOrder);
  
  await writePortfolioData(data);
}

export async function toggleCVSectionVisibility(sectionId: UUID): Promise<void> {
  const data = await readPortfolioData();
  const section = data.cv.sections.find(s => s.id === sectionId);

  if (!section) {
    throw new Error(`CV section with ID ${sectionId} not found`);
  }

  section.isVisible = !section.isVisible;
  await writePortfolioData(data);
}

// ========================================
// CV Section Item CRUD Functions
// ========================================

export async function createCVSectionItem(
  sectionId: UUID,
  itemData: Omit<CVSectionItem, "id">
): Promise<UUID> {
  const data = await readPortfolioData();
  const section = data.cv.sections.find(s => s.id === sectionId);

  if (!section) {
    throw new Error(`CV section with ID ${sectionId} not found`);
  }

  const itemId = uuidv4();
  const newItem: CVSectionItem = {
    ...itemData,
    id: itemId,
  } as CVSectionItem;

  section.items.push(newItem);
  await writePortfolioData(data);
  return itemId;
}

export async function updateCVSectionItem(
  sectionId: UUID,
  itemId: UUID,
  itemData: Partial<CVSectionItem>
): Promise<void> {
  const data = await readPortfolioData();
  const section = data.cv.sections.find(s => s.id === sectionId);

  if (!section) {
    throw new Error(`CV section with ID ${sectionId} not found`);
  }

  const itemIndex = section.items.findIndex(item => getCVItemId(item) === itemId);
  if (itemIndex === -1) {
    throw new Error(`CV section item with ID ${itemId} not found`);
  }

  section.items[itemIndex] = {
    ...section.items[itemIndex],
    ...itemData,
  } as CVSectionItem;

  await writePortfolioData(data);
}

export async function deleteCVSectionItem(
  sectionId: UUID,
  itemId: UUID
): Promise<void> {
  const data = await readPortfolioData();
  const section = data.cv.sections.find(s => s.id === sectionId);

  if (!section) {
    throw new Error(`CV section with ID ${sectionId} not found`);
  }

  const itemIndex = section.items.findIndex(item => getCVItemId(item) === itemId);
  if (itemIndex === -1) {
    throw new Error(`CV section item with ID ${itemId} not found`);
  }

  section.items.splice(itemIndex, 1);
  await writePortfolioData(data);
}

export async function reorderCVSectionItems(
  sectionId: UUID,
  itemIds: UUID[]
): Promise<void> {
  const data = await readPortfolioData();
  const section = data.cv.sections.find(s => s.id === sectionId);

  if (!section) {
    throw new Error(`CV section with ID ${sectionId} not found`);
  }

  // Validate that all item IDs exist in this section
  for (const itemId of itemIds) {
    const item = section.items.find(i => getCVItemId(i) === itemId);
    if (!item) {
      throw new Error(`CV section item with ID ${itemId} not found in section ${sectionId}`);
    }
  }

  // Reorder items based on itemIds array
  const reorderedItems: CVSectionItem[] = [];
  for (const itemId of itemIds) {
    const item = section.items.find(i => getCVItemId(i) === itemId);
    if (item) {
      reorderedItems.push(item);
    }
  }

  section.items = reorderedItems;
  await writePortfolioData(data);
}

// ========================================
// Specialized CV Item Creation Functions
// ========================================

export async function createEducationItem(
  sectionId: UUID,
  educationData: Omit<Education, "id">
): Promise<UUID> {
  return await createCVSectionItem(sectionId, {
    ...educationData,
    id: uuidv4(),
  } as Education);
}

export async function createWorkExperienceItem(
  sectionId: UUID,
  workData: Omit<WorkExperience, "id">
): Promise<UUID> {
  return await createCVSectionItem(sectionId, {
    ...workData,
    id: uuidv4(),
  } as WorkExperience);
}

export async function createSkillCategoryItem(
  sectionId: UUID,
  skillData: SkillCategory
): Promise<UUID> {
  // Note: SkillCategory doesn't have an id, so we'll treat it differently
  const data = await readPortfolioData();
  const section = data.cv.sections.find(s => s.id === sectionId);

  if (!section) {
    throw new Error(`CV section with ID ${sectionId} not found`);
  }

  section.items.push(skillData as CVSectionItem);
  await writePortfolioData(data);
  return uuidv4(); // Return a placeholder ID
}

export async function createPublicationItem(
  sectionId: UUID,
  publicationData: Omit<Publication, "id">
): Promise<UUID> {
  return await createCVSectionItem(sectionId, {
    ...publicationData,
    id: uuidv4(),
  } as Publication);
}

export async function createAwardItem(
  sectionId: UUID,
  awardData: Omit<Award, "id">
): Promise<UUID> {
  return await createCVSectionItem(sectionId, {
    ...awardData,
    id: uuidv4(),
  } as Award);
}

export async function createCertificationItem(
  sectionId: UUID,
  certificationData: Omit<Certification, "id">
): Promise<UUID> {
  return await createCVSectionItem(sectionId, {
    ...certificationData,
    id: uuidv4(),
  } as Certification);
}

export async function createVolunteerExperienceItem(
  sectionId: UUID,
  volunteerData: Omit<VolunteerExperience, "id">
): Promise<UUID> {
  return await createCVSectionItem(sectionId, {
    ...volunteerData,
    id: uuidv4(),
  } as VolunteerExperience);
}

export async function createLanguageItem(
  sectionId: UUID,
  languageData: Omit<Language, "id">
): Promise<UUID> {
  return await createCVSectionItem(sectionId, {
    ...languageData,
    id: uuidv4(),
  } as Language);
}

export async function createCustomCVItem(
  sectionId: UUID,
  customData: Omit<CustomCVItem, "id">
): Promise<UUID> {
  return await createCVSectionItem(sectionId, {
    ...customData,
    id: uuidv4(),
  } as CustomCVItem);
}

// ========================================
// CV Section Template Functions
// ========================================

export async function createEducationSection(): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if education section already exists
  const existingSection = data.cv.sections.find(s => s.type === "education");
  if (existingSection) {
    throw new Error("An education section already exists. Only one education section is allowed.");
  }
  
  return await createCVSection({
    title: "Education",
    type: "education",
    items: [],
    isVisible: true,
  });
}

export async function createWorkExperienceSection(): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if work experience section already exists
  const existingSection = data.cv.sections.find(s => s.type === "work_experience");
  if (existingSection) {
    throw new Error("A work experience section already exists. Only one work experience section is allowed.");
  }
  
  return await createCVSection({
    title: "Professional Experience",
    type: "work_experience",
    items: [],
    isVisible: true,
  });
}

export async function createSkillsSection(): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if skills section already exists
  const existingSection = data.cv.sections.find(s => s.type === "skills");
  if (existingSection) {
    throw new Error("A skills section already exists. Only one skills section is allowed.");
  }
  
  return await createCVSection({
    title: "Skills & Expertise",
    type: "skills",
    items: [],
    isVisible: true,
  });
}

export async function createPublicationsSection(): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if publications section already exists
  const existingSection = data.cv.sections.find(s => s.type === "publications");
  if (existingSection) {
    throw new Error("A publications section already exists. Only one publications section is allowed.");
  }
  
  return await createCVSection({
    title: "Publications",
    type: "publications",
    items: [],
    isVisible: true,
  });
}

export async function createAwardsSection(): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if awards section already exists
  const existingSection = data.cv.sections.find(s => s.type === "awards");
  if (existingSection) {
    throw new Error("An awards section already exists. Only one awards section is allowed.");
  }
  
  return await createCVSection({
    title: "Awards & Honors",
    type: "awards",
    items: [],
    isVisible: true,
  });
}

export async function createCertificationsSection(): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if certifications section already exists
  const existingSection = data.cv.sections.find(s => s.type === "certifications");
  if (existingSection) {
    throw new Error("A certifications section already exists. Only one certifications section is allowed.");
  }
  
  return await createCVSection({
    title: "Certifications",
    type: "certifications",
    items: [],
    isVisible: true,
  });
}

export async function createVolunteeringSection(): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if volunteering section already exists
  const existingSection = data.cv.sections.find(s => s.type === "volunteering");
  if (existingSection) {
    throw new Error("A volunteering section already exists. Only one volunteering section is allowed.");
  }
  
  return await createCVSection({
    title: "Volunteer Experience",
    type: "volunteering",
    items: [],
    isVisible: true,
  });
}

export async function createLanguagesSection(): Promise<UUID> {
  const data = await readPortfolioData();
  
  // Check if languages section already exists
  const existingSection = data.cv.sections.find(s => s.type === "languages");
  if (existingSection) {
    throw new Error("A languages section already exists. Only one languages section is allowed.");
  }
  
  return await createCVSection({
    title: "Languages",
    type: "languages",
    items: [],
    isVisible: true,
  });
}

export async function createCustomSection(title: string): Promise<UUID> {
  // Custom sections are allowed to have multiple instances
  return await createCVSection({
    title,
    type: "custom",
    items: [],
    isVisible: true,
  });
}

// ========================================
// Migration Function (Legacy)
// ========================================

// export async function migrateCVToSections(): Promise<void> {
//   const data = await readPortfolioData();
  
//   // Check if CV is already using sections structure
//   if ('sections' in data.cv && Array.isArray(data.cv.sections)) {
//     console.log("CV is already using sections structure");
//     return;
//   }

//   // Migrate old CV structure to new sections structure
//   const sections: CVSection[] = [];
//   let sortOrder = 0;

//   const oldCV = data.cv as any;

//   // Migrate education
//   if (oldCV.education?.length > 0) {
//     sections.push({
//       id: uuidv4(),
//       title: "Education",
//       type: "education",
//       items: oldCV.education,
//       isVisible: true,
//       sortOrder: sortOrder++,
//     });
//   }

//   // Migrate work experience
//   if (oldCV.workExperience?.length > 0) {
//     sections.push({
//       id: uuidv4(),
//       title: "Professional Experience",
//       type: "work_experience",
//       items: oldCV.workExperience,
//       isVisible: true,
//       sortOrder: sortOrder++,
//     });
//   }

//   // Migrate skills
//   if (oldCV.skills?.length > 0) {
//     sections.push({
//       id: uuidv4(),
//       title: "Skills & Expertise",
//       type: "skills",
//       items: oldCV.skills,
//       isVisible: true,
//       sortOrder: sortOrder++,
//     });
//   }

//   // Migrate publications
//   if (oldCV.publications?.length > 0) {
//     sections.push({
//       id: uuidv4(),
//       title: "Publications",
//       type: "publications",
//       items: oldCV.publications,
//       isVisible: true,
//       sortOrder: sortOrder++,
//     });
//   }

//   // Migrate awards
//   if (oldCV.awardsAndHonors?.length > 0) {
//     sections.push({
//       id: uuidv4(),
//       title: "Awards & Honors",
//       type: "awards",
//       items: oldCV.awardsAndHonors,
//       isVisible: true,
//       sortOrder: sortOrder++,
//     });
//   }

//   // Create new CV structure
//   const newCV: CV = {
//     title: oldCV.title || "Curriculum Vitae",
//     contactInformation: oldCV.contactInformation,
//     summary: oldCV.summary || "",
//     sections,
//   };

//   data.cv = newCV;
//   await writePortfolioData(data);
// }

// ========================================
// Update Functions
// ========================================

export async function updateUserProfile(
  profileData: UserProfile
): Promise<void> {
  const data = await readPortfolioData();

  const {
    name,
    tagline,
    email,
    phone,
    location,
    websiteUrl,
    profilePictureUrl,
    socialLinks,
  } = profileData;

  data.userProfile = {
    name,
    tagline,
    email,
    phone,
    location,
    websiteUrl,
    profilePictureUrl,
    socialLinks,
  };
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