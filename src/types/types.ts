import { JSONContent } from "@tiptap/react";

export type UUID = string;

// ========================================
// User Profile Types
// ========================================

export interface SocialLink {
  id: UUID;
  platformName: string;
  url: string;
  iconSlug: string;
}

export interface UserProfile {
  name: string;
  tagline: string;
  email: string;
  phone?: string;
  location?: string;
  websiteUrl: string;
  profilePictureUrl: string;
  socialLinks: SocialLink[];
}

// ========================================
// Settings Types
// ========================================

export interface Settings {
  publicResumeId?: UUID; // References an ID from the 'resumes' array
  availableTechnologies: string[];
  availableRoles: string[];
}

// ========================================
// Landing Page Types
// ========================================

export interface CallToAction {
  id: UUID;
  text: string;
  url: string;
  style?: string; // e.g., "primary", "secondary"
}

export interface LandingPage {
  greeting: string;
  mainHeadline: string;
  introductionParagraphs: string[];
  callToActions: CallToAction[];
  featuredProjectIds: UUID[]; // Array of UUIDs referencing portfolio.projects
}

// ========================================
// Portfolio Types
// ========================================

export interface PortfolioDisplaySettings {
  defaultSortOrder?: string;
  showFilters?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  status: string;
  thumbnailImageUrl: string;
  headerImageUrl: string;
  shortDescription: string;
  longDescription: JSONContent;
  technologies: string[];
  roles: string[];
  liveProjectUrl?: string;
  sourceCodeUrl?: string;
  keyFeatures?: string[];
  galleryImageUrls?: string[];
}

export interface Portfolio {
  displaySettings?: PortfolioDisplaySettings;
  projects: Project[];
}

// ========================================
// CV Types
// ========================================

export interface ContactInformation {
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface Education {
  id: UUID;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  details?: string[];
}

export interface WorkExperience {
  id: UUID;
  jobTitle: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string;
  endDate: string; // Or "Present"
  responsibilities: string[];
  technologiesUsed?: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Publication {
  id: UUID;
  title: string;
  authors?: string;
  conferenceOrJournal?: string;
  date: string;
  url?: string;
}

export interface Award {
  id: UUID;
  name: string;
  issuer?: string;
  date: string;
  description?: string;
}

export interface CV {
  title?: string; 
  contactInformation: ContactInformation;
  summary: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: SkillCategory[];
  projects?: UUID[];
  publications?: Publication[];
  awardsAndHonors?: Award[];
}

// ========================================
// Resume Types
// ========================================

export type ResumeSectionType = "experience" | "projects" | "skills_list" | "education";

// Resume section item types vary by section type
export interface ResumeExperienceItem {
  jobTitle: string;
  company: string;
  date: string;
  achievements: string[];
  relatedPortfolioProjectIds?: UUID[];
}

export interface ResumeProjectItem {
  portfolioProjectId: UUID; // References portfolio.projects.id
  customTitle?: string;
  resumeSpecificDescription?: string;
  technologiesUsed?: string[];
}

export interface ResumeEducationItem {
  degree: string;
  institution: string;
  graduationYear: string;
  relevantCoursework?: string;
}

// Union type for resume section items
export type ResumeSectionItem = 
  | ResumeExperienceItem 
  | ResumeProjectItem 
  | ResumeEducationItem 
  | string; // For skills_list type

export interface ResumeSection {
  id: UUID;
  title: string;
  type: ResumeSectionType;
  items: ResumeSectionItem[];
}

export interface Resume {
  id: UUID;
  nameForUser: string; // Internal name for local builder UI
  publicTitle: string; // Title displayed on this resume
  contactInformation: ContactInformation;
  summary: string;
  sections: ResumeSection[];
}

// ========================================
// Main Data Structure Type
// ========================================

export interface PortfolioData {
  userProfile: UserProfile;
  settings: Settings;
  landingPage: LandingPage;
  portfolio: Portfolio;
  cv: CV;
  resumes: Resume[];
}

// ========================================
// Type Guards for Resume Section Items
// ========================================

export function isResumeExperienceItem(item: ResumeSectionItem): item is ResumeExperienceItem {
  return typeof item === 'object' && 'jobTitle' in item && 'company' in item && 'achievements' in item;
}

export function isResumeProjectItem(item: ResumeSectionItem): item is ResumeProjectItem {
  return typeof item === 'object' && 'portfolioProjectId' in item;
}

export function isResumeEducationItem(item: ResumeSectionItem): item is ResumeEducationItem {
  return typeof item === 'object' && 'degree' in item && 'institution' in item && 'graduationYear' in item;
}

export function isSkillItem(item: ResumeSectionItem): item is string {
  return typeof item === 'string';
}

// ========================================
// Utility Types
// ========================================

// Type for finding a project by ID
export type ProjectLookup = { [key: UUID]: Project };

// Type for finding a resume by ID
export type ResumeLookup = { [key: UUID]: Resume };

// Type for portfolio sort orders
export type SortOrder = "date_asc" | "date_desc" | "title_asc" | "title_desc";

// Type for project status
export type ProjectStatus = "Completed" | "In Progress" | "Planned" | "On Hold";

// Type for CTA styles
export type CTAStyle = "primary" | "secondary" | "tertiary";