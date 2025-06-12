"use client";

import React, { useState } from "react";
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Grid,
  GridCol,
  TextInput,
  Button,
  Avatar,
  Card,
  ActionIcon,
  Divider,
  Box,
  ThemeIcon,
  Textarea,
  TagsInput,
  Select,
  Modal,
} from "@mantine/core";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  LinkedinOutlined,
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  BookOutlined,
  CarryOutOutlined,
  BulbOutlined,
  FileTextOutlined,
  TrophyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  UserProfile,
  SocialLink,
  CV,
  CVSection,
  CVSectionType,
  CVSectionItem,
  Education,
  WorkExperience,
  SkillCategory,
  Publication,
  Award,
  Certification,
  VolunteerExperience,
  Language,
  CustomCVItem,
  isCVEducationItem,
  isCVWorkExperienceItem,
  isCVSkillCategoryItem,
  isCVPublicationItem,
  isCVAwardItem,
  isCVCertificationItem,
  isCVLanguageItem,
  isCVVolunteerExperienceItem,
  isCVCustomItem,
} from "@/types/types";
import { updateUserProfile, updateCV } from "@/app/actions";
import { ImageInput } from "@/components/ImageInput/ImageInput";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

const SOCIAL_PLATFORMS = [
  {
    name: "LinkedIn",
    icon: LinkedinOutlined,
    slug: "linkedin",
    color: "#0077B5",
  },
  { name: "GitHub", icon: GithubOutlined, slug: "github", color: "#333" },
  { name: "Twitter", icon: TwitterOutlined, slug: "twitter", color: "#1DA1F2" },
  {
    name: "Instagram",
    icon: InstagramOutlined,
    slug: "instagram",
    color: "#E4405F",
  },
  {
    name: "Other",
    icon: GlobalOutlined,
    slug: "other",
    color: "#888",
  },
];

const SECTION_TYPES: {
  value: CVSectionType;
  label: string;
  icon: typeof BookOutlined;
}[] = [
  { value: "education", label: "Education", icon: BookOutlined },
  {
    value: "work_experience",
    label: "Work Experience",
    icon: CarryOutOutlined,
  },
  { value: "skills", label: "Skills", icon: BulbOutlined },
  { value: "publications", label: "Publications", icon: FileTextOutlined },
  { value: "awards", label: "Awards & Honors", icon: TrophyOutlined },
  { value: "certifications", label: "Certifications", icon: TrophyOutlined },
  {
    value: "volunteering",
    label: "Volunteer Experience",
    icon: CarryOutOutlined,
  },
  { value: "languages", label: "Languages", icon: GlobalOutlined },
  { value: "custom", label: "Custom Section", icon: PlusOutlined },
];

interface ProfileEditorForm {
  name: string;
  tagline: string;
  email: string;
  phone?: string;
  location?: string;
  websiteUrl: string;
  profilePictureUrl: string;
  socialLinks: SocialLink[];
  cvTitle: string;
  cvSummary: string;
  cvContactEmail: string;
  cvPhone: string;
  cvLinkedinUrl: string;
  cvPortfolioUrl: string;
  cvSections: CVSection[];
}

interface ProfileEditFormProps {
  initialProfile: UserProfile;
  initialCV: CV;
}

type DeleteTargetData =
  | { index: number; link: SocialLink }
  | { sectionIndex: number; section: CVSection }
  | { sectionIndex: number; itemIndex: number; item: CVSectionItem };

