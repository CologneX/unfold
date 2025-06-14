import { fetchCV, fetchUserProfile } from "@/app/actions";
import {
  Title,
  Text,
  Group,
  Stack,
  Paper,
  Grid,
  Badge,
  Divider,
  List,
  Anchor,
  Box,
  Card,
  Timeline,
  ThemeIcon,
  GridCol,
  TimelineItem,
  ListItem,
} from "@mantine/core";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BankOutlined,
  LinkOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { EnhancedImage } from "@/components/Image/Image";
import {
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
  CVSection,
} from "@/types/types";
import { getSectionIcon, getSocialLinkIcon } from "@/lib/utils";

// Component to render work experience section
function WorkExperienceSection({ section }: { section: CVSection }) {
  const workExperience =
    (section.items?.filter(isCVWorkExperienceItem) as WorkExperience[]) || [];

  if (workExperience.length === 0) return null;

  return (
    <Paper py="md" mb="xl">
      <Group mb="lg">
        <ThemeIcon variant="light" size="lg">
          {getSectionIcon(section.type)}
        </ThemeIcon>
        <Title order={2}>{section.title}</Title>
      </Group>

      <Timeline active={workExperience.length} bulletSize={24} lineWidth={2}>
        {workExperience.map((work) => (
          <TimelineItem
            key={work.id}
            bullet={<BankOutlined style={{ fontSize: 12 }} />}
            title={
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text fw={600} size="lg">
                    {work.jobTitle}
                  </Text>
                  <Text size="md" c="dimmed">
                    {work.companyUrl ? (
                      <Anchor href={work.companyUrl} target="_blank">
                        <LinkOutlined
                          style={{ fontSize: 14, marginRight: 2 }}
                        />
                        {work.company}
                      </Anchor>
                    ) : (
                      work.company
                    )}{" "}
                    • {work.location}
                  </Text>
                </div>
                <Badge variant="light" size="sm">
                  {work.startDate} -{" "}
                  {work.endDate || (work.current ? "Present" : "")}
                </Badge>
              </Group>
            }
          >
            <List spacing="xs" size="sm" mt="md">
              {work.responsibilities.map((responsibility, respIndex) => (
                <ListItem key={respIndex}>{responsibility}</ListItem>
              ))}
            </List>

            {work.technologiesUsed && work.technologiesUsed.length > 0 && (
              <Group gap="xs" mt="md">
                <Text size="sm" fw={500}>
                  Technologies:
                </Text>
                {work.technologiesUsed.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="outline" size="xs">
                    {tech}
                  </Badge>
                ))}
              </Group>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
}

// Component to render education section
function EducationSection({ section }: { section: CVSection }) {
  const education =
    (section.items?.filter(isCVEducationItem) as Education[]) || [];

  if (education.length === 0) return null;

  return (
    <Paper py="md" mb="xl">
      <Group mb="lg">
        <ThemeIcon variant="light" size="lg">
          {getSectionIcon(section.type)}
        </ThemeIcon>
        <Title order={2}>{section.title}</Title>
      </Group>

      <Stack gap="lg">
        {education.map((edu) => (
          <Card key={edu.id} padding="md" radius="md" withBorder>
            <Group justify="space-between" align="flex-start" mb="sm">
              <div>
                <Text fw={600} size="lg">
                  {edu.degree}
                </Text>
                <Text size="md" c="dimmed">
                  {edu.institution} • {edu.location}
                </Text>
              </div>
              <Badge variant="light">
                {edu.graduationDate || (edu.current ? "Present" : "")}
              </Badge>
            </Group>

            {edu.details && edu.details.length > 0 && (
              <List spacing="xs" size="sm">
                {edu.details.map((detail, index) => (
                  <ListItem key={index}>{detail}</ListItem>
                ))}
              </List>
            )}
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}

// Component to render skills section (sidebar)
function SkillsSection({ section }: { section: CVSection }) {
  const skills =
    (section.items?.filter(isCVSkillCategoryItem) as SkillCategory[]) || [];

  if (skills.length === 0) return null;

  return (
    <Paper shadow="sm" p="xl" mb="xl" radius="md" withBorder>
      <Title order={3} mb="lg">
        {section.title}
      </Title>

      <Stack gap="lg">
        {skills.map((skillCategory, index) => (
          <div key={index}>
            <Text fw={600} size="sm" mb="xs" tt="uppercase" c="dimmed">
              {skillCategory.category}
            </Text>
            <Group gap="xs">
              {skillCategory.items.map((skill, skillIndex) => (
                <Badge
                  key={skillIndex}
                  variant="filled"
                  size="sm"
                  style={{ fontWeight: 400 }}
                >
                  {skill}
                </Badge>
              ))}
            </Group>
            {index < skills.length - 1 && <Divider mt="md" />}
          </div>
        ))}
      </Stack>
    </Paper>
  );
}

// Component to render publications section
function PublicationsSection({ section }: { section: CVSection }) {
  const publications =
    (section.items?.filter(isCVPublicationItem) as Publication[]) || [];

  if (publications.length === 0) return null;

  return (
    <Paper py="md" mb="xl">
      <Group mb="lg">
        <ThemeIcon variant="light" size="lg">
          {getSectionIcon(section.type)}
        </ThemeIcon>
        <Title order={2}>{section.title}</Title>
      </Group>

      <Stack gap="md">
        {publications.map((pub) => (
          <Card key={pub.id} padding="md" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <div style={{ flex: 1 }}>
                <Text fw={600} size="md">
                  {pub.url ? (
                    <Anchor href={pub.url} target="_blank">
                      {pub.title}
                      <LinkOutlined style={{ fontSize: 14, marginLeft: 4 }} />
                    </Anchor>
                  ) : (
                    pub.title
                  )}
                </Text>
                {pub.authors && (
                  <Text size="sm" c="dimmed">
                    {pub.authors}
                  </Text>
                )}
                {pub.conferenceOrJournal && (
                  <Text size="sm" c="dimmed">
                    {pub.conferenceOrJournal}
                  </Text>
                )}
              </div>
              <Badge variant="light" size="sm">
                {pub.date}
              </Badge>
            </Group>
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}

// Component to render awards section
function AwardsSection({ section }: { section: CVSection }) {
  const awards = (section.items?.filter(isCVAwardItem) as Award[]) || [];

  if (awards.length === 0) return null;

  return (
    <Paper py="md" mb="xl">
      <Group mb="lg">
        <ThemeIcon variant="light" size="lg">
          {getSectionIcon(section.type)}
        </ThemeIcon>
        <Title order={2}>{section.title}</Title>
      </Group>

      <Stack gap="md">
        {awards.map((award) => (
          <Card key={award.id} padding="md" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={600} size="md">
                  {award.name}
                </Text>
                {award.issuer && (
                  <Text size="sm" c="dimmed">
                    {award.issuer}
                  </Text>
                )}
                {award.description && (
                  <Text size="sm" mt="xs">
                    {award.description}
                  </Text>
                )}
              </div>
              <Badge variant="light" size="sm">
                {award.date}
              </Badge>
            </Group>
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}

// Component to render certifications section
function CertificationsSection({ section }: { section: CVSection }) {
  const certifications =
    (section.items?.filter(isCVCertificationItem) as Certification[]) || [];

  if (certifications.length === 0) return null;

  return (
    <Paper py="md" mb="xl">
      <Group mb="lg">
        <ThemeIcon variant="light" size="lg">
          {getSectionIcon(section.type)}
        </ThemeIcon>
        <Title order={2}>{section.title}</Title>
      </Group>

      <Stack gap="md">
        {certifications.map((cert) => (
          <Card key={cert.id} padding="md" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <div style={{ flex: 1 }}>
                <Text fw={600} size="md">
                  {cert.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {cert.issuer}
                </Text>
                {cert.credentialId && (
                  <Text size="xs" c="dimmed">
                    ID: {cert.credentialId}
                  </Text>
                )}
                {cert.credentialUrl && (
                  <Text size="sm" mt="xs">
                    <Anchor href={cert.credentialUrl} target="_blank" size="sm">
                      View Certificate
                    </Anchor>
                  </Text>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge variant="light" size="sm">
                  {cert.date}
                </Badge>
                {cert.expirationDate && (
                  <Text size="xs" c="dimmed" mt="xs">
                    Expires: {cert.expirationDate}
                  </Text>
                )}
              </div>
            </Group>
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}

// Component to render languages section
function LanguagesSection({ section }: { section: CVSection }) {
  const languages =
    (section.items?.filter(isCVLanguageItem) as Language[]) || [];

  if (languages.length === 0) return null;

  return (
    <Paper shadow="sm" p="xl" mb="xl" radius="md" withBorder>
      <Title order={3} mb="lg">
        {section.title}
      </Title>

      <Stack gap="md">
        {languages.map((lang) => (
          <Group key={lang.id} justify="space-between" align="center">
            <div>
              <Text fw={600} size="md">
                {lang.language}
              </Text>
              {lang.proofUrl && (
                <Anchor href={lang.proofUrl} target="_blank" size="sm">
                  View Proof
                </Anchor>
              )}
            </div>
            <Badge variant="filled" size="sm">
              {lang.proficiency}
            </Badge>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}

// Component to render volunteer experience section
function VolunteeringSection({ section }: { section: CVSection }) {
  const volunteers =
    (section.items?.filter(
      isCVVolunteerExperienceItem
    ) as VolunteerExperience[]) || [];

  if (volunteers.length === 0) return null;

  return (
    <Paper py="md" mb="xl">
      <Group mb="lg">
        <ThemeIcon variant="light" size="lg">
          {getSectionIcon(section.type)}
        </ThemeIcon>
        <Title order={2}>{section.title}</Title>
      </Group>

      <Stack gap="md">
        {volunteers.map((volunteer) => (
          <Card key={volunteer.id} padding="md" radius="md" withBorder>
            <Group justify="space-between" align="flex-start" mb="sm">
              <div>
                <Text fw={600} size="lg">
                  {volunteer.role}
                </Text>
                <Text size="md" c="dimmed">
                  {volunteer.organization}{" "}
                  {volunteer.location && `• ${volunteer.location}`}
                </Text>
              </div>
              <Badge variant="light" size="sm">
                {volunteer.startDate} - {volunteer.endDate}
              </Badge>
            </Group>
            <Text size="sm">{volunteer.description}</Text>
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}

// Component to render custom sections
function CustomSection({ section }: { section: CVSection }) {
  const customItems =
    (section.items?.filter(isCVCustomItem) as CustomCVItem[]) || [];

  if (customItems.length === 0) return null;

  return (
    <Paper py="md" mb="xl">
      <Group mb="lg">
        <ThemeIcon variant="light" size="lg">
          {getSectionIcon(section.type)}
        </ThemeIcon>
        <Title order={2}>{section.title}</Title>
      </Group>

      <Stack gap="md">
        {customItems.map((item) => (
          <Card key={item.id} padding="md" radius="md" withBorder>
            <Group justify="space-between" align="flex-start" mb="sm">
              <div>
                <Text fw={600} size="lg">
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text size="md" c="dimmed">
                    {item.subtitle}
                  </Text>
                )}
              </div>
              {item.date && (
                <Badge variant="light" size="sm">
                  {item.date}
                </Badge>
              )}
            </Group>

            {item.description && (
              <Text size="sm" mb="sm">
                {item.description}
              </Text>
            )}

            {item.details && item.details.length > 0 && (
              <List spacing="xs" size="sm">
                {item.details.map((detail, index) => (
                  <ListItem key={index}>{detail}</ListItem>
                ))}
              </List>
            )}
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}

// Main dynamic section renderer
function renderSection(section: CVSection) {
  switch (section.type) {
    case "work_experience":
      return <WorkExperienceSection key={section.id} section={section} />;
    case "education":
      return <EducationSection key={section.id} section={section} />;
    case "publications":
      return <PublicationsSection key={section.id} section={section} />;
    case "awards":
      return <AwardsSection key={section.id} section={section} />;
    case "certifications":
      return <CertificationsSection key={section.id} section={section} />;
    case "volunteering":
      return <VolunteeringSection key={section.id} section={section} />;
    case "custom":
      return <CustomSection key={section.id} section={section} />;
    default:
      return null;
  }
}

// Sidebar section renderer (for skills, languages, etc.)
function renderSidebarSection(section: CVSection) {
  switch (section.type) {
    case "skills":
      return <SkillsSection key={section.id} section={section} />;
    case "languages":
      return <LanguagesSection key={section.id} section={section} />;
    default:
      return null;
  }
}

export default async function CVPage() {
  const [cv, userProfile] = await Promise.all([fetchCV(), fetchUserProfile()]);

  // Get all visible sections sorted by sortOrder
  const visibleSections = cv.sections?.filter((s) => s.isVisible) || [];
  visibleSections.sort((a, b) => a.sortOrder - b.sortOrder);

  // Separate sections for main content and sidebar
  const mainSections = visibleSections.filter(
    (s) => !["skills", "languages"].includes(s.type)
  );
  const sidebarSections = visibleSections.filter((s) =>
    ["skills", "languages"].includes(s.type)
  );

  return (
    <>
      <Paper shadow="sm" p="xl" mb="xl" radius="md" withBorder>
        <Grid>
          <GridCol span={{ base: 12, md: 8 }}>
            <Group align="flex-start" gap="lg">
              <EnhancedImage
                src={userProfile.profilePictureUrl}
                alt={userProfile.name}
                width={120}
                height={120}
                style={{ borderRadius: "8px", objectFit: "cover" }}
                showPlaceholderOnError={true}
              />
              <Stack gap="xs" flex={1}>
                <Title order={1} size="h1">
                  {userProfile.name}
                </Title>
                <Text size="lg" c="dimmed" fw={500}>
                  {userProfile.tagline}
                </Text>
                <Text size="md" mt="sm">
                  {cv.summary}
                </Text>
              </Stack>
            </Group>
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon variant="light" size="sm">
                  <MailOutlined style={{ fontSize: 14 }} />
                </ThemeIcon>
                <Text size="sm">{userProfile.email}</Text>
              </Group>

              {userProfile.phone && (
                <Group gap="xs">
                  <ThemeIcon variant="light" size="sm">
                    <PhoneOutlined style={{ fontSize: 14 }} />
                  </ThemeIcon>
                  <Text size="sm">{userProfile.phone}</Text>
                </Group>
              )}

              {userProfile.location && (
                <Group gap="xs">
                  <ThemeIcon variant="light" size="sm">
                    <EnvironmentOutlined style={{ fontSize: 14 }} />
                  </ThemeIcon>
                  <Text size="sm">{userProfile.location}</Text>
                </Group>
              )}

              {userProfile.websiteUrl && (
                <Group gap="xs">
                  <ThemeIcon variant="light" size="sm">
                    <GlobalOutlined style={{ fontSize: 14 }} />
                  </ThemeIcon>
                  <Anchor
                    href={userProfile.websiteUrl}
                    target="_blank"
                    size="sm"
                  >
                    Portfolio
                  </Anchor>
                </Group>
              )}

              {userProfile.socialLinks.length > 0 &&
                userProfile.socialLinks.map((link) => (
                  <Group gap="xs" key={link.id}>
                    <ThemeIcon variant="light" size="sm">
                      {getSocialLinkIcon(link.platformName)}
                    </ThemeIcon>
                    <Anchor href={link.url} target="_blank" size="sm">
                      {link.platformName}
                    </Anchor>
                  </Group>
                ))}
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      <Grid>
        <GridCol span={{ base: 12, md: 8 }} px="xs">
          {/* Dynamically render all main sections */}
          {mainSections.map((section, index) => (
            <div key={section.id}>
              {renderSection(section)}
              {index < mainSections.length - 1 && <Divider my="lg" />}
            </div>
          ))}
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }}>
          {/* Dynamically render sidebar sections */}
          {sidebarSections.length > 0 && (
            <Box style={{ position: "sticky", top: 65 }}>
              {sidebarSections.map((section) => renderSidebarSection(section))}
            </Box>
          )}
        </GridCol>
      </Grid>
    </>
  );
}
