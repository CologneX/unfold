import { DownloadOutlined } from "@ant-design/icons";
import { Button, type ButtonProps } from "@mantine/core";
import CVPDFDocument from "@/components/CVPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { fetchCV, fetchUserProfile, fetchPortfolio } from "@/app/actions";
import { CV, UserProfile, Project } from "@/types/types";
import { useEffect, useState } from "react";

function DownloadButton({
  children,
  ...props
}: ButtonProps & { children: React.ReactNode }) {
  return (
    <Button
      leftSection={<DownloadOutlined />}
      variant="gradient"
      size="compact-md"
      {...props}
    >
      {children}
    </Button>
  );
}

export default function CVDowloadPDFButton() {
  const [CV, setCV] = useState<CV | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cvData = await fetchCV();
        const userProfileData = await fetchUserProfile();
        const portfolioData = await fetchPortfolio();
        setCV(cvData);
        setUserProfile(userProfileData);
        setPortfolioProjects(portfolioData);
      } catch (error) {
        console.error("Error fetching CV, User Profile, or Portfolio:", error);
      }
    };

    fetchData();
  }, []);

  if (CV !== null && userProfile !== null) {
    return (
      <PDFDownloadLink
        document={
          <CVPDFDocument
            cv={CV}
            userProfile={userProfile}
            portfolioProjects={portfolioProjects}
          />
        }
        fileName="cv.pdf"
      >
        <DownloadButton>CV</DownloadButton>
      </PDFDownloadLink>
    );
  } else {
    return <DownloadButton loading style={{ pointerEvents: "none", width: "24%" }}>Loading CV...</DownloadButton>;
  }
}
