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
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
  LinkOutlined,
  LinkedinOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { EnhancedImage } from "@/components/Image/Image";

export default async function CVPage() {
  const [cv, userProfile] = await Promise.all([fetchCV(), fetchUserProfile()]);

  return (
    <>
      {/* <Affix position={{ bottom: 25, right: 372 }}>
        <ActionIcon
          component={Link}
          href="/curriculum-vitae/edit"
          size="xl"
          variant="gradient"
          radius="xl"
        >
          <EditOutlined />
        </ActionIcon>
      </Affix> */}
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
                <Text size="sm">{cv.contactInformation.email}</Text>
              </Group>

              {cv.contactInformation.phone && (
                <Group gap="xs">
                  <ThemeIcon variant="light" size="sm">
                    <PhoneOutlined style={{ fontSize: 14 }} />
                  </ThemeIcon>
                  <Text size="sm">{cv.contactInformation.phone}</Text>
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

              {cv.contactInformation.portfolioUrl && (
                <Group gap="xs">
                  <ThemeIcon variant="light" size="sm">
                    <GlobalOutlined style={{ fontSize: 14 }} />
                  </ThemeIcon>
                  <Anchor
                    href={cv.contactInformation.portfolioUrl}
                    target="_blank"
                    size="sm"
                  >
                    Portfolio
                  </Anchor>
                </Group>
              )}

              {cv.contactInformation.linkedinUrl && (
                <Group gap="xs">
                  <ThemeIcon variant="light" size="sm">
                    <LinkedinOutlined style={{ fontSize: 14 }} />
                  </ThemeIcon>
                  <Anchor
                    href={cv.contactInformation.linkedinUrl}
                    target="_blank"
                    size="sm"
                  >
                    LinkedIn
                  </Anchor>
                </Group>
              )}
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      <Grid>
        <GridCol span={{ base: 12, md: 8 }} px="xs">
          {/* Work Experience Section */}
          <Paper py="md" mb="xl">
            <Group mb="lg">
              <ThemeIcon variant="light" size="lg">
                <BankOutlined />
              </ThemeIcon>
              <Title order={2}>Professional Experience</Title>
            </Group>

            <Timeline
              active={cv.workExperience.length}
              bulletSize={24}
              lineWidth={2}
            >
              {cv.workExperience.map((work) => (
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
                              {work.company}
                            </Anchor>
                          ) : (
                            work.company
                          )}{" "}
                          • {work.location}
                        </Text>
                      </div>
                      <Badge variant="light" size="sm">
                        {work.startDate} - {work.endDate}
                      </Badge>
                    </Group>
                  }
                >
                  <List spacing="xs" size="sm" mt="md">
                    {work.responsibilities.map((responsibility, respIndex) => (
                      <ListItem key={respIndex}>{responsibility}</ListItem>
                    ))}
                  </List>

                  {work.technologiesUsed &&
                    work.technologiesUsed.length > 0 && (
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

          <Divider my="lg" />

          {/* Education Section */}
          <Paper py="md" mb="xl">
            <Group mb="lg">
              <ThemeIcon variant="light" size="lg">
                <BookOutlined />
              </ThemeIcon>
              <Title order={2}>Education</Title>
            </Group>

            <Stack gap="lg">
              {cv.education.map((edu) => (
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
                    <Badge variant="light">{edu.graduationDate}</Badge>
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

          <Divider my="lg" />

          {/* Publications Section */}
          {cv.publications && cv.publications.length > 0 && (
            <Paper py="md" mb="xl">
              <Group mb="lg">
                <ThemeIcon variant="light" size="lg">
                  <FileTextOutlined />
                </ThemeIcon>
                <Title order={2}>Publications</Title>
              </Group>

              <Stack gap="md">
                {cv.publications.map((pub) => (
                  <Card key={pub.id} padding="md" radius="md" withBorder>
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <Text fw={600} size="md">
                          {pub.url ? (
                            <Anchor href={pub.url} target="_blank">
                              {pub.title}
                              <LinkOutlined
                                style={{ fontSize: 14, marginLeft: 4 }}
                              />
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
          )}

          <Divider my="lg" />

          {/* Awards Section */}
          {cv.awardsAndHonors && cv.awardsAndHonors.length > 0 && (
            <Paper py="md" mb="xl">
              <Group mb="lg">
                <ThemeIcon variant="light" size="lg">
                  <TrophyOutlined />
                </ThemeIcon>
                <Title order={2}>Awards & Honors</Title>
              </Group>

              <Stack gap="md">
                {cv.awardsAndHonors.map((award) => (
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
          )}
        </GridCol>

        <GridCol span={{ base: 12, md: 4 }}>
          {/* Skills Section */}
          <Box style={{ position: "sticky", top: 65 }}>
            <Paper shadow="sm" p="xl" mb="xl" radius="md" withBorder>
              <Title order={3} mb="lg">
                Skills & Expertise
              </Title>

              <Stack gap="lg">
                {cv.skills.map((skillCategory, index) => (
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
                    {index < cv.skills.length - 1 && <Divider mt="md" />}
                  </div>
                ))}
              </Stack>
            </Paper>
          </Box>
        </GridCol>
      </Grid>
    </>
  );
}
