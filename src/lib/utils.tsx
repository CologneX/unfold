import { UserProfile, CVSectionType } from "@/types/types";
import {
  BookOutlined,
  BankOutlined,
  StarOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  TranslationOutlined,
  FolderOutlined,
  SettingOutlined,
  LinkedinOutlined,
  GithubOutlined,
  TwitterOutlined,
  GlobalOutlined,
  LinkOutlined,
} from "@ant-design/icons";

/**
 * Checks if the application is running in development mode.
 * @returns True if the app is running in development mode, false otherwise.
 */
export function isAppDevMode() {
  return process.env.NODE_ENV === "development";
}

/**
 * Turns a date into a human-readable format (e.g., "March 2020").
 * @returns String version of a date in a human-readable format.
 */
export function formatDateToMonthYear(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

/**
 * Returns the file name for a given user profile.
 * @param userProfile - The user profile.
 * @returns The file name for the given user profile.
 */
export function getCVFileName(userProfile: UserProfile) {
  return `${userProfile.name} - CV - ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })}.pdf`;
}

/**
 * Returns the icon for a given section type.
 * @param sectionType - The type of section.
 * @returns The icon for the given section type.
 */
export function getSectionIcon(sectionType: CVSectionType) {
  switch (sectionType) {
    case "education":
      return <BookOutlined />;
    case "work_experience":
      return <BankOutlined />;
    case "skills":
      return <StarOutlined />;
    case "publications":
      return <FileTextOutlined />;
    case "awards":
      return <TrophyOutlined />;
    case "certifications":
      return <SafetyCertificateOutlined />;
    case "volunteering":
      return <HeartOutlined />;
    case "languages":
      return <TranslationOutlined />;
    case "projects":
      return <FolderOutlined />;
    case "custom":
    default:
      return <SettingOutlined />;
  }
}

/**
 * Returns the icon for a given social link platform name.
 * @param platformName - The name of the social link platform.
 * @returns The icon for the given social link platform name.
 */

export function getSocialLinkIcon(platformName: string) {
  switch (platformName) {
    case "LinkedIn":
      return <LinkedinOutlined />;
    case "GitHub":
      return <GithubOutlined />;
    case "X":
      return <TwitterOutlined />;
    case "Website":
      return <GlobalOutlined />;
    default:
      return <LinkOutlined />;
  }
}
