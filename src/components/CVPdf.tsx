import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { 
  CV, 
  UserProfile, 
  Project,
  CVSection,
  isCVEducationItem,
  isCVWorkExperienceItem,
  isCVSkillCategoryItem,
  isCVPublicationItem,
  isCVAwardItem,
  isCVCertificationItem,
  isCVLanguageItem,
  isCVVolunteerExperienceItem,
  isCVCustomItem,
  Education,
  WorkExperience,
  SkillCategory,
  Publication,
  Award,
  Certification,
  Language,
  VolunteerExperience,
  CustomCVItem,
} from "@/types/types";
import { formatDateToMonthYear } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 40,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 40,
    lineHeight: 1.4,
    color: "#000000",
  },
  header: {
    marginBottom: 25,
    textAlign: "left",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 12,
    marginBottom: 10,
    color: "#333333",
    fontStyle: "italic",
  },
  contactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  contactItem: {
    fontSize: 10,
    marginRight: 15,
    marginBottom: 3,
    color: "#000000",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
    color: "#000000",
    letterSpacing: 1,
    borderBottom: "1.5 solid #000000",
    paddingBottom: 3,
  },
  workEntry: {
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  dateRange: {
    fontSize: 10,
    color: "#000000",
    fontWeight: "normal",
  },
  companyLocation: {
    fontSize: 11,
    marginBottom: 5,
    color: "#000000",
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 3,
    paddingLeft: 12,
    color: "#000000",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  skillCategory: {
    marginRight: 25,
    marginBottom: 6,
    minWidth: "45%",
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#000000",
  },
  skillsList: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.3,
  },
  educationEntry: {
    marginBottom: 12,
  },
  degreeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  degree: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  institution: {
    fontSize: 11,
    marginBottom: 3,
    color: "#000000",
  },
  projectEntry: {
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  projectDescription: {
    fontSize: 10,
    marginBottom: 4,
    color: "#000000",
  },
  technologiesUsed: {
    fontSize: 9,
    color: "#333333",
    fontStyle: "italic",
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#000000",
    textAlign: "justify",
  },
  certificationEntry: {
    marginBottom: 12,
  },
  certificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  certificationName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  certificationIssuer: {
    fontSize: 11,
    marginBottom: 3,
    color: "#000000",
  },
  languageEntry: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  languageName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
  },
  languageProficiency: {
    fontSize: 10,
    color: "#333333",
  },
  volunteerEntry: {
    marginBottom: 15,
  },
  volunteerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  volunteerRole: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  volunteerOrganization: {
    fontSize: 11,
    marginBottom: 5,
    color: "#000000",
  },
  volunteerDescription: {
    fontSize: 10,
    marginBottom: 3,
    color: "#000000",
  },
  customEntry: {
    marginBottom: 12,
  },
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  customTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  customSubtitle: {
    fontSize: 11,
    marginBottom: 3,
    color: "#000000",
  },
});

interface CVPDFDocumentProps {
  cv: CV;
  userProfile: UserProfile;
  portfolioProjects: Project[];
}