export function ProfileEditForm({
  initialProfile,
  initialCV,
}: ProfileEditFormProps) {
  const [saving, setSaving] = useState(false);
  const [selectedSectionType, setSelectedSectionType] =
    useState<CVSectionType>("education");
  // const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Delete confirmation states
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "socialLink" | "section" | "sectionItem";
    data: DeleteTargetData;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Custom section modal states
  const [
    customSectionModalOpened,
    { open: openCustomSectionModal, close: closeCustomSectionModal },
  ] = useDisclosure(false);
  const [customSectionTitle, setCustomSectionTitle] = useState("");

  const router = useRouter();

  const form = useForm<ProfileEditorForm>({
    initialValues: {
      name: initialProfile.name || "",
      tagline: initialProfile.tagline || "",
      email: initialProfile.email || "",
      phone: initialProfile.phone || undefined,
      location: initialProfile.location || undefined,
      websiteUrl: initialProfile.websiteUrl || "",
      profilePictureUrl: initialProfile.profilePictureUrl || "",
      socialLinks: initialProfile.socialLinks || [],
      cvTitle: initialCV.title || "Curriculum Vitae",
      cvSummary: initialCV.summary || "",
      cvContactEmail: initialCV.contactInformation?.email || "",
      cvPhone: initialCV.contactInformation?.phone || "",
      cvLinkedinUrl: initialCV.contactInformation?.linkedinUrl || "",
      cvPortfolioUrl: initialCV.contactInformation?.portfolioUrl || "",
      cvSections: initialCV.sections || [],
    },
    validate: {
      name: (value) => (value.trim() ? null : "Name is required"),
      tagline: (value) => (value.trim() ? null : "Tagline is required"),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      websiteUrl: (value) =>
        !value || /^https?:\/\/.+/.test(value) ? null : "Invalid URL format",
      cvContactEmail: (value) =>
        !value || /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
      cvLinkedinUrl: (value) =>
        !value || /^https?:\/\/.+/.test(value) ? null : "Invalid URL format",
      cvPortfolioUrl: (value) =>
        !value || /^https?:\/\/.+/.test(value) ? null : "Invalid URL format",
      socialLinks: {
        url: (value) => (/^https?:\/\/.+/.test(value) ? null : "Invalid URL"),
      },
      cvSections: {
        title: (value) =>
          value && value.trim() ? null : "Section title is required",
        items: {
          // Education validation
          degree: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (section?.type === "education" && isCVEducationItem(item)) {
              return value && value.trim() ? null : "Degree is required";
            }
            return null;
          },
          institution: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (section?.type === "education" && isCVEducationItem(item)) {
              return value && value.trim() ? null : "Institution is required";
            }
            return null;
          },
          // Work experience validation
          jobTitle: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (
              section?.type === "work_experience" &&
              isCVWorkExperienceItem(item)
            ) {
              return value && value.trim() ? null : "Job title is required";
            }
            return null;
          },
          company: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (
              section?.type === "work_experience" &&
              isCVWorkExperienceItem(item)
            ) {
              return value && value.trim() ? null : "Company is required";
            }
            return null;
          },
          // Skills validation
          category: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (section?.type === "skills" && isCVSkillCategoryItem(item)) {
              return value && value.trim() ? null : "Category is required";
            }
            return null;
          },
          // Publication validation
          title: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (section?.type === "publications" && isCVPublicationItem(item)) {
              return value && value.trim() ? null : "Title is required";
            }

            if (section?.type === "custom" && isCVCustomItem(item)) {
              return value && value.trim() ? null : "Title is required";
            }
            return null;
          },
          // Language validation
          language: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (section?.type === "languages" && isCVLanguageItem(item)) {
              return value && value.trim() ? null : "Language is required";
            }
            return null;
          },
          proficiency: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (section?.type === "languages" && isCVLanguageItem(item)) {
              return value && value.trim()
                ? null
                : "Proficiency level is required";
            }
            return null;
          },
          // Volunteer Experience validation
          organization: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (
              section?.type === "volunteering" &&
              isCVVolunteerExperienceItem(item)
            ) {
              return value && value.trim() ? null : "Organization is required";
            }
            return null;
          },
          role: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (
              section?.type === "volunteering" &&
              isCVVolunteerExperienceItem(item)
            ) {
              return value && value.trim() ? null : "Role is required";
            }
            return null;
          },
          startDate: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (
              section?.type === "volunteering" &&
              isCVVolunteerExperienceItem(item)
            ) {
              return value && value.trim() ? null : "Start date is required";
            }
            return null;
          },
          endDate: (value: string, values: ProfileEditorForm, path: string) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (
              section?.type === "volunteering" &&
              isCVVolunteerExperienceItem(item)
            ) {
              return value && value.trim() ? null : "End date is required";
            }
            return null;
          },
          description: (
            value: string,
            values: ProfileEditorForm,
            path: string
          ) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (
              section?.type === "volunteering" &&
              isCVVolunteerExperienceItem(item)
            ) {
              return value && value.trim() ? null : "Description is required";
            }
            return null;
          },
          // Award validation
          name: (value, values, path) => {
            const pathParts = path.split(".");
            const sectionIndex = parseInt(pathParts[1]);
            const itemIndex = parseInt(pathParts[3]);
            const section = values.cvSections?.[sectionIndex];
            const item = section?.items?.[itemIndex];

            if (section?.type === "awards" && isCVAwardItem(item)) {
              return value && value.trim() ? null : "Award name is required";
            }
            return null;
          },
        },
      },
    },
  });

  // Auto-focus utility
  const focusFirstInput = (sectionIndex: number, itemIndex: number) => {
    setTimeout(() => {
      const firstInput = document.querySelector(
        `[data-section="${sectionIndex}"][data-item="${itemIndex}"] input, [data-section="${sectionIndex}"][data-item="${itemIndex}"] textarea`
      ) as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
        // setEditingItemId(`${sectionIndex}-${itemIndex}`);
      }
    }, 100);
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = form.isDirty();

  // Delete confirmation handler
  const handleDeleteConfirmation = (
    type: "socialLink" | "section" | "sectionItem",
    data: DeleteTargetData,
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setDeleteTarget({ type, data, title, message, onConfirm });
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteTarget.onConfirm();
      setDeleteTarget(null);
    }
    closeDeleteModal();
  };

  // Custom section modal handlers
  const openCustomSectionCreation = () => {
    setCustomSectionTitle("");
    openCustomSectionModal();
  };

  const createCustomSection = () => {
    if (!customSectionTitle.trim()) {
      notifications.show({
        title: "Invalid Input",
        message: "Please enter a section title.",
        color: "red",
      });
      return;
    }

    const maxSortOrder = Math.max(
      ...form.values.cvSections.map((s) => s.sortOrder),
      -1
    );

    const newItem: CustomCVItem = {
      id: `custom_${Date.now()}`,
      title: "",
      subtitle: "",
      date: "",
      description: "",
      details: [],
    };

    const newSection: CVSection = {
      id: `section_${Date.now()}`,
      title: customSectionTitle.trim(),
      type: "custom",
      items: [newItem],
      isVisible: true,
      sortOrder: maxSortOrder + 1,
    };

    const newSections = [...form.values.cvSections, newSection];
    form.setFieldValue("cvSections", newSections);

    // Auto-focus on the first input of the new item
    const sectionIndex = newSections.length - 1;
    focusFirstInput(sectionIndex, 0);

    notifications.show({
      title: "Section Added",
      message: `${customSectionTitle} section added successfully!`,
      color: "green",
    });

    closeCustomSectionModal();
  };

  const handleSave = async (values: ProfileEditorForm) => {
    try {
      setSaving(true);
      // setEditingItemId(null);

      // Update profile
      await updateUserProfile(values);

      // Update CV with all data including sections
      const updatedCV: CV = {
        title: values.cvTitle,
        summary: values.cvSummary,
        contactInformation: {
          email: values.cvContactEmail,
          phone: values.cvPhone,
          linkedinUrl: values.cvLinkedinUrl,
          portfolioUrl: values.cvPortfolioUrl,
        },
        sections: values.cvSections,
      };

      await updateCV(updatedCV);

      notifications.show({
        title: "Success",
        message: "Profile and CV updated successfully!",
        color: "green",
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message: "Failed to save profile and CV. Please try again.",
        color: "red",
      });
    } finally {
      setSaving(false);
      form.resetDirty();
    }
  };

  // Social Links Management
  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: `social_${Date.now()}`,
      platformName: "",
      url: "",
      iconSlug: "",
    };
    form.setFieldValue("socialLinks", [...form.values.socialLinks, newLink]);
  };

  const removeSocialLink = (index: number) => {
    const link = form.values.socialLinks[index];
    handleDeleteConfirmation(
      "socialLink",
      { index, link },
      "Delete Social Link",
      `Are you sure you want to delete this ${
        link.platformName || "social"
      } link?`,
      () => {
        form.setFieldValue(
          "socialLinks",
          form.values.socialLinks.filter((_, i) => i !== index)
        );
        
        // Manually mark form as dirty since deletion should enable save button
        form.setDirty({ socialLinks: true });
      }
    );
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updatedLinks = [...form.values.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    form.setFieldValue("socialLinks", updatedLinks);
  };

  const selectPlatform = (
    index: number,
    platform: (typeof SOCIAL_PLATFORMS)[0]
  ) => {
    updateSocialLink(index, "platformName", platform.name);
    updateSocialLink(index, "iconSlug", platform.slug);
  };

  const getSocialPlatform = (iconSlug: string) =>
    SOCIAL_PLATFORMS.find((p) => p.slug === iconSlug);

  // CV Section Management
  const addNewSection = () => {
    // if (hasUnsavedChanges) {
    //   notifications.show({
    //     title: "Unsaved Changes",
    //     message:
    //       "Please save your current changes before adding a new section.",
    //     color: "orange",
    //   });
    //   return;
    // }

    const maxSortOrder = Math.max(
      ...form.values.cvSections.map((s) => s.sortOrder),
      -1
    );

    let sectionTitle = "";
    let newItem: CVSectionItem;

    switch (selectedSectionType) {
      case "education":
        sectionTitle = "Education";
        newItem = {
          id: `edu_${Date.now()}`,
          degree: "",
          institution: "",
          location: "",
          graduationDate: "",
          details: [],
        } as Education;
        break;
      case "work_experience":
        sectionTitle = "Professional Experience";
        newItem = {
          id: `work_${Date.now()}`,
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          responsibilities: [],
          technologiesUsed: [],
        } as WorkExperience;
        break;
      case "skills":
        sectionTitle = "Skills & Expertise";
        newItem = {
          category: "",
          items: [],
        } as SkillCategory;
        break;
      case "publications":
        sectionTitle = "Publications";
        newItem = {
          id: `pub_${Date.now()}`,
          title: "",
          authors: "",
          conferenceOrJournal: "",
          date: "",
          url: "",
        } as Publication;
        break;
      case "awards":
        sectionTitle = "Awards & Honors";
        newItem = {
          id: `award_${Date.now()}`,
          name: "",
          issuer: "",
          date: "",
          description: "",
        } as Award;
        break;
      case "certifications":
        sectionTitle = "Certifications";
        newItem = {
          id: `cert_${Date.now()}`,
          name: "",
          issuer: "",
          date: "",
          expirationDate: "",
          credentialId: "",
          credentialUrl: "",
        } as Certification;
        break;
      case "volunteering":
        sectionTitle = "Volunteer Experience";
        newItem = {
          id: `vol_${Date.now()}`,
          organization: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
          location: "",
        } as VolunteerExperience;
        break;
      case "languages":
        sectionTitle = "Languages";
        newItem = {
          id: `lang_${Date.now()}`,
          language: "",
          proficiency: "Intermediate",
          proofUrl: "",
        } as Language;
        break;
      case "custom":
        openCustomSectionCreation();
        return; // Exit early since the modal will handle the creation
      default:
        return;
    }

    const newSection: CVSection = {
      id: `section_${Date.now()}`,
      title: sectionTitle,
      type: selectedSectionType,
      items: [newItem],
      isVisible: true,
      sortOrder: maxSortOrder + 1,
    };

    const newSections = [...form.values.cvSections, newSection];
    form.setFieldValue("cvSections", newSections);

    // Auto-focus on the first input of the new item
    const sectionIndex = newSections.length - 1;
    focusFirstInput(sectionIndex, 0);

    notifications.show({
      title: "Section Added",
      message: `${sectionTitle} section added successfully!`,
      color: "green",
    });
  };

  const toggleSectionVisibility = (sectionIndex: number) => {
    const sections = [...form.values.cvSections];
    sections[sectionIndex].isVisible = !sections[sectionIndex].isVisible;
    form.setFieldValue("cvSections", sections);
    form.setDirty({ cvSections: true });
  };

  const deleteSection = (sectionIndex: number, section: CVSection) => {
    handleDeleteConfirmation(
      "section",
      { sectionIndex, section },
      "Delete CV Section",
      `Are you sure you want to delete the "${
        section.title
      }" section? This will remove all ${section.items.length} item${
        section.items.length !== 1 ? "s" : ""
      } in this section.`,
      () => {
        const sections = form.values.cvSections.filter(
          (_, i) => i !== sectionIndex
        );
        form.setFieldValue("cvSections", sections);
        
        // Manually mark form as dirty since deletion should enable save button
        form.setDirty({ cvSections: true });
        
        notifications.show({
          title: "Success",
          message: "Section deleted successfully!",
          color: "green",
        });
      }
    );
  };

  const addItemToSection = (
    sectionIndex: number,
    sectionType: CVSectionType
  ) => {
    if (hasUnsavedChanges) {
      notifications.show({
        title: "Unsaved Changes",
        message:
          "Please finish editing the current item before adding a new one.",
        color: "orange",
      });
      return;
    }

    let newItem: CVSectionItem;

    switch (sectionType) {
      case "education":
        newItem = {
          id: `edu_${Date.now()}`,
          degree: "",
          institution: "",
          location: "",
          graduationDate: "",
          details: [],
        } as Education;
        break;
      case "work_experience":
        newItem = {
          id: `work_${Date.now()}`,
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          responsibilities: [],
          technologiesUsed: [],
        } as WorkExperience;
        break;
      case "skills":
        newItem = {
          category: "",
          items: [],
        } as SkillCategory;
        break;
      case "publications":
        newItem = {
          id: `pub_${Date.now()}`,
          title: "",
          authors: "",
          conferenceOrJournal: "",
          date: "",
          url: "",
        } as Publication;
        break;
      case "awards":
        newItem = {
          id: `award_${Date.now()}`,
          name: "",
          issuer: "",
          date: "",
          description: "",
        } as Award;
        break;
      case "certifications":
        newItem = {
          id: `cert_${Date.now()}`,
          name: "",
          issuer: "",
          date: "",
          expirationDate: "",
          credentialId: "",
          credentialUrl: "",
        } as Certification;
        break;
      case "volunteering":
        newItem = {
          id: `vol_${Date.now()}`,
          organization: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
          location: "",
        } as VolunteerExperience;
        break;
      case "languages":
        newItem = {
          id: `lang_${Date.now()}`,
          language: "",
          proficiency: "Intermediate",
          proofUrl: "",
        } as Language;
        break;
      case "custom":
        newItem = {
          id: `custom_${Date.now()}`,
          title: "",
          subtitle: "",
          date: "",
          description: "",
          details: [],
        } as CustomCVItem;
        break;
      default:
        return;
    }

    const sections = [...form.values.cvSections];
    sections[sectionIndex].items.push(newItem);
    form.setFieldValue("cvSections", sections);

    // Auto-focus on the first input of the new item
    const itemIndex = sections[sectionIndex].items.length - 1;
    focusFirstInput(sectionIndex, itemIndex);

    notifications.show({
      title: "Item Added",
      message: "New item added successfully!",
      color: "green",
    });
  };

  const deleteItemFromSection = (
    sectionIndex: number,
    itemIndex: number,
    item: CVSectionItem
  ) => {
    let itemTitle = "";

    if (isCVEducationItem(item)) {
      itemTitle = item.degree || `Education Entry #${itemIndex + 1}`;
    } else if (isCVWorkExperienceItem(item)) {
      itemTitle = item.jobTitle || `Work Experience #${itemIndex + 1}`;
    } else if (isCVSkillCategoryItem(item)) {
      itemTitle = item.category || `Skill Category #${itemIndex + 1}`;
    } else if (isCVPublicationItem(item)) {
      itemTitle = item.title || `Publication #${itemIndex + 1}`;
    } else if (isCVAwardItem(item)) {
      itemTitle = item.name || `Award #${itemIndex + 1}`;
    } else if (isCVLanguageItem(item)) {
      itemTitle = item.language || `Language #${itemIndex + 1}`;
    } else if (isCVVolunteerExperienceItem(item)) {
      itemTitle =
        `${item.role || "Volunteer Role"} at ${
          item.organization || "Organization"
        }` || `Volunteer Experience #${itemIndex + 1}`;
    } else if (isCVCustomItem(item)) {
      itemTitle = item.title || `Custom Item #${itemIndex + 1}`;
    } else {
      itemTitle = `Item #${itemIndex + 1}`;
    }

    const section = form.values.cvSections[sectionIndex];

    handleDeleteConfirmation(
      "sectionItem",
      { sectionIndex, itemIndex, item },
      "Delete Item",
      `Are you sure you want to delete "${itemTitle}" from the ${section.title} section?`,
      () => {
        const sections = [...form.values.cvSections];
        sections[sectionIndex].items = sections[sectionIndex].items.filter(
          (_, i) => i !== itemIndex
        );
        form.setFieldValue("cvSections", sections);
        
        // Manually mark form as dirty since deletion should enable save button
        form.setDirty({ cvSections: true });

        // Clear editing state if this item was being edited
        // if (editingItemId === `${sectionIndex}-${itemIndex}`) {
        //   setEditingItemId(null);
        // }

        notifications.show({
          title: "Success",
          message: "Item deleted successfully!",
          color: "green",
        });
      }
    );
  };

  // Render item based on type
  const renderSectionItem = (
    section: CVSection,
    item: CVSectionItem,
    itemIndex: number,
    sectionIndex: number
  ) => {
    const itemId =
      "id" in item
        ? item.id
        : "slug" in item
        ? item.slug
        : "category" in item
        ? item.category
        : "";

    if (isCVEducationItem(item)) {
      return (
        <Card
          key={itemId}
          padding="md"
          radius="md"
          withBorder
          data-section={sectionIndex}
          data-item={itemIndex}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <Text fw={500} size="sm" c="dimmed">
              Education #{itemIndex + 1}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<DeleteOutlined />}
              onClick={() =>
                deleteItemFromSection(sectionIndex, itemIndex, item)
              }
            >
              Delete
            </Button>
          </Group>
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label="Degree"
                placeholder="Bachelor of Science"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.degree`
                )}
                required
              />
              <TextInput
                label="Graduation Date"
                placeholder="May 2024"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.graduationDate`
                )}
              />
            </Group>
            <Group grow>
              <TextInput
                label="Institution"
                placeholder="University Name"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.institution`
                )}
                required
              />
              <TextInput
                label="Location"
                placeholder="City, Country"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.location`
                )}
              />
            </Group>
            <TagsInput
              label="Details"
              placeholder="Type achievement and press Enter"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.details`
              )}
              data={[]}
            />
          </Stack>
        </Card>
      );
    }

    if (isCVWorkExperienceItem(item)) {
      return (
        <Card
          key={itemId}
          padding="md"
          radius="md"
          withBorder
          data-section={sectionIndex}
          data-item={itemIndex}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <Text fw={500} size="sm" c="dimmed">
              Experience #{itemIndex + 1}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<DeleteOutlined />}
              onClick={() =>
                deleteItemFromSection(sectionIndex, itemIndex, item)
              }
            >
              Delete
            </Button>
          </Group>
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label="Job Title"
                placeholder="Software Developer"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.jobTitle`
                )}
                required
              />
              <TextInput
                label="Company"
                placeholder="Company Name"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.company`
                )}
                required
              />
            </Group>
            <Group grow>
              <TextInput
                label="Location"
                placeholder="City, Country"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.location`
                )}
              />
              <TextInput
                label="Company URL"
                placeholder="https://company.com"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.companyUrl`
                )}
              />
            </Group>
            <Group grow>
              <TextInput
                label="Start Date"
                placeholder="Jan 2023"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.startDate`
                )}
              />
              <TextInput
                label="End Date"
                placeholder="Present"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.endDate`
                )}
              />
            </Group>
            <TagsInput
              label="Responsibilities"
              placeholder="Type responsibility and press Enter"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.responsibilities`
              )}
              data={[]}
            />
            <TagsInput
              label="Technologies Used"
              placeholder="Type technology and press Enter"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.technologiesUsed`
              )}
              data={[]}
            />
          </Stack>
        </Card>
      );
    }

    if (isCVSkillCategoryItem(item)) {
      return (
        <Card
          key={item.category}
          padding="md"
          radius="md"
          withBorder
          data-section={sectionIndex}
          data-item={itemIndex}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <Text fw={500} size="sm" c="dimmed">
              Skill Category #{itemIndex + 1}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<DeleteOutlined />}
              onClick={() =>
                deleteItemFromSection(sectionIndex, itemIndex, item)
              }
            >
              Delete
            </Button>
          </Group>
          <Stack gap="xs">
            <TextInput
              label="Category"
              placeholder="Programming Languages"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.category`
              )}
              required
            />
            <TagsInput
              label="Skills"
              placeholder="Type a skill and press Enter"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.items`
              )}
              data={[]}
            />
          </Stack>
        </Card>
      );
    }

    if (isCVPublicationItem(item)) {
      return (
        <Card
          key={itemId}
          padding="md"
          radius="md"
          withBorder
          data-section={sectionIndex}
          data-item={itemIndex}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <Text fw={500} size="sm" c="dimmed">
              Publication #{itemIndex + 1}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<DeleteOutlined />}
              onClick={() =>
                deleteItemFromSection(sectionIndex, itemIndex, item)
              }
            >
              Delete
            </Button>
          </Group>
          <Stack gap="xs">
            <TextInput
              label="Title"
              placeholder="Publication Title"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.title`
              )}
              required
            />
            <Group grow>
              <TextInput
                label="Authors"
                placeholder="Author 1, Author 2, et al."
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.authors`
                )}
              />
              <TextInput
                label="Date"
                placeholder="2024"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.date`
                )}
              />
            </Group>
            <Group grow>
              <TextInput
                label="Conference/Journal"
                placeholder="Journal Name"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.conferenceOrJournal`
                )}
              />
              <TextInput
                label="URL"
                placeholder="https://doi.org/..."
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.url`
                )}
              />
            </Group>
          </Stack>
        </Card>
      );
    }

    if (isCVAwardItem(item)) {
      return (
        <Card
          key={itemId}
          padding="md"
          radius="md"
          withBorder
          data-section={sectionIndex}
          data-item={itemIndex}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <Text fw={500} size="sm" c="dimmed">
              Award #{itemIndex + 1}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<DeleteOutlined />}
              onClick={() =>
                deleteItemFromSection(sectionIndex, itemIndex, item)
              }
            >
              Delete
            </Button>
          </Group>
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label="Name"
                placeholder="Award Title"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.name`
                )}
                required
              />
              <TextInput
                label="Issuer"
                placeholder="Organization/Institution"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.issuer`
                )}
              />
            </Group>
            <TextInput
              label="Date"
              placeholder="2024"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.date`
              )}
            />
            <Textarea
              label="Description"
              placeholder="Description of the award or achievement..."
              rows={3}
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.description`
              )}
            />
          </Stack>
        </Card>
      );
    }

    if (isCVLanguageItem(item)) {
      return (
        <Card
          key={itemId}
          padding="md"
          radius="md"
          withBorder
          data-section={sectionIndex}
          data-item={itemIndex}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <Text fw={500} size="sm" c="dimmed">
              Language #{itemIndex + 1}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<DeleteOutlined />}
              onClick={() =>
                deleteItemFromSection(sectionIndex, itemIndex, item)
              }
            >
              Delete
            </Button>
          </Group>
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label="Language"
                placeholder="e.g., Spanish, French, German"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.language`
                )}
                required
              />
              <Select
                label="Proficiency Level"
                placeholder="Select level"
                data={[
                  { value: "Native", label: "Native" },
                  { value: "Fluent", label: "Fluent" },
                  { value: "Intermediate", label: "Intermediate" },
                  { value: "Basic", label: "Basic" },
                ]}
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.proficiency`
                )}
                required
              />
            </Group>
            <TextInput
              label="Proof URL (Optional)"
              placeholder="https://certificate-url.com"
              description="Link to certificate, test results, or other proof of proficiency"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.proofUrl`
              )}
            />
          </Stack>
        </Card>
      );
    }

    if (isCVVolunteerExperienceItem(item)) {
      return (
        <Card
          key={itemId}
          padding="md"
          radius="md"
          withBorder
          data-section={sectionIndex}
          data-item={itemIndex}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <Text fw={500} size="sm" c="dimmed">
              Volunteer Experience #{itemIndex + 1}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<DeleteOutlined />}
              onClick={() =>
                deleteItemFromSection(sectionIndex, itemIndex, item)
              }
            >
              Delete
            </Button>
          </Group>
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label="Organization"
                placeholder="e.g., Red Cross, Local Food Bank"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.organization`
                )}
                required
              />
              <TextInput
                label="Role"
                placeholder="e.g., Volunteer Coordinator, Tutor"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.role`
                )}
                required
              />
            </Group>
            <Group grow>
              <TextInput
                label="Start Date"
                placeholder="Jan 2023"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.startDate`
                )}
                required
              />
              <TextInput
                label="End Date"
                placeholder="Present or Dec 2023"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.endDate`
                )}
                required
              />
            </Group>
            <TextInput
              label="Location (Optional)"
              placeholder="City, Country"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.location`
              )}
            />
            <Textarea
              label="Description"
              placeholder="Describe your volunteer work, responsibilities, and achievements..."
              rows={4}
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.description`
              )}
              required
            />
          </Stack>
        </Card>
      );
    }

    if (isCVCustomItem(item)) {
      return (
        <Card
          key={itemId}
          padding="md"
          radius="md"
          withBorder
          data-section={sectionIndex}
          data-item={itemIndex}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <Text fw={500} size="sm" c="dimmed">
              Custom Item #{itemIndex + 1}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<DeleteOutlined />}
              onClick={() =>
                deleteItemFromSection(sectionIndex, itemIndex, item)
              }
            >
              Delete
            </Button>
          </Group>
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label="Title"
                placeholder="Item title"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.title`
                )}
                required
              />
              <TextInput
                label="Subtitle"
                placeholder="Optional subtitle"
                {...form.getInputProps(
                  `cvSections.${sectionIndex}.items.${itemIndex}.subtitle`
                )}
              />
            </Group>
            <TextInput
              label="Date"
              placeholder="Date or date range"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.date`
              )}
            />
            <Textarea
              label="Description"
              placeholder="Main description of this item..."
              rows={3}
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.description`
              )}
            />
            <TagsInput
              label="Additional Details"
              placeholder="Type detail and press Enter"
              {...form.getInputProps(
                `cvSections.${sectionIndex}.items.${itemIndex}.details`
              )}
              data={[]}
            />
          </Stack>
        </Card>
      );
    }

    // Default fallback for other types
    return (
      <Card
        key={itemId}
        padding="md"
        radius="md"
        withBorder
        data-section={sectionIndex}
        data-item={itemIndex}
      >
        <Group justify="space-between" align="flex-start" mb="md">
          <Text fw={500} size="sm" c="dimmed">
            Item #{itemIndex + 1}
          </Text>
          <Button
            variant="light"
            color="red"
            size="xs"
            leftSection={<DeleteOutlined />}
            onClick={() => deleteItemFromSection(sectionIndex, itemIndex, item)}
          >
            Delete
          </Button>
        </Group>
        <Text size="sm">Unknown item type</Text>
      </Card>
    );
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={deleteTarget?.title || "Confirm Delete"}
        centered
        size="md"
      >
        <Stack gap="md">
          <Text size="sm">{deleteTarget?.message}</Text>
          <Text size="xs" c="dimmed">
            This action cannot be undone.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button color="red" variant="subtle" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Custom Section Creation Modal */}
      <Modal
        opened={customSectionModalOpened}
        onClose={closeCustomSectionModal}
        title="Create Custom Section"
        centered
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Section Title"
            placeholder="e.g., Hobbies & Interests, Side Projects, Volunteer Work"
            value={customSectionTitle}
            onChange={(e) => setCustomSectionTitle(e.target.value)}
            description="Give your custom section a descriptive name that represents the content you'll add."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                createCustomSection();
              }
            }}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={closeCustomSectionModal}>
              Cancel
            </Button>
            <Button
              onClick={createCustomSection}
              leftSection={<PlusOutlined />}
              disabled={!customSectionTitle.trim()}
            >
              Create Section
            </Button>
          </Group>
        </Stack>
      </Modal>

      <form onSubmit={form.onSubmit(handleSave)}>
        <Grid>
          {/* Left Column - Basic Info */}
          <GridCol span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              {/* Basic Information */}
              <Stack gap="lg">
                <Group>
                  <ThemeIcon variant="light" size="lg">
                    <UserOutlined />
                  </ThemeIcon>
                  <Title order={2} size="h3">
                    Basic Information
                  </Title>
                </Group>

                <Stack gap="md">
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    leftSection={<UserOutlined style={{ fontSize: 16 }} />}
                    {...form.getInputProps("name")}
                    required
                  />

                  <TextInput
                    label="Professional Tagline"
                    placeholder="e.g., Full Stack Developer passionate about AI"
                    description="A brief description of your professional identity"
                    {...form.getInputProps("tagline")}
                    required
                  />

                  <Group grow>
                    <TextInput
                      label="Email"
                      placeholder="your.email@example.com"
                      leftSection={<MailOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("email")}
                      required
                    />

                    <TextInput
                      label="Phone"
                      placeholder="+1 (555) 123-4567"
                      leftSection={<PhoneOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("phone")}
                    />
                  </Group>

                  <Group grow>
                    <TextInput
                      label="Location"
                      placeholder="City, Country"
                      leftSection={
                        <EnvironmentOutlined style={{ fontSize: 16 }} />
                      }
                      {...form.getInputProps("location")}
                    />

                    <TextInput
                      label="Website URL"
                      placeholder="https://yourdomain.com"
                      leftSection={<GlobalOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("websiteUrl")}
                    />
                  </Group>
                </Stack>
              </Stack>
              <Divider />

              {/* Social Links */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <LinkedinOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      Social Links
                    </Title>
                  </Group>

                  <Button
                    leftSection={<PlusOutlined />}
                    variant="light"
                    onClick={addSocialLink}
                    size="sm"
                  >
                    Add Link
                  </Button>
                </Group>

                <Stack gap="md">
                  {form.values.socialLinks.map((link, index) => {
                    const platform = getSocialPlatform(link.iconSlug);
                    const PlatformIcon = platform?.icon || GlobalOutlined;

                    return (
                      <Card
                        key={link.id || index}
                        padding="md"
                        radius="md"
                        withBorder
                      >
                        <Group justify="space-between" align="flex-start">
                          <Stack gap="xs" style={{ flex: 1 }}>
                            <Group gap="xs">
                              <Text size="sm" fw={500} c="dimmed">
                                Platform
                              </Text>
                              <Group gap="xs">
                                {SOCIAL_PLATFORMS.map((platform) => (
                                  <ActionIcon
                                    key={platform.slug}
                                    variant={
                                      link.iconSlug === platform.slug
                                        ? "filled"
                                        : "light"
                                    }
                                    color={
                                      link.iconSlug === platform.slug
                                        ? platform.color
                                        : "gray"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      selectPlatform(index, platform)
                                    }
                                  >
                                    <platform.icon style={{ fontSize: 12 }} />
                                  </ActionIcon>
                                ))}
                              </Group>
                            </Group>

                            <TextInput
                              placeholder="https://..."
                              value={link.url}
                              onChange={(e) =>
                                updateSocialLink(index, "url", e.target.value)
                              }
                              leftSection={
                                <PlatformIcon style={{ fontSize: 16 }} />
                              }
                              error={
                                link.url && !/^https?:\/\/.+/.test(link.url)
                                  ? "Invalid URL format"
                                  : null
                              }
                            />
                          </Stack>

                          <Button
                            variant="light"
                            color="red"
                            size="xs"
                            leftSection={<DeleteOutlined />}
                            onClick={() => removeSocialLink(index)}
                          >
                            Delete
                          </Button>
                        </Group>
                      </Card>
                    );
                  })}

                  {form.values.socialLinks.length === 0 && (
                    <Text c="dimmed" ta="center" py="xl">
                      No social links added yet. Click &quot;Add Link&quot; to
                      get started.
                    </Text>
                  )}
                </Stack>
              </Stack>

              <Divider />

              {/* CV Basic Information */}
              <Stack gap="lg">
                <Group>
                  <ThemeIcon variant="light" size="lg">
                    <FileTextOutlined />
                  </ThemeIcon>
                  <Title order={2} size="h3">
                    CV Information
                  </Title>
                </Group>

                <Stack gap="md">
                  <TextInput
                    label="CV Title"
                    placeholder="e.g., Curriculum Vitae"
                    {...form.getInputProps("cvTitle")}
                  />

                  <Textarea
                    label="Professional Summary"
                    placeholder="Write a brief summary of your professional background and career objectives..."
                    rows={4}
                    {...form.getInputProps("cvSummary")}
                  />

                  <Group grow>
                    <TextInput
                      label="CV Contact Email"
                      placeholder="cv.email@example.com"
                      leftSection={<MailOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("cvContactEmail")}
                    />

                    <TextInput
                      label="CV Phone"
                      placeholder="+1 (555) 123-4567"
                      leftSection={<PhoneOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("cvPhone")}
                    />
                  </Group>

                  <Group grow>
                    <TextInput
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/yourprofile"
                      leftSection={
                        <LinkedinOutlined style={{ fontSize: 16 }} />
                      }
                      {...form.getInputProps("cvLinkedinUrl")}
                    />

                    <TextInput
                      label="Portfolio URL"
                      placeholder="https://yourportfolio.com"
                      leftSection={<GlobalOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("cvPortfolioUrl")}
                    />
                  </Group>
                </Stack>
              </Stack>

              <Divider />

              {/* Dynamic CV Sections */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <FileTextOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      CV Sections
                    </Title>
                  </Group>

                  <Group>
                    <Select
                      placeholder="Select section type"
                      value={selectedSectionType}
                      onChange={(value) =>
                        setSelectedSectionType(value as CVSectionType)
                      }
                      data={SECTION_TYPES.filter((type) => {
                        // Allow custom sections (multiple instances allowed)
                        if (type.value === "custom") return true;

                        // For other types, only show if they don't already exist
                        return !form.values.cvSections.some(
                          (section) => section.type === type.value
                        );
                      }).map((type) => ({
                        value: type.value,
                        label: type.label,
                      }))}
                      size="sm"
                      style={{ minWidth: 200 }}
                    />
                    <Button
                      leftSection={<PlusOutlined />}
                      variant="light"
                      onClick={addNewSection}
                      size="sm"
                      disabled={
                        hasUnsavedChanges ||
                        SECTION_TYPES.filter((type) => {
                          // Allow custom sections (multiple instances allowed)
                          if (type.value === "custom") return true;

                          // For other types, only show if they don't already exist
                          return !form.values.cvSections.some(
                            (section) => section.type === type.value
                          );
                        }).length === 0
                      }
                    >
                      Add Section
                    </Button>
                  </Group>
                </Group>

                <Stack gap="xl">
                  {form.values.cvSections
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((section, sectionIndex) => {
                      const sectionTypeInfo = SECTION_TYPES.find(
                        (t) => t.value === section.type
                      );
                      const SectionIcon =
                        sectionTypeInfo?.icon || FileTextOutlined;

                      return (
                        <Paper key={section.id} p="lg" withBorder radius="md">
                          {/* Section Header */}
                          <Group justify="space-between" mb="lg">
                            <Group>
                              <ThemeIcon
                                variant="light"
                                size="lg"
                                color={section.isVisible ? "blue" : "gray"}
                              >
                                <SectionIcon />
                              </ThemeIcon>
                              <Stack gap={0}>
                                <Title order={3} size="h4">
                                  {section.title}
                                </Title>
                                <Text size="xs" c="dimmed">
                                  {section.items.length} item
                                  {section.items.length !== 1 ? "s" : ""}
                                </Text>
                              </Stack>
                            </Group>

                            <Group gap="xs">
                              <ActionIcon
                                variant="light"
                                color={section.isVisible ? "blue" : "gray"}
                                onClick={() =>
                                  toggleSectionVisibility(sectionIndex)
                                }
                                title={
                                  section.isVisible
                                    ? "Hide section"
                                    : "Show section"
                                }
                              >
                                {section.isVisible ? (
                                  <EyeOutlined />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )}
                              </ActionIcon>

                              <Button
                                leftSection={<PlusOutlined />}
                                variant="light"
                                size="xs"
                                onClick={() =>
                                  addItemToSection(sectionIndex, section.type)
                                }
                                // disabled={
                                //   hasUnsavedChanges
                                // }
                              >
                                Add Item
                              </Button>

                              <Button
                                variant="light"
                                color="red"
                                size="xs"
                                leftSection={<DeleteOutlined />}
                                onClick={() =>
                                  deleteSection(sectionIndex, section)
                                }
                              >
                                Delete Section
                              </Button>
                            </Group>
                          </Group>

                          {/* Section Items */}
                          {section.items.length > 0 ? (
                            <Stack gap="md">
                              {section.items.map((item, itemIndex) =>
                                renderSectionItem(
                                  section,
                                  item,
                                  itemIndex,
                                  sectionIndex
                                )
                              )}
                            </Stack>
                          ) : (
                            <Text c="dimmed" ta="center" py="xl">
                              No items in this section yet. Click &quot;Add
                              Item&quot; to get started.
                            </Text>
                          )}
                        </Paper>
                      );
                    })}

                  {form.values.cvSections.length === 0 && (
                    <Text c="dimmed" ta="center" py="xl">
                      No CV sections added yet. Select a section type and click
                      &quot;Add Section&quot; to get started.
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </GridCol>

          {/* Right Column - Profile Picture */}
          <GridCol
            span={{ base: 12, md: 4 }}
            style={{ position: "sticky", top: 65, height: "100%" }}
          >
            <Box>
              <Paper shadow="xs" p="xl" radius="lg" withBorder>
                <Stack align="center" gap="lg">
                  <Title order={3} ta="center">
                    Profile Picture
                  </Title>

                  <Avatar
                    src={form.values.profilePictureUrl}
                    size={120}
                    radius="md"
                    style={{
                      border: "3px solid var(--mantine-color-blue-1)",
                    }}
                  />

                  <ImageInput
                    value={form.values.profilePictureUrl}
                    onChange={(url) =>
                      form.setFieldValue("profilePictureUrl", url)
                    }
                    label="Upload Photo"
                  />
                </Stack>
              </Paper>
            </Box>
            {/* Save Button */}
            <Button
              type="submit"
              leftSection={<SaveOutlined />}
              loading={saving}
              fullWidth
              size="md"
              disabled={!form.isValid() || !form.isDirty()}
              mt="md"
            >
              Save Changes
            </Button>
          </GridCol>
        </Grid>
      </form>
    </>
  );
}
