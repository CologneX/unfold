import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CV, UserProfile, Project } from "@/types/types";
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

        {/* Core Competencies / Skills */}
        {cv.skills && cv.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Competencies</Text>
            <View style={styles.skillsContainer}>
              {cv.skills.map((skillCategory, index) => (
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
          </View>
        )}

        {/* Professional Experience */}
        {cv.workExperience && cv.workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {cv.workExperience.map((work) => (
              <View key={work.id} style={styles.workEntry}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{work.jobTitle}</Text>
                  <Text style={styles.dateRange}>
                    {work.startDate} - {work.endDate}
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
            ))}
          </View>
        )}

        {/* Education */}
        {cv.education && cv.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {cv.education.map((edu) => (
              <View key={edu.id} style={styles.educationEntry}>
                <View style={styles.degreeHeader}>
                  <Text style={styles.degree}>{edu.degree}</Text>
                  <Text style={styles.dateRange}>{edu.graduationDate}</Text>
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
            ))}
          </View>
        )}

        {/* Projects */}
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

        {/* Publications */}
        {cv.publications && cv.publications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publications</Text>
            {cv.publications.map((pub) => (
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
            ))}
          </View>
        )}

        {/* Awards & Honors */}
        {cv.awardsAndHonors && cv.awardsAndHonors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards & Recognition</Text>
            {cv.awardsAndHonors.map((award) => (
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
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVPDFDocument;