const CVPDFDocument: React.FC<CVPDFDocumentProps> = ({
  cv,
  userProfile,
  portfolioProjects,
}) => {
  // Helper function to render section items based on type
  const renderSectionItems = (section: CVSection) => {
    switch (section.type) {
      case 'work_experience':
        const workExperience = section.items.filter(isCVWorkExperienceItem) as WorkExperience[];
        return workExperience.map((work) => (
          <View key={work.id} style={styles.workEntry}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{work.jobTitle}</Text>
              <Text style={styles.dateRange}>
                {work.startDate} - {work.endDate || (work.current ? "Present" : "")}
              </Text>
            </View>
            <Text style={styles.companyLocation}>
              {work.company} | {work.location}
            </Text>
            {work.responsibilities.map((resp, index) => (
              <Text key={index} style={styles.bulletPoint}>
                • {resp}
              </Text>
            ))}
            {work.technologiesUsed && work.technologiesUsed.length > 0 && (
              <Text style={styles.technologiesUsed}>
                Key Technologies: {work.technologiesUsed.join(", ")}
              </Text>
            )}
          </View>
        ));

      case 'education':
        const education = section.items.filter(isCVEducationItem) as Education[];
        return education.map((edu) => (
          <View key={edu.id} style={styles.educationEntry}>
            <View style={styles.degreeHeader}>
              <Text style={styles.degree}>{edu.degree}</Text>
              <Text style={styles.dateRange}>{edu.graduationDate || (edu.current ? "Present" : "")}</Text>
            </View>
            <Text style={styles.institution}>
              {edu.institution} | {edu.location}
            </Text>
            {edu.details &&
              edu.details.map((detail, index) => (
                <Text key={index} style={styles.bulletPoint}>
                  • {detail}
                </Text>
              ))}
          </View>
        ));

      case 'skills':
        const skills = section.items.filter(isCVSkillCategoryItem) as SkillCategory[];
        return (
          <View style={styles.skillsContainer}>
            {skills.map((skillCategory, index) => (
              <View key={index} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>
                  {skillCategory.category}
                </Text>
                <Text style={styles.skillsList}>
                  {skillCategory.items.join(" • ")}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'publications':
        const publications = section.items.filter(isCVPublicationItem) as Publication[];
        return publications.map((pub) => (
          <View key={pub.id} style={styles.projectEntry}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>{pub.title}</Text>
              <Text style={styles.dateRange}>{pub.date}</Text>
            </View>
            {pub.authors && (
              <Text style={styles.institution}>{pub.authors}</Text>
            )}
            {pub.conferenceOrJournal && (
              <Text style={styles.institution}>
                {pub.conferenceOrJournal}
              </Text>
            )}
            {pub.url && (
              <Text style={styles.technologiesUsed}>URL: {pub.url}</Text>
            )}
          </View>
        ));

      case 'awards':
        const awards = section.items.filter(isCVAwardItem) as Award[];
        return awards.map((award) => (
          <View key={award.id} style={styles.projectEntry}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>{award.name}</Text>
              <Text style={styles.dateRange}>{award.date}</Text>
            </View>
            {award.issuer && (
              <Text style={styles.institution}>{award.issuer}</Text>
            )}
            {award.description && (
              <Text style={styles.projectDescription}>
                {award.description}
              </Text>
            )}
          </View>
        ));

      case 'certifications':
        const certifications = section.items.filter(isCVCertificationItem) as Certification[];
        return certifications.map((cert) => (
          <View key={cert.id} style={styles.certificationEntry}>
            <View style={styles.certificationHeader}>
              <Text style={styles.certificationName}>{cert.name}</Text>
              <Text style={styles.dateRange}>
                {cert.date}{cert.expirationDate ? ` - ${cert.expirationDate}` : ''}
              </Text>
            </View>
            <Text style={styles.certificationIssuer}>{cert.issuer}</Text>
            {cert.credentialId && (
              <Text style={styles.technologiesUsed}>
                Credential ID: {cert.credentialId}
              </Text>
            )}
            {cert.credentialUrl && (
              <Text style={styles.technologiesUsed}>
                Verification: {cert.credentialUrl}
              </Text>
            )}
          </View>
        ));

      case 'languages':
        const languages = section.items.filter(isCVLanguageItem) as Language[];
        return languages.map((lang) => (
          <View key={lang.id} style={styles.languageEntry}>
            <Text style={styles.languageName}>{lang.language}</Text>
            <Text style={styles.languageProficiency}>{lang.proficiency}</Text>
          </View>
        ));

      case 'volunteering':
        const volunteerExperience = section.items.filter(isCVVolunteerExperienceItem) as VolunteerExperience[];
        return volunteerExperience.map((volunteer) => (
          <View key={volunteer.id} style={styles.volunteerEntry}>
            <View style={styles.volunteerHeader}>
              <Text style={styles.volunteerRole}>{volunteer.role}</Text>
              <Text style={styles.dateRange}>
                {volunteer.startDate} - {volunteer.endDate}
              </Text>
            </View>
            <Text style={styles.volunteerOrganization}>
              {volunteer.organization}{volunteer.location && ` | ${volunteer.location}`}
            </Text>
            <Text style={styles.volunteerDescription}>
              {volunteer.description}
            </Text>
          </View>
        ));

      case 'custom':
        const customItems = section.items.filter(isCVCustomItem) as CustomCVItem[];
        return customItems.map((item) => (
          <View key={item.id} style={styles.customEntry}>
            <View style={styles.customHeader}>
              <Text style={styles.customTitle}>{item.title}</Text>
              {item.date && <Text style={styles.dateRange}>{item.date}</Text>}
            </View>
            {item.subtitle && (
              <Text style={styles.customSubtitle}>{item.subtitle}</Text>
            )}
            {item.description && (
              <Text style={styles.projectDescription}>
                {item.description}
              </Text>
            )}
            {item.details && item.details.map((detail, index) => (
              <Text key={index} style={styles.bulletPoint}>
                • {detail}
              </Text>
            ))}
          </View>
        ));

      default:
        return null;
    }
  };

  // Get all visible sections sorted by sortOrder
  const visibleSections = cv.sections?.filter(section => section.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Contact Information */}
        <View style={styles.header}>
          <Text style={styles.name}>{userProfile.name}</Text>
          {userProfile.tagline && (
            <Text style={styles.tagline}>{userProfile.tagline}</Text>
          )}
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>
              {cv.contactInformation.email}
            </Text>
            {cv.contactInformation.phone && (
              <Text style={styles.contactItem}>
                {cv.contactInformation.phone}
              </Text>
            )}
            {userProfile.location && (
              <Text style={styles.contactItem}>{userProfile.location}</Text>
            )}
            {cv.contactInformation.linkedinUrl && (
              <Text style={styles.contactItem}>
                {cv.contactInformation.linkedinUrl}
              </Text>
            )}
            {cv.contactInformation.portfolioUrl && (
              <Text style={styles.contactItem}>
                {cv.contactInformation.portfolioUrl}
              </Text>
            )}
            {userProfile.websiteUrl && (
              <Text style={styles.contactItem}>{userProfile.websiteUrl}</Text>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {cv.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{cv.summary}</Text>
          </View>
        )}

        {/* Dynamic CV Sections */}
        {visibleSections.map((section) => {
          const sectionItems = renderSectionItems(section);
          
          // Only render if section has items
          if (!sectionItems || (Array.isArray(sectionItems) && sectionItems.length === 0)) {
            return null;
          }

          return (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {sectionItems}
            </View>
          );
        })}

        {/* Projects - Keep this separate as it's not part of CV sections */}
        {portfolioProjects && portfolioProjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {portfolioProjects.map((project) => (
              <View key={project.slug} style={styles.projectEntry}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.dateRange}>{formatDateToMonthYear(project.date)}</Text>
                </View>
                {project.subtitle && (
                  <Text style={styles.institution}>{project.subtitle}</Text>
                )}
                <Text style={styles.projectDescription}>
                  {project.shortDescription}
                </Text>
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={styles.technologiesUsed}>
                    Technologies: {project.technologies.join(", ")}
                  </Text>
                )}
                {project.liveProjectUrl && (
                  <Text style={styles.technologiesUsed}>
                    Live Project: {project.liveProjectUrl}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVPDFDocument;
