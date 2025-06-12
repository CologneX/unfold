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
  publicResumeId?: UUID;
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
  style?: string;
}

export interface LandingPage {
  greeting: string;
  mainHeadline: string;
  introductionParagraphs: string[];
  callToActions: CallToAction[];
  featuredProjectIds: UUID[];
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
  graduationDate?: string;
  current?: boolean;
  details?: string[];
}

export interface WorkExperience {
  id: UUID;
  jobTitle: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string;
  current?: boolean;
  endDate?: string;
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

// ========================================
// CV Dynamic Section Types
// ========================================

export type CVSectionType = 
  | "education" 
  | "work_experience" 
  | "skills" 
  | "projects" 
  | "publications" 
  | "awards" 
  | "certifications"
  | "volunteering"
  | "languages"
  | "custom";

// CV section item types vary by section type
export type CVSectionItem = 
  | Education
  | WorkExperience
  | SkillCategory
  | Publication
  | Award
  | Project
  | Certification
  | VolunteerExperience
  | Language
  | CustomCVItem;

export interface CVSection {
  id: UUID;
  title: string;
  type: CVSectionType;
  items: CVSectionItem[];
  isVisible: boolean;
  sortOrder: number;
}

export interface Certification {
  id: UUID;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface VolunteerExperience {
  id: UUID;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  location?: string;
}

export interface Language {
  id: UUID;
  language: string;
  proofUrl?: string;
  proficiency: "Native" | "Fluent" | "Intermediate" | "Basic";
}

export interface CustomCVItem {
  id: UUID;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  details?: string[];
}

export interface CV {
  title?: string;
  contactInformation: ContactInformation;
  summary: string;
  sections: CVSection[];
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
}

// ========================================
// Utility Types
// ========================================

// Type for finding a project by ID
export type ProjectLookup = { [key: UUID]: Project };

// Type for portfolio sort orders
export type SortOrder = "date_asc" | "date_desc" | "title_asc" | "title_desc";

// Type for project status
export type ProjectStatus = "Completed" | "In Progress" | "Planned" | "On Hold";

export function isCVEducationItem(item: CVSectionItem): item is Education {
  return typeof item === 'object' && 'degree' in item && 'institution' in item;
}

export function isCVWorkExperienceItem(item: CVSectionItem): item is WorkExperience {
  return typeof item === 'object' && 'jobTitle' in item && 'company' in item && 'responsibilities' in item;
}

export function isCVSkillCategoryItem(item: CVSectionItem): item is SkillCategory {
  return typeof item === 'object' && 'category' in item && 'items' in item;
}

export function isCVPublicationItem(item: CVSectionItem): item is Publication {
  return typeof item === 'object' && 'title' in item && 'authors' in item;
}

export function isCVAwardItem(item: CVSectionItem): item is Award {
  return typeof item === 'object' && 'name' in item && 'issuer' in item;
}

export function isCVCertificationItem(item: CVSectionItem): item is Certification {
  return typeof item === 'object' && 'name' in item && 'issuer' in item && 'date' in item;
}

export function isCVLanguageItem(item: CVSectionItem): item is Language {
  return typeof item === 'object' && 'language' in item && 'proficiency' in item;
}

export function isCVVolunteerExperienceItem(item: CVSectionItem): item is VolunteerExperience {
  return typeof item === 'object' && 'organization' in item && 'role' in item && 'description' in item;
}

export function isCVCustomItem(item: CVSectionItem): item is CustomCVItem {
  return typeof item === 'object' && 'title' in item && !('degree' in item) && !('jobTitle' in item);
}